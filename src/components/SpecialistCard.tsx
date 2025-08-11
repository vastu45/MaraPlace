"use client";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

interface SpecialistCardProps {
  specialist: {
    id: string;
    name: string;
    company: string;
    registration: string;
    logo: string;
    image?: string;
    rating: number;
    totalReviews: number;
    specializations: string[];
    city: string;
    bio?: string;
    experience?: number;
    languages?: string[];
    consultationFee?: number;
  };
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const { currentTheme } = useTheme();

  return (
    <Link href={`/agents/${specialist.id}`}>
      <div 
        className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1 h-[600px] flex flex-col"
        style={{ 
          boxShadow: `0 4px 20px ${currentTheme.colors.primary[100]}20`,
        }}
      >
        {/* Header with Navigation Icons */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div 
              style={{ backgroundColor: currentTheme.colors.accent[500] }}
              className="w-2 h-2 rounded-full"
            ></div>
            <span 
              style={{ color: currentTheme.colors.neutral[500] }}
              className="text-xs font-medium"
            >
              Featured Specialist
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div 
              style={{ backgroundColor: currentTheme.colors.primary[100] }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
            >
              <span 
                style={{ color: currentTheme.colors.primary[600] }}
                className="text-xs font-bold"
              >
                {specialist.logo}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Profile Section */}
          <div className="text-center mb-4 flex-shrink-0">
            {/* Avatar */}
            <div className="relative inline-block mb-3">
              <div 
                style={{ backgroundColor: currentTheme.colors.secondary[500] }}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-md mx-auto"
              >
                <span className="text-white font-bold text-lg">
                  {specialist.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {/* Verification Badge */}
              <div 
                style={{ backgroundColor: currentTheme.colors.primary[600] }}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
              >
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Name and Title */}
            <h3 
              style={{ color: currentTheme.colors.primary[800] }}
              className="text-lg font-bold mb-1"
            >
              {specialist.name}
            </h3>
            <p 
              style={{ color: currentTheme.colors.primary[600] }}
              className="text-xs font-medium uppercase tracking-wide"
            >
              {specialist.company}
            </p>
          </div>

          {/* Rating Section */}
          <div className="flex items-center justify-center gap-2 mb-3 flex-shrink-0">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.round(specialist.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span 
              style={{ color: currentTheme.colors.neutral[600] }}
              className="text-xs"
            >
              {specialist.rating.toFixed(1)} ({specialist.totalReviews})
            </span>
          </div>

          {/* Description */}
          <div className="text-center mb-4 flex-shrink-0">
            <p 
              style={{ color: currentTheme.colors.neutral[600] }}
              className="text-xs leading-relaxed"
            >
              {specialist.bio || `Experienced migration specialist with expertise in ${specialist.specializations.slice(0, 2).join(' and ')}.`}
            </p>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 flex-shrink-0">
            {/* Location */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg 
                  style={{ color: currentTheme.colors.neutral[400] }}
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span 
                  style={{ color: currentTheme.colors.neutral[600] }}
                  className="text-xs font-medium"
                >
                  Location
                </span>
              </div>
              <p 
                style={{ color: currentTheme.colors.primary[700] }}
                className="text-xs font-semibold"
              >
                {specialist.city}
              </p>
            </div>

            {/* Experience */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <svg 
                  style={{ color: currentTheme.colors.neutral[400] }}
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                <span 
                  style={{ color: currentTheme.colors.neutral[600] }}
                  className="text-xs font-medium"
                >
                  Experience
                </span>
              </div>
              <p 
                style={{ color: currentTheme.colors.primary[700] }}
                className="text-xs font-semibold"
              >
                {specialist.experience || 5}+ years
              </p>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-4 flex-shrink-0">
            <h4 
              style={{ color: currentTheme.colors.primary[700] }}
              className="text-xs font-semibold mb-2 text-center"
            >
              Specializations
            </h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {specialist.specializations.slice(0, 2).map((spec, index) => (
                <span 
                  key={index}
                  style={{ 
                    backgroundColor: currentTheme.colors.accent[100],
                    color: currentTheme.colors.accent[700]
                  }}
                  className="text-xs px-2 py-1 rounded-full font-medium"
                >
                  {spec}
                </span>
              ))}
              {specialist.specializations.length > 2 && (
                <span 
                  style={{ 
                    backgroundColor: currentTheme.colors.neutral[100],
                    color: currentTheme.colors.neutral[600]
                  }}
                  className="text-xs px-2 py-1 rounded-full font-medium"
                >
                  +{specialist.specializations.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Registration Number */}
          <div className="text-center mb-4 flex-shrink-0">
            <div 
              style={{ 
                backgroundColor: currentTheme.colors.primary[50],
                border: `1px solid ${currentTheme.colors.primary[200]}`
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg"
            >
              <svg 
                style={{ color: currentTheme.colors.primary[600] }}
                className="w-3 h-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span 
                style={{ color: currentTheme.colors.primary[700] }}
                className="text-xs font-semibold"
              >
                {specialist.registration}
              </span>
            </div>
          </div>

          {/* Call to Action Button */}
          <div 
            style={{ 
              backgroundColor: '#8B5CF6'
            }}
            className="w-full py-2.5 rounded-lg text-white font-semibold text-center group-hover:opacity-90 transition-all duration-200 flex-shrink-0"
          >
            Book Consultation
          </div>

          {/* Social Stats Section */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex-1 flex items-end">
            <div className="grid grid-cols-3 gap-3 w-full">
              {/* Languages */}
              <div className="text-center">
                <div 
                  style={{ backgroundColor: currentTheme.colors.primary[100] }}
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1"
                >
                  <svg 
                    style={{ color: currentTheme.colors.primary[600] }}
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <div 
                  style={{ color: currentTheme.colors.primary[700] }}
                  className="text-sm font-bold"
                >
                  {specialist.languages?.length || 2}
                </div>
                <div 
                  style={{ color: currentTheme.colors.neutral[500] }}
                  className="text-xs"
                >
                  Languages
                </div>
              </div>

              {/* Consultation Fee */}
              <div className="text-center">
                <div 
                  style={{ backgroundColor: currentTheme.colors.success[100] }}
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1"
                >
                  <svg 
                    style={{ color: currentTheme.colors.success[600] }}
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div 
                  style={{ color: currentTheme.colors.success[700] }}
                  className="text-sm font-bold"
                >
                  ${specialist.consultationFee || 200}
                </div>
                <div 
                  style={{ color: currentTheme.colors.neutral[500] }}
                  className="text-xs"
                >
                  Consultation
                </div>
              </div>

              {/* Success Rate */}
              <div className="text-center">
                <div 
                  style={{ backgroundColor: currentTheme.colors.accent[100] }}
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1"
                >
                  <svg 
                    style={{ color: currentTheme.colors.accent[600] }}
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div 
                  style={{ color: currentTheme.colors.accent[700] }}
                  className="text-sm font-bold"
                >
                  98%
                </div>
                <div 
                  style={{ color: currentTheme.colors.neutral[500] }}
                  className="text-xs"
                >
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
