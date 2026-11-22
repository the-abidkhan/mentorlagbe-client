
"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          setError("Payment session not found.");
          setLoading(false);
          return;
        }

        const { data } = await authClient.token();

        if (!data?.token) {
          setError("Please login to verify your payment.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments/verify-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Payment verification failed."
          );
        }

        setPaymentData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">

        {loading ? (
          <>
            <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />

            <h1 className="text-2xl font-bold text-slate-900">
              Verifying Payment
            </h1>

            <p className="mt-3 text-slate-500">
              Please wait while we verify your payment.
            </p>
          </>
        ) : error ? (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
              !
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Verification Failed
            </h1>

            <p className="mt-3 text-slate-500">{error}</p>

            <Link
              href="/pricing"
              className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Back to Pricing
            </Link>
          </>
        ) : (
          <>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Payment Successful!
            </h1>

            <p className="mt-3 text-slate-500">
              Your payment has been received successfully.
            </p>

            {paymentData?.planActivated ? (
              <div className="mt-6 rounded-2xl bg-green-50 p-5">
                <h2 className="font-bold text-green-700">
                  MentorLagbe Pro Activated!
                </h2>

                <p className="mt-2 text-sm text-green-600">
                  Your account has been upgraded to the Pro plan.
                </p>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-amber-50 p-5">
                <h2 className="font-bold text-amber-700">
                  Payment Processing
                </h2>

                <p className="mt-2 text-sm text-amber-600">
                  Your payment is complete. Your Pro plan is waiting
                  for confirmation. Please refresh this page in a moment.
                </p>
              </div>
            )}

            <Link
              href="/dashboard"
              className="mt-7 inline-block rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-slate-500">Loading payment details...</p>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
