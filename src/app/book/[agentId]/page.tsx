"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
        setConfirmation("Your appointment has been scheduled!");
        setShowBookingForm(false);
        setFormData({ name: "", email: "", phone: "", notes: "" });
        setSelectedDate(null);
        setSelectedTime("");
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
      <div className="flex-1 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Agent Info & Service Selection */}
            <div className="lg:col-span-1 space-y-6">
              {/* Agent Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Book with {agent.user.name}</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Business</p>
                    <p className="font-medium">{agent.businessName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 font-medium">{agent.rating || 'No ratings'}</span>
                      <span className="ml-1 text-gray-500">({agent.totalReviews} reviews)</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Specializations</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.specializations.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`
                        p-4 border rounded-lg cursor-pointer transition-all
                        ${selectedService?.id === service.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          <p className="text-sm text-gray-500 mt-1">{service.duration} minutes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">${service.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Type */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Meeting Type</h3>
                <div className="space-y-3">
                  {[
                    { value: "ONLINE", label: "Video Call", icon: "📹" },
                    { value: "IN_PERSON", label: "In Person", icon: "🏢" },
                    { value: "PHONE", label: "Phone Call", icon: "📞" }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="meetingType"
                        value={type.value}
                        checked={meetingType === type.value}
                        onChange={(e) => setMeetingType(e.target.value as any)}
                        className="mr-3"
                      />
                      <span className="mr-2">{type.icon}</span>
                      <span className="font-medium">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Calendar & Booking Form */}
            <div className="lg:col-span-2">
              {!showBookingForm ? (
                <BookingCalendar
                  agentId={agentId}
                  serviceId={selectedService?.id}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  selectedDate={selectedDate || undefined}
                  selectedTime={selectedTime || undefined}
                />
              ) : (
                <form className="bg-white rounded-lg shadow-md p-6 mt-0 max-w-lg mx-auto" onSubmit={handleBooking}>
                  {/* Back to Calendar Button */}
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="mb-4 flex items-center text-green-700 hover:text-green-900 focus:outline-none"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to calendar
                  </button>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Details</h3>
                  {formError && <div className="text-red-500 mb-2">{formError}</div>}
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFormChange}
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button type="submit" className="px-8 py-2 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded" disabled={submitting}>
                      {submitting ? "Scheduling..." : "Schedule Event"}
                    </Button>
                  </div>
                </form>
              )}
              {/* Confirmation Message */}
              {confirmation && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6 text-center">
                  <h3 className="text-xl font-bold text-green-700 mb-2">{confirmation}</h3>
                  <p className="text-green-800">A confirmation email will be sent to you soon.</p>
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