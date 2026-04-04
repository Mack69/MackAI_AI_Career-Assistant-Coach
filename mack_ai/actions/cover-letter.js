"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Handle both field names
  const companyName = data.company || data.companyName;
  
  if (!companyName) throw new Error("Company name is required");
  if (!data.jobTitle) throw new Error("Job title is required");
  if (!data.jobDescription) throw new Error("Job description is required");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${companyName}.
    
    About the candidate:
    - Industry: ${user.industry || "Not specified"}
    - Years of Experience: ${user.experience || "Not specified"}
    - Skills: ${user.skills?.join(", ") || "Not specified"}
    - Professional Background: ${user.bio || "Not specified"}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const coverLetter = await db.coverLetter.create({
      data: {
        content: content,
        jobDescription: data.jobDescription,
        company: companyName,
        jobTitle: data.jobTitle,
        userId: user.id,
      },
    });

    revalidatePath("/ai-cover-letter");
    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter: " + error.message);
  }
}

export async function getCoverLetters() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return [];

    return await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return [];
  }
}

export async function getCoverLetter(id) {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return null;

    return await db.coverLetter.findFirst({
      where: {
        id: id,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Error fetching cover letter:", error);
    return null;
  }
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) throw new Error("User not found");

  const result = await db.coverLetter.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  revalidatePath("/ai-cover-letter");
  return result;
}