
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage?: string;
}

export default function TuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [mode, setMode] = useState("");

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        if (search.trim()) params.set("search", search.trim());
        if (subject) params.set("subject", subject);
        if (classLevel) params.set("classLevel", classLevel);
        if (mode) params.set("mode", mode);

        const queryString = params.toString();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions${
            queryString ? `?${queryString}` : ""
          }`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch tuitions.");
        }

        const data = await response.json();
        setTuitions(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        console.error("Tuition fetch error:", error);
        setError("Unable to load tuitions. Please try again.");
        setTuitions([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, subject, classLevel, mode]);

  // Load student's saved tuition IDs
  useEffect(() => {
    const loadSavedTuitions = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/saved`,
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (!response.ok) return;

        const dataList: Tuition[] = await response.json();
        setSavedIds(dataList.map((tuition) => tuition._id));
      } catch (error) {
        console.error("Saved tuition fetch error:", error);
      }
    };

    loadSavedTuitions();
  }, []);

  const handleBookmark = async (tuitionId: string) => {
    try {
      setSavingId(tuitionId);

      const { data } = await authClient.token();

      if (!data?.token) {
        alert("Please login as a student to save tuitions.");
        return;
      }

      const isSaved = savedIds.includes(tuitionId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/tuitions/${tuitionId}/bookmark`,
        {
          method: isSaved ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Unable to update bookmark.");
        return;
      }

      if (isSaved) {
        setSavedIds((previous) =>
          previous.filter((id) => id !== tuitionId)
        );
      } else {
        setSavedIds((previous) => [...previous, tuitionId]);
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSavingId("");
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setSubject("");
    setClassLevel("");
    setMode("");
  };

  const hasFilters = search || subject || classLevel || mode;

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
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

        <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-4">
              <label
                htmlFor="tuition-search"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Search Tuitions
              </label>

              <input
                id="tuition-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by tuition title or subject..."
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="subject-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Subject
              </label>

              <select
                id="subject-filter"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
                <option value="Programming">Programming</option>
                <option value="IELTS">IELTS</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="class-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Class Level
              </label>

              <select
                id="class-filter"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">All Classes</option>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={`Class ${index + 1}`}>
                    Class {index + 1}
                  </option>
                ))}
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
                <option value="University">University</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="mode-filter"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Tuition Mode
              </label>

              <select
                id="mode-filter"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="">All Modes</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={!hasFilters}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Available Tuitions
          </h2>

          {!loading && (
            <p className="text-sm text-slate-500">
              {tuitions.length}{" "}
              {tuitions.length === 1 ? "result" : "results"} found
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white py-16 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              Something Went Wrong
            </h2>
            <p className="mt-2 text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => setSearch((previous) => previous + " ")}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : tuitions.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              No Tuitions Found
            </h2>
            <p className="mt-2 text-slate-500">
              Try changing your search or filters to find available tuitions.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => {
              const isSaved = savedIds.includes(tuition._id);

              return (
                <div
                  key={tuition._id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  {tuition.bannerImage ? (
                    <img
                      src={tuition.bannerImage}
                      alt={tuition.title}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-indigo-50 text-indigo-300">
                      No Image Available
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-6">
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

                    <div className="mt-5 flex-1 space-y-3 text-sm text-slate-500">
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

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-slate-500">Monthly Fee</p>
                          <p className="mt-1 text-lg font-bold text-indigo-600">
                            ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBookmark(tuition._id)}
                          disabled={savingId === tuition._id}
                          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
                            isSaved
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {savingId === tuition._id
                            ? "Please wait..."
                            : isSaved
                              ? "♥ Saved"
                              : "♡ Save"}
                        </button>
                      </div>

                      <Link
                        href={`/tuitions/${tuition._id}`}
                        className="mt-5 block rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
