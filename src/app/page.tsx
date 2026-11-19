
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
            MentorLagbe
          </span>

          <h1 className="font-heading mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Find Your Ideal Tutor or{" "}
            <span className="text-indigo-600">
              Mentorship Batch
            </span>{" "}
            Today
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Browse verified tutors and open tuitions by subject or class level
            for focused 1-on-1 learning and batch sessions.
          </p>

          <form
            action="/tuitions"
            method="GET"
            className="mt-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-2 max-w-xl"
          >
            <input
              type="text"
              name="search"
              placeholder="Search by subject or title..."
              className="flex-1 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition cursor-pointer"
            >
              Browse Tuitions
            </button>
          </form>

          <div className="mt-4">
            <Link
              href="/tuitions"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all open tuitions →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose MentorLagbe */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-sm font-semibold text-indigo-600">
              WHY MENTORLAGBE
            </span>

            <h2 className="font-heading mt-3 text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose MentorLagbe?
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              We make finding the right tutor and learning opportunity
              simple, reliable, and convenient.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Feature 1 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl">
                ✓
              </div>

              <h3 className="font-heading mt-5 text-xl font-bold text-slate-900">
                Verified Tutors
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-7">
                Find qualified tutors through a platform designed to provide
                a more reliable learning experience.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl">
                ◷
              </div>

              <h3 className="font-heading mt-5 text-xl font-bold text-slate-900">
                Flexible Learning
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-7">
                Explore online and offline tuition opportunities that match
                your preferred schedule and learning needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-7 rounded-2xl border border-slate-200 bg-slate-50 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl">
                ↗
              </div>

              <h3 className="font-heading mt-5 text-xl font-bold text-slate-900">
                Easy Application
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-7">
                Browse available tuition posts and apply for suitable
                opportunities through a simple process.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
