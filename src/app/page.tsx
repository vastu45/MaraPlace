"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useAgents } from "@/hooks/use-agents";

export default function Home() {
  const { currentTheme } = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { agents, loading, error } = useAgents();

  // Get featured specialists (first 4 agents with highest ratings)
  const featuredSpecialists = agents && agents.length > 0 
    ? agents
        .filter(agent => agent.status === 'APPROVED')
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)
        .map(agent => ({
          id: agent.id,
          name: agent.name,
          company: agent.businessName || 'Independent Specialist',
          registration: agent.maraNumber ? `MARN ${agent.maraNumber}` : 'Registration Pending',
          logo: agent.businessName ? agent.businessName.split(' ').map(word => word[0]).join('').slice(0, 4) : 'SPEC',
          image: agent.image || '/api/placeholder/100/100',
          rating: agent.rating || 0,
          totalReviews: agent.totalReviews || 0,
          specializations: agent.specializations || [],
          city: agent.businessCity || 'Australia'
        }))
    : [
        {
          id: '1',
          name: 'Spandan Karki',
          company: 'ICS Venture Pty Ltd',
          registration: 'MARN 1281245',
          logo: 'ICSV',
          image: '/api/placeholder/100/100',
          rating: 4.8,
          totalReviews: 15,
          specializations: ['Skilled Migration'],
          city: 'Sydney'
        },
        {
          id: '2',
          name: 'Michael Chen',
          company: 'Chen Immigration Solutions',
          registration: 'MARN 2345678',
          logo: 'CIS',
          image: '/api/placeholder/100/100',
          rating: 4.6,
          totalReviews: 12,
          specializations: ['Family Migration'],
          city: 'Melbourne'
        },
        {
          id: '3',
          name: 'Sarah Johnson',
          company: 'Johnson Migration Services',
          registration: 'MARN 1234567',
          logo: 'JMS',
          image: '/api/placeholder/100/100',
          rating: 4.4,
          totalReviews: 8,
          specializations: ['Student Visas'],
          city: 'Brisbane'
        },
        {
          id: '4',
          name: 'Emma Wilson',
          company: 'Wilson Visa Services',
          registration: 'MARN 3456789',
          logo: 'WVS',
          image: '/api/placeholder/100/100',
          rating: 4.2,
          totalReviews: 10,
          specializations: ['Business Migration'],
          city: 'Perth'
        }
      ];

  // Show a message if using fallback data
  const isUsingFallbackData = !agents || agents.length === 0;

  const keyFeatures = [
    {
      icon: "✓",
      title: "Free sign up",
      description: "Sign up for free and start exploring. Some consultations may require a fee."
    },
    {
      icon: "★",
      title: "User reviews & ratings",
      description: "Make informed decisions by browsing through reviews and ratings from other visa applicants."
    },
    {
      icon: "💬",
      title: "Enhanced communication",
      description: "Secure booking and messaging ensures seamless communication with specialists."
    },
    {
      icon: "$",
      title: "Transparent pricing",
      description: "Compare service fees and find specialists that fit your budget."
    },
    {
      icon: "📊",
      title: "User-friendly dashboard",
      description: "Easily navigate and manage your dashboard with online support."
    },
    {
      icon: "👤",
      title: "Unified profile",
      description: "Use your profile to apply for jobs, post ads, and connect with migration specialists.",
      isNew: true
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Dark Blue Navigation */}
      <nav style={{ backgroundColor: currentTheme.colors.primary[900], color: 'white' }} className="px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div style={{ backgroundColor: currentTheme.colors.secondary[500] }} className="w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold">Migration Marketplace</span>
            </div>
            <div className="hidden md:flex gap-6 text-sm">
              <Link href="/agents" style={{ color: 'white' }} className="hover:opacity-80 transition-colors">
                Find a migration specialist
              </Link>
              <Link href="/agent-register" style={{ color: 'white' }} className="hover:opacity-80 transition-colors">
                Register as a migration specialist
              </Link>
              <Link href="/jobs" style={{ color: 'white' }} className="hover:opacity-80 transition-colors">
                Find WorkinAUS
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" style={{ backgroundColor: currentTheme.colors.secondary[600], borderColor: currentTheme.colors.secondary[600], color: 'white' }} className="hover:opacity-90">
              <Link href="/signup">Sign up</Link>
            </Button>
            <Button asChild style={{ backgroundColor: currentTheme.colors.accent[600] }} className="hover:opacity-90">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section style={{ background: `linear-gradient(to bottom right, ${currentTheme.colors.primary[50]}, ${currentTheme.colors.accent[50]})` }} className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 style={{ color: currentTheme.colors.primary[800] }} className="text-4xl md:text-5xl font-bold mb-4">
            EXPERT IMMIGRATION ADVICE WHEN YOU NEED IT
          </h1>
          <p style={{ color: currentTheme.colors.neutral[700] }} className="text-lg mb-8 max-w-3xl mx-auto">
            All Migration Marketplace specialists are either lawyers or OMARA registered migration agents.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Area of Practice</option>
                <option>Skilled Migration</option>
                <option>Family Migration</option>
                <option>Student Visas</option>
                <option>Business Migration</option>
              </select>
              <select className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option>Select Industry</option>
                <option>Technology</option>
                <option>Healthcare</option>
                <option>Engineering</option>
                <option>Education</option>
              </select>
              <Button style={{ backgroundColor: currentTheme.colors.accent[600] }} className="hover:opacity-90 px-8 py-3 flex items-center gap-2">
                Search specialists
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Migration Specialists */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
                     <h2 style={{ color: currentTheme.colors.primary[800] }} className="text-3xl font-bold text-center mb-4">
             FEATURED MIGRATION SPECIALISTS
             {isUsingFallbackData && (
               <span style={{ color: currentTheme.colors.warning }} className="text-sm font-normal block mt-2">
                 (Showing sample data - Database connection required for real data)
               </span>
             )}
          </h2>
          <p style={{ color: currentTheme.colors.neutral[600] }} className="text-center mb-12 max-w-3xl mx-auto">
            Filter search above or browse the featured specialists below to book a consultation for advice on visa options and the Australian migration process.
          </p>
          
          {/* Specialists Carousel */}
          <div className="relative">
                         <div className="flex gap-6 overflow-x-auto pb-8">
               {loading ? (
                 <div className="flex gap-6">
                   {[...Array(4)].map((_, index) => (
                     <div key={index} style={{ backgroundColor: currentTheme.colors.primary[50], borderColor: currentTheme.colors.primary[200] }} className="flex-shrink-0 w-80 rounded-lg p-6 border relative animate-pulse">
                       <div className="w-16 h-16 bg-gray-300 rounded-full mb-4"></div>
                       <div className="space-y-2">
                         <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                         <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                                 featuredSpecialists.map((specialist, index) => (
                   <Link href={`/agents/${specialist.id}`} key={specialist.id}>
                     <div style={{ backgroundColor: currentTheme.colors.primary[50], borderColor: currentTheme.colors.primary[200] }} className="flex-shrink-0 w-80 rounded-lg p-6 border relative hover:shadow-lg transition-shadow cursor-pointer">
                    <div style={{ backgroundColor: currentTheme.colors.accent[500] }} className="absolute top-4 left-4 text-white text-xs px-2 py-1 rounded-full">
                      featured
                    </div>
                    <div style={{ color: currentTheme.colors.neutral[600] }} className="absolute top-4 right-4 text-xs font-semibold">
                      {specialist.logo}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {specialist.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                                                 <div className="flex items-center gap-1 mb-1">
                           {[...Array(5)].map((_, i) => (
                             <svg key={i} className={`w-4 h-4 ${i < Math.round(specialist.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                           ))}
                           <span className="text-sm text-gray-500 ml-1">({specialist.totalReviews})</span>
                         </div>
                        <h3 style={{ color: currentTheme.colors.neutral[900] }} className="font-semibold">{specialist.name}</h3>
                        <p style={{ color: currentTheme.colors.neutral[600] }} className="text-sm">{specialist.company}</p>
                                                 <p style={{ color: currentTheme.colors.neutral[500] }} className="text-xs">{specialist.registration}</p>
              </div>
            </div>
              </div>
                   </Link>
                 ))
              )}
            </div>
            
                         {/* Pagination Dots */}
             {featuredSpecialists.length > 0 && (
               <div className="flex justify-center gap-2 mt-6">
                 {featuredSpecialists.map((_, index) => (
                   <button
                     key={index}
                     onClick={() => setCurrentSlide(index)}
                     style={{ backgroundColor: index === currentSlide ? currentTheme.colors.primary[600] : currentTheme.colors.neutral[300] }}
                     className="w-3 h-3 rounded-full"
                   />
                 ))}
               </div>
             )}
            
            <div className="text-center mt-6">
              <Link href="/agents" style={{ color: currentTheme.colors.primary[600] }} className="hover:opacity-80 font-medium flex items-center justify-center gap-2">
                View all specialists
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Get Expert Guidance Section */}
      <section className="relative h-96 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        
        <div className="relative z-20 flex h-full">
          {/* Left Side - Background Image Placeholder */}
          <div className="w-2/3 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-4xl font-bold mb-2">GET EXPERT GUIDANCE</h2>
              <p className="text-2xl">IN 4 SIMPLE STEPS!</p>
            </div>
          </div>
          
          {/* Right Side - Steps Panel */}
          <div style={{ backgroundColor: currentTheme.colors.accent[100] }} className="w-1/3 p-8">
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Search for the right specialist",
                  description: "Browse through the list of verified migration specialists based on your visa or migration requirements."
                },
                {
                  step: 2,
                  title: "Book and pay securely",
                  description: "Choose a specialist, select a time slot and make a secure online payment for your 30-minute video consultation."
                },
                {
                  step: 3,
                  title: "Get expert guidance",
                  description: "Connect with your specialist via video call, ask your questions and find out your visa and migration options."
                },
                {
                  step: 4,
                  title: "Engage specialist for full migration assistance",
                  description: "If you're satisfied with your consultation, you can engage the specialist for full migration assistance."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div style={{ backgroundColor: currentTheme.colors.accent[600] }} className="flex-shrink-0 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ color: currentTheme.colors.neutral[900] }} className="font-semibold mb-1">{item.title}</h3>
                    <p style={{ color: currentTheme.colors.neutral[600] }} className="text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button style={{ backgroundColor: currentTheme.colors.accent[600] }} className="w-full mt-8 hover:opacity-90 text-white py-3">
              Start your migration journey today
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section style={{ backgroundColor: currentTheme.colors.primary[900] }} className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 style={{ color: currentTheme.colors.accent[400] }} className="text-3xl font-bold mb-8">KEY FEATURES</h2>
              <div className="grid gap-6">
                {keyFeatures.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div style={{ backgroundColor: currentTheme.colors.accent[500] }} className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 style={{ color: 'white' }} className="font-semibold mb-1 flex items-center gap-2">
                        {feature.title}
                        {feature.isNew && (
                          <span style={{ backgroundColor: currentTheme.colors.warning, color: 'black' }} className="text-xs px-2 py-1 rounded-full">NEW</span>
                        )}
                      </h3>
                      <p style={{ color: currentTheme.colors.neutral[300] }} className="text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="grid gap-6">
                {keyFeatures.slice(3).map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div style={{ backgroundColor: currentTheme.colors.accent[500] }} className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 style={{ color: 'white' }} className="font-semibold mb-1 flex items-center gap-2">
                        {feature.title}
                        {feature.isNew && (
                          <span style={{ backgroundColor: currentTheme.colors.warning, color: 'black' }} className="text-xs px-2 py-1 rounded-full">NEW</span>
                        )}
                      </h3>
                      <p style={{ color: currentTheme.colors.neutral[300] }} className="text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button asChild style={{ backgroundColor: currentTheme.colors.secondary[600] }} className="mt-8 hover:opacity-90 text-white flex items-center gap-2">
                <Link href="/agents">
                  Find a specialist now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
          </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 