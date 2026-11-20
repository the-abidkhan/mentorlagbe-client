
"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

function ApplyPageContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setMessage("Please login before applying for a tuition.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
          body: JSON.stringify({
            tuitionId: id,
            studentPhone,
            preferredSchedule,
            studentNote,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit application.");
      }

      setSuccess(true);
      setMessage(result.message || "Application submitted successfully.");

      setStudentPhone("");
      setPreferredSchedule("");
      setStudentNote("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/tuitions"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Tuitions
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Apply for Tuition
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Fill in the information below to apply for this tuition.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="studentPhone" className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number *
              </label>
              <input
                id="studentPhone"
                type="tel"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="preferredSchedule" className="mb-2 block text-sm font-semibold text-slate-700">
                Preferred Schedule *
              </label>
              <input
                id="preferredSchedule"
                type="text"
                required
                value={preferredSchedule}
                onChange={(e) => setPreferredSchedule(e.target.value)}
                placeholder="Example: Sun, Tue, Thu - 5 PM"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label htmlFor="studentNote" className="mb-2 block text-sm font-semibold text-slate-700">
                Additional Note
              </label>
              <textarea
                id="studentNote"
                rows={4}
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                placeholder="Write something about your learning requirements..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
              />
            </div>

            {message && (
              <div className={`rounded-xl p-4 text-sm ${
                success
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}>
                {message}
              </div>
            )}

            {success ? (
              <button
                type="button"
                onClick={() => router.push("/tuitions")}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Browse More Tuitions
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-6 py-20">
          <div className="mx-auto h-80 max-w-2xl animate-pulse rounded-2xl bg-slate-200" />
        </main>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}