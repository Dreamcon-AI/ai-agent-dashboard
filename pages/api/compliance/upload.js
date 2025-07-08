// /pages/api/compliance/upload.js
import { formidable } from 'formidable';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';
import { createClient } from '@supabase/supabase-js';
import mime from 'mime-types';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), '/tmp'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.file) {
      console.error('Upload error:', err || 'No file found');
      return res.status(400).json({ error: 'File upload failed' });
    }

    const uploadedFile = files.file[0];
    const filePath = uploadedFile.filepath;
    const mimeType = mime.lookup(filePath);

    let extractedText = '';

    try {
      const dataBuffer = fs.readFileSync(filePath);
      let parsedText = '';
      try {
        const pdfData = await pdfParse(dataBuffer);
        parsedText = pdfData.text;
      } catch (e) {
        console.warn('PDF parsing failed, fallback to Vision if image');
      }

      if (parsedText && parsedText.length > 30) {
        extractedText = parsedText.slice(0, 8000);
      } else if (mimeType && mimeType.startsWith('image/')) {
        const base64 = fs.readFileSync(filePath, { encoding: 'base64' });

        const visionRes = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Extract compliance data from this image of a license or COI. Return only JSON.`,
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        });

        const visionContent = visionRes.choices[0].message.content.trim();
        extractedText = visionContent;
      } else {
        throw new Error('File is neither valid PDF nor image. Cannot extract.');
      }

      const prompt = `
You are a compliance document parser.

Given the following text from a document, determine what kind of document it is (e.g., COI, Contractor License, Business License), and extract the relevant fields accordingly.

Return only a JSON object like:

{
  "document_type": "COI | Contractor License | Business License | Other",
  "license_title": "Descriptive title of the document",
  "license_number": "License or policy number, or null",
  "expiration_date": "Expiration date in YYYY-MM-DD format, or null",
  "insurance_policies": [
    {
      "type": "e.g. General Liability, Auto, Umbrella",
      "policy_number": "string or null",
      "general_aggregate": "string or null",
      "each_occurrence": "string or null",
      "expiration_date": "string or null"
    }
  ]
}

If this is not an insurance document, set insurance_policies to an empty array.

Only output valid JSON — no markdown or commentary.

Text:
"""${extractedText}"""
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You classify and extract structured data from compliance documents.' },
          { role: 'user', content: prompt },
        ],
      });

      const rawContent = completion.choices[0].message.content.trim();

      let extracted;
      try {
        extracted = JSON.parse(rawContent);
      } catch (jsonErr) {
        const fixed = rawContent.replace(/```json|```/g, '');
        extracted = JSON.parse(fixed);
      }

      const {
        document_type,
        license_title,
        license_number,
        expiration_date,
        insurance_policies = [],
      } = extracted;

      const { error } = await supabase.from('compliance_documents').insert({
        document_type,
        license_title,
        license_number,
        expiration_date,
        insurance_policies,
        extracted_text: extractedText,
        uploaded_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: 'Database insert failed', detail: error.message });
      }

      res.status(200).json({
        message: 'Upload and extraction successful',
        summary: {
          Document_Type: extracted.document_type || 'Unknown',
          Title: extracted.license_title || 'Not found',
          License_or_Policy_Number: extracted.license_number || 'Not found',
          Expiration: extracted.expiration_date || 'Not found',
          Insurance_Policies: extracted.insurance_policies || [],
        },
      });
    } catch (error) {
      console.error('Processing error:', error);
      res.status(500).json({ error: 'AI processing failed', detail: error.message });
    } finally {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Cleanup failed:', e.message);
      }
    }
  });
}
