"use client";

import { useAgents } from "@/hooks/use-agents";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const categories = [
  { name: "Student Visa", icon: "🎓" },
  { name: "Work Visa", icon: "💼" },
  { name: "Family Visa", icon: "👨‍👩‍👧‍👦" },
  { name: "Business Visa", icon: "🏢" },
  { name: "Tourist Visa", icon: "🌏" },
  { name: "Appeals", icon: "⚖️" },
];

function Navbar() {
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
        {session ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-green-50 border border-green-100"
            >
              <span className="font-medium text-green-700">
                {session.user?.name || session.user?.email?.split("@")[0] || "Profile"}
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

function Hero({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  return (
    <section className="bg-gradient-to-br from-[#dcfce7] to-green-400 dark:from-gray-900 dark:to-gray-800 py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white">Find the Best MARA Agents for Your Migration Needs</h1>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">Connect with trusted, verified migration professionals in Australia</p>
      <div className="max-w-xl mx-auto flex gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search agents, city, visa type..."
          className="flex-1 border rounded-l px-4 py-2 text-lg focus:outline-none"
        />
        <Button onClick={() => onSearch(query)} className="rounded-l-none text-lg">Search</Button>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="py-10 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Popular Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {categories.map(cat => (
          <div key={cat.name} className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-lg shadow p-4 hover:shadow-lg transition">
            <span className="text-3xl mb-2">{cat.icon}</span>
            <span className="font-medium text-gray-800 dark:text-gray-100">{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-8 mt-12 text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="font-bold text-green-600 text-lg">MaraPlace</div>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-green-600">About</Link>
          <Link href="#" className="hover:text-green-600">Contact</Link>
          <Link href="#" className="hover:text-green-600">Terms</Link>
          <Link href="#" className="hover:text-green-600">Privacy</Link>
        </div>
        <div className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} MaraPlace. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { agents, loading, error } = useAgents();
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter(agent => {
    const q = search.toLowerCase();
    return (
      agent.name?.toLowerCase().includes(q) ||
      agent.businessCity?.toLowerCase().includes(q) ||
      agent.businessState?.toLowerCase().includes(q) ||
      agent.specializations?.some(s => s.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <Navbar />
      <Hero onSearch={setSearch} />
      <Categories />
      <main id="agents" className="max-w-5xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Featured Mara Agents</h2>
        {loading && <div className="text-center">Loading agents...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => {
            const photoDoc = agent.documents?.find((doc: any) => doc.type === 'photo');
            return (
              <Link href={`/agents/${agent.id}`} key={agent.id} className="block">
                <Card className="hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0">
                      {photoDoc ? (
                        <img src={photoDoc.url} alt={agent.name} className="w-20 h-20 rounded-full object-cover border-2 border-green-200 shadow" />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 border-2 border-green-200 shadow">
                          <span>{agent.name?.[0]}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-lg font-bold truncate">{agent.name}</CardTitle>
                        <CardDescription className="truncate">{agent.businessName} - {agent.businessCity}, {agent.businessState}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">MARA No: {agent.maraNumber}</span>
                          <span className="text-yellow-600">★ {agent.rating?.toFixed(1) ?? 'N/A'}</span>
                          <span className="text-gray-500">({agent.totalReviews} reviews)</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Languages: {agent.languages?.join(", ")}</div>
                        <div className="mt-1 text-sm text-gray-700 dark:text-gray-200 line-clamp-3">{agent.bio}</div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
        {(!loading && filteredAgents.length === 0) && <div className="text-center">No agents found.</div>}
      </main>
      <Footer />
    </div>
  );
} 