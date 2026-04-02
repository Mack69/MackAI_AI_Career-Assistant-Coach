"use server";
import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// export async function updateUser(data) {
//   const { userId } = await auth();
//   if (!userId) {
//     throw new Error("User not authenticated");
//   }

//   const user = await db.user.findUnique({
//     where: {
//       clerkId: userId,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   try {
//     const result = await db.$transaction(
//       async (txn) => {
//         //find if industry exists
//         let industryInsight = await txn.IndustryInsights.findUnique({
//           where: {
//             industry: data.industry,
//           },
//         });

//         // if not create it and connect to it
//         if (!industryInsight) {
//           industryInsight = await txn.IndustryInsights.create({
//             data: {
//               industry: data.industry,
//               salaryRange: [], // add default salary ranges here
//               growthRate: 0, // add default growth rates here
//               demandLevel: "MEDIUM", // add default demand levels here
//               topSkills: [], // add default top skills here
//               marketOutLook: "NEUTRAL", // add default market outlook here
//               keyTrends: [], // add default key trends here
//               recommendedSkills: [], // add default recommended skills here
//               nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
//             },
//           });
//         }

//         // update user with the industry
//         const updatedUser = await txn.user.update({
//           where: {
//             id: user.id,
//           },
//           data: {
//             industry: data.industry,
//             experience: data.experience,
//             bio: data.bio,
//             skills: data.skills,
//           },
//         });

//         return { updatedUser, industryInsight };
//       },

//       {
//         timeout: 10000, // 10 seconds
//       },
//     );
//     return {success: true, ...result};
//   } catch (error) {
//     console.error("Error updating user: ", error.message);
//     throw new Error("Failed to update user"+error.message);
//   }
// }
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
      // Use "IndustryInsights" (plural, matches your schema)
      let industryInsight = await txn.IndustryInsights.findUnique({
        where: { industry: data.industry },
      });

      if (!industryInsight) {
        industryInsight = await txn.IndustryInsights.create({
          data: {
            industry: data.industry,
            salaryRange: [],
            growthRate: 0,
            demandLevel: "MEDIUM",
            topSkills: [],
            marketOutlook: "NEUTRAL",
            keyTrends: [],
            recommendedSkills: [],
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
          skills: Array.isArray(data.skills) ? data.skills : data.skills.split(',').map(s => s.trim()),
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