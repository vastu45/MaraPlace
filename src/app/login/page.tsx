"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    // Simulated login validation
    setTimeout(() => {
      setLoading(false);
      if (form.email === "test@example.com" && form.password === "password123") {
        setSuccess(true);
        router.push("/"); // Redirect to home page after login
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1000);
  };

  const handleAgentRegister = () => {
    router.push("/agent-register");
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dcfce7] to-green-400">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-green-700">Login to MaraPlace</h1>
        {success ? (
          <div className="text-green-700 text-center mb-4">Login successful!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-200" />
              <span className="mx-3 text-gray-400 font-medium">or</span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>
            <Button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-green-50"
              type="button"
            >
              <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block align-middle" xmlns="http://www.w3.org/2000/svg"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C35.82 2.69 30.28 0 24 0 14.82 0 6.71 5.8 2.69 14.09l7.98 6.19C12.13 13.16 17.57 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.3 46.1 24.55z"/><path fill="#FBBC05" d="M10.67 28.28a14.5 14.5 0 0 1 0-8.56l-7.98-6.19A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.47l7.98-6.19z"/><path fill="#EA4335" d="M24 48c6.28 0 11.56-2.08 15.41-5.66l-7.19-5.6c-2.01 1.35-4.59 2.16-8.22 2.16-6.43 0-11.87-3.66-14.33-8.99l-7.98 6.19C6.71 42.2 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
              Sign in with Google
            </Button>
          </form>
        )}
        <div className="text-center mt-4 text-sm">
          New to MaraPlace? <Link href="/signup" className="text-green-700 underline">Sign Up</Link>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <span className="mb-2 text-gray-500">Want to help others migrate?</span>
          <Button onClick={handleAgentRegister} variant="outline" className="w-full text-green-700 border-green-400 hover:bg-green-50">
            Register as an agent
          </Button>
        </div>
      </div>
    </div>
  );
} 