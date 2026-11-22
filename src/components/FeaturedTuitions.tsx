
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
  bannerImage: string;
}

export default function FeaturedTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tuitions.");
        }

        const data = await response.json();
        setTuitions(data.slice(0, 3));
      } catch (error) {
        console.error("Tuition fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Explore Opportunities
            </span>

            <h2 className="font-heading mt-4 text-3xl md:text-4xl font-bold text-slate-900">
              Featured Tuitions
            </h2>

            <p className="mt-4 max-w-xl text-slate-500 leading-7">
              Explore recently posted tuition opportunities and find
              the right match for your learning journey.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Tuitions →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : tuitions.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-14 text-center">
            <h3 className="font-heading text-lg font-bold text-slate-900">
              No Featured Tuitions Yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              New tuition opportunities will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
              >
                {/* Tuition Banner Image */}
                <div className="h-48 w-full overflow-hidden bg-slate-100">
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="p-6">
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

                  <h3 className="font-heading mt-5 text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {tuition.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Class: {tuition.classLevel}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600">
                    <div className="flex justify-between gap-3">
                      <span>Location</span>
                      <span className="font-medium text-slate-900 text-right">
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
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
