"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [fade, setFade] = useState(false);

  // Auto redirect if already logged in
  useEffect(() => {
    if (session) {
      setFade(true);
      const timer = setTimeout(() => router.push("/dashboard"), 300);
      return () => clearTimeout(timer);
    }
  }, [session, router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) setError(res.error);
    else {
      setFade(true);
      setTimeout(() => router.push("/dashboard"), 300);
    }
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message);

      const login = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (login?.error) setError(login.error);
      else {
        setFade(true);
        setTimeout(() => router.push("/dashboard"), 300);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 px-4 overflow-hidden transition-opacity duration-300 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Particle container */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute w-2 h-2 bg-white/50 rounded-full animate-particle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Floating shapes */}
      <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-white/10 rounded-full -translate-x-1/2 animate-spin-slow mix-blend-overlay"></div>
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-pink-400/20 rounded-full animate-pulse mix-blend-overlay"></div>

      {/* Auth card */}
      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-lg">
          Kuruluş AI
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              tab === "login"
                ? "bg-white text-blue-600 shadow-lg"
                : "text-white/80 hover:text-white"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-semibold transition ${
              tab === "signup"
                ? "bg-white text-blue-600 shadow-lg"
                : "text-white/80 hover:text-white"
            }`}
            onClick={() => setTab("signup")}
          >
            Signup
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Forms */}
        {tab === "login" ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              placeholder="Email"
              type="email"
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="mt-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:scale-105 transition transform"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <input
              placeholder="Name"
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              placeholder="Email"
              type="email"
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              placeholder="Password"
              type="password"
              className="p-3 rounded-xl border border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <button
              type="submit"
              className="mt-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:scale-105 transition transform"
            >
              Signup
            </button>
          </form>
        )}
        <p className="mt-6 text-sm text-white/70">Powered by Kuruluş AI</p>
      </div>

      {/* Tailwind particle animation */}
      <style jsx>{`
        @keyframes particle-move {
          0% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(-20px, 20px); opacity: 1; }
          100% { transform: translate(0, -20px); opacity: 0.5; }
        }
        .animate-particle {
          animation-name: particle-move;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
