"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
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
          const insights = await generateAIInsights(data.industry);

          industryInsight = await db.industryInsight.create({
            data: {
              industry: data.industry,
              ...insights,
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            industry: data.industry,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills,
          },
        });

        return { updatedUser, industryInsight };
      },
      {
        timeout: 10000, // default: 5000
      }
    );

    revalidatePath("/");
    return result.updatedUser;
  } catch (error) {
    console.error("Error updating user and industry:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No userId found in auth");
      return { isOnboarded: false };
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
      return { isOnboarded: false };
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

    return { isOnboarded };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return { isOnboarded: false };
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
