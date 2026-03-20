import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function askOracle(question: string): Promise<string> {
  const systemPrompt = `You are the Oracle of Afrikapedia — a wise, knowledgeable AI encyclopedia focused exclusively on African history, culture, science, geography, languages, kingdoms, and innovation.

Answer questions in a rich, educational tone. Use vivid, engaging prose. Include specific facts, dates, names. Draw connections between African heritage and the modern world. Keep responses to 3-4 paragraphs.

Always celebrate African achievement. Never be dismissive or eurocentric. Start with the most compelling fact. End with a thought that makes the reader want to learn more.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: question }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "The Oracle is silent on this matter.";
}
