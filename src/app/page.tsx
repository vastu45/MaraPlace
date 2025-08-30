"use client";

import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import SpecialistCard from "@/components/SpecialistCard";
import Navbar from "@/components/Navbar";
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
        .map(agent => {
          // Debug: Log agent data to see what's available
          console.log('Agent Debug:', {
            name: agent.name,
            image: agent.image,
            hasImage: !!agent.image,
            imageType: typeof agent.image
          });
          
          return {
          id: agent.id,
          name: agent.name,
          company: agent.businessName || 'Independent Specialist',
          registration: agent.maraNumber ? `MARN ${agent.maraNumber}` : 'Registration Pending',
          logo: agent.businessName ? agent.businessName.split(' ').map(word => word[0]).join('').slice(0, 4) : 'SPEC',
            image: agent.image || undefined,
          rating: agent.rating || 0,
          totalReviews: agent.totalReviews || 0,
          specializations: agent.specializations || [],
          city: agent.businessCity || 'Australia',
          bio: agent.bio || '',
          experience: agent.experience || 0,
          languages: agent.languages || [],
          consultationFee: agent.consultationFee || 0
          };
        })
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
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 style={{ color: currentTheme.colors.primary[800] }} className="text-4xl font-bold mb-4">
              Get Expert Guidance
            </h2>
            <p style={{ color: currentTheme.colors.neutral[600] }} className="text-xl">
              In 4 Simple Steps
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative">
            {/* Wavy Line Connector */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
              <div className="relative h-full">
                {/* Blue section */}
                <div style={{ backgroundColor: currentTheme.colors.primary[500] }} className="absolute top-0 left-0 w-full h-1/4 rounded-full"></div>
                {/* Yellow section */}
                <div style={{ backgroundColor: currentTheme.colors.accent[500] }} className="absolute top-1/4 left-0 w-full h-1/2 rounded-full"></div>
                {/* Blue section */}
                <div style={{ backgroundColor: currentTheme.colors.primary[500] }} className="absolute bottom-0 left-0 w-full h-1/4 rounded-full"></div>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-16">
              {[
                {
                  step: 1,
                  title: "Search for the right specialist",
                  description: "Browse through the list of verified migration specialists based on your visa or migration requirements. Filter by location, specializations, and ratings to find the perfect match for your needs.",
                  icon: "🔍",
                  visual: (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🔍</div>
                        <div className="text-sm font-medium text-blue-700">Search Specialists</div>
                        <div className="text-xs text-blue-600 mt-1">Filter by location, expertise, ratings</div>
                      </div>
                    </div>
                  )
                },
                {
                  step: 2,
                  title: "Book and pay securely",
                  description: "Choose a specialist, select a time slot and make a secure online payment for your 30-minute video consultation. Our platform ensures safe and encrypted transactions.",
                  icon: "⏰",
                  visual: (
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">⏰</div>
                        <div className="text-sm font-medium text-yellow-700">Choose Time</div>
                        <div className="flex justify-center gap-2 mt-2">
                          <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">6h</div>
                          <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold">12h</div>
                          <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">24h ✓</div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  step: 3,
                  title: "Get expert guidance",
                  description: "Connect with your specialist via video call, ask your questions and find out your visa and migration options. Get personalized advice tailored to your situation.",
                  icon: "💬",
                  visual: (
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="text-sm font-medium text-green-700">Video Consultation</div>
                        <div className="bg-white rounded border p-2 mt-2">
                          <div className="text-xs text-gray-600 text-left">Additional comments...</div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  step: 4,
                  title: "Engage specialist for full migration assistance",
                  description: "If you're satisfied with your consultation, you can engage the specialist for full migration assistance. Start your journey to Australia with expert guidance.",
                  icon: "✅",
                  visual: (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">✅</div>
                        <div className="text-sm font-medium text-purple-700">Full Migration Support</div>
                        <div className="text-xs text-purple-600 mt-1">Complete visa application assistance</div>
                      </div>
                    </div>
                  )
                }
              ].map((item, index) => (
                <div key={item.step} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} gap-12`}>
                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div style={{ backgroundColor: currentTheme.colors.primary[600] }} className="w-12 h-12 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 style={{ color: currentTheme.colors.primary[800] }} className="text-xl font-bold">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p style={{ color: currentTheme.colors.neutral[600] }} className="text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Visual Element */}
                  <div className="flex-1 flex justify-center">
                    <div className="relative">
                      {/* Arrow pointing to step */}
                      <div className={`absolute top-1/2 transform -translate-y-1/2 ${index % 2 === 0 ? '-left-4' : '-right-4'}`}>
                        <div style={{ color: currentTheme.colors.primary[500] }} className="text-2xl">
                          {index % 2 === 0 ? '→' : '←'}
                        </div>
                      </div>
                      {item.visual}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Button 
              style={{ 
                backgroundColor: currentTheme.colors.primary[600],
                boxShadow: `0 4px 14px ${currentTheme.colors.primary[600]}40`
              }} 
              className="hover:opacity-90 font-medium text-lg px-8 py-4"
            >
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 style={{ color: currentTheme.colors.primary[800] }} className="text-4xl font-bold mb-4">
              Hear from customers like you
            </h2>
            <p style={{ color: currentTheme.colors.neutral[600] }} className="text-xl max-w-3xl mx-auto">
              Learn what led them to Migration Marketplace, what else they tried, and what their migration journey looks like today.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                company: "Growth Alliance",
                icon: "#",
                content: '"We no longer have to ask ourselves, where did that visa application go?"',
                hasImage: false,
                imageBg: false
              },
              {
                company: "ITALIC",
                icon: "ITALIC",
                content: "How Sarah finally found a migration specialist her family was willing to trust",
                hasImage: true,
                imageBg: true,
                imageAlt: "Sarah - Migration Success"
              },
              {
                company: "AVENUE / SYSTEMS",
                icon: "AVENUE / SYSTEMS",
                content: "How David finally unified his family's migration process with expert guidance",
                hasImage: false,
                imageBg: false
              },
              {
                company: "canny",
                icon: "canny",
                content: '"I would hate going back to traditional migration agencies because I would lose so many personalized services."',
                hasImage: true,
                imageBg: false,
                imageAlt: "Team Success"
              },
              {
                company: "smplrspace",
                icon: "smplrspace",
                content: "From visa consultation to foundation for the whole family's future",
                hasImage: false,
                imageBg: false
              },
              {
                company: "Migration Pro",
                icon: "🍽️",
                content: "From endless visa confusion to increased confidence and clarity",
                hasImage: false,
                imageBg: false
              }
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  testimonial.imageBg ? 'bg-amber-50' : ''
                }`}
              >
                {/* Card Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Company/Icon */}
                  <div className="mb-4">
                    <div style={{ color: currentTheme.colors.primary[700] }} className="text-lg font-bold">
                      {testimonial.icon}
                    </div>
                    <div style={{ color: currentTheme.colors.neutral[800] }} className="text-sm font-medium mt-1">
                      {testimonial.company}
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="flex-1">
                    <p style={{ color: currentTheme.colors.neutral[700] }} className="text-base leading-relaxed">
                      {testimonial.content}
                    </p>
                  </div>

                  {/* Read Story Link */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link 
                      href="#" 
                      style={{ color: currentTheme.colors.primary[600] }} 
                      className="text-sm font-medium hover:underline"
                    >
                      Read story
                    </Link>
                  </div>
                </div>

                {/* Background Image (if applicable) */}
                {testimonial.hasImage && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center">
                      <div className="w-16 h-16 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-gray-600 text-lg">👤</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* View All Testimonials Button */}
          <div className="text-center mt-12">
            <Button 
              variant="outline"
              style={{ 
                borderColor: currentTheme.colors.primary[600],
                color: currentTheme.colors.primary[600]
              }} 
              className="hover:bg-primary-50 font-medium"
            >
              View all testimonials
            </Button>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              {/* Blog Header */}
              <div className="mb-8">
                <div style={{ color: currentTheme.colors.neutral[500] }} className="text-xs font-medium uppercase tracking-wide mb-2">
                  LEARN / BLOG
                </div>
                <h2 style={{ color: currentTheme.colors.primary[800] }} className="text-2xl font-bold mb-2">
                  The Migration Blog
                </h2>
                <p style={{ color: currentTheme.colors.neutral[600] }} className="text-sm">
                  Content for migration experts, visa applicants, and immigration professionals.
                </p>
              </div>

              {/* Jump To Section */}
              <div className="mb-8">
                <div style={{ color: currentTheme.colors.neutral[700] }} className="text-xs font-bold uppercase tracking-wide mb-3">
                  JUMP TO
                </div>
                <div className="space-y-2">
                  {[
                    "Trending",
                    "Visa insights & migration tips",
                    "Latest articles"
                  ].map((item, index) => (
                    <Link 
                      key={index}
                      href="#" 
                      className="flex items-center justify-between text-sm hover:text-primary-600 transition-colors"
                      style={{ color: currentTheme.colors.neutral[600] }}
                    >
                      <span>{item}</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Filters Section */}
              <div>
                <div style={{ color: currentTheme.colors.neutral[700] }} className="text-xs font-bold uppercase tracking-wide mb-3">
                  FILTERS
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "All", active: true },
                    { name: "Visa guides", active: false },
                    { name: "Migration tips", active: false },
                    { name: "Success stories", active: false },
                    { name: "Legal updates", active: false },
                    { name: "Expert advice", active: false },
                    { name: "Family migration", active: false },
                    { name: "Business visas", active: false },
                    { name: "Student visas", active: false },
                    { name: "Partner visas", active: false },
                    { name: "Skilled migration", active: false },
                    { name: "Common problems", active: false }
                  ].map((filter, index) => (
                    <button
                      key={index}
                      className={`text-xs px-3 py-2 rounded font-medium transition-colors ${
                        filter.active 
                          ? 'text-white' 
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      style={{
                        backgroundColor: filter.active 
                          ? currentTheme.colors.primary[600] 
                          : 'transparent',
                        border: filter.active 
                          ? 'none' 
                          : `1px solid ${currentTheme.colors.neutral[200]}`
                      }}
                    >
                      {filter.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Featured Articles */}
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Featured Article 1 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div style={{ backgroundColor: currentTheme.colors.accent[100] }} className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div style={{ color: currentTheme.colors.accent[600] }} className="text-4xl mb-2">📋</div>
                      <div style={{ color: currentTheme.colors.accent[700] }} className="text-lg font-bold">Migration Marketplace</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div style={{ color: currentTheme.colors.neutral[500] }} className="text-xs font-medium uppercase tracking-wide mb-2">
                      MIGRATION MARKETPLACE UPDATES
                    </div>
                    <h3 style={{ color: currentTheme.colors.primary[800] }} className="text-xl font-bold mb-3">
                      Expert consultations now available on Migration Marketplace
                    </h3>
                    <p style={{ color: currentTheme.colors.neutral[600] }} className="text-sm mb-4">
                      We've launched our new consultation platform—connecting visa applicants with verified migration specialists for personalized guidance.
                    </p>
                    <div className="flex items-center">
                      <div style={{ backgroundColor: currentTheme.colors.primary[100] }} className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                        <span style={{ color: currentTheme.colors.primary[600] }} className="text-xs font-bold">M</span>
                      </div>
                      <span style={{ color: currentTheme.colors.neutral[600] }} className="text-sm">Migration Marketplace team</span>
                    </div>
                  </div>
                </div>

                {/* Featured Article 2 */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-2xl">👩‍💼</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div style={{ color: currentTheme.colors.neutral[500] }} className="text-xs font-medium uppercase tracking-wide mb-2">
                      MIGRATION TIPS & ADVICE
                    </div>
                    <h3 style={{ color: currentTheme.colors.primary[800] }} className="text-xl font-bold mb-3">
                      How to choose the right migration specialist for your visa application
                    </h3>
                    <p style={{ color: currentTheme.colors.neutral[600] }} className="text-sm mb-4">
                      Finding the right migration specialist is crucial for your visa success. Here's what to look for and how to make the best choice...
                    </p>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                      <span style={{ color: currentTheme.colors.neutral[600] }} className="text-sm">Emma Wilson, Migration Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div style={{ color: currentTheme.colors.neutral[700] }} className="text-xs font-bold uppercase tracking-wide mb-3">
                  SEARCH
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="I want to read about..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    style={{ color: currentTheme.colors.neutral[800] }}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
} 