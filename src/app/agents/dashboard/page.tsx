"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BellIcon, DocumentIcon, QuestionMarkCircleIcon, CalendarIcon, UsersIcon, ChartBarIcon, Cog6ToothIcon, CreditCardIcon, ClipboardDocumentListIcon, HomeIcon, FolderIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CameraIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
  { label: "Consultations", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
  { label: "Agreements", icon: <DocumentIcon className="w-5 h-5" /> },
  { label: "Clients", icon: <UsersIcon className="w-5 h-5" /> },
  { label: "Calendar", icon: <CalendarIcon className="w-5 h-5" /> },
  { label: "Financials", icon: <CreditCardIcon className="w-5 h-5" /> },
  { label: "Manage", icon: <ChartBarIcon className="w-5 h-5" /> },
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
  // Placeholder stats
  const stats = [
    { label: "Revenue (lifetime)", value: "$0.00", color: "text-green-700" },
    { label: "Total consultations", value: 0, color: "text-blue-600" },
    { label: "Total cases", value: 0, color: "text-purple-600" },
    { label: "Total clients", value: 0, color: "text-green-600" },
    { label: "New ratings", value: 0, color: "text-pink-600" },
  ];

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
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'consultations' | 'settings'>('dashboard');
  // Add state for consultations filter
  const [consultationFilter, setConsultationFilter] = useState<'all' | 'upcoming' | 'closed' | 'overdue' | 'settings'>('all');
  // Type for consultations
  type Consultation = {
    id: number;
    clientName: string;
    clientType: string;
    schedule: string;
    fee: string;
    status: string;
    outcome: string;
  };
  // Mock consultations data
  const consultations: Consultation[] = [
    { id: 1, clientName: 'John Doe', clientType: 'Individual', schedule: '2024-07-15 10:00', fee: '$200', status: 'Upcoming', outcome: '-', },
    { id: 2, clientName: 'Jane Smith', clientType: 'Business', schedule: '2024-07-10 14:00', fee: '$350', status: 'Closed', outcome: 'Completed', },
    { id: 3, clientName: 'Bob Lee', clientType: 'Individual', schedule: '2024-07-20 09:00', fee: '$150', status: 'Overdue', outcome: '-', },
    { id: 4, clientName: 'Alice Brown', clientType: 'Individual', schedule: '2024-07-18 11:00', fee: '$250', status: 'Upcoming', outcome: '-', },
  ];

  // Filter consultations based on selected tab
  const filteredConsultations = consultations.filter(row => {
    if (consultationFilter === 'all') return true;
    if (consultationFilter === 'upcoming') return row.status === 'Upcoming';
    if (consultationFilter === 'closed') return row.status === 'Closed';
    if (consultationFilter === 'overdue') return row.status === 'Overdue';
    return true;
  });

  // Message modal placeholder
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);

  const openMessageModal = (consultation: Consultation) => {
    setActiveConsultation(consultation);
    setShowMessageModal(true);
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
        setProfile(prev => ({
          ...prev,
          fullName: user.name || "",
          marnOrLpn: agent.maraNumber || "",
          mobile: user.phone || "",
          email: user.email || "",
          abn: agent.abn || "",
          businessName: agent.businessName || "",
          businessEmail: agent.businessEmail || "",
          languages: (agent.languages || []).join(", "),
          areasOfPractice: (agent.specializations || []).join(", "),
          industries: (agent.industries || []).join(", "),
          officeAddress: agent.businessAddress || "",
          aboutCompany: agent.bio || "",
          // Add more fields as needed
        }));
        // Set logo and photo previews if available
        const logoDoc = agent.documents?.find((d: any) => d.type === "businessLogo");
        if (logoDoc) setLogoPreview(logoDoc.url);
        const photoDoc = agent.documents?.find((d: any) => d.type === "photo");
        if (photoDoc) setPhotoPreview(photoDoc.url);
      }
    }
    fetchProfile();
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
      if ((typeof File !== 'undefined' && value instanceof File) || typeof value === 'string') {
        formData.append(key, value);
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
          marnOrLpn: agent.maraNumber || "",
          mobile: user.phone || "",
          email: user.email || "",
          abn: agent.abn || "",
          businessName: agent.businessName || "",
          businessEmail: agent.businessEmail || "",
          languages: (agent.languages || []).join(", "),
          areasOfPractice: (agent.specializations || []).join(", "),
          industries: profile.industries, // not in db, keep local
          officeAddress: agent.businessAddress || "",
          aboutCompany: agent.bio || "",
        }));
        // Set logo and photo previews if available
        const logoDoc = agent.documents?.find((d: any) => d.type === "businessLogo");
        if (logoDoc) setLogoPreview(logoDoc.url);
        const photoDoc = agent.documents?.find((d: any) => d.type === "photo");
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
      <Navbar />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 text-gray-800 py-8 px-4 h-full min-h-0">
          <div className="mb-8 flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 w-full">
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-green-100 p-2"><HomeIcon className="w-7 h-7 text-green-700" /></span>
                <div>
                  <div className="font-bold text-lg leading-tight">MaraPlace</div>
                  <div className="text-xs text-gray-400">Agent dashboard</div>
                </div>
              </span>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <button onClick={() => setActiveMainTab('dashboard')} className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium ${activeMainTab === 'dashboard' ? 'bg-green-50 text-green-700' : 'hover:bg-green-50 text-gray-700'}`}>Dashboard</button>
            <button onClick={() => setActiveMainTab('consultations')} className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium ${activeMainTab === 'consultations' ? 'bg-green-50 text-green-700' : 'hover:bg-green-50 text-gray-700'}`}>Consultations</button>
            <button onClick={() => setActiveMainTab('settings')} className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium ${activeMainTab === 'settings' ? 'bg-green-50 text-green-700' : 'hover:bg-green-50 text-gray-700'}`}>Settings</button>
            {sidebarLinks.map(link => {
              if (link.submenu) {
                const isOpen = openSubMenu === link.label;
                return (
                  <div key={link.label}>
                    <button
                      type="button"
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full font-medium text-gray-700 ${isOpen ? 'bg-gray-100' : 'hover:bg-green-50 transition'}`}
                      onClick={() => setOpenSubMenu(isOpen ? null : link.label)}
                    >
                      {link.icon} <span>{link.label}</span>
                    </button>
                    {isOpen && (
                      <div className="ml-7 border-l border-gray-200 pl-3 py-1 space-y-1">
                        {link.submenu.map((sublink) => {
                          const isActive = activeSubMenu === sublink.label;
                          return (
                            <button
                              key={sublink.label}
                              className={`flex items-center gap-2 py-1 w-full text-left rounded ${isActive ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:text-green-700'}`}
                              onClick={() => {
                                setActiveSubMenu(sublink.label);
                                if (sublink.label === 'Edit Profile') setShowEditProfile(true);
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
                <a key={link.label} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 transition font-medium text-gray-700">
                  {link.icon} <span>{link.label}</span>
                </a>
              );
            })}
          </nav>
          <div className="my-4 border-t border-gray-200" />
          <nav className="space-y-1 mb-4">
            {secondaryLinks.filter(link => link.label !== "Notification").map(link => (
              <a key={link.label} href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 transition font-medium text-gray-700 relative">
                {link.icon} <span>{link.label}</span>
              </a>
            ))}
          </nav>
          <div className="mt-auto flex flex-col items-center pt-8">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-14 h-14 rounded-full border-2 border-green-600 shadow mb-2" />
            <div className="font-semibold">Agent Name</div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
          {activeMainTab === 'dashboard' && (
            <>
              {/* Top bar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="text-2xl font-bold text-gray-800">Dashboard</div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-600">Wallet: <span className="font-semibold text-green-700">A$0</span></span>
                  <Button variant="outline" className="border-green-600 text-green-700">Release funds</Button>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">Testing</span>
                  <span className="relative">
                    <BellIcon className="w-6 h-6 text-gray-500" />
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">5</span>
                  </span>
                  <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">👤</span>
                </div>
              </div>
              {/* Profile completion alert */}
              <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-4 rounded-lg mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span>Please provide the missing information to complete your profile. <span className="underline cursor-pointer">Missing information: MARN or LPN, ABN, About company, office ...</span></span>
                </div>
                <button className="ml-4 text-yellow-900 font-bold">&gt;&gt;</button>
              </div>
              {/* Stats cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-gray-500 text-sm mt-1 text-center">{stat.label}</div>
                  </div>
                ))}
              </div>
              {/* Placeholder charts/analytics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
                  <div className="font-semibold mb-2">Consultations (lifetime)</div>
                  <div className="flex-1 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
                </div>
                <div className="bg-white rounded-xl shadow p-6 min-h-[220px] flex flex-col">
                  <div className="font-semibold mb-2">Cases (lifetime)</div>
                  <div className="flex-1 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
                </div>
              </div>
            </>
          )}
          {activeMainTab === 'consultations' && (
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full">
              <h1 className="text-2xl font-bold mb-6 text-green-700">Consultations</h1>
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6">
                {['all', 'upcoming', 'closed', 'overdue', 'settings'].map(tab => (
                  <button
                    key={tab}
                    className={`px-5 py-2 rounded-lg font-semibold ${consultationFilter === tab ? 'bg-purple-700 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setConsultationFilter(tab as any)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-xl shadow">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 text-sm">
                      <th className="p-3 text-left font-semibold">Client name</th>
                      <th className="p-3 text-left font-semibold">Client type</th>
                      <th className="p-3 text-left font-semibold">Booking schedule</th>
                      <th className="p-3 text-left font-semibold">Fee paid</th>
                      <th className="p-3 text-left font-semibold">Booking status</th>
                      <th className="p-3 text-left font-semibold">Outcome</th>
                      <th className="p-3 text-center font-semibold">Message</th>
                      <th className="p-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredConsultations.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-gray-400 py-10">No data available in table</td>
                      </tr>
                    ) : (
                      filteredConsultations.map(row => (
                        <tr key={row.id} className="border-t hover:bg-gray-50 transition">
                          <td className="p-3">{row.clientName}</td>
                          <td className="p-3">{row.clientType}</td>
                          <td className="p-3">{row.schedule}</td>
                          <td className="p-3">{row.fee}</td>
                          <td className="p-3">{row.status}</td>
                          <td className="p-3">{row.outcome}</td>
                          <td className="p-3 text-center">
                            <button className="text-green-700 hover:text-green-900" title="Message client" onClick={() => openMessageModal(row)}>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 15.75h6.75m-6.75-3h6.75m-6.75-3h4.125M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4.286-.98L3 20.25l1.23-3.075C3.454 15.57 3 14.317 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </button>
                          </td>
                          <td className="p-3 text-center">
                            <select className="border rounded px-2 py-1">
                              <option>Actions</option>
                              <option>Mark as complete</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeMainTab === 'settings' && (
            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
              {/* Tab Navigation */}
              <div className="flex gap-2 mb-8 border-b">
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'account' ? 'bg-purple-700 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('account')}
                >
                  Account settings
                </button>
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'consultancy' ? 'bg-purple-700 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
                  onClick={() => setActiveTab('consultancy')}
                >
                  Consultancy settings
                </button>
                <button
                  className={`px-6 py-2 font-semibold rounded-t-lg focus:outline-none ${activeTab === 'notification' ? 'bg-purple-700 text-white' : 'bg-transparent text-gray-700 hover:bg-gray-100'}`}
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
                      <img src={photoPreview || "/default-profile.png"} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-green-100 shadow" />
                      <label className="absolute bottom-2 right-2 bg-green-600 p-2 rounded-full cursor-pointer shadow-lg group-hover:scale-110 transition-transform">
                        <CameraIcon className="w-5 h-5 text-white" />
                        <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="hidden" />
                      </label>
                    </div>
                    <div className="text-xl font-bold text-gray-800 mb-1">{profile.fullName || "Agent Name"}</div>
                    <div className="text-green-700 font-semibold text-sm mb-1">{profile.marnOrLpn ? `MARN/LPN: ${profile.marnOrLpn}` : "MARN/LPN: ---"}</div>
                    <div className="text-gray-500 text-xs mb-2">ABN: {profile.abn || "---"}</div>
                    <div className="text-gray-400 text-xs mt-4 mb-4">Member since <span className="font-medium text-green-700">12 Feb 2020</span></div>
                    {/* Business Logo Upload */}
                    <div className="w-full flex flex-col items-center mt-2">
                      <div className="relative group mb-2">
                        <img src={logoPreview || "/default-logo.png"} alt="Business Logo" className="w-20 h-20 object-contain bg-gray-100 rounded border-2 border-green-200 shadow" />
                        <label className="absolute bottom-2 right-2 bg-green-600 p-2 rounded-full cursor-pointer shadow-lg group-hover:scale-110 transition-transform">
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">MARN or LPN</label>
                        <input
                          name="marnOrLpn"
                          value={profile.marnOrLpn}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Mobile</label>
                        <input
                          name="mobile"
                          value={profile.mobile}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
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
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Name</label>
                        <input
                          name="businessName"
                          value={profile.businessName}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Business Email</label>
                        <input
                          name="businessEmail"
                          value={profile.businessEmail}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          type="email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Languages</label>
                        <input
                          name="languages"
                          value={profile.languages}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          placeholder="e.g. English, Hindi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Areas of Practice</label>
                        <input
                          name="areasOfPractice"
                          value={profile.areasOfPractice}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          placeholder="e.g. Student Visa, Work Visa"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Industries</label>
                        <input
                          name="industries"
                          value={profile.industries}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          placeholder="e.g. Education, Health"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Office Address</label>
                        <input
                          name="officeAddress"
                          value={profile.officeAddress}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">About Company</label>
                        <textarea
                          name="aboutCompany"
                          value={profile.aboutCompany}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                      <button type="button" className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold bg-white hover:bg-gray-100 transition">Cancel</button>
                      <Button type="submit" className="px-8 py-2 text-lg rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow">Save Changes</Button>
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
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                        type="number"
                        min="0"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Time per session</label>
                      <div className="bg-gray-50 border rounded px-3 py-2">30 Minutes</div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Availability</label>
                      <div className="space-y-2">
                        {availability.map((day, idx) => (
                          <div key={day.day} className="flex items-center gap-2">
                            <span className="w-16 font-medium">{day.day}</span>
                            <input type="time" value={day.start} onChange={e => updateAvailability(idx, 'start', e.target.value)} className="border rounded px-2 py-1" disabled={day.unavailable} />
                            <span>-</span>
                            <input type="time" value={day.end} onChange={e => updateAvailability(idx, 'end', e.target.value)} className="border rounded px-2 py-1" disabled={day.unavailable} />
                            <label className="ml-2 text-xs"><input type="checkbox" checked={day.unavailable} onChange={e => updateAvailability(idx, 'unavailable', e.target.checked)} /> Unavailable</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Calendar setting</label>
                      <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                        <span className="inline-block"><img src="/google-calendar.svg" alt="Google Calendar" className="w-6 h-6" /></span>
                        <span>Google Calendar</span>
                        <Button size="sm" className="ml-auto">Connect</Button>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-1">Consultancy Terms & Conditions Agreement</label>
                      <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                        <span>{agreementUploaded ? "Agreement uploaded" : "Agreement not uploaded"}</span>
                        <Button size="sm" className="ml-auto" onClick={handleAgreementUpload}>Upload agreement</Button>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                      <Button type="submit" className="px-8 py-2 text-lg rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold shadow">Save Changes</Button>
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
        </main>
      </div>
      <Footer />
    </div>
  );
} 