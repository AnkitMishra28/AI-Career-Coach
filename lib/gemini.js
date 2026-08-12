import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export function getGenerativeModel(overrideModel) {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables.");
  }
  const modelName = overrideModel || process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
  return client.getGenerativeModel({ model: modelName });
}

export function getAIErrorCooldownMs(error) {
  const message = String(error?.message || "").toLowerCase();
  const status = error?.status;

  if (status === 429 || message.includes("429") || message.includes("quota") || message.includes("too many requests")) {
    return 6 * 60 * 60 * 1000; // 6 hours
  }

  return 30 * 60 * 1000; // 30 minutes default cooldown
}

function withTimeout(promise, ms = 25000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("AI service request timed out. Please try again."));
    }, ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}

/**
 * Safely executes a Gemini AI generation call with fallback protection and structured JSON parsing.
 */
export async function safeGenerateAIContent({
  prompt,
  fallbackFn,
  logTag = "AI Generation",
  overrideModel,
  timeoutMs = 25000,
}) {
  try {
    const client = getGeminiClient();
    if (!client) {
      if (typeof fallbackFn === "function") return fallbackFn(new Error("No API Key"));
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const model = getGenerativeModel(overrideModel);
    const result = await withTimeout(model.generateContent(prompt), timeoutMs);
    const text = result?.response?.text?.()?.trim();
    if (!text) {
      throw new Error("Empty response from AI model.");
    }
    return text;
  } catch (error) {
    const msg = error?.message || String(error);
    const isQuota =
      msg.toLowerCase().includes("429") ||
      msg.toLowerCase().includes("quota") ||
      msg.toLowerCase().includes("too many requests");

    if (isQuota) {
      console.warn(`[${logTag}] Gemini API rate limit / quota exceeded (429). Using fallback response.`);
    } else {
      console.warn(`[${logTag}] AI request error (${msg}). Using fallback response.`);
    }

    if (typeof fallbackFn === "function") {
      return fallbackFn(error);
    }
    throw new Error("AI service is temporarily unavailable. Your saved data is safe. Please try again.");
  }
}

/**
 * Safely generates and parses structured JSON from Gemini.
 */
export async function safeGenerateJSON({
  prompt,
  fallbackData,
  logTag = "AI JSON Generation",
  overrideModel,
  timeoutMs = 25000,
}) {
  try {
    const rawText = await safeGenerateAIContent({
      prompt: `${prompt}\n\nIMPORTANT: Return ONLY valid JSON without markdown code blocks, backticks, or prose.`,
      fallbackFn: () => null,
      logTag,
      overrideModel,
      timeoutMs,
    });

    if (!rawText) return fallbackData;

    let cleanedText = rawText.replace(/```(?:json)?\n?/gi, "").replace(/```/g, "").trim();

    const firstBrace = cleanedText.indexOf("{");
    const lastBrace = cleanedText.lastIndexOf("}");
    const firstBracket = cleanedText.indexOf("[");
    const lastBracket = cleanedText.lastIndexOf("]");

    if (firstBrace !== -1 && lastBrace > firstBrace && (firstBracket === -1 || firstBrace < firstBracket)) {
      cleanedText = cleanedText.substring(firstBrace, lastBrace + 1);
    } else if (firstBracket !== -1 && lastBracket > firstBracket) {
      cleanedText = cleanedText.substring(firstBracket, lastBracket + 1);
    }

    return JSON.parse(cleanedText);
  } catch (err) {
    console.warn(`[${logTag}] Failed to parse JSON from AI response: ${err?.message || err}. Using fallback data.`);
    return fallbackData;
  }
}

