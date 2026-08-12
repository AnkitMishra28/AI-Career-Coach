import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] navbar-clearance px-4 text-center">
      <h1 className="page-title mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
