import { getDashboardData } from "@/actions/dashboard";
import DashboardView from "./_component/dashboard-view";
import { getUserOnboardingStatus, checkUserExists } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  try {
    const { exists } = await checkUserExists();
    if (!exists) {
      redirect("/onboarding");
    }

    const { isOnboarded } = await getUserOnboardingStatus();
    if (!isOnboarded) {
      redirect("/onboarding");
    }

    const dashboardData = await getDashboardData();
    return <DashboardView data={dashboardData} />;
  } catch (error) {
    if (
      error?.digest === "DYNAMIC_SERVER_USAGE" || 
      error?.message?.includes("Dynamic server usage") ||
      error?.digest?.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("Dashboard error:", error?.message || error);
    return (
      <div className="max-w-4xl mx-auto p-6 my-8 glass-card rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Unable to load Command Center</h2>
        <p className="text-sm text-muted-foreground">
          {error?.message || "An unexpected error occurred while loading your career data."}
        </p>
        <a 
          href="/dashboard" 
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10"
        >
          Refresh Page
        </a>
      </div>
    );
  }
}
