import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="w-full">
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#6366f1" />}
      >
        {children}
      </Suspense>
    </div>
  );
}

