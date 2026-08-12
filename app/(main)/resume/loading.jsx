import RouteLoadingShell from "@/components/route-loading-shell";

export default function ResumeLoading() {
  return (
    <RouteLoadingShell
      title="Opening Resume Builder"
      subtitle="Setting up your editor and bringing in your latest resume draft..."
      showEditor
    />
  );
}
