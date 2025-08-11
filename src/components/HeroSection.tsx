"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  backgroundImage?: string;
}

export default function HeroSection({ 
  title = "EXPERT IMMIGRATION ADVICE WHEN YOU NEED IT",
  subtitle = "All Migration Marketplace specialists are either lawyers or OMARA registered migration agents.",
  showSearch = true,
  backgroundImage = "/images/sydney-harbour.jpg"
}: HeroSectionProps) {
  const { currentTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [industry, setIndustry] = useState("");

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, ${currentTheme.colors.primary[900]}dd, ${currentTheme.colors.primary[800]}dd), url(${backgroundImage})`
          }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            {/* Large bubble - slow diagonal movement */}
            <div 
              className="absolute w-32 h-32 rounded-full opacity-20 animate-float-slow"
              style={{ 
                backgroundColor: currentTheme.colors.secondary[500],
                top: '15%',
                left: '10%',
                animation: 'float-slow 8s ease-in-out infinite'
              }}
            ></div>
            
            {/* Medium bubble - slow circular movement */}
            <div 
              className="absolute w-24 h-24 rounded-full opacity-15 animate-float-medium"
              style={{ 
                backgroundColor: currentTheme.colors.accent[500],
                top: '70%',
                right: '15%',
                animation: 'float-medium 12s ease-in-out infinite'
              }}
            ></div>
            
            {/* Small bubble - slow horizontal movement */}
            <div 
              className="absolute w-16 h-16 rounded-full opacity-10 animate-float-small"
              style={{ 
                backgroundColor: currentTheme.colors.secondary[400],
                top: '40%',
                left: '25%',
                animation: 'float-small 10s ease-in-out infinite'
              }}
            ></div>
            
            {/* Extra small bubble - very slow movement */}
            <div 
              className="absolute w-12 h-12 rounded-full opacity-8 animate-float-extra-slow"
              style={{ 
                backgroundColor: currentTheme.colors.accent[400],
                top: '20%',
                right: '30%',
                animation: 'float-extra-slow 15s ease-in-out infinite'
              }}
            ></div>
            
            {/* Medium bubble - slow vertical movement */}
            <div 
              className="absolute w-20 h-20 rounded-full opacity-12 animate-float-vertical"
              style={{ 
                backgroundColor: currentTheme.colors.secondary[300],
                bottom: '25%',
                left: '60%',
                animation: 'float-vertical 9s ease-in-out infinite'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: 'white' }}
          >
            {title.split(' ').map((word, index) => (
              <span 
                key={index}
                className="inline-block mr-4 animate-fade-in-up"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  textShadow: `0 4px 20px ${currentTheme.colors.primary[900]}`
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          
          <p 
            className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: currentTheme.colors.neutral[200] }}
          >
            {subtitle}
          </p>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 max-w-5xl mx-auto border border-white/20"
            style={{ 
              boxShadow: `0 20px 40px ${currentTheme.colors.primary[900]}40`
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search Input */}
              <div className="md:col-span-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search specialists..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Location Input */}
              <div className="md:col-span-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Practice Area Select */}
              <div className="md:col-span-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Area of Practice</option>
                    <option value="skilled-migration">Skilled Migration</option>
                    <option value="family-migration">Family Migration</option>
                    <option value="student-visas">Student Visas</option>
                    <option value="business-migration">Business Migration</option>
                    <option value="partner-visas">Partner Visas</option>
                  </select>
                </div>
              </div>

              {/* Industry Select */}
              <div className="md:col-span-1">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="engineering">Engineering</option>
                    <option value="education">Education</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="md:col-span-1">
                <Button 
                  style={{ 
                    backgroundColor: currentTheme.colors.accent[600],
                    boxShadow: `0 4px 14px ${currentTheme.colors.accent[600]}40`
                  }} 
                  className="w-full py-3 hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <span>Search specialists</span>
                  <svg 
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            style={{ 
              backgroundColor: currentTheme.colors.secondary[600],
              boxShadow: `0 4px 14px ${currentTheme.colors.secondary[600]}40`
            }} 
            className="px-8 py-3 hover:opacity-90 transition-all duration-200"
          >
            <a href="/agents">Browse All Specialists</a>
          </Button>
          <Button 
            asChild
            variant="outline"
            style={{ 
              borderColor: 'white',
              color: 'white'
            }} 
            className="px-8 py-3 hover:bg-white hover:text-gray-900 transition-all duration-200"
          >
            <a href="/agent-register">Register as Specialist</a>
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
