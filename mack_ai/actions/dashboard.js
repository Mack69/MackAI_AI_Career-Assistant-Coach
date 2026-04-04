
"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Changed to 2.0-flash

export const generateAIInsights = async (industry) => {
  if (!industry) {
    console.error("No industry provided to generateAIInsights");
    return getDefaultInsights();
  }

  try {
    const prompt = `
      Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
      {
        "salaryRange": [
          { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
        ],
        "growthRate": number,
        "demandLevel": "HIGH" | "MEDIUM" | "LOW",
        "topSkills": ["skill1", "skill2"],
        "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
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
  } catch (error) {
    console.error("AI generation failed:", error);
    return getDefaultInsights();
  }
};

function getDefaultInsights() {
  return {
    salaryRange: [
      { role: "Entry Level", min: 50000, max: 80000, median: 65000, location: "US National Average" },
      { role: "Mid Level", min: 80000, max: 120000, median: 100000, location: "US National Average" },
      { role: "Senior Level", min: 120000, max: 180000, median: 150000, location: "US National Average" }
    ],
    growthRate: 10,
    demandLevel: "MEDIUM",
    topSkills: ["Communication", "Problem Solving", "Teamwork", "Leadership", "Adaptability"],
    marketOutlook: "NEUTRAL",
    keyTrends: ["Digital Transformation", "Remote Work", "AI Integration", "Data Analytics", "Automation"],
    recommendedSkills: ["Data Analysis", "Project Management", "Critical Thinking", "Cloud Computing", "Cybersecurity"],
  };
}

export async function getIndustryInsights() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get user with industry
    const user = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        industry: true,
      },
    });

    if (!user) throw new Error("User not found");
    
    // ✅ CRITICAL: Check if user has an industry (onboarded)
    if (!user.industry) {
      console.log("User has no industry - not onboarded yet");
      throw new Error("Please complete onboarding first");
    }

    // Check if industry insight exists
    let industryInsight = await db.IndustryInsights.findUnique({
      where: { industry: user.industry },
    });

    // Only generate AI if industry insight doesn't exist
    if (!industryInsight) {
      console.log("Generating AI insights for industry:", user.industry);
      const insights = await generateAIInsights(user.industry);
      
      industryInsight = await db.IndustryInsights.create({
        data: {
          industry: user.industry,
          salaryRange: insights.salaryRange || [],
          growthRate: insights.growthRate || 0,
          demandLevel: insights.demandLevel || "MEDIUM",
          topSkills: insights.topSkills || [],
          marketOutlook: insights.marketOutlook || "NEUTRAL",
          keyTrends: insights.keyTrends || [],
          recommendedSkills: insights.recommendedSkills || [],
          nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });
    }

    return industryInsight;
  } catch (error) {
    console.error("Error fetching industry insights:", error);
    throw new Error("Failed to fetch industry insights: " + error.message);
  }
}