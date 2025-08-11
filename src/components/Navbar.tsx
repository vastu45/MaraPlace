"use client";
import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <nav 
      style={{ 
        backgroundColor: currentTheme.colors.primary[900], 
        color: 'white',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${currentTheme.colors.primary[800]}`
      }} 
      className="sticky top-0 z-50 px-4 py-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div 
              style={{ 
                backgroundColor: currentTheme.colors.secondary[500],
                boxShadow: `0 0 20px ${currentTheme.colors.secondary[500]}40`
              }} 
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
            >
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">Migration</span>
              <span 
                style={{ color: currentTheme.colors.secondary[400] }} 
                className="text-sm font-medium -mt-1"
              >
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-8 text-sm font-medium">
            <Link 
              href="/agents" 
              className="hover:opacity-80 transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find a migration specialist
            </Link>
            <Link 
              href="/agent-register" 
              className="hover:opacity-80 transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register as a specialist
            </Link>
            <Link 
              href="/jobs" 
              className="hover:opacity-80 transition-all duration-200 flex items-center gap-2 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Find WorkinAUS
            </Link>
          </div>
        </div>

        {/* Right Side - Auth Buttons & User Menu */}
        <div className="flex items-center gap-4">
          {session && session.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                style={{ 
                  backgroundColor: currentTheme.colors.primary[800],
                  borderColor: currentTheme.colors.primary[700]
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-80 transition-all duration-200 border"
              >
                <div 
                  style={{ backgroundColor: currentTheme.colors.secondary[500] }}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                >
                  {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-sm">
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
                <div 
                  style={{ 
                    backgroundColor: currentTheme.colors.primary[800],
                    borderColor: currentTheme.colors.primary[700]
                  }}
                  className="absolute right-0 mt-2 w-48 rounded-lg border shadow-xl z-20 backdrop-blur-sm"
                >
                  <div className="p-2">
                    {(session.user as any)?.role === "AGENT" ? (
                      <Link
                        href="/agents/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:opacity-80 transition-all duration-200"
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
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:opacity-80 transition-all duration-200"
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
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:opacity-80 transition-all duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Client Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:opacity-80 transition-all duration-200 w-full text-left"
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
              <Button 
                asChild 
                variant="outline" 
                style={{ 
                  backgroundColor: 'transparent',
                  borderColor: currentTheme.colors.secondary[600], 
                  color: currentTheme.colors.secondary[400]
                }} 
                className="hover:opacity-90 transition-all duration-200"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
              <Button 
                asChild 
                style={{ 
                  backgroundColor: currentTheme.colors.accent[600],
                  boxShadow: `0 4px 14px ${currentTheme.colors.accent[600]}40`
                }} 
                className="hover:opacity-90 transition-all duration-200"
              >
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:opacity-80 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          style={{ backgroundColor: currentTheme.colors.primary[800] }}
          className="lg:hidden mt-4 py-4 border-t border-gray-700"
        >
          <div className="flex flex-col gap-4 px-4">
            <Link 
              href="/agents" 
              className="flex items-center gap-3 py-2 hover:opacity-80 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find a migration specialist
            </Link>
            <Link 
              href="/agent-register" 
              className="flex items-center gap-3 py-2 hover:opacity-80 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Register as a specialist
            </Link>
            <Link 
              href="/jobs" 
              className="flex items-center gap-3 py-2 hover:opacity-80 transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              Find WorkinAUS
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
} 