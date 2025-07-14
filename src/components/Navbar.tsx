"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace</span>
        <div className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Link href="#categories" className="hover:text-green-600">Categories</Link>
          <Link href="#agents" className="hover:text-green-600">Agents</Link>
        </div>
      </div>
      <div className="flex items-center gap-4 relative">
        {session && session.user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 border border-green-100"
            >
              <span className="font-medium text-green-700">
                {session.user.name || session.user.email?.split("@")[0] || "Profile"}
              </span>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-20">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => { signOut(); setDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
} 