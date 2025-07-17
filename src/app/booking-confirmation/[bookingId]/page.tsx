"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes: string;
  meetingType: string;
  totalAmount: number;
  client: {
    name: string;
    email: string;
  };
  agent: {
    user: {
      name: string;
      email: string;
    };
    businessName: string;
  };
  service: {
    name: string;
    description: string;
  };
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else {
        setError("Booking not found");
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'ONLINE': return 'Video Call';
      case 'IN_PERSON': return 'In Person';
      case 'PHONE': return 'Phone Call';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pending Confirmation';
      case 'CONFIRMED': return 'Confirmed';
      case 'CANCELLED': return 'Cancelled';
      case 'COMPLETED': return 'Completed';
      case 'NO_SHOW': return 'No Show';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'CONFIRMED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      case 'COMPLETED': return 'text-blue-600 bg-blue-100';
      case 'NO_SHOW': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
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

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h1>
            <p className="text-gray-600">{error}</p>
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">{booking.id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">{booking.service.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{booking.duration} minutes</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Meeting Type:</span>
                <span className="font-medium">{getMeetingTypeLabel(booking.meetingType)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-green-600">${booking.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Agent Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Information</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{booking.agent.user.name}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Business:</span>
                <span className="ml-2 font-medium">{booking.agent.businessName}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{booking.agent.user.email}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
            
            <div className="space-y-3">
              <div>
                <span className="text-gray-600">Service:</span>
                <span className="ml-2 font-medium">{booking.service.name}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Description:</span>
                <p className="mt-1 text-gray-700">{booking.service.description}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
              <p className="text-gray-700">{booking.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => window.print()} 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              Print Confirmation
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'} 
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Important Information */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• The agent will review and confirm your booking</li>
              <li>• For online meetings, you'll receive a meeting link before the appointment</li>
              <li>• You can cancel or reschedule up to 24 hours before the appointment</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 