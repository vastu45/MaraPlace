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
  
  // Debug: Log the specialist data to see what image is being passed
  console.log('SpecialistCard Debug:', {
    name: specialist.name,
    image: specialist.image,
    hasImage: !!specialist.image,
    imageType: typeof specialist.image
  });

  return (
    <Link href={`/agents/${specialist.id}`}>
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-1 h-auto min-h-[650px] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600">Featured Specialist</span>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">{specialist.logo}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Profile Section */}
          <div className="text-center mb-6">
            {/* Large Avatar */}
            <div className="relative inline-block mb-6">
              {specialist.image && specialist.image !== '/api/placeholder/100/100' ? (
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg mx-auto">
                  <img 
                    src={specialist.image} 
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto hidden">
                    <span className="text-white font-bold text-5xl">
                      {specialist.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg mx-auto">
                  <span className="text-white font-bold text-5xl">
                    {specialist.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              {/* Verification Badge */}
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-purple-600 rounded-full border-3 border-white flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Name and Company */}
            <h3 className="text-lg font-bold text-gray-900 mb-1">{specialist.name}</h3>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-3">
              {specialist.company}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(typeof specialist.rating === 'number' ? specialist.rating : 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {(typeof specialist.rating === 'number' ? specialist.rating : 0).toFixed(1)} ({specialist.totalReviews || 0})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {specialist.bio || `Experienced migration specialist with expertise in ${(specialist.specializations || []).slice(0, 2).join(' and ')}.`}
            </p>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Location */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-semibold text-gray-900">{specialist.city}</p>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm font-semibold text-gray-900">{specialist.experience || 5}+ years</p>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Specializations</h4>
            <div className="flex flex-wrap gap-2">
              {(specialist.specializations || []).slice(0, 2).map((spec, index) => (
                <span 
                  key={index}
                  className="bg-green-100 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {spec}
                </span>
              ))}
              {(specialist.specializations || []).length > 2 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium">
                  +{(specialist.specializations || []).length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* MARN Number */}
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-semibold text-gray-900">{specialist.registration}</span>
            </div>
          </div>

          {/* Book Consultation Button */}
          <div className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold text-center transition-all duration-200 mb-4">
            Book Consultation
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {/* Languages */}
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div className="text-sm font-bold text-gray-900">{specialist.languages?.length || 2}</div>
              <div className="text-xs text-gray-500">Languages</div>
            </div>

            {/* Consultation Price */}
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-sm font-bold text-gray-900">${specialist.consultationFee || 200}</div>
              <div className="text-xs text-gray-500">Consultation</div>
            </div>

            {/* Success Rate */}
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-sm font-bold text-gray-900">98%</div>
              <div className="text-xs text-gray-500">Success</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
