
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get("error")

    if (reason === "configuration") {
      setNotice("Konfigurasi Supabase belum tersedia. Hubungi administrator situs.")
    } else if (reason === "unauthorized") {
      setNotice("Sesi berakhir atau akun ini tidak memiliki akses administrator.")
    }
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setNotice("");
    setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError("Email atau password tidak valid.");
        return;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_admin");

      if (adminError) {
        console.error("Admin access check failed:", adminError);
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error("Failed to clear unauthorized session:", signOutError);
        setError("Akses administrator tidak dapat diverifikasi. Silakan coba kembali.");
        return;
      }

      if (isAdmin !== true) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) console.error("Failed to clear unauthorized session:", signOutError);
        setError("Akun ini tidak memiliki akses administrator.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (loginError) {
      console.error("Admin sign-in failed:", loginError);
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Terjadi kesalahan. Silakan coba kembali.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Admin Login
          </h1>
          <p className="mt-2 text-gray-400">
            FajarKurniawan Portfolio
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {notice && (
            <p role="status" className="rounded-lg bg-amber-950 p-3 text-sm text-amber-200">
              {notice}
            </p>
          )}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none focus:border-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-950 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Halaman khusus administrator.
        </p>
      </div>
    </main>
  );
}
