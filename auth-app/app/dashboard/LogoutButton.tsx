"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 rounded-xl bg-white text-purple-600 font-semibold hover:bg-white/90 transition"
    >
      Logout
    </button>
  );
}
