import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET() {
  const debugInfo = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    urlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + "..." : "not set",
    nodeEnv: process.env.NODE_ENV,
    prismaAvailable: !!db,
  };
  
  // Try to test database connection
  let dbStatus = "Not tested";
  let dbError = null;
  let userCount = null;
  
  try {
    await db.$connect();
    dbStatus = "Connected successfully";
    userCount = await db.user.count();
    debugInfo.userCount = userCount;
  } catch (error) {
    dbStatus = "Failed";
    dbError = error.message;
  }
  
  return NextResponse.json({
    ...debugInfo,
    dbStatus,
    dbError,
    userCount,
  });
}