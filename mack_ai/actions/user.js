"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { generateAIInsights } from "./dashboard";


export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Get or create user
  let user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    // Get Clerk user data to create the user
    const clerkUser = await clerkClient().users.getUser(userId);
    user = await db.user.create({
      data: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  try {
    const result = await db.$transaction(async (txn) => {
      let industryInsight = await txn.IndustryInsights.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        const insights = await generateAIInsights(data.industry);

        industryInsight = await txn.IndustryInsights.create({
          data: {
            industry: data.industry,
            ...insights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
      }

      // Update user with the industry and other fields
      const updatedUser = await txn.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: parseInt(data.experience) || 0,
          bio: data.bio,
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills.split(",").map((s) => s.trim()),
        },
      });

      return { updatedUser, industryInsight };
    });

    return { success: true, user: result.updatedUser };
  } catch (error) {
    console.error("Error updating user: ", error.message);
    throw new Error("Failed to update user: " + error.message);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      select: {
        industry: true,
      },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
