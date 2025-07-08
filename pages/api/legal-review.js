export default async function handler(req, res) {
  const { gcText, zochertText } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // no NEXT_PUBLIC
      },
      body: JSON.stringify({
        model: "gpt-4",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content: `You are a construction subcontract legal expert. Carefully review the provided GC contract and subcontractor proposal.
Flag anything unusual or high-risk. Focus especially on:
- Missing or unfavorable indemnity terms
- Insurance requirements (e.g. General Liability, Auto, Umbrella, Workers Comp)
- Payment timelines or conditions (e.g. Pay-When-Paid)
- Scope mismatches
- Liquidated damages or backcharges
- Conflict resolution and termination clauses
- Check for any bad press or pending lawsuits with the client or General Contractor
- Check for special bidding requirements for Zochert employees
- Check local laws for where job is to be performed, make sure they match contract`
          },
          {
            role: "user",
            content: `GC Contract:\n${gcText.slice(0, 8000)}`,
          },
          {
            role: "user",
            content: `Zochert Proposal:\n${zochertText.slice(0, 8000)}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
