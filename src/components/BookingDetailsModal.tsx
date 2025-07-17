"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Clock, User, Mail, Phone, MapPin, Calendar, FileText, Edit, Filter, RefreshCw, Trash2, AlertTriangle } from "lucide-react";

interface BookingDetails {
  id: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes?: string;
  meetingType: string;
  totalAmount?: number;
  serviceName?: string;
  location?: string;
  createdAt: string;
  client?: {
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
}

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export default function BookingDetailsModal({ isOpen, onClose, bookingId }: BookingDetailsModalProps) {
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && bookingId) {
      fetchBookingDetails();
    }
  }, [isOpen, bookingId]);

  const fetchBookingDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        const data = await response.json();
        setBooking(data.booking);
      } else {
        setError("Failed to load booking details");
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    switch (type) {
      case 'ONLINE': return 'Online Meeting';
      case 'IN_PERSON': return 'In Person';
      case 'PHONE': return 'Phone Call';
      default: return type;
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

  const handleDeleteBooking = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setShowDeleteConfirm(false);
        onClose();
        // Optionally refresh the consultations list
        window.location.reload();
      } else {
        setError("Failed to delete booking");
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError("Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  };

  const handleReschedule = () => {
    // TODO: Implement reschedule functionality
    alert("Reschedule functionality will be implemented soon!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {booking ? (booking.clientName || booking.client?.name || "Unknown Client") : "Loading..."}
              </h2>
              <p className="text-sm text-gray-600">
                Event type <span className="font-semibold">{booking?.duration || 30} Minute Meeting</span>
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">1 host | 0 non-hosts</span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : booking ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-4">
                {/* Time */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.startTime} – {booking.endTime}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button 
                    onClick={handleReschedule}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-blue-600">Reschedule</span>
                  </button>
                  
                  <div className="space-y-1">
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                      <span className="text-sm">Edit Event Type</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Filter className="w-4 h-4" />
                      <span className="text-sm">Filter by Event Type</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-sm">Schedule Invitee Again</span>
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="text-sm">Delete Booking</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">EMAIL</p>
                        <p className="text-sm text-gray-600">{booking.clientEmail || booking.client?.email || 'Not provided'}</p>
                      </div>
                    </div>

                    {booking.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">LOCATION</p>
                          <p className="text-sm text-gray-600">{booking.location}</p>
                        </div>
                      </div>
                    )}

                    {booking.clientPhone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">PHONE</p>
                          <p className="text-sm text-gray-600">{booking.clientPhone}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">INVITEE TIME ZONE</p>
                        <p className="text-sm text-gray-600">Sydney, Melbourne Time</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions/Notes */}
                {booking.notes && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">QUESTIONS</p>
                        <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Meeting Host */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Meeting Host</h3>
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Host will attend this meeting</p>
                      <p className="text-sm text-gray-500">{booking.agent.user.name} ({booking.agent.businessName})</p>
                    </div>
                  </div>
                </div>

                {/* Meeting Notes */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Add meeting notes
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">(only the host will see these)</p>
                </div>

                {/* Creation Date */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">
                    Created {format(new Date(booking.createdAt), 'd MMMM yyyy')}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Booking</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the booking for{" "}
              <span className="font-semibold">
                {booking?.clientName || booking?.client?.name || "this client"}?
              </span>
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBooking}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 