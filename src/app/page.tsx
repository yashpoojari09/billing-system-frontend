export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-[#54f2ff]">Welcome to Billing Login</h1>
      <p className="mt-2 text-[#b4b7b7]">Manage customers, inventory, and billing with ease.</p>
      <a
        href="/auth/login"
        className="mt-4 px-6 py-2 bg-[#015a5f] text-white rounded-md hover:bg-[#40888f]"
      >
        Login
      </a>
    </main>
  );
}
