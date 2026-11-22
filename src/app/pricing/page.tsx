
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Check, Crown, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default function PricingPage() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const [selectedRole, setSelectedRole] = useState<"student" | "tutor">(
    "student"
  );
  const [loading, setLoading] = useState(false);

  const currentUser = session?.user as
    | { role?: string; plan?: string }
    | undefined;

  const isLoggedIn = !!session?.user;
  const isPro = currentUser?.plan === "pro";

  // Logged-in users always see pricing for their own role.
  const activeRole =
    currentUser?.role === "tutor" ? "tutor" : 
    currentUser?.role === "student" ? "student" : selectedRole;

  const price = activeRole === "tutor" ? 15 : 10;

  const handleUpgrade = async () => {
    if (!isLoggedIn) {
      toast.info("Please login first to upgrade your plan.");
      router.push("/login");
      return;
    }

    if (isPro) {
      toast.info("You already have a Pro plan.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${SERVER_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planName: "pro",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create checkout session.");
      }

      if (!result.checkoutUrl) {
        throw new Error("Stripe checkout URL was not received.");
      }

      window.location.href = result.checkoutUrl;
    } catch (error) {
      console.error("Upgrade error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setLoading(false);
    }
  };

  const freeFeatures =
    activeRole === "student"
      ? [
          "Browse approved tuition listings",
          "Apply for available tuitions",
          "Track application status",
          "Manage your profile",
        ]
      : [
          "Create up to 2 tuition posts",
          "Manage tuition listings",
          "View student applications",
          "Manage your profile",
        ];

  const proFeatures =
    activeRole === "student"
      ? [
          "Everything included in Free",
          "Unlimited tuition bookmarks",
          "Priority booking",
          "Pro membership status",
        ]
      : [
          "Everything included in Free",
          "Unlimited tuition posts",
          "Manage all your tuition listings",
          "Pro membership status",
          "Verified badge",
        ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0F172A] px-4 py-20 text-center text-white sm:py-24">
        <div className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-medium text-blue-300">
            <Crown size={16} />
            Simple & Transparent Pricing
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
            Choose the Right Plan for Your{" "}
            <span className="text-blue-400">Learning Journey</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Whether you are looking for the perfect tutor or sharing your
            teaching expertise, MentorLagbe has a plan for you.
          </p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Find Your Perfect Plan
          </h2>

          <p className="mt-3 text-slate-500">
            Select your account type to explore the available plans.
          </p>

          {/* Role Selector */}
          <div className="mt-8 inline-flex rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setSelectedRole("student")}
              disabled={isLoggedIn}
              className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
                activeRole === "student"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              } disabled:cursor-not-allowed`}
            >
              <GraduationCap size={18} />
              Student
            </button>

            <button
              onClick={() => setSelectedRole("tutor")}
              disabled={isLoggedIn}
              className={`flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
                activeRole === "tutor"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              } disabled:cursor-not-allowed`}
            >
              <BookOpen size={18} />
              Tutor
            </button>
          </div>

          {isLoggedIn && (
            <p className="mt-3 text-sm text-slate-500">
              Showing plans for your {activeRole} account.
            </p>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-12 grid max-w-4xl gap-7 md:grid-cols-2">
          {/* Free Plan */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Free Plan
              </span>

              <h3 className="mt-3 text-3xl font-extrabold text-[#0F172A]">
                $0
                <span className="ml-1 text-base font-medium text-slate-400">
                  / forever
                </span>
              </h3>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                Get started with the essential tools you need on MentorLagbe.
              </p>

              <div className="my-7 border-t border-slate-100" />

              <h4 className="font-bold text-[#0F172A]">
                What's included:
              </h4>

              <ul className="mt-5 space-y-4">
                {freeFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-green-500"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => router.push(isLoggedIn ? "/dashboard" : "/signup")}
              className="mt-9 w-full rounded-xl border border-slate-200 py-3.5 font-semibold text-[#0F172A] transition hover:bg-slate-50"
            >
              {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col rounded-2xl border-2 border-blue-600 bg-white p-7 shadow-xl shadow-blue-100/60 sm:p-9">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-blue-600 px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              Recommended
            </div>

            <div>
              <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-blue-600">
                <Crown size={17} />
                Pro Plan
              </span>

              <h3 className="mt-3 text-3xl font-extrabold text-[#0F172A]">
                ${price}
                <span className="ml-1 text-base font-medium text-slate-400">
                  / one-time
                </span>
              </h3>

              <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                Unlock more opportunities and get more from your
                MentorLagbe experience.
              </p>

              <div className="my-7 border-t border-slate-100" />

              <h4 className="font-bold text-[#0F172A]">
                Everything in Free, plus:
              </h4>

              <ul className="mt-5 space-y-4">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={loading || isPro}
              className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Redirecting...
                </>
              ) : isPro ? (
                <>
                  <Check size={18} />
                  Pro Active
                </>
              ) : (
                <>
                  <Crown size={18} />
                  Upgrade to Pro
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-slate-200 bg-white p-5 text-center">
          <p className="text-sm leading-6 text-slate-600">
            <strong className="text-[#0F172A]">Secure Payment:</strong>{" "}
            Payments are processed securely through Stripe. Pro plans
            currently require a one-time payment.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-blue-50 px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-[#0F172A]">
          Ready to get started?
        </h2>

        <p className="mt-3 text-slate-600">
          Join MentorLagbe and take the next step in your learning journey.
        </p>

        <button
          onClick={() => router.push("/tuitions")}
          className="mt-6 rounded-xl bg-[#0F172A] px-7 py-3.5 font-semibold text-white transition hover:bg-slate-800"
        >
          Explore Tuitions
        </button>
      </section>
    </div>
  );
}
