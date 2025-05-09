"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  console.log("[updateUser] Called with data:", JSON.stringify(data, null, 2));
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Validate required fields
    if (!data.industry) return { success: false, error: "Industry is required" };
    if (!data.experience && data.experience !== 0) return { success: false, error: "Experience is required" };
    if (!data.bio) return { success: false, error: "Bio is required" };
    if (!data.skills || !data.skills.length) return { success: false, error: "At least one skill is required" };

    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if industry exists
        let industryInsight = await tx.industryInsight.findUnique({
          where: {
            industry: data.industry,
          },
        });

        // If industry doesn't exist, create it with default values
        if (!industryInsight) {
          console.log("[updateUser] Industry insight not found, generating new insights for:", data.industry);
          try {
            const insights = await generateAIInsights(data.industry);
            industryInsight = await tx.industryInsight.create({
              data: {
                industry: data.industry,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          } catch (error) {
            console.error("[updateUser] Error generating insights:", error);
            // Create industry insight with default values if AI generation fails
            industryInsight = await tx.industryInsight.create({
              data: {
                industry: data.industry,
                demandLevel: "Medium",
                marketOutlook: "Neutral",
                salaryRanges: [],
                topSkills: [],
                lastUpdated: new Date(),
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
          }
        }

        // Now update the user
        console.log("[updateUser] Updating user with:", {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        });

        // Ensure skills is an array
        const skills = Array.isArray(data.skills) ? data.skills : 
          (typeof data.skills === 'string' ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: parseInt(data.experience, 10),
            bio: data.bio,
            skills: skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 20000, // increased timeout
      }
    );

    revalidatePath("/");
    return { success: true, user: result.updatedUser };
  } catch (error) {
    console.error("[updateUser] Error updating user and industry:", error);
    console.error("[updateUser] Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      data,
    });
    return { 
      success: false, 
      error: error.message || "Failed to update profile",
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No userId found in auth");
      return { isOnboarded: false, error: "Not authenticated" };
    }

    console.log("Checking onboarding status for user:", userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
        experience: true,
        bio: true,
        skills: true,
      },
    });

    console.log("User found:", user ? "Yes" : "No");
    if (!user) {
      return { isOnboarded: false, error: "User not found" };
    }

    const isOnboarded = Boolean(
      user.industry && user.experience && user.bio && user.skills?.length > 0
    );

    console.log("Onboarding status:", {
      isOnboarded,
      hasIndustry: Boolean(user.industry),
      hasExperience: Boolean(user.experience),
      hasBio: Boolean(user.bio),
      hasSkills: Boolean(user.skills?.length > 0),
    });

    return { 
      isOnboarded,
      details: {
        hasIndustry: Boolean(user.industry),
        hasExperience: Boolean(user.experience),
        hasBio: Boolean(user.bio),
        hasSkills: Boolean(user.skills?.length > 0)
      }
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { isOnboarded: false, error: error.message };
  }
}

export async function checkUserExists() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No userId found in auth");
      return { exists: false, error: "Not authenticated" };
    }

    console.log("Checking if user exists:", userId);
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    console.log("User exists:", user ? "Yes" : "No");
    return { 
      exists: !!user,
      user: user ? {
        id: user.id,
        industry: user.industry,
        experience: user.experience,
        bio: user.bio,
        skills: user.skills
      } : null
    };
  } catch (error) {
    console.error("Error checking user existence:", error);
    return { exists: false, error: error.message };
  }
}
