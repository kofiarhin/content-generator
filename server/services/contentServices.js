// aiContent.js
// Generates channel-specific content with defaults for tone, words, and platform

const { Groq } = require("groq-sdk");

const MODEL_NAME = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
const MAX_TOKENS = Number(process.env.CHAT_MAX_TOKENS) || 1024;

const buildMessages = ({ channel, tone, wordsTarget }) => {
  const systemPrompt = `
You are a creative strategist and copywriter specialized in ${channel} content.
Generate engaging, high-performing content that matches the requested tone and word target.

Guidelines:
- Match the tone exactly.
- Stay within ±10% of the word target.
- Adapt writing style to fit ${channel} best practices (hooks, pacing, CTA style).
- Output only the final content. No explanations or markdown.
`;

  const userPrompt = `
Channel: ${channel}
Tone: ${tone}
Word Target: ${wordsTarget}

Write a full ${channel} post or script matching the tone and length.
`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];
};

const generateChannelContent = async ({
  channel = "YouTube",
  tone = "educational and motivational",
  wordsTarget = 200,
}) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY environment variable is required");

  const groq = new Groq({ apiKey });
  const messages = buildMessages({ channel, tone, wordsTarget });

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages,
    temperature: 0.5,
    max_tokens: MAX_TOKENS,
    top_p: 1,
  });

  const content = completion?.choices?.[0]?.message?.content?.trim() || "";
  return { channel, tone, wordsTarget, content };
};

module.exports = { generateChannelContent };
