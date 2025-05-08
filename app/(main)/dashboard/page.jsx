import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const { isOnboarded } = await getUserOnboardingStatus();

    // If not onboarded, redirect to onboarding page
    if (!isOnboarded) {
      redirect("/onboarding");
    }

    const insights = await getIndustryInsights();

    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">
            We're having trouble loading your industry insights. Please try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }
}
