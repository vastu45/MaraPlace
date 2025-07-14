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

function Hero({ onSearch }: { onSearch: (filters: any) => void }) {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    area: "",
    industry: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <section className="bg-gradient-to-br from-[#dcfce7] to-green-400 dark:from-gray-900 dark:to-gray-800 py-16 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">EXPERT IMMIGRATION ADVICE WHEN YOU NEED IT</h1>
      <p className="text-lg md:text-xl text-green-700 mb-8">All Migration Marketplace specialists are either lawyers or OMARA registered migration agents.</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 justify-center">
        <div className="flex items-center bg-white rounded-lg px-4 py-2 w-full md:w-auto">
          {/* Search Icon */}
          <span className="text-green-400 mr-2">🔍</span>
          <input
            className="outline-none w-full bg-transparent"
            placeholder="Search..."
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center bg-white rounded-lg px-4 py-2 w-full md:w-auto">
          {/* Location Icon */}
          <span className="text-green-400 mr-2">🇦🇺</span>
          <input
            className="outline-none w-full bg-transparent"
            placeholder="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center bg-white rounded-lg px-4 py-2 w-full md:w-auto">
          {/* Area of Practice Icon */}
          <span className="text-green-400 mr-2">📚</span>
          <select
            className="outline-none w-full bg-transparent"
            name="area"
            value={filters.area}
            onChange={handleChange}
          >
            <option value="">Area of Practice</option>
            <option value="visa">Visa</option>
            <option value="appeals">Appeals</option>
            <option value="citizenship">Citizenship</option>
          </select>
        </div>
        <div className="flex items-center bg-white rounded-lg px-4 py-2 w-full md:w-auto">
          {/* Industry Icon */}
          <span className="text-green-400 mr-2">🏢</span>
          <select
            className="outline-none w-full bg-transparent"
            name="industry"
            value={filters.industry}
            onChange={handleChange}
          >
            <option value="">Select Industry</option>
            <option value="education">Education</option>
            <option value="business">Business</option>
            <option value="family">Family</option>
          </select>
        </div>
        <button type="submit" className="bg-[#386641] text-white rounded-lg px-6 py-2 flex items-center font-semibold hover:bg-green-700 transition">
          Search specialists <span className="ml-2">→</span>
        </button>
      </form>
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

function AgentCard({ agent }: { agent: any }) {
  // Extract profile photo and business logo from documents
  const photoDoc = agent.documents?.find((d: any) => d.type === 'photo');
  const logoDoc = agent.documents?.find((d: any) => d.type === 'businessLogo');
  const photoUrl = photoDoc?.url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(agent.name || "Agent");
  const logoUrl = logoDoc?.url || "https://placehold.co/40x40";
  const rating = agent.rating || 0;
  const reviewCount = agent.totalReviews || 0;
  const consultancyFee = agent.consultationFee !== undefined && agent.consultationFee !== null ? `$${agent.consultancyFee}` : 'N/A';
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center relative">
      {/* Profile Photo (Top, Larger) */}
      <div className="-mt-20 mb-2 w-36 h-36 rounded-full bg-gray-100 border-4 border-green-200 flex items-center justify-center overflow-hidden shadow-lg">
        <img src={photoUrl} alt="Profile" className="object-cover w-full h-full" />
      </div>
      <div className="text-green-700 font-semibold text-xs mb-1">Featured</div>
      <div className="flex items-center gap-1 mb-1">
        <span className="text-gray-400">{Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}</span>
        <span className="text-gray-600 font-medium ml-1">{rating.toFixed(1)}</span>
        <span className="text-gray-400 text-xs">({reviewCount})</span>
      </div>
      <div className="text-lg font-bold text-gray-900 mb-1">{agent.name}</div>
      <div className="text-purple-700 font-medium text-sm mb-1">{agent.businessName}</div>
      <div className="text-gray-500 text-xs mb-2">MARA No: {agent.maraNumber}</div>
      {/* Business Logo (Below, Small) */}
      <div className="mb-4 mt-2 w-14 h-14 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-center overflow-hidden shadow">
        <img src={logoUrl} alt="Business Logo" className="object-contain w-full h-full" />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-green-700 font-bold text-lg">{consultancyFee}</span>
        <span className="text-gray-500 text-xs">for 30 min</span>
      </div>
      <div className="flex flex-col gap-2 w-full pt-2">
        <Button className="w-full bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 rounded-lg">Book a consultation</Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={`/agents/${agent.id}`}>Profile</Link>
        </Button>
      </div>
    </div>
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
      <main id="agents" className="py-10 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-32 text-center">Featured Mara Agents</h2>
        {/* Add extra margin below heading to prevent overlap */}
        <div className="mb-8" />
        {loading && <div className="text-center">Loading agents...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        {(!loading && filteredAgents.length === 0) && <div className="text-center">No agents found.</div>}
      </main>
      <Footer />
    </div>
  );
} 