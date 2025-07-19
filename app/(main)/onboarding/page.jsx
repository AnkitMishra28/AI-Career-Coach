"use client";
import { useEffect, useState } from "react";
import { industries } from "@/data/industries";
import OnboardingForm from "./_components/onboarding-form";

export default function OnboardingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Optionally, show a loading spinner here
    return null;
  }

  return (
    <main>
      <OnboardingForm industries={industries} />
    </main>
  );
}
