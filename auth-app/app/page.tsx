"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 overflow-hidden px-4">
      
      {/* Floating shapes */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 animate-spin-slow mix-blend-overlay"></div>
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-pink-400/20 rounded-full animate-pulse mix-blend-overlay"></div>

      {/* Main card */}
      <div className="relative max-w-xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-xl text-center">
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight drop-shadow-lg text-white">
          Kuruluş AI
        </h1>
        <p className="mb-10 text-lg sm:text-xl text-white/90">
          Welcome! Access Kuruluş AI platform with a single account.
        </p>

        {/* Single Button */}
        <button
          className="px-10 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-lg hover:scale-105 hover:bg-white/90 transition transform text-lg"
          onClick={() => router.push("/auth")} // Single combined page
        >
          Get Started
        </button>

        <p className="mt-8 text-sm text-white/70">
          Powered by Kuruluş AI
        </p>
      </div>
    </div>
  );
}
