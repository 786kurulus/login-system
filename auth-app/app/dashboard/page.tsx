"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login"); // Redirect to login if not authenticated
    else setLoading(false);
  }, [status, session, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <Loader2 className="animate-spin mr-2" size={24} />
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center px-4 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome, {session?.user?.name || session?.user?.email}</h1>
      <p className="mb-8">This is your secure dashboard. Only logged-in users can see this.</p>

      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}
