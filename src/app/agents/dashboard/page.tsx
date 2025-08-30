 "use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Star,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const ServiceManager = dynamic(() => import("@/components/ServiceManager"), {
  ssr: false,
  loading: () => <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">Loading ServiceManager...</div>
});

import { BellIcon, DocumentIcon, QuestionMarkCircleIcon, CalendarIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon, CreditCardIcon, ClipboardDocumentListIcon, HomeIcon, FolderIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import ModernCalendarLayout from "../calendar/ModernCalendarLayout";
import BookingDetailsModal from "@/components/BookingDetailsModal";
import Toast from "@/components/Toast";
import CalendarSync from "@/components/CalendarSync";
import ClientDetailsModal from "@/components/ClientDetailsModal";
import EnhancedDashboard from "@/components/EnhancedDashboard";

const sidebarLinks = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" />, tab: "dashboard" },
  { label: "Consultations", icon: <ClipboardDocumentListIcon className="w-5 h-5" />, tab: "consultations" },
  { label: "Agreements", icon: <DocumentIcon className="w-5 h-5" />, tab: "agreements" },
  { label: "Clients", icon: <UsersIcon className="w-5 h-5" />, tab: "clients" },
  { label: "Calendar", icon: <CalendarIcon className="w-5 h-5" />, tab: "calendar" },
  { label: "Calendar Sync", icon: <CalendarIcon className="w-5 h-5" />, tab: "calendar-sync" },
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
  const { data: session, status } = useSession();
  
  // Debug session data
  useEffect(() => {
    console.log('Session data:', session);
    console.log('Session status:', status);
  }, [session, status]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);



  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      
      // Close notification dropdown when clicking outside
      const notificationDropdown = document.querySelector('[data-notification-dropdown]');
      if (notificationDropdown && !notificationDropdown.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  
  // Debug photo preview state
  useEffect(() => {
    console.log('Photo preview state changed:', photoPreview);
  }, [photoPreview]);
  
  // Notification system
  interface Notification {
    id: string;
    type: 'success' | 'info' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
    action?: string;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [previousProfile, setPreviousProfile] = useState(initialProfile);
  const [previousConsultations, setPreviousConsultations] = useState<Consultation[]>([]);
  
  // Agent statistics from API
  const [agentStats, setAgentStats] = useState({
    totalEarnings: 0,
    totalBookings: 0,
    totalReviews: 0,
    totalCases: 0,
    totalClients: 0,
    rating: 0,
    monthlyData: []
  });

  // Todo state
  const [todos, setTodos] = useState([
    { id: 1, text: "Review pending client applications", completed: false, priority: "high" },
    { id: 2, text: "Follow up with recent consultations", completed: false, priority: "medium" },
    { id: 3, text: "Update service availability calendar", completed: true, priority: "low" },
    { id: 4, text: "Prepare monthly report", completed: false, priority: "high" },
    { id: 5, text: "Schedule team meeting", completed: false, priority: "medium" },
    { id: 6, text: "Review client feedback", completed: false, priority: "low" }
  ]);

  // Sample data for charts
  const [chartData] = useState<{
    revenueData: Array<{ month: string; revenue: number; consultations: number }>;
    taskStats: Array<{ name: string; value: number; color: string }>;
    clientData: Array<{ name: string; clients: number; color: string }>;
  }>({
    revenueData: [
      { month: 'Jan', revenue: 12000, consultations: 8 },
      { month: 'Feb', revenue: 15000, consultations: 12 },
      { month: 'Mar', revenue: 18000, consultations: 15 },
      { month: 'Apr', revenue: 22000, consultations: 18 },
      { month: 'May', revenue: 25000, consultations: 22 },
      { month: 'Jun', revenue: 28000, consultations: 25 },
      { month: 'Jul', revenue: 32000, consultations: 28 }
    ],
    taskStats: [
      { name: 'Completed', value: 45, color: '#10B981' },
      { name: 'In Progress', value: 30, color: '#F59E0B' },
      { name: 'Pending', value: 15, color: '#3B82F6' },
      { name: 'Overdue', value: 10, color: '#EF4444' }
    ],
    clientData: [
      { name: 'Student Visas', clients: 25, color: '#8B5CF6' },
      { name: 'Skilled Migration', clients: 18, color: '#06B6D4' },
      { name: 'Family Visas', clients: 12, color: '#10B981' },
      { name: 'Business Visas', clients: 8, color: '#F59E0B' }
    ]
  });

  // Recent activities data
  const [recentActivities] = useState([
    { id: 1, type: 'booking', message: 'New booking from John Smith', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'payment', message: 'Payment received from Sarah Johnson', time: '4 hours ago', status: 'completed' },
    { id: 3, type: 'review', message: 'New 5-star review from Mike Wilson', time: '6 hours ago', status: 'completed' },
    { id: 4, type: 'consultation', message: 'Consultation completed with Lisa Brown', time: '1 day ago', status: 'completed' }
  ]);
  
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Notification functions
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
  };
  
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };
  
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  const getUnreadNotificationCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };
  
  // Generate real graph data from actual consultations
  const generateConsultationData = () => {
    if (agentStats.monthlyData && agentStats.monthlyData.length > 0) {
      // Use data from stats API
      const maxValue = Math.max(...agentStats.monthlyData.map((d: any) => d.consultations));
      
      return agentStats.monthlyData.map((item: any) => ({
        month: item.month,
        value: item.consultations,
        height: maxValue > 0 ? Math.max(3, (item.consultations / maxValue) * 100) : 3
      }));
    }
    
    // Fallback to consultations data if stats API data is not available
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    
    console.log('Generating consultation data with consultations:', consultations);
    console.log('Consultations array length:', consultations.length);
    
    // Group consultations by month
    const monthlyData = months.map((month, index) => {
      const monthNumber = index + 1; // 1 for Jan, 2 for Feb, etc.
      const consultationsInMonth = consultations.filter(consultation => {
        const consultationDate = new Date(consultation.date);
        console.log(`Checking consultation ${consultation.id}: date=${consultation.date}, month=${consultationDate.getMonth()}, index=${index}`);
        return consultationDate.getMonth() === index; // 0-indexed month
      });
      
      return {
        month,
        value: consultationsInMonth.length,
        consultations: consultationsInMonth
      };
    });
    
    // Calculate heights based on the maximum value
    const maxValue = Math.max(...monthlyData.map(d => d.value));
    
    const result = monthlyData.map(item => ({
      ...item,
      height: maxValue > 0 ? Math.max(3, (item.value / maxValue) * 100) : 3
    }));
    
    console.log('Real consultation data:', result, 'Total consultations:', consultations.length, 'Max value:', maxValue);
    return result;
  };
  
  const generateRevenueData = () => {
    if (agentStats.monthlyData && agentStats.monthlyData.length > 0) {
      // Use data from stats API
      const maxValue = Math.max(...agentStats.monthlyData.map((d: any) => d.revenue));
      
      return agentStats.monthlyData.map((item: any) => ({
        month: item.month,
        value: item.revenue,
        height: maxValue > 0 ? Math.max(3, (item.revenue / maxValue) * 100) : 3
      }));
    }
    
    // Fallback to consultations data if stats API data is not available
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    
    // Group consultations by month and calculate revenue
    const monthlyData = months.map((month, index) => {
      const consultationsInMonth = consultations.filter(consultation => {
        const consultationDate = new Date(consultation.date);
        return consultationDate.getMonth() === index; // 0-indexed month
      });
      
      // Calculate total revenue for this month
      const monthlyRevenue = consultationsInMonth.reduce((total, consultation) => {
        return total + (consultation.totalAmount || 0);
      }, 0);
      
      return {
        month,
        value: monthlyRevenue,
        consultations: consultationsInMonth
      };
    });
    
    // Calculate heights based on the maximum value
    const maxValue = Math.max(...monthlyData.map(d => d.value));
    
    const result = monthlyData.map(item => ({
      ...item,
      height: maxValue > 0 ? Math.max(3, (item.value / maxValue) * 100) : 3
    }));
    
    console.log('Real revenue data:', result, 'Total revenue:', agentStats.totalEarnings, 'Max value:', maxValue);
    return result;
  };
  
  // Function to detect profile changes and add notifications
  const detectProfileChanges = (newProfile: typeof initialProfile) => {
    const changes: string[] = [];
    
    if (previousProfile.fullName !== newProfile.fullName) {
      changes.push('Full Name');
    }
    if (previousProfile.mobile !== newProfile.mobile) {
      changes.push('Phone Number');
    }
    if (previousProfile.email !== newProfile.email) {
      changes.push('Email');
    }
    if (previousProfile.businessEmail !== newProfile.businessEmail) {
      changes.push('Business Email');
    }
    if (previousProfile.languages !== newProfile.languages) {
      changes.push('Languages');
    }
    if (previousProfile.areasOfPractice !== newProfile.areasOfPractice) {
      changes.push('Areas of Practice');
    }
    if (previousProfile.industries !== newProfile.industries) {
      changes.push('Industries');
    }
    if (previousProfile.officeAddress !== newProfile.officeAddress) {
      changes.push('Office Address');
    }
    if (previousProfile.aboutCompany !== newProfile.aboutCompany) {
      changes.push('About Company');
    }
    
    if (changes.length > 0) {
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: `Your ${changes.join(', ')} ${changes.length === 1 ? 'was' : 'were'} updated successfully.`,
        action: 'View Profile'
      });
    }
    
    setPreviousProfile(newProfile);
  };
  
  // Function to detect new bookings
  const detectNewBookings = (newConsultations: Consultation[]) => {
    const previousIds = new Set(previousConsultations.map(c => c.id));
    const newBookings = newConsultations.filter(c => !previousIds.has(c.id));
    
    if (newBookings.length > 0) {
      newBookings.forEach(booking => {
        addNotification({
          type: 'info',
          title: 'New Booking',
          message: `You have a new booking from ${booking.clientName} for ${booking.serviceName || 'consultation'} on ${new Date(booking.date).toLocaleDateString()} at ${booking.startTime}.`,
          action: 'View Booking'
        });
      });
    }
    
    setPreviousConsultations(newConsultations);
  };
  
  // Debug effect to log graph data
  useEffect(() => {
    console.log('AgentStats changed:', agentStats);
    const consultationData = generateConsultationData();
    const revenueData = generateRevenueData();
    console.log('Graph data debug:', {
      consultation: consultationData.map(d => ({ month: d.month, value: d.value, height: d.height })),
      revenue: revenueData.map(d => ({ month: d.month, value: d.value, height: d.height }))
    });
  }, [agentStats.totalBookings, agentStats.totalEarnings]);

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
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'consultations' | 'clients' | 'settings' | 'calendar' | 'calendar-sync' | 'documents'>('dashboard');
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
    totalAmount?: number;
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

  // Debug effect to monitor consultations state
  useEffect(() => {
    console.log('Consultations state changed:', consultations);
    console.log('Consultations length:', consultations.length);
  }, [consultations]);
  
  // Clients state
  type Client = {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    lastBooking: string;
    status: 'active' | 'inactive';
    totalSpent: number;
    notes?: string;
  };
  
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [clientSortField, setClientSortField] = useState<'name' | 'email' | 'totalBookings' | 'lastBooking' | 'totalSpent'>('name');
  const [clientSortDirection, setClientSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Client details modal state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  
  // Service management state
  interface Service {
    id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isActive: boolean;
  }
  
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  
  // Documents state
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  
  // Profile updates state
  const [pendingUpdates, setPendingUpdates] = useState<any[]>([]);
  const [pendingUpdatesLoading, setPendingUpdatesLoading] = useState(false);
  
  // Traditional KPI stats matching the image design
  const stats = [
    { label: "Revenue (lifetime)", value: "$0.00", color: "text-green-700" },
    { label: "Total consultations", value: consultations.length, color: "text-blue-600" },
    { label: "Total cases", value: 0, color: "text-purple-600" },
    { label: "Total clients", value: clients.length, color: "text-green-600" },
    { label: "New ratings", value: 0, color: "text-pink-600" },
  ];
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const consultationsPerPage = 5;

  // Client details modal handlers
  const handleViewClientDetails = (client: Client) => {
    setSelectedClient(client);
    setIsClientModalOpen(true);
  };

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false);
    setSelectedClient(null);
  };

  // Fetch consultations data
  const fetchConsultations = async () => {
    setConsultationsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        console.log('Raw API data:', data);
        console.log('Number of bookings from API:', data.bookings.length);
        
        const formattedConsultations: Consultation[] = data.bookings.map((booking: any) => {
          const consultation = {
            id: booking.id,
            clientName: booking.clientName || booking.client.name || 'Unknown Client',
            clientEmail: booking.clientEmail || booking.client.email || '',
            clientPhone: booking.clientPhone || booking.client.phone || '',
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            schedule: `${new Date(booking.date).toLocaleDateString()} ${booking.startTime}`,
            fee: booking.totalAmount ? `$${parseFloat(booking.totalAmount).toFixed(2)}` : 'Free',
            totalAmount: booking.totalAmount ? parseFloat(booking.totalAmount) : 0,
            status: booking.status,
            outcome: booking.status === 'COMPLETED' ? 'Completed' : 
                     booking.status === 'CANCELLED' ? 'Cancelled' : 
                     booking.status === 'NO_SHOW' ? 'No Show' : '-',
            serviceName: booking.service?.name || 'General Consultation',
            meetingType: booking.meetingType,
            notes: booking.notes || '',
            duration: booking.duration || 30,
            seenByAgent: booking.seenByAgent || false,
          };
          console.log('Formatted consultation:', consultation);
          return consultation;
        });
        
        console.log('Setting consultations state with:', formattedConsultations);
        setConsultations(formattedConsultations);
        
        // Detect new bookings and add notifications
        detectNewBookings(formattedConsultations);
        
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

  // Fetch clients data
  const fetchClients = async () => {
    setClientsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        
        // Group bookings by client to create client records
        const clientMap = new Map<string, Client>();
        
        data.bookings.forEach((booking: any) => {
          const clientId = booking.clientId || booking.client?.id || 'unknown';
          const clientName = booking.clientName || booking.client?.name || 'Unknown Client';
          const clientEmail = booking.clientEmail || booking.client?.email || '';
          const clientPhone = booking.clientPhone || booking.client?.phone || '';
          
          if (!clientMap.has(clientId)) {
            clientMap.set(clientId, {
              id: clientId,
              name: clientName,
              email: clientEmail,
              phone: clientPhone,
              totalBookings: 0,
              lastBooking: '',
              status: 'active' as const,
              totalSpent: 0,
              notes: ''
            });
          }
          
          const client = clientMap.get(clientId)!;
          client.totalBookings += 1;
          
          const bookingDate = new Date(booking.date);
          if (!client.lastBooking || bookingDate > new Date(client.lastBooking)) {
            client.lastBooking = booking.date;
          }
          
          if (booking.totalAmount) {
            client.totalSpent += parseFloat(booking.totalAmount);
          }
        });
        
        const clientsArray = Array.from(clientMap.values());
        setClients(clientsArray);
      } else {
        console.error('Failed to fetch clients');
        setClients([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    } finally {
      setClientsLoading(false);
    }
  };

  // Fetch agent services
  const fetchAgentServices = async () => {
    console.log('Fetching agent services...');
    setServicesLoading(true);
    try {
      // Get agent profile ID from session or fetch it
      console.log('Fetching agent data...');
      const agentResponse = await fetch('/api/agents/me');
      console.log('Agent response status:', agentResponse.status);
      
      if (agentResponse.ok) {
        const agentData = await agentResponse.json();
        console.log('Agent data:', agentData);
        const currentAgentId = agentData.agent?.id;
        console.log('Agent ID:', currentAgentId);
        setAgentId(currentAgentId);
        
        if (currentAgentId) {
          console.log('Fetching services for agent:', currentAgentId);
          const servicesResponse = await fetch(`/api/agents/${currentAgentId}/services`);
          console.log('Services response status:', servicesResponse.status);
          
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            console.log('Services data:', servicesData);
            setServices(servicesData.services || []);
          } else {
            console.error('Failed to fetch services:', servicesResponse.statusText);
          }
        } else {
          console.log('No agent ID found');
        }
      } else {
        console.error('Failed to fetch agent data:', agentResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setServicesLoading(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    try {
      const response = await fetch('/api/agents/me');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.agent.documents || []);
      } else {
        console.error('Failed to fetch documents');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setDocumentsLoading(false);
    }
  };

  // Fetch pending profile updates
  const fetchPendingUpdates = async () => {
    setPendingUpdatesLoading(true);
    try {
      const response = await fetch('/api/agents/profile');
      if (response.ok) {
        const data = await response.json();
        setPendingUpdates(data.pendingUpdates || []);
      } else {
        console.error('Failed to fetch pending updates');
        setPendingUpdates([]);
      }
    } catch (error) {
      console.error('Error fetching pending updates:', error);
      setPendingUpdates([]);
    } finally {
      setPendingUpdatesLoading(false);
    }
  };

  // Handle services change
  const handleServicesChange = async (updatedServices: Service[]) => {
    try {
      if (agentId) {
        // Update local state immediately for better UX
        setServices(updatedServices);

        // Send updates to server
        const response = await fetch(`/api/agents/${agentId}/services`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ services: updatedServices }),
        });

        if (!response.ok) {
          throw new Error('Failed to update services');
        }

        const data = await response.json();
        // Update with server response to get proper IDs
        setServices(data.services || updatedServices);
      }
    } catch (error) {
      console.error('Error updating services:', error);
      alert('Failed to update services. Please try again.');
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

  const handleQuickConfirm = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CONFIRMED',
        }),
      });
      
      if (response.ok) {
        // Refresh consultations to show updated status
        fetchConsultations();
      } else {
        console.error('Failed to confirm booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleQuickReject = async (bookingId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the modal
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED',
        }),
      });
      
      if (response.ok) {
        // Refresh consultations to show updated status
        fetchConsultations();
      } else {
        console.error('Failed to reject booking');
      }
    } catch (error) {
      console.error('Error rejecting booking:', error);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Debug function to clear session
  const handleClearSession = () => {
    console.log('Clearing session...');
    signOut({ callbackUrl: "/login" });
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
    const fetchProfile = async () => {
      console.log('Fetching profile, session:', session);
      const res = await fetch("/api/agents/me");
      if (res.ok) {
        const data = await res.json();
        console.log('Profile API response:', data);
        const user = data.user;
        const agent = user.agentProfile;
        
        // If user doesn't have an agent profile, redirect to agent registration
        if (!agent) {
          router.push("/agent-register");
          return;
        }
        
        const newProfileData = {
          ...initialProfile,
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
        };
        
        setProfile(newProfileData);
        
        // Detect profile changes and add notifications
        detectProfileChanges(newProfileData);
        

        
        console.log('User name from API:', user.name);
        console.log('Agent profile:', agent);
        // Set logo and photo previews if available
        const logoDoc = agent?.documents?.find((d: any) => d.type === "businessLogo");
        if (logoDoc) {
          setLogoPreview(logoDoc.url);
          console.log('Logo URL set:', logoDoc.url);
        }
        const photoDoc = agent?.documents?.find((d: any) => d.type === "photo");
        console.log('All documents:', agent?.documents);
        console.log('Photo document found:', photoDoc);
        if (photoDoc) {
          setPhotoPreview(photoDoc.url);
          console.log('Photo URL set:', photoDoc.url);
        } else {
          console.log('No photo document found');
        }
      }
    };
    
    fetchProfile();
    fetchConsultations(); // Also fetch consultations on mount
  }, [session]); // Re-fetch when session changes

  // Fetch consultations when consultations tab is active
  useEffect(() => {
    if (activeMainTab === 'consultations') {
      fetchConsultations();
    }
  }, [activeMainTab]);

  // Fetch clients when clients tab is active
  useEffect(() => {
    if (activeMainTab === 'clients') {
      fetchClients();
    }
  }, [activeMainTab]);

  // Fetch agent stats from dedicated endpoint
  const fetchAgentStats = async () => {
    try {
      const response = await fetch('/api/agents/stats');
      if (response.ok) {
        const stats = await response.json();
        console.log('Fetched agent stats:', stats);
        setAgentStats(stats);
      } else {
        console.error('Failed to fetch agent stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching agent stats:', error);
    }
  };

  // Todo functions
  const addTodo = (text: string) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      priority: "medium" as "high" | "medium" | "low"
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Fetch agent data when component mounts
  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const agentResponse = await fetch('/api/agents/me');
        if (agentResponse.ok) {
          const agentData = await agentResponse.json();
          const currentAgentId = agentData.agent?.id;
          setAgentId(currentAgentId);
        }
      } catch (error) {
        console.error('Error fetching agent data:', error);
      }
    };
    
    fetchAgentData();
    fetchAgentStats(); // Fetch stats when component mounts
  }, []);

  // Fetch services when consultancy tab is active
  useEffect(() => {
    console.log('useEffect triggered - activeMainTab:', activeMainTab, 'activeTab:', activeTab);
    if (activeMainTab === 'settings' && activeTab === 'consultancy') {
      console.log('Fetching services - conditions met');
      fetchAgentServices();
    }
    if (activeMainTab === 'documents') {
      console.log('Fetching documents - conditions met');
      fetchDocuments();
    }
    if (activeMainTab === 'settings') {
      console.log('Fetching pending updates - conditions met');
      fetchPendingUpdates();
    }
  }, [activeMainTab, activeTab]);

  // Check for new bookings every 30 seconds when not on consultations tab
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeMainTab !== 'consultations') {
        fetchConsultations();
        fetchAgentStats(); // Also refresh stats
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
        console.log('File selected:', name, file.name, file.size);
        if (name === "profilePicture") {
          const previewUrl = URL.createObjectURL(file);
          setPhotoPreview(previewUrl);
          console.log('Profile picture preview set:', previewUrl);
        } else if (name === "businessLogo") {
          const previewUrl = URL.createObjectURL(file);
          setLogoPreview(previewUrl);
          console.log('Business logo preview set:', previewUrl);
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
    if (!profile.mobile.trim()) errors.push("Mobile is required");
    if (!profile.email.trim()) errors.push("Email is required");
    // Removed validation for disabled fields (MARN/LPN, ABN, Business Name)
    return errors;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSaving(true);
    
    const errors = validateProfile();
    if (errors.length > 0) {
      setFormError(errors.join(", "));
      setIsSaving(false);
      return;
    }

    try {
      // Create FormData for file uploads
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('mobile', profile.mobile);
      formData.append('email', profile.email);
      formData.append('maraNumber', profile.marnOrLpn); // API expects maraNumber
      formData.append('abn', profile.abn);
      formData.append('businessName', profile.businessName);
      formData.append('businessEmail', profile.businessEmail);
      formData.append('languages', profile.languages);
      formData.append('specializations', profile.areasOfPractice);
      formData.append('industries', profile.industries);
      formData.append('businessAddress', profile.officeAddress);
      formData.append('bio', profile.aboutCompany);

      // Add files if they exist
      if (profile.profilePicture && typeof profile.profilePicture !== 'string') {
        formData.append('profilePicture', profile.profilePicture as File);
      }
      if (profile.businessLogo && typeof profile.businessLogo !== 'string') {
        formData.append('businessLogo', profile.businessLogo as File);
      }

      const res = await fetch('/api/agents/me', {
        method: 'PATCH',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
          setFormSuccess('Profile updated successfully!');
        
        // Add success notification
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully!',
          action: 'View Profile'
        });
        
        // Refresh the profile data to show updated information
        const profileRes = await fetch("/api/agents/me");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          const user = profileData.user;
          const agent = user.agentProfile;
          
          // Update photo and logo previews
          const logoDoc = agent?.documents?.find((d: any) => d.type === "businessLogo");
          if (logoDoc) setLogoPreview(logoDoc.url);
          const photoDoc = agent?.documents?.find((d: any) => d.type === "photo");
          if (photoDoc) setPhotoPreview(photoDoc.url);
        }
      } else {
        setFormError(data.error || 'Failed to update profile');
        
        // Add error notification
        addNotification({
          type: 'error',
          title: 'Profile Update Failed',
          message: data.error || 'Failed to update profile. Please try again.',
        });
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setFormError('Failed to update profile');
      
      // Add error notification
      addNotification({
        type: 'error',
        title: 'Profile Update Failed',
        message: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 min-h-0">
        {/* Modern Purple Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white py-8 px-4 min-h-full shadow-xl">
          <div className="mb-8 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 w-full">
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-white p-2 shadow-lg"><HomeIcon className="w-7 h-7 text-purple-900" /></span>
                <div>
                  <div className="font-bold text-lg leading-tight text-white">MaraPlace</div>
                  <div className="text-xs text-purple-200">Agent dashboard</div>
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
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium transition-all duration-200 ${isOpen ? 'bg-purple-700 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800 hover:text-white hover:shadow-md'}`}
                      onClick={() => setOpenSubMenu(isOpen ? null : link.label)}
                    >
                      {link.icon} <span>{link.label}</span>
                    </button>
                    {isOpen && (
                      <div className="ml-7 border-l border-purple-700 pl-3 py-1 space-y-1">
                        {link.submenu.map((sublink) => {
                          const isActive = activeSubMenu === sublink.label;
                          return (
                            <button
                              key={sublink.label}
                              className={`flex items-center gap-2 py-1 w-full text-left rounded transition-all duration-200 ${isActive ? 'bg-purple-700 text-white font-semibold shadow-md' : 'text-purple-200 hover:text-white hover:bg-purple-800'}`}
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
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium w-full text-left ${activeMainTab === link.tab ? 'bg-purple-700 text-white shadow-lg' : 'text-purple-200 hover:bg-purple-800 hover:text-white hover:shadow-md'}`}
                  onClick={() => {
                    if (link.tab === 'consultations') {
                      handleConsultationsTabClick();
                    } else if (link.tab && (link.tab === 'dashboard' || link.tab === 'clients' || link.tab === 'settings' || link.tab === 'calendar' || link.tab === 'calendar-sync')) {
                      setActiveMainTab(link.tab);
                    }
                  }}
                >
                  {link.icon} <span>{link.label}</span>
                  {link.tab === 'consultations' && unreadBookingsCount > 0 && (
                    <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                      {unreadBookingsCount}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
          <div className="my-4 border-t border-purple-700" />
          <nav className="space-y-1 mb-4">
            {secondaryLinks.filter(link => link.label !== "Notification").map(link => (
              <button
                key={link.label}
                onClick={() => {
                  if (link.label === "Documents") {
                    setActiveMainTab('documents');
                  }
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium w-full text-left ${
                  activeMainTab === 'documents' && link.label === "Documents" 
                    ? 'bg-purple-700 text-white shadow-lg' 
                    : 'text-purple-200 hover:bg-purple-800 hover:text-white hover:shadow-md'
                }`}
              >
                {link.icon} <span>{link.label}</span>
              </button>
            ))}
          </nav>
          <div className="mt-auto flex flex-col items-center pt-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mb-2 shadow-lg overflow-hidden">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onLoad={() => console.log('Profile image loaded successfully:', photoPreview)}
                  onError={(e) => {
                    console.log('Profile image failed to load:', photoPreview);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center text-white font-semibold ${photoPreview ? 'hidden' : ''}`}>
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            </div>
            <div className="font-semibold text-white">{profile.fullName || session?.user?.name || 'Agent Name'}</div>
            <div className="text-xs text-purple-200 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-6 overflow-auto">
          {/* Modern Top Bar */}
          <div className="flex items-center justify-between mb-8 bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
                          <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-purple-600 transition-colors duration-200 hover:bg-purple-50 rounded-lg"
                  >
                <BellIcon className="w-5 h-5" />
                    {getUnreadNotificationCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {getUnreadNotificationCount()}
                  </span>
                )}
              </button>
                  
                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div 
                      data-notification-dropdown
                      className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          {getUnreadNotificationCount() > 0 && (
                            <button
                              onClick={markAllNotificationsAsRead}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Mark all as read
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-2">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <BellIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-3 rounded-lg mb-2 transition-all duration-200 ${
                                notification.read 
                                  ? 'bg-gray-50 hover:bg-gray-100' 
                                  : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
                              }`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${
                                      notification.type === 'success' ? 'bg-green-500' :
                                      notification.type === 'info' ? 'bg-blue-500' :
                                      notification.type === 'warning' ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}></div>
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                      {notification.title}
                                    </h4>
                                  </div>
                                  <p className="text-gray-600 text-sm mb-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {notification.timestamp.toLocaleTimeString()}
                                    </span>
                                    {notification.action && (
                                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                                        {notification.action}
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeNotification(notification.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 ml-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 bg-white rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md overflow-hidden">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onLoad={() => console.log('Header profile image loaded successfully:', photoPreview)}
                        onError={(e) => {
                          console.log('Header profile image failed to load:', photoPreview);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-white font-semibold text-sm ${photoPreview ? 'hidden' : ''}`}>
                      {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : 'A'}
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{profile.fullName || session?.user?.name || 'Agent Name'}</p>
                  <p className="text-xs text-gray-500">MARA Agent</p>
                </div>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                    <div className="p-2">
                      <Link
                        href="/agents/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Agent Dashboard
                      </Link>
                      <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Visit Website
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-all duration-200 w-full text-left"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {activeMainTab === 'dashboard' && (
            <EnhancedDashboard 
              agentStats={agentStats}
              profile={profile}
              session={session}
            />
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
                              <div className="mt-1">
                                <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                  consultation.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                  consultation.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                  consultation.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                  consultation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {consultation.status}
                                </span>
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

                              {/* Quick Actions for PENDING bookings */}
                              {consultation.status === 'PENDING' && (
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={(e) => handleQuickConfirm(consultation.id, e)}
                                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={(e) => handleQuickReject(consultation.id, e)}
                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}

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
          {activeMainTab === 'clients' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
              <h1 className="text-2xl font-bold mb-6 text-blue-900">Clients</h1>
              
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <input
                    type="text"
                    placeholder="Search clients by name, email, or phone..."
                    value={clientSearchTerm}
                    onChange={(e) => setClientSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Sort Controls */}
                <div className="flex items-center gap-4">
                  <select
                    value={clientSortField}
                    onChange={(e) => setClientSortField(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="totalBookings">Sort by Total Bookings</option>
                    <option value="lastBooking">Sort by Last Booking</option>
                    <option value="totalSpent">Sort by Total Spent</option>
                  </select>
                  <button
                    onClick={() => setClientSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {clientSortDirection === 'asc' ? '↑' : '↓'}
                  </button>
                </div>
              </div>

              {/* Clients Table */}
              {clientsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading clients...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Client Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Bookings</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Booking</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Spent</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Filter and sort clients
                        let filteredClients = clients.filter(client =>
                          client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                          client.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                          client.phone.includes(clientSearchTerm)
                        );

                        // Sort clients
                        filteredClients.sort((a, b) => {
                          let aValue: any = a[clientSortField];
                          let bValue: any = b[clientSortField];

                          if (clientSortField === 'lastBooking') {
                            aValue = new Date(aValue || 0);
                            bValue = new Date(bValue || 0);
                          }

                          if (typeof aValue === 'string') {
                            aValue = aValue.toLowerCase();
                            bValue = bValue.toLowerCase();
                          }

                          if (clientSortDirection === 'asc') {
                            return aValue > bValue ? 1 : -1;
                          } else {
                            return aValue < bValue ? 1 : -1;
                          }
                        });

                        return filteredClients.map((client) => (
                          <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {client.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{client.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-700">{client.email}</td>
                            <td className="py-4 px-4 text-gray-700">{client.phone}</td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {client.totalBookings}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-700">
                              {client.lastBooking ? new Date(client.lastBooking).toLocaleDateString() : 'Never'}
                            </td>
                            <td className="py-4 px-4 text-gray-700 font-medium">
                              ${client.totalSpent.toFixed(2)}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                client.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleViewClientDetails(client)}
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View Details
                                </button>
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                  Message
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                  
                  {clients.filter(client =>
                    client.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                    client.email.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
                    client.phone.includes(clientSearchTerm)
                  ).length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {clientSearchTerm ? 'No clients found matching your search.' : 'No clients found.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {activeMainTab === 'calendar' && (
            <ModernCalendarLayout />
          )}
          {activeMainTab === 'calendar-sync' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
              <CalendarSync agentId={agentId || ''} />
            </div>
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
                      <img 
                        src={photoPreview || "/default-profile.png"} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shadow"
                        onError={(e) => {
                          console.log('Image failed to load:', photoPreview);
                          e.currentTarget.src = "/default-profile.png";
                        }}
                      />
                      <label className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full cursor-pointer shadow-lg group-hover:scale-110 transition-transform">
                        <CameraIcon className="w-5 h-5 text-white" />
                        <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                      </label>
                    </div>
                                         <div className="text-xl font-bold text-gray-800 mb-1">{profile.fullName || session?.user?.name || "Agent Name"}</div>
                    <div className="text-blue-700 font-semibold text-sm mb-1">{profile.marnOrLpn ? `MARN/LPN: ${profile.marnOrLpn}` : "MARN/LPN: ---"}</div>
                    <div className="text-gray-500 text-xs mb-2">ABN: {profile.abn || "---"}</div>
                    <div className="text-gray-400 text-xs mt-4 mb-4">Member since <span className="font-medium text-blue-700">12 Feb 2020</span></div>
                    {/* Business Logo Upload */}
                    <div className="w-full flex flex-col items-center mt-2">
                      <div className="relative group mb-2">
                        <img 
                          src={logoPreview || "/default-logo.png"} 
                          alt="Business Logo" 
                          className="w-20 h-20 object-contain bg-gray-100 rounded border-2 border-blue-200 shadow"
                          onError={(e) => {
                            console.log('Logo failed to load:', logoPreview);
                            e.currentTarget.src = "/default-logo.png";
                          }}
                        />
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                          disabled
                          title="MARN/LPN cannot be edited"
                        />
                        <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                          disabled
                          title="ABN cannot be edited"
                        />
                        <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Name</label>
                        <input
                          name="businessName"
                          value={profile.businessName}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                          disabled
                          title="Business Name cannot be edited"
                        />
                        <p className="text-xs text-gray-500 mt-1">This field cannot be edited</p>
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
                      <button 
                        type="button" 
                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold bg-white hover:bg-gray-100 transition"
                        disabled={isSaving}
                      >
                        Cancel
                      </button>
                      <Button 
                        type="submit" 
                        className="px-8 py-2 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              {/* Pending Profile Updates Section - Temporarily disabled */}
              {activeTab === 'consultancy' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6 text-green-700">Consultancy Settings</h2>
                  
                  {/* Service Management */}
                  <div className="mb-8">
                    
                    {!servicesLoading && agentId ? (
                      <ServiceManager
                        agentId={agentId}
                        services={services}
                        onServicesChange={handleServicesChange}
                      />
                    ) : (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading services...</span>
                      </div>
                    )}
                    

                  </div>

                  {/* Terms & Conditions Agreement */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Terms & Conditions Agreement</h3>
                      <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                      <span className="text-gray-600">{agreementUploaded ? "Agreement uploaded" : "Agreement not uploaded"}</span>
                        <Button size="sm" className="ml-auto" onClick={handleAgreementUpload}>Upload agreement</Button>
                      </div>
                    </div>
                </div>
              )}
              {activeTab === 'notification' && (
                <div className="max-w-2xl mx-auto text-gray-500 text-center py-20">Notification settings coming soon...</div>
              )}
            </div>
          )}
          {activeMainTab === 'documents' && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Documents</h2>
                  <p className="text-gray-600 text-lg mt-2">Manage your uploaded documents and files</p>
                </div>
              </div>

              {documentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading documents...</span>
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Documents Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't uploaded any documents yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {documents.map((document, index) => (
                    <div key={document.id || index} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                          {document.type || 'Document'}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {document.type === 'photo' ? 'Profile Photo' :
                             document.type === 'businessLogo' ? 'Business Logo' :
                             document.type === 'agreement' ? 'Terms & Conditions' :
                             document.type || 'Document'}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {document.type === 'photo' ? 'Your profile picture' :
                             document.type === 'businessLogo' ? 'Your business logo' :
                             document.type === 'agreement' ? 'Terms and conditions agreement' :
                             'Uploaded document'}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-500">
                              {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'Recently uploaded'}
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            <a
                              href={document.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                              title="View document"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </a>
                            <button
                              onClick={() => window.open(document.url, '_blank')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                              title="Download document"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

          {/* Client Details Modal */}
          <ClientDetailsModal
            client={selectedClient}
            isOpen={isClientModalOpen}
            onClose={handleCloseClientModal}
          />
        </main>
      </div>
    </div>
  );
} 