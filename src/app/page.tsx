export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-700">
        Welcome to Billing Login
      </h1>

      {/* Description */}
      <p className="mt-2 text-sm sm:text-lg md:text-xl lg:text-2xl text-[#b4b7b7] max-w-md">
        Manage customers, inventory, and billing with ease.
      </p>

      {/* Login Button */}
      <a
        href="/auth/login"
        className="mt-4 px-6 py-3 bg-blue-700 text-white text-sm sm:text-lg rounded-md hover:bg-blue-600 transition-all"
      >
        Login
      </a>
    </main>
  );
}

