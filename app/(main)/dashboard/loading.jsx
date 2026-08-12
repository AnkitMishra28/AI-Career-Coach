import RouteLoadingShell from "@/components/route-loading-shell";

export default function DashboardLoading() {
  return (
    <RouteLoadingShell
      title="Loading Industry Insights"
      subtitle="Analyzing market trends, salaries, and role demand..."
      showChart
    />
  );
}
