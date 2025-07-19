import { getIndustryInsights } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus, checkUserExists } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    // First check if user exists
    const { exists, user, error: userError } = await checkUserExists();
    if (!exists) {
      console.error("User check failed:", userError);
      return (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Setup Required</h2>
            <p className="text-yellow-600 mt-2">
              Please complete your profile setup first.
            </p>
            <a 
              href="/onboarding" 
              className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Go to Setup
            </a>
          </div>
        </div>
      );
    }

    const { isOnboarded } = await getUserOnboardingStatus();
    
    // Instead of using redirect, return a component that will handle the redirect
    if (!isOnboarded) {
      return (
        <div className="container mx-auto p-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">Profile Setup Required</h2>
            <p className="text-yellow-600 mt-2">
              Please complete your profile setup to access industry insights.
            </p>
            <a 
              href="/onboarding" 
              className="mt-4 inline-block px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Complete Setup
            </a>
          </div>
        </div>
      );
    }

    const insights = await getIndustryInsights();
    return (
      <div className="container mx-auto">
        <DashboardView insights={insights} />
      </div>
    );
  } catch (error) {
    console.error("Dashboard error:", error);
    // Log the full error details
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600 mt-2">
            Error: {error.message || "Unknown error"}
          </p>
          <p className="text-red-600 mt-2">
            Please try refreshing the page or contact support if the problem persists.
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p>Debug Info:</p>
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
              {JSON.stringify({
                error: error.message,
                type: error.name,
                stack: error.stack
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}
