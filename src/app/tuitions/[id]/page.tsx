
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  tutorName: string;
  tutorEmail: string;
}

function TuitionDetailsContent() {
  const params = useParams();
  const id = params.id as string;

  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuition = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${id}`
        );

        if (!response.ok) {
          throw new Error("Tuition not found");
        }

        const data = await response.json();
        setTuition(data);
      } catch (error) {
        console.error("Tuition details error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTuition();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-20">
        <div className="mx-auto h-80 max-w-4xl animate-pulse rounded-2xl bg-slate-200" />
      </main>
    );
  }

  if (!tuition) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          Tuition Not Found
        </h1>

        <p className="mt-3 text-slate-500">
          This tuition may no longer be available.
        </p>

        <Link
          href="/tuitions"
          className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Browse Tuitions
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <Link
          href="/tuitions"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Tuitions
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <section className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                  {tuition.subject}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                  {tuition.mode}
                </span>
              </div>

              <h1 className="mt-6 text-3xl font-bold text-slate-900">
                {tuition.title}
              </h1>

              <p className="mt-4 text-slate-500">
                {tuition.description}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">
                Tuition Information
              </h2>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500">Class Level</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tuition.classLevel}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tuition.location}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Days per Week</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tuition.daysPerWeek} days
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Teaching Mode</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {tuition.mode}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <h2 className="text-xl font-bold text-slate-900">
                About the Tutor
              </h2>

              <p className="mt-5 font-semibold text-slate-900">
                {tuition.tutorName}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {tuition.tutorEmail}
              </p>
            </div>
          </section>

          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-7">
              <p className="text-sm text-slate-500">
                Monthly Tuition Fee
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-600">
                ৳{tuition.monthlyFee.toLocaleString("en-BD")}
              </p>

              <div className="my-6 border-t border-slate-100" />

              <Link
  href={`/apply/${id}`}
  className="block rounded-xl bg-indigo-600 px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
>
  Apply for Tuition
</Link>

              <p className="mt-4 text-center text-xs text-slate-500">
                Login required to apply for this tuition.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function TuitionDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-6 py-20">
          <div className="mx-auto h-80 max-w-4xl animate-pulse rounded-2xl bg-slate-200" />
        </main>
      }
    >
      <TuitionDetailsContent />
    </Suspense>
  );
}