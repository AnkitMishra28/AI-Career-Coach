"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
};

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No userId found in auth");
      throw new Error("Unauthorized");
    }

    console.log("Fetching user with clerkUserId:", userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) {
      console.error("No user found for clerkUserId:", userId);
      throw new Error("User not found");
    }
    
    if (!user.industry) {
      console.error("No industry set for user:", userId);
      throw new Error("User industry not set");
    }

    console.log("User industry:", user.industry);

    // If no insights exist, generate them
    if (!user.industryInsight) {
      try {
        console.log("Generating new insights for industry:", user.industry);
        const insights = await generateAIInsights(user.industry);
        console.log("Generated insights:", JSON.stringify(insights, null, 2));

        const industryInsight = await db.industryInsight.create({
          data: {
            industry: user.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        console.log("Created industry insight:", industryInsight.id);
        return industryInsight;
      } catch (error) {
        console.error("Error generating insights:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        throw new Error("Failed to generate industry insights");
      }
    }

    console.log("Returning existing insights for industry:", user.industry);
    return user.industryInsight;
  } catch (error) {
    console.error("getIndustryInsights error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}
