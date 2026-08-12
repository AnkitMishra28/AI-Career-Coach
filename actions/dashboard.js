"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { getGenerativeModel, getAIErrorCooldownMs, safeGenerateJSON } from "@/lib/gemini";
import { buildDefaultInsights, buildTemplateInsights } from "@/lib/industry-insights";

// In-memory lock to prevent simultaneous duplicate AI calls for the same industry
const activeInsightRequests = new Map();

const normalizeInsights = (insights) => {
  const defaults = buildDefaultInsights();
  const safeInsights = insights && typeof insights === "object" ? insights : {};

  return {
    salaryRanges: Array.isArray(safeInsights.salaryRanges)
      ? safeInsights.salaryRanges
      : defaults.salaryRanges,
    growthRate:
      typeof safeInsights.growthRate === "number"
        ? safeInsights.growthRate
        : defaults.growthRate,
    demandLevel:
      typeof safeInsights.demandLevel === "string"
        ? safeInsights.demandLevel
        : defaults.demandLevel,
    topSkills: Array.isArray(safeInsights.topSkills)
      ? safeInsights.topSkills
      : defaults.topSkills,
    marketOutlook:
      typeof safeInsights.marketOutlook === "string"
        ? safeInsights.marketOutlook
        : defaults.marketOutlook,
    keyTrends: Array.isArray(safeInsights.keyTrends)
      ? safeInsights.keyTrends
      : defaults.keyTrends,
    recommendedSkills: Array.isArray(safeInsights.recommendedSkills)
      ? safeInsights.recommendedSkills
      : defaults.recommendedSkills,
    lastUpdated: new Date(),
  };
};

export const generateAIInsights = async (industry) => {
  const prompt = `
    Analyze the current state of the ${industry} industry in India and provide benchmarks in ONLY the following JSON format:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "India (INR)", "currency": "INR" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT RULES:
    1. Return salary min, median, max as annual INR Rupees (e.g. min: 600000 for 6 LPA, median: 1200000 for 12 LPA, max: 2400000 for 24 LPA).
    2. Include at least 5 common roles for salary ranges.
    3. Growth rate should be a percentage number (e.g. 14.5).
    4. Return ONLY valid JSON without markdown code blocks.
  `;

  const fallback = buildTemplateInsights(industry, []);
  const parsed = await safeGenerateJSON({
    prompt,
    fallbackData: fallback,
    logTag: "Industry Insights AI",
  });

  return normalizeInsights(parsed);
};

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.industry) {
      throw new Error("User industry not set");
    }

    const currentInsight = user.industryInsight;

    // Check if existing insight is fresh and valid
    const isFresh =
      currentInsight &&
      currentInsight.nextUpdate &&
      new Date(currentInsight.nextUpdate) > new Date() &&
      Array.isArray(currentInsight.salaryRanges) &&
      currentInsight.salaryRanges.length > 0;

    if (isFresh) {
      return currentInsight;
    }

    // Deduplicate concurrent AI requests for the exact same industry
    const normalizedIndustry = user.industry.trim().toLowerCase();
    if (activeInsightRequests.has(normalizedIndustry)) {
      try {
        return await activeInsightRequests.get(normalizedIndustry);
      } catch (err) {
        if (currentInsight) return currentInsight;
      }
    }

    // Create single generation promise
    const generationPromise = (async () => {
      try {
        const insights = await generateAIInsights(user.industry);
        const nextUpdateDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        return await db.industryInsight.upsert({
          where: { industry: user.industry },
          update: {
            ...insights,
            nextUpdate: nextUpdateDate,
          },
          create: {
            industry: user.industry,
            ...insights,
            nextUpdate: nextUpdateDate,
          },
        });
      } catch (error) {
        const msg = error?.message || String(error);
        const isQuota = msg.includes("429") || msg.toLowerCase().includes("quota");

        if (isQuota) {
          console.warn(
            `[IndustryInsights] Gemini 429 rate limit reached for "${user.industry}". Using database/template fallback with backoff.`
          );
        } else {
          console.warn(
            `[IndustryInsights] AI generation failed for "${user.industry}" (${msg}). Using fallback.`
          );
        }

        const cooldownMs = getAIErrorCooldownMs(error);
        const retryAt = new Date(Date.now() + cooldownMs);
        const fallback = buildTemplateInsights(user.industry, user.skills || []);

        if (currentInsight) {
          // Keep existing DB insight but push back nextUpdate to avoid hammering Gemini
          return await db.industryInsight.update({
            where: { industry: user.industry },
            data: { nextUpdate: retryAt },
          });
        }

        // Create initial fallback record in DB so subsequent requests load instantly
        return await db.industryInsight.upsert({
          where: { industry: user.industry },
          update: { nextUpdate: retryAt },
          create: {
            industry: user.industry,
            ...fallback,
            nextUpdate: retryAt,
          },
        });
      } finally {
        activeInsightRequests.delete(normalizedIndustry);
      }
    })();

    activeInsightRequests.set(normalizedIndustry, generationPromise);
    return await generationPromise;
  } catch (error) {
    console.error("getIndustryInsights error:", error.message || error);
    throw error;
  }
}

export async function getDashboardData() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      resume: true,
      assessments: {
        orderBy: { createdAt: "desc" },
      },
      coverLetter: {
        orderBy: { createdAt: "desc" },
      },
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  let insights = user.industryInsight;
  const isFresh =
    insights &&
    insights.nextUpdate &&
    new Date(insights.nextUpdate) > new Date() &&
    Array.isArray(insights.salaryRanges) &&
    insights.salaryRanges.length > 0;

  if (!isFresh && user.industry) {
    try {
      insights = await getIndustryInsights();
    } catch (err) {
      console.warn("Failed to load insights in getDashboardData:", err?.message);
      if (!insights) {
        insights = buildTemplateInsights(user.industry, user.skills || []);
      }
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      industry: user.industry,
      experience: user.experience,
      skills: user.skills || [],
      bio: user.bio,
      createdAt: user.createdAt,
    },
    resume: user.resume,
    assessments: user.assessments || [],
    coverLetters: user.coverLetter || [],
    insights,
  };
}

