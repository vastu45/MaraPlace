"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, UserIcon, MapPinIcon, PhoneIcon, MailIcon, AlertTriangleIcon } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes: string;
  meetingType: string;
  meetingLink: string;
  location: string;
  totalAmount: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  agent: {
    id: string;
    user: {
      name: string;
      email: string;
    };
    businessName: string;
    businessPhone: string;
    businessEmail: string;
  };
  service: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
}

interface ClientBookingDetailsModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdate: () => void;
}

export default function ClientBookingDetailsModal({
  booking,
  isOpen,
  onClose,
  onBookingUpdate,
}: ClientBookingDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState<"reschedule" | "cancel" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  if (!isOpen || !booking) return null;

  const handleAction = async (actionType: "reschedule" | "cancel") => {
    if (actionType === "reschedule") {
      setShowRescheduleForm(true);
      // Pre-fill with current booking date and time
      setRescheduleData({
        date: booking.date.split('T')[0], // Extract date part
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
    } else {
      setAction(actionType);
      setShowConfirm(true);
    }
  };

  const confirmAction = async () => {
    if (!action) return;

    setLoading(true);
    try {
      const url = `/api/bookings/${booking.id}`;
      
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        onBookingUpdate();
        onClose();
        setShowConfirm(false);
        setAction(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // First cancel the current booking
      const cancelRes = await fetch(`/api/bookings/${booking.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!cancelRes.ok) {
        throw new Error("Failed to cancel current booking");
      }

      // Create new booking with new date/time
      const newBookingData = {
        agentId: booking.agent.id, // Use agent ID
        serviceId: booking.service?.id,
        date: rescheduleData.date,
        startTime: rescheduleData.startTime,
        endTime: rescheduleData.endTime,
        duration: booking.duration,
        notes: booking.notes,
        meetingType: booking.meetingType,
        totalAmount: booking.totalAmount,
        name: booking.clientName,
        email: booking.clientEmail,
        phone: booking.clientPhone,
      };

      const createRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBookingData),
      });

      if (createRes.ok) {
        onBookingUpdate();
        onClose();
        setShowRescheduleForm(false);
        alert("Booking rescheduled successfully!");
      } else {
        const data = await createRes.json();
        alert(data.error || "Failed to create new booking");
      }
    } catch (error) {
      console.error("Error rescheduling booking:", error);
      alert("Failed to reschedule booking");
    } finally {
      setLoading(false);
    }
  };

  const cancelReschedule = () => {
    setShowRescheduleForm(false);
    setRescheduleData({ date: "", startTime: "", endTime: "" });
  };

  const cancelAction = () => {
    setShowConfirm(false);
    setAction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'ONLINE':
        return '🌐';
      case 'IN_PERSON':
        return '🏢';
      case 'PHONE':
        return '📞';
      default:
        return '📅';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
            <p className="text-sm text-gray-600">Consultation with {booking.agent.user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!showRescheduleForm ? (
            <>
              {/* Status and Basic Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <span className="text-2xl">{getMeetingTypeIcon(booking.meetingType)}</span>
                  <span className="text-sm text-gray-600 capitalize">{booking.meetingType.toLowerCase().replace('_', ' ')}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${booking.service?.price || booking.totalAmount || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {booking.duration || 60} minutes
                  </p>
                </div>
              </div>

          {/* Date and Time */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CalendarIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Date & Time</span>
            </div>
            <p className="text-gray-700">{formatDate(booking.date)}</p>
            <p className="text-gray-600">
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
          </div>

          {/* Agent Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <UserIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Agent Information</span>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{booking.agent.user.name}</p>
              {booking.agent.businessName && (
                <p className="text-gray-600">{booking.agent.businessName}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MailIcon className="w-4 h-4" />
                <span>{booking.agent.user.email}</span>
              </div>
              {booking.agent.businessPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{booking.agent.businessPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Information */}
          {booking.service && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <ClockIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Service Details</span>
              </div>
              <p className="font-medium text-gray-900">{booking.service.name}</p>
              {booking.service.description && (
                <p className="text-gray-600 text-sm mt-1">{booking.service.description}</p>
              )}
            </div>
          )}

          {/* Meeting Details */}
          {booking.meetingType === 'ONLINE' && booking.meetingLink && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-blue-600">🌐</span>
                <span className="font-medium text-gray-900">Online Meeting</span>
              </div>
              <a
                href={booking.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline break-all"
              >
                {booking.meetingLink}
              </a>
            </div>
          )}

          {booking.meetingType === 'IN_PERSON' && booking.location && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Meeting Location</span>
              </div>
              <p className="text-gray-700">{booking.location}</p>
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-yellow-600">📝</span>
                <span className="font-medium text-gray-900">Notes</span>
              </div>
              <p className="text-gray-700">{booking.notes}</p>
            </div>
          )}

          {/* Client Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <UserIcon className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Your Information</span>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{booking.clientName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MailIcon className="w-4 h-4" />
                <span>{booking.clientEmail}</span>
              </div>
              {booking.clientPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{booking.clientPhone}</span>
                </div>
              )}
            </div>
          </div>
            </>
          ) : (
            /* Reschedule Form Content */
            <>
              <div className="text-center mb-6">
                <CalendarIcon className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Reschedule Booking
                </h3>
                <p className="text-gray-600">
                  Select a new date and time for your consultation with {booking.agent.user.name}.
                </p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleData.startTime}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, startTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleData.endTime}
                      onChange={(e) => setRescheduleData(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Current Booking Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Current Booking</h4>
                  <p className="text-sm text-gray-600">
                    {formatDate(booking.date)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {!showRescheduleForm ? (
            <>
              {booking.status === 'PENDING' || booking.status === 'CONFIRMED' ? (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAction("reschedule")}
                    variant="outline"
                    className="flex-1"
                    disabled={loading}
                  >
                    Reschedule
                  </Button>
                  <Button
                    onClick={() => handleAction("cancel")}
                    variant="destructive"
                    className="flex-1"
                    disabled={loading}
                  >
                    Cancel Booking
                  </Button>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  {booking.status === 'COMPLETED' && "This consultation has been completed."}
                  {booking.status === 'CANCELLED' && "This booking has been cancelled."}
                  {booking.status === 'NO_SHOW' && "This consultation was marked as no-show."}
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-3">
              <Button
                onClick={cancelReschedule}
                variant="outline"
                className="flex-1"
                disabled={loading}
              >
                Back to Details
              </Button>
              <Button
                onClick={handleReschedule}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Processing..." : "Reschedule Booking"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangleIcon className="w-6 h-6 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">
                What would you like to do?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Would you like to cancel this booking or reschedule it for a different time?
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setShowConfirm(false);
                  setAction(null);
                  handleAction("reschedule");
                }}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Reschedule Booking
              </Button>
              <Button
                onClick={confirmAction}
                variant="destructive"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : "Cancel Booking"}
              </Button>
              <Button
                onClick={cancelAction}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Keep Current Booking
              </Button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
} 