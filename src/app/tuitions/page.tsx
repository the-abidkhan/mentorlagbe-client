"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
}

export default function TuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tuitions");
        }

        const data = await response.json();
        setTuitions(data);
      } catch (error) {
        console.error("Tuition fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
            Explore Opportunities
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Find Your Perfect Tuition
          </h1>

          <p className="mt-4 max-w-2xl text-slate-500">
            Browse available tuition opportunities and find the right
            learning match for your needs.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : tuitions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No Tuitions Available
            </h2>
            <p className="mt-2 text-slate-500">
              Please check again later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600">
                    {tuition.subject}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      tuition.mode === "Online"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {tuition.mode}
                  </span>
                </div>

                <h2 className="mt-6 text-xl font-bold text-slate-900">
                  {tuition.title}
                </h2>

                <div className="mt-5 space-y-3 text-sm text-slate-500">
                  <div className="flex justify-between gap-3">
                    <span>Class</span>
                    <span className="font-medium text-slate-900">
                      {tuition.classLevel}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span>Location</span>
                    <span className="text-right font-medium text-slate-900">
                      {tuition.location}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Days per week</span>
                    <span className="font-medium text-slate-900">
                      {tuition.daysPerWeek} days
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-500">Monthly Fee</p>
                    <p className="mt-1 text-lg font-bold text-indigo-600">
                      ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>

                  <Link
                    href={`/tuitions/${tuition._id}`}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}