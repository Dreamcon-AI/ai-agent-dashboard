async function extractComplianceMetadata(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const parsed = await pdfParse(dataBuffer);
  const text = parsed.text;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `
You are a compliance document classification and extraction assistant.

Given a document (insurance certificate, business license, contractor license, endorsement, or similar), perform the following:

1. Identify and return the **document type** as one of:
   - "Certificate of Insurance"
   - "Contractor License"
   - "Business License"
   - "Endorsement"
   - "Workers Comp Certificate"
   - "Other"

2. Extract relevant fields depending on the type:

• For "Certificate of Insurance":
  - policies: [ { policyType, policyNumber, expirationDate, coverage { eachOccurrence, aggregate, etc. } } ]

• For licenses (contractor/business):
  - licenseNumber, issuingAuthority, expirationDate, companyName

• For endorsements:
  - endorsementType, relatedPolicyNumber, effectiveDate, expirationDate, coverageAmount (if applicable)

3. Return a JSON object like:

{
  "documentType": "Contractor License",
  "licenseNumber": "CCB-123456",
  "expirationDate": "2026-07-01",
  "issuingAuthority": "Oregon CCB",
  "companyName": "Zochert Fence"
}

OR

{
  "documentType": "Certificate of Insurance",
  "policies": [
    {
      "policyType": "General Liability",
      "policyNumber": "AES1232420 02",
      "expirationDate": "2026-06-08",
      "coverage": {
        "eachOccurrence": 1000000,
        "generalAggregate": 2000000
      }
    }
  ]
}

 Return a **valid JSON object**. Do not include any commentary, formatting, or markdown. Only return plain JSON`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0,
  });

  const raw = response.choices[0].message.content.trim();

  try {
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    const jsonString = raw.slice(jsonStart, jsonEnd + 1);
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse JSON:\n", raw);
    throw new Error("OpenAI returned invalid JSON.");
  }
}
