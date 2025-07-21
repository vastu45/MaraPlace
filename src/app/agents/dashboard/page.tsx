"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

import { BellIcon, DocumentIcon, QuestionMarkCircleIcon, CalendarIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon, CreditCardIcon, ClipboardDocumentListIcon, HomeIcon, FolderIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import ModernCalendarLayout from "../calendar/ModernCalendarLayout";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import { ToastContainer } from "@/components/Toast";

const sidebarLinks = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, tab: "dashboard" },
  { label: "Consultations", icon: <ClipboardDocumentListIcon className="w-5 h-5" />, tab: "consultations" },
  { label: "Agreements", icon: <DocumentIcon className="w-5 h-5" />, tab: "agreements" },
  { label: "Clients", icon: <UsersIcon className="w-5 h-5" />, tab: "clients" },
  { label: "Calendar", icon: <CalendarIcon className="w-5 h-5" />, tab: "calendar" },
  { label: "Financials", icon: <CreditCardIcon className="w-5 h-5" />, tab: "financials" },
  { label: "Manage", icon: <ChartBarIcon className="w-5 h-5" />, tab: "manage" },
  { label: "Settings", icon: <FolderIcon className="w-5 h-5" />, submenu: [
    { label: "Edit Profile", icon: <PencilSquareIcon className="w-4 h-4 text-green-600" />, href: "/agents/settings" },
  ] },
];

const secondaryLinks = [
  { label: "Notification", icon: <BellIcon className="w-5 h-5" />, badge: 5 },
  { label: "Documents", icon: <DocumentIcon className="w-5 h-5" /> },
  { label: "Help", icon: <QuestionMarkCircleIcon className="w-5 h-5" /> },
];

export default function AgentDashboard() {
  // Enhanced stats with more detailed information - will be defined after consultations state



  const initialProfile = {
    fullName: "",
    marnOrLpn: "",
    mobile: "",
    email: "",
    profilePicture: "",
    businessLogo: "",
    abn: "",
    businessName: "",
    businessEmail: "",
    languages: "",
    areasOfPractice: "",
    industries: "",
    officeAddress: "",
    aboutCompany: "",
    stripeOnboarding: false,
    calendarConnected: false,
    consultancyFee: "",
    consultancyAgreement: false,
  };

  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [logoPreview, setLogoPreview] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  // Add state for consultancy settings
  const [availability, setAvailability] = useState([
    { day: "Mon", start: "09:00", end: "17:00", unavailable: false },
    { day: "Tue", start: "09:00", end: "17:00", unavailable: false },
    { day: "Wed", start: "09:00", end: "17:00", unavailable: false },
    { day: "Thu", start: "09:00", end: "17:00", unavailable: false },
    { day: "Fri", start: "09:00", end: "17:00", unavailable: false },
    { day: "Sat", start: "09:00", end: "17:00", unavailable: true },
    { day: "Sun", start: "09:00", end: "17:00", unavailable: true },
  ]);
  const [agreementUploaded, setAgreementUploaded] = useState(false);
  // Add state for tab navigation
  const [activeTab, setActiveTab] = useState<'account' | 'consultancy' | 'notification'>('account');
  // Add state for consultations tab
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'consultations' | 'settings' | 'calendar'>('dashboard');
  // Add state for consultations filter
  const [consultationFilter, setConsultationFilter] = useState<'upcoming' | 'past' | 'dateRange'>('upcoming');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [consultationFilter, dateRange]);

  // Type for consultations
  type Consultation = {
    id: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    date: string;
    startTime: string;
    endTime: string;
    schedule: string;
    fee: string;
    status: string;
    outcome: string;
    serviceName?: string;
    meetingType: string;
    notes?: string;
    duration: number;
    seenByAgent: boolean;
  };
  
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [consultationsLoading, setConsultationsLoading] = useState(false);
  
  // Traditional KPI stats matching the image design
  const stats = [
    { label: "Revenue (lifetime)", value: "$0.00", color: "text-green-700" },
    { label: "Total consultations", value: consultations.length, color: "text-blue-600" },
    { label: "Total cases", value: 0, color: "text-purple-600" },
    { label: "Total clients", value: 0, color: "text-green-600" },
    { label: "New ratings", value: 0, color: "text-pink-600" },
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const consultationsPerPage = 5;

  // Fetch consultations data
  const fetchConsultations = async () => {
    setConsultationsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        const formattedConsultations: Consultation[] = data.bookings.map((booking: any) => ({
          id: booking.id,
          clientName: booking.clientName || booking.client.name || 'Unknown Client',
          clientEmail: booking.clientEmail || booking.client.email || '',
          clientPhone: booking.clientPhone || booking.client.phone || '',
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          schedule: `${new Date(booking.date).toLocaleDateString()} ${booking.startTime}`,
          fee: booking.totalAmount ? `$${parseFloat(booking.totalAmount).toFixed(2)}` : 'Free',
          status: booking.status,
          outcome: booking.status === 'COMPLETED' ? 'Completed' : 
                   booking.status === 'CANCELLED' ? 'Cancelled' : 
                   booking.status === 'NO_SHOW' ? 'No Show' : '-',
          serviceName: booking.service?.name || 'General Consultation',
          meetingType: booking.meetingType,
          notes: booking.notes || '',
          duration: booking.duration || 30,
          seenByAgent: booking.seenByAgent || false,
        }));
        setConsultations(formattedConsultations);
        // Calculate unread bookings (PENDING status bookings that haven't been seen)
        const unreadCount = formattedConsultations.filter(
          consultation => consultation.status === 'PENDING' && !consultation.seenByAgent
        ).length;
        setUnreadBookingsCount(unreadCount);
      } else {
        console.error('Failed to fetch consultations');
        setConsultations([]);
      }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      setConsultations([]);
    } finally {
      setConsultationsLoading(false);
    }
  };

  // Filter consultations based on selected tab
  const filteredConsultations = consultations.filter(row => {
    const bookingDate = new Date(row.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (consultationFilter === 'upcoming') {
      return (row.status === 'PENDING' || row.status === 'CONFIRMED') && bookingDate >= today;
    }
    if (consultationFilter === 'past') {
      return bookingDate < today || row.status === 'COMPLETED' || row.status === 'CANCELLED' || row.status === 'NO_SHOW';
    }
    if (consultationFilter === 'dateRange') {
      if (!dateRange.start || !dateRange.end) return true;
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return bookingDate >= startDate && bookingDate <= endDate;
    }
    return true;
  });

  // Group consultations by date
  const groupedConsultations = filteredConsultations.reduce((groups, consultation) => {
    const date = new Date(consultation.date).toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(consultation);
    return groups;
  }, {} as Record<string, Consultation[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedConsultations).sort((a, b) => {
    const dateA = new Date(groupedConsultations[a][0].date);
    const dateB = new Date(groupedConsultations[b][0].date);
    return consultationFilter === 'upcoming' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  // Pagination logic
  const totalConsultations = sortedDates.reduce((total, date) => total + groupedConsultations[date].length, 0);
  const totalPages = Math.ceil(totalConsultations / consultationsPerPage);
  
  // Get consultations for current page
  const getConsultationsForPage = () => {
    const allConsultations: Array<{ date: string; consultation: Consultation }> = [];
    
    sortedDates.forEach(date => {
      groupedConsultations[date].forEach(consultation => {
        allConsultations.push({ date, consultation });
      });
    });
    
    // Debug: Log before sorting
    console.log('Before sorting - First 3 consultations:', allConsultations.slice(0, 3).map(c => ({
      client: c.consultation.clientName,
      seen: c.consultation.seenByAgent,
      status: c.consultation.status,
      date: c.consultation.date,
      time: c.consultation.startTime
    })));
    
    // Sort consultations: new/unseen first, then by date and time
    allConsultations.sort((a, b) => {
      // First priority: unseen bookings come first
      if (!a.consultation.seenByAgent && b.consultation.seenByAgent) {
        console.log(`${a.consultation.clientName} (unseen) comes before ${b.consultation.clientName} (seen)`);
        return -1;
      }
      if (a.consultation.seenByAgent && !b.consultation.seenByAgent) {
        console.log(`${a.consultation.clientName} (seen) comes after ${b.consultation.clientName} (unseen)`);
        return 1;
      }
      
      // Second priority: date (earliest first for upcoming, latest first for past)
      const dateA = new Date(a.consultation.date);
      const dateB = new Date(b.consultation.date);
      if (consultationFilter === 'upcoming') {
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
      } else {
        if (dateA.getTime() !== dateB.getTime()) {
          return dateB.getTime() - dateA.getTime();
        }
      }
      
      // Third priority: time (earliest first)
      const timeA = a.consultation.startTime;
      const timeB = b.consultation.startTime;
      return timeA.localeCompare(timeB);
    });
    
    // Debug: Log after sorting
    console.log('After sorting - First 5 consultations:', allConsultations.slice(0, 5).map(c => ({
      client: c.consultation.clientName,
      seen: c.consultation.seenByAgent,
      status: c.consultation.status,
      date: c.consultation.date,
      time: c.consultation.startTime
    })));
    
    // Debug: Log all consultations with their seen status
    console.log('All consultations with seen status:', allConsultations.map(c => ({
      client: c.consultation.clientName,
      seen: c.consultation.seenByAgent,
      status: c.consultation.status,
      date: c.consultation.date,
      time: c.consultation.startTime
    })));
    
    // Debug: Count new vs seen bookings
    const newBookings = allConsultations.filter(c => !c.consultation.seenByAgent);
    const seenBookings = allConsultations.filter(c => c.consultation.seenByAgent);
    console.log(`New bookings: ${newBookings.length}, Seen bookings: ${seenBookings.length}`);
    
    const startIndex = (currentPage - 1) * consultationsPerPage;
    const endIndex = startIndex + consultationsPerPage;
    const pageConsultations = allConsultations.slice(startIndex, endIndex);
    
    // Group by date for display, maintaining the sorted order
    const pageGroupedConsultations: Record<string, Consultation[]> = {};
    pageConsultations.forEach(({ date, consultation }) => {
      if (!pageGroupedConsultations[date]) {
        pageGroupedConsultations[date] = [];
      }
      pageGroupedConsultations[date].push(consultation);
    });
    
    // Sort consultations within each date group
    Object.keys(pageGroupedConsultations).forEach(date => {
      pageGroupedConsultations[date].sort((a, b) => {
        // First priority: unseen bookings come first
        if (!a.seenByAgent && b.seenByAgent) return -1;
        if (a.seenByAgent && !b.seenByAgent) return 1;
        
        // Second priority: time (earliest first)
        return a.startTime.localeCompare(b.startTime);
      });
    });
    
    return pageGroupedConsultations;
  };

  const pageGroupedConsultations = getConsultationsForPage();
  const pageSortedDates = Object.keys(pageGroupedConsultations).sort((a, b) => {
    const dateA = new Date(pageGroupedConsultations[a][0].date);
    const dateB = new Date(pageGroupedConsultations[b][0].date);
    return consultationFilter === 'upcoming' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
  });

  // Message modal placeholder
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  const openMessageModal = (consultation: Consultation) => {
    setActiveConsultation(consultation);
    setShowMessageModal(true);
  };

  // Booking details modal
  const [showBookingDetailsModal, setShowBookingDetailsModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");

  const openBookingDetailsModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setShowBookingDetailsModal(true);
  };

  const closeBookingDetailsModal = () => {
    setShowBookingDetailsModal(false);
    setSelectedBookingId("");
  };

  // Notification system for new bookings
  const [unreadBookingsCount, setUnreadBookingsCount] = useState(0);
  const [hasSeenConsultations, setHasSeenConsultations] = useState(false);
  
  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>>([]);

  // Remove toast notification
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Mark consultations as seen when tab is opened
  const handleConsultationsTabClick = async () => {
    setActiveMainTab('consultations');
    setHasSeenConsultations(true);
    setUnreadBookingsCount(0);
    // Mark all as seen in backend
    try {
      await fetch('/api/bookings', { method: 'PATCH' });
      // Refetch consultations to update seenByAgent
      fetchConsultations();
    } catch (err) {
      console.error('Failed to mark bookings as seen:', err);
    }
  };
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setActiveConsultation(null);
  };

  const updateAvailability = (idx: number, field: string, value: any) => {
    setAvailability(prev => prev.map((d, i) =>
      i === idx ? { ...d, [field]: value, ...(field === 'unavailable' && value ? { start: "09:00", end: "17:00" } : {}) } : d
    ));
  };

  const handleAgreementUpload = () => {
    // TODO: Implement file upload logic
    setAgreementUploaded(true);
    alert("Agreement uploaded (placeholder)");
  };

  useEffect(() => {
    async function fetchProfile() {
      const res = await fetch("/api/agents/me");
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        const agent = user.agentProfile;
        
        // If user doesn't have an agent profile, redirect to agent registration
        if (!agent) {
          router.push("/agent-register");
          return;
        }
        
        setProfile(prev => ({
          ...prev,
          fullName: user.name || "",
          marnOrLpn: agent?.maraNumber || "",
          mobile: user.phone || "",
          email: user.email || "",
          abn: agent?.abn || "",
          businessName: agent?.businessName || "",
          businessEmail: agent?.businessEmail || "",
          languages: (agent?.languages || []).join(", "),
          areasOfPractice: (agent?.specializations || []).join(", "),
          industries: (agent?.industries || []).join(", "),
          officeAddress: agent?.businessAddress || "",
          aboutCompany: agent?.bio || "",
          // Add more fields as needed
        }));
        // Set logo and photo previews if available
        const logoDoc = agent?.documents?.find((d: any) => d.type === "businessLogo");
        if (logoDoc) setLogoPreview(logoDoc.url);
        const photoDoc = agent?.documents?.find((d: any) => d.type === "photo");
        if (photoDoc) setPhotoPreview(photoDoc.url);
      }
    }
    fetchProfile();
    fetchConsultations(); // Also fetch consultations on mount
  }, []);

  // Fetch consultations when consultations tab is active
  useEffect(() => {
    if (activeMainTab === 'consultations') {
      fetchConsultations();
    }
  }, [activeMainTab]);

  // Check for new bookings every 30 seconds when not on consultations tab
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeMainTab !== 'consultations') {
        fetchConsultations();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeMainTab, hasSeenConsultations]);

  // Real-time notifications using Server-Sent Events
  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connectToNotifications = () => {
      try {
        eventSource = new EventSource('/api/notifications');
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'new_booking') {
            // Show a toast notification
            console.log('New booking received:', data);
            
            // Add toast notification
            const toastId = Date.now().toString();
            setToasts(prev => [...prev, {
              id: toastId,
              message: data.message,
              type: 'success'
            }]);
            
            // Update the unread count immediately
            setUnreadBookingsCount(prev => prev + 1);
            
            // Show a browser notification if permission is granted
            if (Notification.permission === 'granted') {
              new Notification('New Booking', {
                body: data.message,
                icon: '/favicon.ico',
              });
            }
            
            // Refetch consultations to get the latest data
            fetchConsultations();
          }
        };

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          // Reconnect after 5 seconds
          setTimeout(connectToNotifications, 5000);
        };

        eventSource.onopen = () => {
          console.log('SSE connection established');
        };
      } catch (error) {
        console.error('Failed to connect to notifications:', error);
        // Reconnect after 5 seconds
        setTimeout(connectToNotifications, 5000);
      }
    };

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Connect to notifications
    connectToNotifications();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setProfile(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (name === "profilePicture") {
          setPhotoPreview(URL.createObjectURL(file));
        } else if (name === "businessLogo") {
          setLogoPreview(URL.createObjectURL(file));
        }
        setProfile(prev => ({ ...prev, [name]: file }));
      }
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateProfile = () => {
    const errors = [];
    if (!profile.fullName.trim()) errors.push("Full Name is required");
    if (!profile.marnOrLpn.trim()) errors.push("MARN or LPN is required");
    if (!profile.mobile.trim()) errors.push("Mobile is required");
    if (!profile.email.trim()) errors.push("Email is required");
    if (!profile.businessName.trim()) errors.push("Business Name is required");
    return errors;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    const errors = validateProfile();
    if (errors.length > 0) {
      setFormError(errors.join(", "));
      return;
    }
    const formData = new FormData();
    Object.entries(profile).forEach(([key, value]) => {
      if (typeof value === 'string' && value) {
        formData.append(key, value);
      } else if (typeof value === 'object' && value !== null && 'name' in value && 'size' in value && 'type' in value) {
        // Type-safe check for file-like objects
        const fileObj = value as { name: string; size: number; type: string };
        if (typeof fileObj.name === 'string' && typeof fileObj.size === 'number' && typeof fileObj.type === 'string') {
          formData.append(key, value as any);
        }
      }
    });
    try {
      const res = await fetch('/api/agents/me', {
        method: 'PATCH',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        const agent = user.agentProfile;
        setProfile(prev => ({
          ...prev,
          fullName: user.name || "",
          marnOrLpn: agent?.maraNumber || "",
          mobile: user.phone || "",
          email: user.email || "",
          abn: agent?.abn || "",
          businessName: agent?.businessName || "",
          businessEmail: agent?.businessEmail || "",
          languages: (agent?.languages || []).join(", "),
          areasOfPractice: (agent?.specializations || []).join(", "),
          industries: profile.industries, // not in db, keep local
          officeAddress: agent?.businessAddress || "",
          aboutCompany: agent?.bio || "",
        }));
        // Set logo and photo previews if available
        const logoDoc = agent?.documents?.find((d: any) => d.type === "businessLogo");
        if (logoDoc) setLogoPreview(logoDoc.url);
        const photoDoc = agent?.documents?.find((d: any) => d.type === "photo");
        if (photoDoc) setPhotoPreview(photoDoc.url);
        setFormSuccess('Profile updated successfully!');
      } else {
        setFormError('Failed to update profile');
      }
    } catch (err) {
      setFormError('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <div className="flex flex-1 min-h-0">
        {/* Dark Green Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-green-900 text-white py-8 px-4 min-h-full">
          <div className="mb-8 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 w-full">
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-white p-2"><HomeIcon className="w-7 h-7 text-green-900" /></span>
                <div>
                  <div className="font-bold text-lg leading-tight text-white">MaraPlace</div>
                  <div className="text-xs text-green-200">Agent dashboard</div>
                </div>
              </span>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map(link => {
              if (link.submenu) {
                const isOpen = openSubMenu === link.label;
                return (
                  <div key={link.label}>
                    <button
                      type="button"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium ${isOpen ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white transition'}`}
                      onClick={() => setOpenSubMenu(isOpen ? null : link.label)}
                    >
                      {link.icon} <span>{link.label}</span>
                    </button>
                    {isOpen && (
                      <div className="ml-7 border-l border-green-700 pl-3 py-1 space-y-1">
                        {link.submenu.map((sublink) => {
                          const isActive = activeSubMenu === sublink.label;
                          return (
                            <button
                              key={sublink.label}
                              className={`flex items-center gap-2 py-1 w-full text-left rounded ${isActive ? 'bg-green-700 text-white font-semibold' : 'text-green-200 hover:text-white'}`}
                              onClick={() => {
                                setActiveSubMenu(sublink.label);
                                if (sublink.label === 'Edit Profile') {
                                  setActiveMainTab('settings');
                                  setActiveTab('account');
                                }
                              }}
                            >
                              {sublink.icon}
                              <span>{sublink.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button
                  key={link.label}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium w-full text-left ${activeMainTab === link.tab ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white'}`}
                  onClick={() => {
                    if (link.tab === 'consultations') {
                      handleConsultationsTabClick();
                    } else if (link.tab && (link.tab === 'dashboard' || link.tab === 'settings' || link.tab === 'calendar')) {
                      setActiveMainTab(link.tab);
                    }
                  }}
                >
                  {link.icon} <span>{link.label}</span>
                  {link.tab === 'consultations' && unreadBookingsCount > 0 && (
                    <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {unreadBookingsCount}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="my-4 border-t border-green-700" />
          <nav className="space-y-1 mb-4">
            {secondaryLinks.filter(link => link.label !== "Notification").map(link => (
              <a key={link.label} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-800 transition font-medium text-green-200 hover:text-white relative">
                {link.icon} <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col items-center pt-8">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold mb-2">
              {profile.fullName ? profile.fullName.charAt(0) : 'A'}
            </div>
            <div className="font-semibold text-white">{profile.fullName || 'Agent Name'}</div>
            <div className="text-xs text-green-200">Online</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-100 p-6 overflow-auto">
          {/* Top Bar - Removed search bar */}
          <div className="flex items-center justify-end mb-6">
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 text-gray-600 hover:text-gray-900">
                <BellIcon className="w-5 h-5" />
                {unreadBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadBookingsCount}
                  </span>
                )}
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {profile.fullName ? profile.fullName.charAt(0) : 'A'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{profile.fullName || 'Agent Name'}</p>
                  <p className="text-xs text-gray-500">MARA Agent</p>
                </div>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {activeMainTab === 'dashboard' && (
            <>
              {/* Good Morning Banner - Further reduced size */}
              <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex-1">
                  <h1 className="text-lg font-bold text-white mb-1">
                    Good morning, {profile.fullName || 'Agent'}!
                  </h1>
                  <p className="text-white text-sm">
                    Search and manage consultations on the marketplace to help clients with their immigration needs!
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">👨‍💼</span>
                  </div>
                </div>
              </div>

              {/* Invite Friends Card - Further reduced size */}
              <div className="bg-white rounded-lg shadow p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 mb-1">Invite your colleagues to MaraPlace</h3>
                    <p className="text-gray-600 mb-2 text-xs">
                      Reward yourself and join our MARA community! Get recognition for every invited colleague! Everyone wins!
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <span className="text-lg">💰</span>
                        <span className="font-bold text-gray-900 text-sm">+50</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                        Send invite →
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-lg">⭐</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Summary Cards with Progress Bars */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {/* Revenue */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                  <div className="text-xl font-bold text-green-700">$0.00</div>
                  <div className="text-gray-500 text-xs mt-1 text-center">Revenue (lifetime)</div>
                  <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-green-700 text-xs font-bold">$2,450 revenue</span>
                    </div>
                  </div>
                </div>
                {/* Consultations */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                  <div className="text-xl font-bold text-blue-600">{consultations.length}</div>
                  <div className="text-gray-500 text-xs mt-1 text-center">Total consultations</div>
                  <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((consultations.length / 200) * 100, 100)}%` }}></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-blue-600 text-xs font-bold">{consultations.length} consultations</span>
                    </div>
                  </div>
                </div>
                {/* Cases */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                  <div className="text-xl font-bold text-purple-600">0</div>
                  <div className="text-gray-500 text-xs mt-1 text-center">Total cases</div>
                  <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: '45%' }}></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-purple-600 text-xs font-bold">89 cases</span>
                    </div>
                  </div>
                </div>
                {/* Clients */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                  <div className="text-xl font-bold text-green-600">0</div>
                  <div className="text-gray-500 text-xs mt-1 text-center">Total clients</div>
                  {/* No progress bar for clients as in your screenshot */}
                </div>
                {/* Ratings */}
                <div className="bg-white rounded-lg shadow p-3 flex flex-col items-center">
                  <div className="text-xl font-bold text-pink-600">0</div>
                  <div className="text-gray-500 text-xs mt-1 text-center">New ratings</div>
                  <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-pink-600 h-2 rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-end mt-1">
                      <span className="text-pink-600 text-xs font-bold">156 ratings</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts with Real Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow p-4 min-h-[180px] flex flex-col">
                  <div className="font-semibold mb-3 text-sm">Consultations (lifetime)</div>
                  <div className="flex-1 flex items-end justify-between space-x-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((month) => {
                      const height = Math.random() * 100 + 20; // Random height for demo
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-blue-200 rounded-t transition-all duration-500 hover:bg-blue-300"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][month]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 min-h-[180px] flex flex-col">
                  <div className="font-semibold mb-3 text-sm">Revenue (lifetime)</div>
                  <div className="flex-1 flex items-end justify-between space-x-1">
                    {[0, 1, 2, 3, 4, 5, 6].map((month) => {
                      const height = Math.random() * 100 + 20; // Random height for demo
                      return (
                        <div key={month} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-green-200 rounded-t transition-all duration-500 hover:bg-green-300"
                            style={{ height: `${height}%` }}
                          ></div>
                          <div className="text-xs text-gray-500 mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][month]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
          {activeMainTab === 'consultations' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
              <h1 className="text-2xl font-bold mb-6 text-blue-900">Consultations</h1>
              
              {/* Top Navigation/Filter Bar */}
              <div className="flex items-center justify-between mb-6">
                {/* Filter Tabs */}
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setConsultationFilter('upcoming')}
                    className={`pb-2 font-medium text-sm border-b-2 transition-colors ${
                      consultationFilter === 'upcoming' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setConsultationFilter('past')}
                    className={`pb-2 font-medium text-sm border-b-2 transition-colors ${
                      consultationFilter === 'past' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Past
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                      className={`pb-2 font-medium text-sm border-b-2 transition-colors flex items-center space-x-1 ${
                        consultationFilter === 'dateRange' 
                          ? 'border-blue-600 text-blue-600' 
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>Date Range</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {showDateRangePicker && (
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-64">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setConsultationFilter('dateRange');
                                setShowDateRangePicker(false);
                              }}
                              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => setShowDateRangePicker(false)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                    </svg>
                    <span>Filter</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Main Content Area - Meeting List */}
              <div className="space-y-6">
                {/* Summary */}
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-semibold text-gray-900">{totalConsultations}</span> consultations
                    </div>
                    {unreadBookingsCount > 0 && (
                      <div className="text-sm text-red-600">
                        New: <span className="font-semibold">{unreadBookingsCount}</span> unread
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Showing {consultationsPerPage} per page
                  </div>
                </div>

                {/* Consultations List */}
                {consultationsLoading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading consultations...</p>
                  </div>
                ) : sortedDates.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500">No consultations found</p>
                  </div>
                ) : (
                  pageSortedDates.map(date => (
                    <div key={date} className="space-y-4">
                      {/* Date Header */}
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                        {date}
                      </h3>
                      
                      {/* Meeting Entries */}
                      <div className="space-y-3">
                        {pageGroupedConsultations[date].map(consultation => (
                          <div 
                            key={consultation.id} 
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => openBookingDetailsModal(consultation.id)}
                          >
                            {/* Time Slot */}
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${consultation.seenByAgent ? 'bg-green-600' : 'bg-red-500'}`}></div>
                              <div className="text-sm font-medium text-gray-900">
                                {consultation.startTime} – {consultation.endTime}
                                {!consultation.seenByAgent && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Client/Event Details */}
                            <div className="flex-1 ml-6">
                              <div className="font-semibold text-gray-900">{consultation.clientName}</div>
                              <div className="text-sm text-gray-600">
                                Event type <span className="font-semibold">{consultation.duration} Minute Meeting</span>
                              </div>
                              {consultation.clientEmail && (
                                <div className="text-xs text-gray-500">{consultation.clientEmail}</div>
                              )}
                              {consultation.clientPhone && (
                                <div className="text-xs text-gray-500">{consultation.clientPhone}</div>
                              )}
                            </div>

                            {/* Host/Non-Host Count and Details */}
                            <div className="flex items-center space-x-4">
                              <div className="text-sm text-gray-600">
                                1 host | 0 non-hosts
                              </div>

                              {/* Details Action */}
                              <div className="flex items-center space-x-2 text-green-600">
                                <span className="text-sm font-medium">Details</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
                
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    {/* First Page */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      &lt;&lt;
                    </button>
                    
                    {/* Previous Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      &lt;
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    {/* Next Page */}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      &gt;
                    </button>
                    
                    {/* Last Page */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      &gt;&gt;
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeMainTab === 'calendar' && (
            <ModernCalendarLayout />
          )}
          {activeMainTab === 'settings' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-8 border-b">
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'account' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('account')}
                >
                  Account settings
                </button>
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'consultancy' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('consultancy')}
                >
                  Consultancy settings
                </button>
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'notification' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('notification')}
                >
                  Notification settings
                </button>
              </div>
              {/* Tab Content */}
              {activeTab === 'account' && (
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Profile Card */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full md:w-80 mb-8 md:mb-0">
                    <div className="relative group mb-4">
                      <img src={photoPreview || "/default-profile.png"} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow" />
                      <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg group-hover:scale-110 transition-transform">
                        <CameraIcon className="w-5 h-5 text-white" />
                        <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                      </label>
                    </div>
                    <div className="text-xl font-bold text-gray-800 mb-1">{profile.fullName || "Agent Name"}</div>
                    <div className="text-blue-700 font-semibold text-sm mb-1">{profile.marnOrLpn ? `MARN/LPN: ${profile.marnOrLpn}` : "MARN/LPN: ---"}</div>
                    <div className="text-gray-500 text-xs mb-2">ABN: {profile.abn || "---"}</div>
                    <div className="text-gray-400 text-xs mt-4 mb-4">Member since <span className="font-medium text-blue-700">12 Feb 2020</span></div>
                    {/* Business Logo Upload */}
                    <div className="w-full flex flex-col items-center mt-2">
                      <div className="relative group mb-2">
                        <img src={logoPreview || "/default-logo.png"} alt="Business Logo" className="w-20 h-20 object-contain bg-gray-100 rounded border-2 border-blue-200 shadow" />
                        <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg group-hover:scale-110 transition-transform">
                          <CameraIcon className="w-4 h-4 text-white" />
                          <input name="businessLogo" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                        </label>
                      </div>
                      <span className="text-xs text-gray-500">Upload Business Logo</span>
                    </div>
                  </div>
                  {/* Form Section */}
                  <form onSubmit={handleProfileSubmit} className="flex-1">
                    {formError && <div className="mb-4 text-red-600 font-semibold text-center">{formError}</div>}
                    {formSuccess && <div className="mb-4 text-green-700 font-semibold text-center">{formSuccess}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                        <input
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">MARN or LPN</label>
                        <input
                          name="marnOrLpn"
                          value={profile.marnOrLpn}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Mobile</label>
                        <input
                          name="mobile"
                          value={profile.mobile}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          type="email"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">ABN</label>
                        <input
                          name="abn"
                          value={profile.abn}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Name</label>
                        <input
                          name="businessName"
                          value={profile.businessName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Email</label>
                        <input
                          name="businessEmail"
                          value={profile.businessEmail}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Languages</label>
                        <input
                          name="languages"
                          value={profile.languages}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          placeholder="e.g. English, Hindi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Areas of Practice</label>
                        <input
                          name="areasOfPractice"
                          value={profile.areasOfPractice}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          placeholder="e.g. Student Visa, Work Visa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Industries</label>
                        <input
                          name="industries"
                          value={profile.industries}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          placeholder="e.g. Education, Health"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Office Address</label>
                        <input
                          name="officeAddress"
                          value={profile.officeAddress}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">About Company</label>
                        <textarea
                          name="aboutCompany"
                          value={profile.aboutCompany}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                      <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold bg-white hover:bg-gray-100 transition">Cancel</button>
                      <Button type="submit" className="px-8 py-2 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow">Save Changes</Button>
                    </div>
                  </form>
                </div>
              )}
              {activeTab === 'consultancy' && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-green-700">Consultancy Settings</h2>
                  <form onSubmit={e => { e.preventDefault(); alert('Consultancy settings saved (placeholder)'); }}>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Consultancy fee per session (AUD)</label>
                      <input
                        name="consultancyFee"
                        value={profile.consultancyFee}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Consultancy Terms & Conditions Agreement</label>
                      <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                        <span>{agreementUploaded ? "Agreement uploaded" : "Agreement not uploaded"}</span>
                        <Button size="sm" className="ml-auto" onClick={handleAgreementUpload}>Upload agreement</Button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                      <Button type="submit" className="px-8 py-2 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow">Save Changes</Button>
                    </div>
                  </form>
                </div>
              )}
              {activeTab === 'notification' && (
                <div className="max-w-2xl mx-auto text-gray-500 text-center py-20">Notification settings coming soon...</div>
              )}
            </div>
          )}
          {/* Message Modal Placeholder */}
          {showMessageModal && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={closeMessageModal}>&times;</button>
                <h2 className="text-xl font-bold mb-4 text-green-700">Message {activeConsultation?.clientName}</h2>
                <div className="text-gray-500 mb-4">(Chat UI coming soon...)</div>
                <textarea className="w-full border rounded px-3 py-2 mb-4" rows={3} placeholder="Type your message..." disabled />
                <Button className="w-full" disabled>Send</Button>
              </div>
            </div>
          )}

          {/* Booking Details Modal */}
          <BookingDetailsModal
            isOpen={showBookingDetailsModal}
            onClose={closeBookingDetailsModal}
            bookingId={selectedBookingId}
          />
        </main>
      </div>
    </div>
  );
} 