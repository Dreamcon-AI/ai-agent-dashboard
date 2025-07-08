import { supabase } from "../../../lib/supabaseAdmin";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY missing");
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // Step 1: Get all compliance documents with extracted_text and insurance_policies
   const { data, error } = await supabase
  .from("compliance_documents")
  .select("id, license_title, license_number, expiration_date, extracted_text, insurance_policies");

    if (error) throw new Error("Supabase read failed: " + error.message);

    // Step 2: Build context including extracted text and policy data
    const context = data.map((doc) => {
      const policyInfo = typeof doc.insurance_policies === 'object'
        ? JSON.stringify(doc.insurance_policies)
        : doc.insurance_policies;

      return `
Document ID: ${doc.id}
Type: ${doc.license_type}
Title: ${doc.license_title}
Number: ${doc.license_number}
Expires: ${doc.expiration_date}
Extracted Text: ${doc.extracted_text || ""}
Insurance Policies: ${policyInfo || ""}
`;
    }).join("\n\n");

    // Step 3: Ask GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You're a compliance assistant. Answer only using the provided data from compliance documents, including text and policy info." },
        { role: "user", content: `Here is all document data:\n${context}\n\nNow answer this: ${query}` },
      ],
    });

    const answer = completion.choices[0].message.content;
    res.status(200).json({ answer });

  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ error: "Search failed", detail: err.message });
  }
}
