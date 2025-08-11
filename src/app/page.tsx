"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SpecialistCard from "@/components/SpecialistCard";
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
          city: agent.businessCity || 'Australia',
          bio: agent.bio || '',
          experience: agent.experience || 0,
          languages: agent.languages || [],
          consultationFee: agent.consultationFee || 0
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
          specializations: ['Skilled Migration', 'Business Migration', 'Family Migration'],
          city: 'Sydney',
          bio: 'Experienced migration specialist with expertise in skilled and business migration pathways.',
          experience: 8,
          languages: ['English', 'Nepali', 'Hindi'],
          consultationFee: 200
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
          specializations: ['Family Migration', 'Partner Visas', 'Student Visas'],
          city: 'Melbourne',
          bio: 'Specialized in family and partner visa applications with high success rates.',
          experience: 6,
          languages: ['English', 'Mandarin', 'Cantonese'],
          consultationFee: 180
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
          specializations: ['Student Visas', 'Skilled Migration', 'Temporary Visas'],
          city: 'Brisbane',
          bio: 'Expert in student visa applications and temporary visa pathways.',
          experience: 5,
          languages: ['English', 'Spanish'],
          consultationFee: 150
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
          specializations: ['Business Migration', 'Investment Visas', 'Skilled Migration'],
          city: 'Perth',
          bio: 'Specialized in business and investment migration with extensive experience.',
          experience: 10,
          languages: ['English', 'French'],
          consultationFee: 250
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
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Migration Specialists */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 style={{ color: currentTheme.colors.primary[800] }} className="text-4xl font-bold mb-4">
              FEATURED MIGRATION SPECIALISTS
              {isUsingFallbackData && (
                <span style={{ color: currentTheme.colors.warning }} className="text-sm font-normal block mt-2">
                  (Showing sample data - Database connection required for real data)
                </span>
              )}
            </h2>
            <p style={{ color: currentTheme.colors.neutral[600] }} className="text-lg max-w-3xl mx-auto">
              Filter search above or browse the featured specialists below to book a consultation for advice on visa options and the Australian migration process.
            </p>
          </div>
          
          {/* Specialists Grid */}
          <div className="relative">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} style={{ backgroundColor: currentTheme.colors.primary[50], borderColor: currentTheme.colors.primary[200] }} className="rounded-2xl p-6 border relative animate-pulse">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredSpecialists.map((specialist) => (
                  <SpecialistCard key={specialist.id} specialist={specialist} />
                ))}
              </div>
            )}
            
            {/* View All Button */}
            <div className="text-center mt-12">
              <Link href="/agents">
                <Button 
                  style={{ 
                    backgroundColor: currentTheme.colors.primary[600],
                    boxShadow: `0 4px 14px ${currentTheme.colors.primary[600]}40`
                  }} 
                  className="hover:opacity-90 font-medium flex items-center gap-2 mx-auto"
                >
                  View all specialists
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
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

      {/* Footer */}
      <Footer />
    </div>
  );
} 