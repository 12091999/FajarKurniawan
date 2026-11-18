
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) throw error;
      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Admin sign-out failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Logout gagal. Silakan coba kembali.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {errorMessage && <p role="alert" className="text-xs text-red-300">{errorMessage}</p>}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className="rounded-full border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:border-red-300/40 hover:text-red-200 disabled:opacity-50"
      >
        {loading ? "Keluar..." : "Logout"}
      </button>
    </div>
  );
}
