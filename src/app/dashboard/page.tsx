"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function DashboardRedirect() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = session.user.role;

    if (role === "student") {
      router.replace("/student/dashboard");
    } else if (role === "tutor") {
      router.replace("/tutor/dashboard");
    } else if (role === "admin") {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/");
    }
  }, [session, isPending, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <p className="text-slate-600">Redirecting to your dashboard...</p>
    </div>
  );
}