"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, addMinutes } from "date-fns";
import BookingCalendar from "@/components/BookingCalendar";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Agent {
  id: string;
  user: {
    name: string;
    email: string;
  };
  businessName: string;
  bio: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  specializations: string[];
  languages: string[];
  defaultMeetingDuration: number;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const agentId = params.agentId as string;
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingNotes, setBookingNotes] = useState("");
  const [meetingType, setMeetingType] = useState<"ONLINE" | "IN_PERSON" | "PHONE">("ONLINE");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<"selection" | "calendar" | "form">("selection");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchAgentDetails();
  }, [agentId]);

  useEffect(() => {
    if (confirmation) {
      console.log('Confirmation state changed to:', confirmation);
    }
  }, [confirmation]);

  // Autofill form with user data when logged in
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).phone || "",
        notes: "",
      });
    }
  }, [session]);

  const fetchAgentDetails = async () => {
    try {
      const [agentResponse, servicesResponse] = await Promise.all([
        fetch(`/api/agents/${agentId}`),
        fetch(`/api/agents/${agentId}/services`)
      ]);

      if (agentResponse.ok) {
        const agentData = await agentResponse.json();
        setAgent(agentData.agent);
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services);
        if (servicesData.services.length > 0) {
          setSelectedService(servicesData.services[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching agent details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowBookingForm(!!time);
    if (time) {
      setCurrentStep("form");
    }
  };

  const handleContinueToCalendar = () => {
    if (selectedService && meetingType) {
      setCurrentStep("calendar");
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep("selection");
    setSelectedDate(null);
    setSelectedTime("");
    setShowBookingForm(false);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = addMinutes(startDate, duration);
    return format(endDate, 'HH:mm');
  };

  // Helper to add minutes to a time string ("HH:mm")
  function addMinutesToTime(time: string, minutesToAdd: number): string {
    const [hours, minutes] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    date.setMinutes(date.getMinutes() + minutesToAdd);
    return date.toTimeString().slice(0, 5);
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormError("Name, email, and phone are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!session?.user) {
      setFormError("Please log in to book an appointment");
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`);
      return;
    }
    
    if (!selectedDate || !selectedTime) {
      setFormError("Please select a date and time");
      return;
    }
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          agentId,
          serviceId: selectedService ? selectedService.id : null,
          date: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedTime,
          endTime: selectedService
            ? calculateEndTime(selectedTime, selectedService.duration)
            : addMinutesToTime(selectedTime, agent?.defaultMeetingDuration || 30), // fallback: endTime = startTime if no service
          duration: selectedService ? selectedService.duration : null,
          notes: formData.notes,
          meetingType,
          totalAmount: selectedService ? selectedService.price : null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      if (response.ok) {
        console.log('Booking successful! Setting confirmation message...');
        setConfirmation("Your appointment has been scheduled!");
        setShowBookingForm(false);
        setFormData({ name: "", email: "", phone: "", notes: "" });
        setSelectedDate(null);
        setSelectedTime("");
        console.log('Confirmation message set:', "Your appointment has been scheduled!");
      } else {
        const error = await response.json();
        setFormError(error.error || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setFormError('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Agent not found</h1>
            <p className="text-gray-600">The agent you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            {/* Left Column - Agent Info Only */}
            <div className="lg:col-span-1">
              {/* Agent Information */}
              <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 h-full">
                <div className="text-center mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <span className="text-white font-bold text-4xl">
                      {agent.user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Book with {agent.user.name}</h2>
                  <p className="text-green-600 font-semibold text-lg">{agent.businessName}</p>
                  </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-2xl ${i < (agent.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                    <span className="ml-3 text-base text-gray-600 font-medium">({agent.totalReviews} reviews)</span>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Specializations</h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {agent.specializations.map((spec, index) => (
                        <span key={index} className="px-4 py-2 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200 shadow-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">Languages</h4>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {agent.languages.map((lang, index) => (
                        <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200 shadow-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Dynamic Content Based on Step */}
            <div className="lg:col-span-2 h-full">
              {/* Step 1: Service and Meeting Type Selection */}
              {currentStep === "selection" && (
                <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 h-full">
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">Select Service & Meeting Type</h2>
                        <p className="text-gray-600 text-lg mt-2">Choose your preferred service and how you'd like to meet with {agent.user.name}.</p>
                  </div>
                </div>
              </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Service Selection */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Select Service</h3>
                      </div>
                      <div className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`
                              p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 hover:shadow-lg
                        ${selectedService?.id === service.id 
                                ? 'border-green-500 bg-green-50 shadow-lg' 
                                : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{service.name}</h4>
                                <div className="flex items-center text-base text-gray-500 mt-2">
                                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {service.duration} min
                                </div>
                        </div>
                              <div className="text-right ml-6">
                                <p className="text-2xl font-bold text-green-600">${service.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Type */}
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Meeting Type</h3>
                      </div>
                      <div className="space-y-4">
                        {[
                          { value: "ONLINE", label: "Video Call", icon: "📹", color: "blue" },
                          { value: "IN_PERSON", label: "In Person", icon: "🏢", color: "green" },
                          { value: "PHONE", label: "Phone Call", icon: "📞", color: "purple" }
                  ].map((type) => (
                          <label key={type.value} className={`
                            flex items-center p-6 rounded-xl cursor-pointer transition-all duration-200 border-2 hover:shadow-lg
                            ${meetingType === type.value 
                              ? 'border-blue-500 bg-blue-50 shadow-lg' 
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                            }
                          `}>
                      <input
                        type="radio"
                        name="meetingType"
                        value={type.value}
                        checked={meetingType === type.value}
                        onChange={(e) => setMeetingType(e.target.value as any)}
                              className="mr-4 w-5 h-5 text-blue-600"
                      />
                            <span className="text-2xl mr-4">{type.icon}</span>
                            <span className="font-bold text-gray-900 text-lg">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

                  {/* Continue Button */}
                  <div className="mt-10 flex justify-end">
                    <Button
                      onClick={handleContinueToCalendar}
                      disabled={!selectedService || !meetingType}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Calendar
                      <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}
              {/* Step 2: Calendar Selection (only shown when user is logged in and on calendar step) */}
              {currentStep === "calendar" && (
                <>
              {!session?.user ? (
                    <div className="bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100 h-full">
                      <div className="mb-8">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Login Required</h3>
                        <p className="text-gray-600 mb-8 text-xl">Please log in to book an appointment with this agent.</p>
                    <Button 
                      onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(window.location.href)}`)}
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200"
                    >
                      Log In to Book
                    </Button>
                  </div>
                </div>
                  ) : (
                    <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 h-full">
                      {/* Back Button */}
                      <button
                        onClick={handleBackToSelection}
                        className="mb-8 flex items-center text-green-600 hover:text-green-700 focus:outline-none font-semibold text-lg"
                      >
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to selection
                      </button>
                      
                      <div className="flex items-center mb-8">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">2</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900">Select Date & Time</h2>
                          <p className="text-gray-600 text-lg mt-2">Choose when you'd like to meet with {agent.user.name}.</p>
                        </div>
                      </div>
                      
                      {/* Selected Service Summary */}
                      {selectedService && (
                        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl shadow-sm">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-green-800 text-lg">{selectedService.name}</h4>
                              <p className="text-base text-green-600 mt-1">
                                {meetingType === "ONLINE" ? "📹 Video Call" : 
                                 meetingType === "IN_PERSON" ? "🏢 In Person" : "📞 Phone Call"}
                                {" • "}{selectedService.duration} min
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-green-600">${selectedService.price}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                <BookingCalendar
                  agentId={agentId}
                  serviceId={selectedService?.id}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedDate={selectedDate || undefined}
                  selectedTime={selectedTime || undefined}
                />
                    </div>
                  )}
                </>
              )}
              
              {/* Step 3: Booking Form (shown when user selects a time slot) */}
              {currentStep === "form" && (
                <form className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100 h-full max-w-2xl mx-auto" onSubmit={handleBooking}>
                  {/* Back to Calendar Button */}
                  <button
                    type="button"
                    onClick={() => setCurrentStep("calendar")}
                    className="mb-8 flex items-center text-green-600 hover:text-green-700 focus:outline-none font-semibold text-lg"
                  >
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to calendar
                  </button>
                  
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Enter Your Details</h2>
                      <p className="text-gray-600 text-lg mt-2">Complete your booking information.</p>
                    </div>
                  </div>
                  
                  {session?.user && (
                    <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-green-800 font-semibold">Form pre-filled with your account information</p>
                          <p className="text-green-700 text-sm mt-1">You can edit any fields if needed</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formError && (
                    <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-lg">
                      {formError}
                    </div>
                  )}
                  
                  <div className="space-y-8">
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Full Name *
                        {session?.user && formData.name && (
                          <span className="ml-2 text-sm font-normal text-green-600">(from your account)</span>
                        )}
                      </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                        className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg ${
                          session?.user && formData.name 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      required
                    />
                  </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Email Address *
                        {session?.user && formData.email && (
                          <span className="ml-2 text-sm font-normal text-green-600">(from your account)</span>
                        )}
                      </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                        className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg ${
                          session?.user && formData.email 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your email address"
                      required
                    />
                  </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">
                        Phone Number *
                        {session?.user && formData.phone && (
                          <span className="ml-2 text-sm font-normal text-green-600">(from your account)</span>
                        )}
                      </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                        className={`w-full px-6 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg ${
                          session?.user && formData.phone 
                            ? 'border-green-300 bg-green-50' 
                            : 'border-gray-300'
                        }`}
                        placeholder="Enter your phone number"
                      required
                    />
                  </div>
                    
                    <div>
                      <label className="block text-lg font-bold text-gray-700 mb-3">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                        className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-lg"
                        rows={4}
                        placeholder="Any additional information you'd like to share..."
                    />
                  </div>
                  </div>
                  
                  <div className="flex justify-end mt-10">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-12 py-5 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-200" 
                      disabled={submitting}
                    >
                      {submitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Scheduling...
                        </div>
                      ) : (
                        "Schedule Consultation"
                      )}
                    </Button>
                  </div>
                </form>
              )}
              {/* Confirmation Message */}
              {confirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-green-700 mb-4">{confirmation}</h3>
                    <p className="text-gray-600 text-lg mb-8">Your consultation has been successfully scheduled!</p>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500">A confirmation email will be sent to you soon.</p>
                      <p className="text-sm text-gray-500">You can view your bookings in your dashboard.</p>
                    </div>
                    <div className="mt-8 space-y-3">
                      <Button 
                        onClick={() => {
                          setConfirmation(null);
                          setCurrentStep("selection");
                          setSelectedDate(null);
                          setSelectedTime("");
                          setFormData({ name: "", email: "", phone: "", notes: "" });
                        }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Book Another Consultation
                      </Button>
                      <Button 
                        onClick={() => router.push('/client/dashboard')}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 