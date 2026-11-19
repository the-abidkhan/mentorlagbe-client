import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="max-w-3xl">
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          MentorLagbe
        </span>

        <h1 className="font-heading mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
          Find Your Ideal Tutor or{" "}
          <span className="text-indigo-600">Mentorship Batch</span> Today
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Browse verified tutors and open tuitions by subject or class level for
          focused 1-on-1 learning and batch sessions.
        </p>

        {/* Search & CTA */}
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
  );
}