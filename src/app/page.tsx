
import Link from "next/link";
import FeaturedTuitions from "@/components/FeaturedTuitions";

const features = [
  {
    number: "01",
    icon: "✓",
    title: "Verified Tutors",
    description:
      "Discover qualified tutors and explore learning opportunities through a trusted platform.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    number: "02",
    icon: "◷",
    title: "Flexible Learning",
    description:
      "Choose online or offline tuition options that fit your schedule and learning needs.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    number: "03",
    icon: "↗",
    title: "Easy Application",
    description:
      "Find suitable tuition opportunities and apply through a simple process.",
    color: "bg-amber-50 text-amber-600",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description:
      "Join MentorLagbe as a student or tutor and set up your profile in minutes.",
    icon: "✦",
  },
  {
    number: "02",
    title: "Explore Opportunities",
    description:
      "Browse available tuitions and discover opportunities that match your goals.",
    icon: "⌕",
  },
  {
    number: "03",
    title: "Apply & Connect",
    description:
      "Apply for a suitable tuition and take the next step in your learning journey.",
    icon: "↗",
  },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
        <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Your Learning Journey Starts Here
            </span>

            <h1 className="font-heading mt-7 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Find the Right Tutor.
              <br />
              <span className="text-indigo-600">
                Build a Brighter Future.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-8 text-slate-600">
              Connect with qualified tutors, explore tuition opportunities,
              and make learning more accessible with MentorLagbe.
            </p>

            <div className="mt-9">
              <Link
                href="/tuitions"
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
              >
                Explore Tuitions →
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-slate-500">
              <Link
                href="/signup"
                className="transition hover:text-slate-900"
              >
                Join as a tutor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose MentorLagbe */}
      <section className="border-y border-slate-200 bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Why MentorLagbe
            </span>

            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              A Better Way to Find
              <span className="text-indigo-600"> Learning Opportunities</span>
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Everything you need to discover the right tutor or the right
              tuition opportunity, all in one place.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.number}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 p-8 transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold ${feature.color}`}
                  >
                    {feature.icon}
                  </div>

                  <span className="font-heading text-4xl font-bold text-slate-200 transition group-hover:text-indigo-200">
                    {feature.number}
                  </span>
                </div>

                <h3 className="font-heading mt-7 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>

                <div className="mt-7 h-1 w-10 rounded-full bg-indigo-200 transition-all duration-300 group-hover:w-20 group-hover:bg-indigo-600" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              Simple Process
            </span>

            <h2 className="font-heading mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              How It Works
            </h2>

            <p className="mt-5 leading-7 text-slate-500">
              Three simple steps to get started with your next learning
              opportunity.
            </p>
          </div>

          <div className="relative mt-16 grid grid-cols-1 gap-7 md:grid-cols-3">
            {/* Connecting line on desktop */}
            <div className="absolute left-[16%] right-[16%] top-10 hidden border-t-2 border-dashed border-indigo-200 md:block" />

            {steps.map((step) => (
              <div
                key={step.number}
                className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
              >
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-3xl text-white shadow-lg shadow-indigo-200 transition duration-300 group-hover:rotate-6 group-hover:scale-105">
                    {step.icon}
                  </div>

                  <span className="font-heading text-5xl font-extrabold text-slate-100 transition group-hover:text-indigo-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-heading mt-9 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  Step {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedTuitions />

      {/* Bottom CTA */}
      <section className="bg-white px-6 py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center md:px-16 md:py-20">
          <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Get Started Today
            </span>

            <h2 className="font-heading mx-auto mt-5 max-w-2xl text-3xl font-bold text-white md:text-4xl">
              Ready to Find Your Next Learning Opportunity?
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-300 md:text-base">
              Create your account and take the first step towards a better
              learning experience.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Create Your Account →
              </Link>

              <Link
                href="/tuitions"
                className="rounded-xl border border-slate-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Explore Tuitions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
