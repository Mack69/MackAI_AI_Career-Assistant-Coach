import { getUserOnboardingStatus } from "@/actions/user";
import { industries } from "@/data/industries";
import { redirect } from 'next/navigation';
import OnboardingForm from "./_components/OnboardingForm";
import React from "react";

// check if user is onboarded, if not redirect to onboarding page
const OnboardingPage = async () => {
  const {isOnboarded} = await getUserOnboardingStatus();
  if (isOnboarded){
    redirect("/dashboard");
  }
  return <main>
    <OnboardingForm industries={industries}/>
  </main>;
};

export default OnboardingPage;
