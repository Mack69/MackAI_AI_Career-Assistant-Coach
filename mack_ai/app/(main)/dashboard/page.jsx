
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { getIndustryInsights } from "@/actions/dashboard";
import React from "react";
import DashboardView from "./_components/DashboardView";

const IndustryInsightsPage = async () => {
  // ✅ FIRST: Check onboarding status
  const { isOnboarded } = await getUserOnboardingStatus();
  
  // ✅ SECOND: Redirect if not onboarded (BEFORE trying to get insights)
  if (!isOnboarded) {
    console.log("User not onboarded, redirecting to /onboarding");
    redirect("/onboarding");
  }
  
  // ✅ THIRD: Only get insights if user is onboarded
  let insights = null;
  try {
    insights = await getIndustryInsights();
  } catch (error) {
    console.error("Error loading insights:", error);
    // If insights fail but user is onboarded, show a fallback
    insights = {
      growthRate: 0,
      demandLevel: "MEDIUM",
      marketOutlook: "NEUTRAL",
      topSkills: [],
      keyTrends: [],
      salaryRange: [],
      recommendedSkills: [],
    };
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <DashboardView insights={insights} />
    </div>
  );
};

export default IndustryInsightsPage;