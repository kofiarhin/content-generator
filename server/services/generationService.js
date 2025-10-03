const crypto = require('crypto');
const axios = require('axios');
const { buildKey, getCache, setCache } = require('../utils/cache');
const { validateOrThrow } = require('../utils/validator');

const systemPrompt =
  'You are a senior content strategist for a MERN SaaS. Always return STRICT JSON matching the provided schema. No prose outside JSON. Optimize for clarity, conversion, and distinct angles. Avoid clichés.';
const guardPrompt =
  'Respond ONLY with valid JSON. If unsure, set unknown fields to null and explain in `notes`.';

const hashPayload = (payload) =>
  crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

const parseResponse = (raw) => {
  if (!raw) {
    throw new Error('Empty response from model');
  }

  if (typeof raw === 'object') {
    return raw;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    const parsingError = new Error('Failed to parse model response');
    parsingError.cause = error;
    throw parsingError;
  }
};

const callGroq = async ({ messages, apiKey, model, baseUrl }) => {
  if (!apiKey) {
    return {
      meta: {
        type: 'youtube_idea',
        tone: 'casual',
        lang: 'en',
        brand: 'devkofi',
        wordsTarget: 250
      },
      assets: [
        {
          id: 'fallback-asset',
          title: 'Connect your Groq API key to start generating content',
          body: 'Set GROQ_API_KEY in your environment to enable live generations.',
          cta: 'Update your environment configuration to continue.'
        }
      ],
      notes: 'Returned fallback content because GROQ_API_KEY is missing.'
    };
  }

  const url = `${baseUrl}/openai/v1/chat/completions`;
  const response = await axios.post(
    url,
    {
      model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  return parseResponse(content);
};

const buildMessages = ({ profile, request }) => [
  { role: 'system', content: systemPrompt },
  {
    role: 'user',
    content: JSON.stringify({ guardPrompt, profile, request })
  }
];

const generateContent = async ({ userId, profile, request }) => {
  const payloadHash = hashPayload({ profile, request });
  const cacheKey = buildKey({ userId, type: request?.type || 'unknown', hash: payloadHash });
  const cached = getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || 'llama-3.1-70b';
  const baseUrl = process.env.GROQ_BASE_URL || 'https://api.groq.com';

  const messages = buildMessages({ profile, request });
  const response = await callGroq({ messages, apiKey, model, baseUrl });

  validateOrThrow(response);
  setCache({ key: cacheKey, value: response });

  return response;
};

const generateBatch = async ({ userId, profile, requests }) => {
  const results = [];
  for (const request of requests) {
    // eslint-disable-next-line no-await-in-loop
    const result = await generateContent({ userId, profile, request });
    results.push(result);
  }
  return results;
};

const refineContent = async ({ userId, profile, asset, operation }) => {
  const request = {
    ...operation,
    type: asset.meta?.type || asset.type,
    original: {
      title: asset.title,
      body: asset.body,
      cta: asset.cta,
      tags: asset.tags
    }
  };

  const response = await generateContent({ userId, profile, request });
  return response;
};

module.exports = {
  generateContent,
  generateBatch,
  refineContent
};
