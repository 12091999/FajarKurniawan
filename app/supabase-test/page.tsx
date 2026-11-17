
"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function SupabaseTestPage() {
  const [status, setStatus] = useState("Memeriksa koneksi...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await getSupabaseBrowserClient().auth.getSession();

        if (error) {
          setStatus("Koneksi gagal: " + error.message);
          return;
        }

        setStatus("Supabase berhasil terhubung!");
      } catch {
        setStatus("Tidak dapat menghubungi Supabase.");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-xl border p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          Supabase Connection Test
        </h1>
        <p>{status}</p>
      </div>
    </main>
  );
}
