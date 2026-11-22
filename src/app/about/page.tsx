
import {
  GraduationCap,
  Users,
  BookOpen,
  ShieldCheck,
  Target,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Connect Students & Tutors",
    description:
      "We bring students and qualified tutors together through one simple platform.",
  },
  {
    icon: BookOpen,
    title: "Easy Tuition Search",
    description:
      "Students can easily find tuition opportunities based on subject, class and location.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description:
      "Our approval system helps maintain a reliable and organized tuition marketplace.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
          About MentorLagbe
        </span>

        <h1 className="mt-8 text-4xl font-bold leading-tight md:text-6xl">
          Making Education
          <span className="block text-blue-600">
            More Accessible
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          MentorLagbe is an online tuition marketplace designed
          to connect students with qualified tutors. Our goal
          is to make finding and providing tuition easier,
          faster and more convenient.
        </p>
      </section>

      {/* Mission and Vision */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-blue-200">
          <Target className="mb-5 text-blue-600" size={34} />

          <h2 className="mb-4 text-2xl font-bold">
            Our Mission
          </h2>

          <p className="leading-7 text-slate-600">
            Our mission is to simplify the tuition searching
            process and create opportunities for both students
            and tutors through a user-friendly digital platform.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-blue-200">
          <Heart className="mb-5 text-blue-600" size={34} />

          <h2 className="mb-4 text-2xl font-bold">
            Our Vision
          </h2>

          <p className="leading-7 text-slate-600">
            We envision a future where every student can find
            the right tutor and every tutor can discover
            meaningful teaching opportunities.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            What We{" "}
            <span className="text-blue-600">Offer</span>
          </h2>

          <p className="mt-4 text-slate-600">
            Everything you need to connect through education.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-5 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon size={28} />
                </div>

                <h3 className="mb-3 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="border-t border-slate-200 bg-slate-50 px-6 py-16 text-center">
        <GraduationCap
          className="mx-auto mb-5 text-blue-600"
          size={48}
        />

        <h2 className="text-3xl font-bold">
          Learn Better. Teach Better.
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
          MentorLagbe is here to make the connection between
          students and tutors easier.
        </p>
      </section>
    </main>
  );
}
