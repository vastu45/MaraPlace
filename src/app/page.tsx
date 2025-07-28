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
                {(session.user as any)?.role === "AGENT" ? (
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  Edit Profile
                </Link>
                ) : (
                  <Link
                    href="/client/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
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
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 relative overflow-hidden w-full">
      {/* Gold border effect */}
      <div className="absolute inset-0 border-2 border-green-400/20 pointer-events-none"></div>
      
      <div className="w-full px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Section - Content */}
          <div className="space-y-8">
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                <span className="text-green-400">ONE STOP SOLUTION</span>
                <br />
                <span className="text-white">For All Immigration Services And Information</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                All Migration Marketplace specialists are either lawyers or OMARA registered migration agents.
              </p>
            </div>

            {/* Search Interface */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center bg-white rounded-xl px-4 py-3">
                    <span className="text-green-600 mr-3 text-lg">🔍</span>
          <input
                      className="outline-none w-full bg-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Search specialists..."
            name="keyword"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>
                  <div className="flex items-center bg-white rounded-xl px-4 py-3">
                    <span className="text-green-600 mr-3 text-lg">🇦🇺</span>
          <input
                      className="outline-none w-full bg-transparent text-gray-900 placeholder-gray-500"
            placeholder="Location"
            name="location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center bg-white rounded-xl px-4 py-3">
                    <span className="text-green-600 mr-3 text-lg">📚</span>
          <select
                      className="outline-none w-full bg-transparent text-gray-900"
            name="area"
            value={filters.area}
            onChange={handleChange}
          >
                      <option value="" className="text-gray-500">Area of Practice</option>
                      <option value="visa" className="text-gray-900">Visa</option>
                      <option value="appeals" className="text-gray-900">Appeals</option>
                      <option value="citizenship" className="text-gray-900">Citizenship</option>
          </select>
        </div>
                  <div className="flex items-center bg-white rounded-xl px-4 py-3">
                    <span className="text-green-600 mr-3 text-lg">🏢</span>
          <select
                      className="outline-none w-full bg-transparent text-gray-900"
            name="industry"
            value={filters.industry}
            onChange={handleChange}
          >
                      <option value="" className="text-gray-500">Select Industry</option>
                      <option value="education" className="text-gray-900">Education</option>
                      <option value="business" className="text-gray-900">Business</option>
                      <option value="family" className="text-gray-900">Family</option>
          </select>
        </div>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl px-8 py-4 flex items-center justify-center font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="mr-2">🔍</span>
                  Search specialists
        </button>
      </form>
            </div>
          </div>

          {/* Right Section - Visual Elements */}
          <div className="relative">
            {/* Background Image */}
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Immigration consultation" 
                className="w-full h-96 lg:h-[500px] object-cover"
              />
              
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
            </div>

            {/* Feature Overlays */}
            <div className="absolute top-4 right-4">
              <div className="bg-gray-900/90 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">📚</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">
                      Browse through our Immigration Resource Library to Resolve Your Visa Issues
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <div className="bg-gray-900/90 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">📄</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">
                      Extensive Legal Document Templates for Agents, Clients and Students
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <div className="bg-gray-900/90 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 max-w-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">👨‍💼</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">
                      Consult Best MARA Agents in Australia and Get Instant Legal Advice via Text Chat and Video Chat
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative wavy line */}
            <div className="absolute bottom-0 left-0 w-24 h-8">
              <svg viewBox="0 0 100 30" className="w-full h-full">
                <path 
                  d="M0 15 Q25 5 50 15 T100 15" 
                  stroke="#22c55e" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
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

function Testimonials() {
  const testimonials = [
    {
      id: 1,
      clientName: "Sarah Chen",
      clientAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=4F46E5&color=fff",
      agentName: "Michael Rodriguez",
      agentAvatar: "https://ui-avatars.com/api/?name=Michael+Rodriguez&background=059669&color=fff",
      conversation: [
        {
          sender: "client",
          message: "Hi Michael, I'm worried about my student visa application. I got a request for more documents and I'm not sure what to do.",
          time: "2:30 PM"
        },
        {
          sender: "agent",
          message: "Hi Sarah! Don't worry, this is very common. Let me help you understand what documents they need and how to respond properly.",
          time: "2:32 PM"
        },
        {
          sender: "client",
          message: "That would be amazing! I'm really stressed about this. Can you review my application too?",
          time: "2:33 PM"
        },
        {
          sender: "agent",
          message: "Absolutely! I'll review everything and make sure your response is perfect. We'll get this sorted together. Book a consultation and I'll help you through every step.",
          time: "2:35 PM"
        }
      ],
      outcome: "Visa approved in 2 weeks! 🎉"
    },
    {
      id: 2,
      clientName: "David Thompson",
      clientAvatar: "https://ui-avatars.com/api/?name=David+Thompson&background=DC2626&color=fff",
      agentName: "Lisa Patel",
      agentAvatar: "https://ui-avatars.com/api/?name=Lisa+Patel&background=7C3AED&color=fff",
      conversation: [
        {
          sender: "client",
          message: "Lisa, my partner visa was refused and I'm devastated. I don't know what went wrong.",
          time: "10:15 AM"
        },
        {
          sender: "agent",
          message: "I'm so sorry to hear that, David. Refusals can be overturned with the right approach. Let me analyze your case and see what we can do.",
          time: "10:17 AM"
        },
        {
          sender: "client",
          message: "Really? You think we can appeal this? I thought it was hopeless.",
          time: "10:18 AM"
        },
        {
          sender: "agent",
          message: "Absolutely! I've helped many clients successfully appeal refusals. The key is understanding why it was refused and addressing those specific concerns. Let's discuss your options.",
          time: "10:20 AM"
        }
      ],
      outcome: "Appeal successful! Partner visa granted ✅"
    },
    {
      id: 3,
      clientName: "Priya Sharma",
      clientAvatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=EA580C&color=fff",
      agentName: "James Wilson",
      agentAvatar: "https://ui-avatars.com/api/?name=James+Wilson&background=0891B2&color=fff",
      conversation: [
        {
          sender: "client",
          message: "Hi James! I want to apply for permanent residency but I'm confused about the points system. Can you help?",
          time: "3:45 PM"
        },
        {
          sender: "agent",
          message: "Hi Priya! The points system can be tricky. I'll assess your qualifications, work experience, and other factors to calculate your points and suggest the best pathway.",
          time: "3:47 PM"
        },
        {
          sender: "client",
          message: "That sounds perfect! I have 5 years of IT experience and a master's degree. Do you think I have enough points?",
          time: "3:48 PM"
        },
        {
          sender: "agent",
          message: "With your background, you likely have strong points! Let's do a detailed assessment and I'll help you maximize your score. Book a consultation and we'll map out your PR pathway.",
          time: "3:50 PM"
        }
      ],
      outcome: "PR application lodged successfully! 🏠"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Real Conversations, Real Results</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how our MARA agents help clients navigate complex visa issues and achieve their immigration goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
              {/* Chat Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img 
                      src={testimonial.clientAvatar} 
                      alt={testimonial.clientName}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                    <img 
                      src={testimonial.agentAvatar} 
                      alt={testimonial.agentName}
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.clientName}</p>
                    <p className="text-sm text-gray-500">with {testimonial.agentName}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-400">Today</div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6">
                {testimonial.conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'client' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] ${message.sender === 'client' ? 'order-1' : 'order-2'}`}>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'client' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-green-600 text-white'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'client' ? 'text-gray-500' : 'text-green-100'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      message.sender === 'client' ? 'order-2 ml-2' : 'order-1 mr-2'
                    }`}>
                      {message.sender === 'client' ? 'C' : 'A'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Outcome */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-semibold text-green-800">{testimonial.outcome}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful clients who have achieved their immigration goals with expert guidance.
            </p>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Link href="/agents">Find Your Immigration Expert</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            The simple way to get expert immigration guidance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's how we make it easy to connect with verified MARA agents—all done securely with professional video consultations.
          </p>
        </div>

        {/* Floating Product Icons */}
        <div className="relative mb-16">
          <div className="flex justify-center items-center gap-8">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💼</span>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎓</span>
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏠</span>
            </div>
          </div>
          {/* Flowing line connecting the icons */}
          <div className="absolute top-1/2 left-1/4 right-1/4 h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-full transform -translate-y-1/2"></div>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-yellow-400 transform -translate-x-1/2"></div>

          {/* Step 1 */}
          <div className="relative mb-16">
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Step 1</span>
                      <h3 className="text-xl font-bold text-gray-900">Search for the right specialist</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Browse through our list of verified MARA migration specialists based on your visa or migration requirements. 
                    Filter by location, specialization, and ratings to find your perfect match.
                  </p>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">✓</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Verified MARA Agents</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">⭐</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Detailed Profiles & Reviews</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📍</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Location & Specialization Filters</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                      <p className="text-sm text-gray-500">MARA Agent</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★★★★★</span>
                        <span className="text-sm text-gray-600">(127)</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Specializations:</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Student Visa</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Partner Visa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Location:</span>
                      <span className="text-sm text-gray-700">Sydney, NSW</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">Consultation Fee:</span>
                      <span className="text-sm font-semibold text-green-600">$150</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative mb-16">
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📅</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Available Time Slots</h4>
                      <p className="text-sm text-gray-500">Choose your preferred time</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-700">Today</div>
                      <div className="text-xs text-gray-500">2:00 PM</div>
                    </div>
                    <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg text-center">
                      <div className="text-sm font-medium text-blue-700">Tomorrow</div>
                      <div className="text-xs text-blue-500">10:00 AM</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg text-center">
                      <div className="text-sm font-medium text-gray-700">Wed</div>
                      <div className="text-xs text-gray-500">3:30 PM</div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">🔒</span>
                      <span className="text-sm text-green-700">Secure payment processing</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">💳</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Step 2</span>
                      <h3 className="text-xl font-bold text-gray-900">Book and pay securely</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Choose your specialist, select a convenient time slot, and make a secure online payment for your 30-minute video consultation. 
                    Everything is encrypted and protected.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Instant booking confirmation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Secure payment gateway</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Email confirmation with details</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative mb-16">
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🎥</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Step 3</span>
                      <h3 className="text-xl font-bold text-gray-900">Get expert guidance</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Connect with your specialist via high-quality video call, ask your questions, and find out your visa and migration options. 
                    Get personalized advice from experienced professionals.
                  </p>
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📹</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">HD Video Call</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">⏱️</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">30-Minute Session</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📝</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Detailed Consultation Notes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">🎥</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Video Consultation</h4>
                    <p className="text-sm text-gray-500">High-quality, secure connection</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Screen sharing available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Document upload support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Recording option (with consent)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="flex items-center">
              <div className="w-1/2 pr-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl text-white">📋</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Full Migration Assistance</h4>
                    <p className="text-sm text-gray-500">Complete visa application support</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Document preparation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Application submission</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-green-600">✓</span>
                      </div>
                      <span className="text-sm text-gray-700">Ongoing support & updates</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 pl-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Step 4</span>
                      <h3 className="text-xl font-bold text-gray-900">Engage specialist for full migration assistance</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    If you're satisfied with your consultation, you can engage the specialist for comprehensive migration assistance. 
                    Get end-to-end support for your entire visa application process.
                  </p>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📄</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Complete Application Support</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">📞</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Dedicated Case Manager</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm">🎯</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Success Rate Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-12 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg">
            <Link href="/agents">Start your migration journey today</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  const blogPosts = [
    {
      id: 1,
      featured: true,
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      categories: ["News", "Inspiration"],
      date: "22 Dec 2023",
      title: "MaraPlace, Transforming Immigration Practice",
      excerpt: "Our commitment to providing value extends beyond the features of our products or services. We believe in fostering long-term partnerships by ensuring that our pricing plans are transparent and competitive. Many legal professionals find it difficult to accurately keep track of all case-related time, which often results in billable time slipping through the tracks and revenue left on the table.",
      author: {
        name: "Cody Fisher",
        avatar: "https://ui-avatars.com/api/?name=Cody+Fisher&background=4F46E5&color=fff"
      }
    },
    {
      id: 2,
      featured: false,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      categories: ["News", "Inspiration"],
      date: "22 Dec 2023",
      title: "MaraPlace: Transforming Immigration Practice",
      excerpt: "Embark on a journey through the innovation that is MaraPlace, redefining how legal professionals approach immigration cases with cutting-edge technology and personalized service.",
      author: {
        name: "Cody Fisher",
        avatar: "https://ui-avatars.com/api/?name=Cody+Fisher&background=4F46E5&color=fff"
      }
    },
    {
      id: 3,
      featured: false,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      categories: ["News", "Inspiration"],
      date: "22 Dec 2023",
      title: "How MaraPlace Addresses Immigration Challenges",
      excerpt: "MaraPlace stands out through its unique combination of features and user-centric design that addresses the specific challenges faced by immigration professionals and their clients.",
      author: {
        name: "Guy Hawkins",
        avatar: "https://ui-avatars.com/api/?name=Guy+Hawkins&background=059669&color=fff"
      }
    },
    {
      id: 4,
      featured: false,
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      categories: ["News", "Inspiration"],
      date: "20 Dec 2023",
      title: "MaraPlace: Transforming Immigration Practice",
      excerpt: "Embark on a journey through the innovation that is MaraPlace, redefining how legal professionals approach immigration cases with cutting-edge technology and personalized service.",
      author: {
        name: "Floyd Miles",
        avatar: "https://ui-avatars.com/api/?name=Floyd+Miles&background=DC2626&color=fff"
      }
    }
  ];

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Recent Post</h2>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors">
            Reports
          </button>
        </div>

        <div className="space-y-12">
          {/* Featured Post */}
          {featuredPost && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Image */}
                <div className="lg:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                  {/* Categories and Date */}
                  <div className="flex items-center gap-3 mb-4">
                    {featuredPost.categories.map((category, index) => (
                      <span 
                        key={index}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          index === 0 
                            ? 'bg-gray-200 text-gray-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {category}
                      </span>
                    ))}
                    <span className="text-gray-500 text-sm ml-auto">{featuredPost.date}</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <div className="text-gray-600 leading-relaxed mb-6">
                    <p className="mb-4">
                      Our commitment to providing value extends beyond the features of our products or services. We believe in fostering long-term partnerships by ensuring that our pricing plans are transparent and competitive.
                    </p>
                    <p>
                      Many legal professionals find it difficult to accurately keep track of all case-related time, which often results in billable time slipping through the tracks and revenue left on the table.
                    </p>
                  </div>
                  
                  {/* Call to Action */}
                  <div className="flex items-center gap-2 text-gray-900 font-medium hover:text-green-600 transition-colors cursor-pointer">
                    <span>Read Article</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Posts */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-8">Other Posts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    {/* Categories */}
                    <div className="flex items-center gap-2 mb-3">
                      {post.categories.map((category, index) => (
                        <span 
                          key={index}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            index === 0 
                              ? 'bg-gray-200 text-gray-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    {/* Title */}
                    <h4 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                      {post.title}
                    </h4>
                    
                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Author and Date */}
                    <div className="flex items-center gap-3">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-xs text-gray-500">Updated on: {post.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  const consultancyFee = agent.consultationFee !== undefined && agent.consultationFee !== null ? `$${agent.consultationFee}` : 'N/A';
  
  return (
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center relative group">
      {/* Featured Badge */}
      <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
        Featured
      </div>
      
      {/* Profile Photo */}
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
        <img src={photoUrl} alt="Profile" className="object-cover w-full h-full" />
        </div>
        {/* Online Status Indicator */}
        <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-lg"></div>
      </div>
      
      {/* Rating */}
      <div className="flex items-center justify-center gap-1 mb-3">
        <div className="flex items-center">
          {Array(5).fill(0).map((_, i) => (
            <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-700 font-semibold ml-2">{rating.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">({reviewCount})</span>
      </div>
      
      {/* Agent Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 text-center leading-tight">{agent.name}</h3>
      
      {/* Business Name */}
      <p className="text-purple-600 font-medium text-sm mb-2 text-center">{agent.businessName}</p>
      
      {/* MARA Number */}
      <p className="text-gray-600 text-sm mb-4 text-center">MARA No: {agent.maraNumber}</p>
      
      {/* Business Logo */}
      <div className="mb-6 p-3 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="w-16 h-16 rounded-xl bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
        <img src={logoUrl} alt="Business Logo" className="object-contain w-full h-full" />
        </div>
      </div>
      
      {/* Consultation Fee */}
      <div className="text-center mb-6">
        <div className="text-2xl font-bold text-green-600 mb-1">{consultancyFee}</div>
        <div className="text-gray-500 text-sm">for 30 min consultation</div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          Book a consultation
        </Button>
        <Button asChild variant="outline" className="w-full border-2 border-gray-200 hover:border-purple-300 text-gray-700 hover:text-purple-700 font-medium py-3 rounded-xl transition-all duration-200">
          <Link href={`/agents/${agent.id}`}>View Profile</Link>
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
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Mara Agents</h2>
        
        {loading && <div className="text-center">Loading agents...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        
        {/* Agents Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
        
        {(!loading && filteredAgents.length === 0) && <div className="text-center">No agents found.</div>}
      </main>
      <Testimonials />
      <HowItWorks />
      <Blog />
      <Footer />
    </div>
  );
} 