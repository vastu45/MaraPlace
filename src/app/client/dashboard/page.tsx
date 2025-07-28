"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarIcon, UserIcon, SettingsIcon, ClockIcon, MapPinIcon, PhoneIcon, MailIcon, SearchIcon, FileTextIcon, CreditCardIcon, MessageSquareIcon, UsersIcon } from "lucide-react";
import ClientBookingDetailsModal from "@/components/ClientBookingDetailsModal";

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

interface ClientProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ClientDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState('overview');
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ClientProfile>({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
    city: "",
    state: "",
    postcode: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (formSuccess) {
      const timer = setTimeout(() => {
        setFormSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formSuccess]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
      return;
    }

    if ((session.user as any)?.role === "AGENT") {
      router.push("/agents/dashboard");
      return;
    }

    fetchBookings();
    fetchProfile();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/client/profile");
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched profile data:", data);
        console.log("Date of birth value:", data.profile?.dateOfBirth);
        setProfile(data.profile || {});
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    // Validate password change if attempting to change password
    if (profile.newPassword || profile.confirmPassword || profile.currentPassword) {
      if (!profile.currentPassword) {
        setFormError("Current password is required to change password");
        return;
      }
      if (!profile.newPassword) {
        setFormError("New password is required");
        return;
      }
      if (profile.newPassword !== profile.confirmPassword) {
        setFormError("New passwords do not match");
        return;
      }
      if (profile.newPassword.length < 6) {
        setFormError("New password must be at least 6 characters long");
        return;
      }
    }

    try {
      const res = await fetch("/api/client/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setFormSuccess("Profile updated successfully!");
        // Clear password fields after successful update
        setProfile(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to update profile");
      }
    } catch (error) {
      setFormError("Failed to update profile");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleBookingUpdate = () => {
    fetchBookings();
  };

  const upcomingBookings = bookings.filter(b => 
    new Date(b.date) >= new Date() && b.status === "CONFIRMED"
  ).slice(0, 3);

  const recentBookings = bookings.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600">Welcome back, {session?.user?.name || "Client"}!</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveMainTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'overview' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Overview</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'bookings' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ClockIcon className="w-5 h-5" />
                  <span className="font-medium">My Bookings</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'settings' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('agents')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'agents' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UsersIcon className="w-5 h-5" />
                  <span className="font-medium">Find Agents</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('cases')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'cases' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileTextIcon className="w-5 h-5" />
                  <span className="font-medium">Case Tracking</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('payments')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'payments' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCardIcon className="w-5 h-5" />
                  <span className="font-medium">Payments</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('resources')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'resources' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileTextIcon className="w-5 h-5" />
                  <span className="font-medium">Resources</span>
                </button>
                
                <button
                  onClick={() => setActiveMainTab('messages')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeMainTab === 'messages' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquareIcon className="w-5 h-5" />
                  <span className="font-medium">Messages</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeMainTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <CalendarIcon className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{bookings.length}</div>
                      <p className="text-xs text-gray-600">All time</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{upcomingBookings.length}</div>
                      <p className="text-xs text-gray-600">Next 30 days</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
                      <UserIcon className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {bookings.filter(b => b.status === "COMPLETED").length}
                      </div>
                      <p className="text-xs text-gray-600">All time</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingBookings.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No upcoming consultations</p>
                        <Button className="mt-4" onClick={() => router.push('/')}>
                          Book a Consultation
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => (
                          <div 
                            key={booking.id} 
                            className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => handleBookingClick(booking)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CalendarIcon className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{booking.agent.user.name}</h4>
                                <p className="text-sm text-gray-600">
                                  {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                                </p>
                                <p className="text-sm text-gray-500">{booking.service?.name || 'Consultation'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${booking.service?.price || booking.totalAmount || 'N/A'}</p>
                              <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMainTab === 'bookings' && (
              <Card>
                <CardHeader>
                  <CardTitle>My Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No bookings yet</p>
                      <Button className="mt-4" onClick={() => router.push('/')}>
                        Book Your First Consultation
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div 
                          key={booking.id} 
                          className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => handleBookingClick(booking)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{booking.agent.user.name}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(booking.date).toLocaleDateString()} at {booking.startTime}
                              </p>
                              <p className="text-sm text-gray-500">{booking.service?.name || 'Consultation'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${booking.service?.price || booking.totalAmount || 'N/A'}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeMainTab === 'settings' && (
              <div className="space-y-6">
                {/* Settings Tabs */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="flex space-x-8">
                      <button
                        onClick={() => setActiveSubTab('account')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeSubTab === 'account'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Account Settings
                      </button>
                      <button
                        onClick={() => setActiveSubTab('profile')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                          activeSubTab === 'profile'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Profile Information
                      </button>
                    </nav>
                  </div>

                  {activeSubTab === 'account' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={profile.name}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date of Birth
                            </label>
                            <input
                              type="date"
                              name="dateOfBirth"
                              value={profile.dateOfBirth}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Password Change Section */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Current Password
                              </label>
                              <input
                                type="password"
                                name="currentPassword"
                                value={profile.currentPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter current password"
                              />
                            </div>
                            <div></div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="newPassword"
                                value={profile.newPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter new password"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                name="confirmPassword"
                                value={profile.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Confirm new password"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {formError}
                          </div>
                        </div>
                      )}

                      {formSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {formSuccess}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button onClick={handleProfileSubmit} className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nationality
                            </label>
                            <input
                              type="text"
                              name="nationality"
                              value={profile.nationality}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <input
                              type="text"
                              name="country"
                              value={profile.country}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={profile.address}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={profile.city}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State/Province
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={profile.state}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <input
                              type="text"
                              name="postcode"
                              value={profile.postcode}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {formError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {formError}
                          </div>
                        </div>
                      )}

                      {formSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {formSuccess}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button onClick={handleProfileSubmit} className="bg-green-600 hover:bg-green-700">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeMainTab === 'agents' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Immigration Agents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search agents by name, specialization, or location..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Sample Agent Cards */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
                            <p className="text-sm text-gray-600">Immigration Lawyer</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Specializations:</strong> Skilled Migration, Family Visas
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Languages:</strong> English, Spanish
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Experience:</strong> 8 years
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">4.8 (24 reviews)</span>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Profile
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Michael Chen</h3>
                            <p className="text-sm text-gray-600">Registered Migration Agent</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Specializations:</strong> Business Visas, Student Visas
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Languages:</strong> English, Mandarin
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Experience:</strong> 12 years
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">4.9 (31 reviews)</span>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Profile
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">Emma Rodriguez</h3>
                            <p className="text-sm text-gray-600">Immigration Consultant</p>
                          </div>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-600">
                            <strong>Specializations:</strong> Partner Visas, Humanitarian Visas
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Languages:</strong> English, Portuguese
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Experience:</strong> 6 years
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">4.7 (18 reviews)</span>
                          </div>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMainTab === 'cases' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Active Cases */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Active Cases</h3>
                        <div className="space-y-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">Skilled Independent Visa (Subclass 189)</h4>
                                <p className="text-sm text-gray-600">Case ID: CS-2024-001</p>
                              </div>
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                In Progress
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Agent</p>
                                <p className="font-medium">Sarah Johnson</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Started</p>
                                <p className="font-medium">Jan 15, 2024</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Estimated Completion</p>
                                <p className="font-medium">Mar 15, 2024</p>
                              </div>
                            </div>
                            <div className="bg-gray-100 rounded-full h-2 mb-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">65% Complete - Documents under review</p>
                          </div>

                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">Partner Visa (Subclass 820)</h4>
                                <p className="text-sm text-gray-600">Case ID: CS-2024-002</p>
                              </div>
                              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                Pending Documents
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Agent</p>
                                <p className="font-medium">Emma Rodriguez</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Started</p>
                                <p className="font-medium">Feb 1, 2024</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Estimated Completion</p>
                                <p className="font-medium">May 1, 2024</p>
                              </div>
                            </div>
                            <div className="bg-gray-100 rounded-full h-2 mb-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                            </div>
                            <p className="text-sm text-gray-600">30% Complete - Awaiting additional documents</p>
                          </div>
                        </div>
                      </div>

                      {/* Completed Cases */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Completed Cases</h3>
                        <div className="space-y-4">
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="font-semibold text-gray-900">Student Visa (Subclass 500)</h4>
                                <p className="text-sm text-gray-600">Case ID: CS-2023-015</p>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                Approved
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Agent</p>
                                <p className="font-medium">Michael Chen</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Completed</p>
                                <p className="font-medium">Dec 20, 2023</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Duration</p>
                                <p className="font-medium">3 months</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMainTab === 'payments' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Payment Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <CreditCardIcon className="w-8 h-8 text-green-600" />
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="text-2xl font-bold text-green-600">$2,450</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <ClockIcon className="w-8 h-8 text-blue-600" />
                            <div>
                              <p className="text-sm text-gray-600">Pending</p>
                              <p className="text-2xl font-bold text-blue-600">$800</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="w-8 h-8 text-purple-600" />
                            <div>
                              <p className="text-sm text-gray-600">This Month</p>
                              <p className="text-2xl font-bold text-purple-600">$650</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment History Table */}
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h3 className="text-lg font-medium text-gray-900">Recent Payments</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Agent
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Mar 15, 2024
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Skilled Migration Consultation
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Sarah Johnson
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  $450
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Paid
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Mar 10, 2024
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Partner Visa Application
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Emma Rodriguez
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  $800
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                    Pending
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Feb 28, 2024
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Student Visa Consultation
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  Michael Chen
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  $200
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Paid
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMainTab === 'resources' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Immigration Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Resource Categories */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Visa Guides</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Comprehensive guides for different visa types including requirements, documents, and application processes.
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            View Guides
                          </Button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-green-600" />
                            <h3 className="font-semibold text-gray-900">Document Templates</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Ready-to-use templates for common immigration documents and forms.
                          </p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Download Templates
                          </Button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">Checklists</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Step-by-step checklists to ensure you have everything ready for your application.
                          </p>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            View Checklists
                          </Button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-orange-600" />
                            <h3 className="font-semibold text-gray-900">FAQs</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Frequently asked questions about immigration processes and requirements.
                          </p>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            Read FAQs
                          </Button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-red-600" />
                            <h3 className="font-semibold text-gray-900">Legal Updates</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Latest updates on immigration laws, policies, and procedural changes.
                          </p>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Read Updates
                          </Button>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <FileTextIcon className="w-8 h-8 text-indigo-600" />
                            <h3 className="font-semibold text-gray-900">Success Stories</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Real stories from clients who successfully obtained their visas.
                          </p>
                          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                            Read Stories
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeMainTab === 'messages' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Message List */}
                      <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                                <p className="text-sm text-gray-600">Immigration Lawyer</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">2 hours ago</p>
                              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">
                            Hi! I've reviewed your documents for the Skilled Migration application. Everything looks good, but we need a few additional documents...
                          </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                                <p className="text-sm text-gray-600">Registered Migration Agent</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">1 day ago</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">
                            Your Student Visa application has been submitted successfully. You should receive a confirmation email within 24 hours...
                          </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Emma Rodriguez</h4>
                                <p className="text-sm text-gray-600">Immigration Consultant</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">3 days ago</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">
                            Great news! Your Partner Visa application has been approved. I'll send you the detailed instructions for the next steps...
                          </p>
                        </div>
                      </div>

                      {/* Compose Message */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Send a Message</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              To
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                              <option>Select an agent...</option>
                              <option>Sarah Johnson - Immigration Lawyer</option>
                              <option>Michael Chen - Registered Migration Agent</option>
                              <option>Emma Rodriguez - Immigration Consultant</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Subject
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Enter subject..."
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message
                            </label>
                            <textarea
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="Type your message..."
                            ></textarea>
                          </div>
                          <div className="flex justify-end">
                            <Button className="bg-green-600 hover:bg-green-700">
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Booking Details Modal */}
      <ClientBookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onBookingUpdate={handleBookingUpdate}
      />
    </div>
  );
} 