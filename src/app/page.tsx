export default function Home() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-950 px-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Welcome to{" "}
          <span className="text-blue-500">MentorLagbe</span>
        </h1>

        <p className="mt-5 text-gray-400 text-lg">
          Find the right tutor and make learning easier.
        </p>
      </div>
    </div>
  );
}
