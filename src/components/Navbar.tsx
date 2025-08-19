"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const categories = {
    "Immigration": [
      { name: "Lawyers", href: "/agents?category=immigration&subcategory=lawyers" },
      { name: "Migration Agents", href: "/agents?category=immigration&subcategory=migration-agents" },
      { name: "Counselors", href: "/agents?category=immigration&subcategory=counselors" },
      { name: "Visa Consultants", href: "/agents?category=immigration&subcategory=visa-consultants" }
    ],
    "Real Estate": [
      { name: "Real Estate Agents", href: "/agents?category=real-estate&subcategory=agents" },
      { name: "Property Managers", href: "/agents?category=real-estate&subcategory=property-managers" },
      { name: "Buyer's Agents", href: "/agents?category=real-estate&subcategory=buyers-agents" },
      { name: "Property Consultants", href: "/agents?category=real-estate&subcategory=consultants" }
    ]
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace</span>
        <div className="hidden md:flex gap-6 text-sm text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onMouseEnter={() => setCategoriesOpen(true)}
              className="flex items-center gap-1 hover:text-green-600 transition-colors"
            >
              Categories
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {categoriesOpen && (
              <div 
                className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(categories).map(([category, subcategories]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-semibold text-gray-900 text-sm border-b border-gray-100 pb-1">
                          {category}
                        </h3>
                        <div className="space-y-1">
                          {subcategories.map((subcategory) => (
            <Link 
                              key={subcategory.name}
                              href={subcategory.href}
                              className="block text-sm text-gray-600 hover:text-green-600 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                              onClick={() => setCategoriesOpen(false)}
                            >
                              {subcategory.name}
            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Link href="/agents" className="hover:text-green-600 transition-colors">Find Specialists</Link>
          <Link href="/jobs" className="hover:text-green-600 transition-colors">Jobs</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {session && session.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                </div>
              <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                  {session.user.name || session.user.email?.split("@")[0] || "Profile"}
                </span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                  <div className="p-2">
                    {(session.user as any)?.role === "AGENT" ? (
                      <Link
                        href="/agents/dashboard"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Agent Dashboard
                      </Link>
                    ) : (session.user as any)?.role === "ADMIN" ? (
                      <Link
                        href="/admin"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Panel
                      </Link>
                    ) : (
                      <Link
                        href="/client/dashboard"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Client Dashboard
                      </Link>
                    )}
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Visit Website
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200 w-full text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
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