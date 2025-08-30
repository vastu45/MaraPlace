"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Users, 
  UserCheck, 
  Shield, 
  Ban, 
  Settings, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Search,
  Grid3X3,
  Bell,
  Mail,
  User,
  DollarSign
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

function AdminSidebar() {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">MaraPlace</h1>
      </div>
      
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">MAIN MENU</h2>
        
        {/* Dashboard Section */}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('dashboard')}
            className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Dashboard</span>
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Hot</span>
            </div>
            {expandedSections.dashboard ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {expandedSections.dashboard && (
            <div className="ml-6 mt-2 space-y-1">
              <Link href="/admin" className="flex items-center gap-3 p-2 text-blue-600 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Admin Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Users */}
        <div className="mb-4">
          <Link href="/admin/users" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <Users className="w-4 h-4" />
            <span className="font-medium">Users</span>
          </Link>
        </div>

        {/* Agents */}
        <div className="mb-4">
          <Link href="/admin/agents" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <UserCheck className="w-4 h-4" />
            <span className="font-medium">Agents</span>
          </Link>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <Link href="/admin/categories" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <FileText className="w-4 h-4" />
            <span className="font-medium">Categories</span>
          </Link>
        </div>

        {/* Payments */}
        <div className="mb-4">
          <Link href="/admin/payments" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">Payments</span>
          </Link>
        </div>

        {/* Disputes */}
        <div className="mb-4">
          <Link href="/admin/disputes" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">Disputes</span>
          </Link>
        </div>

        {/* Theme */}
        <div className="mb-4">
          <Link href="/admin/theme" className="flex items-center gap-3 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
            <Settings className="w-4 h-4" />
            <span className="font-medium">Theme</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search in HRMS"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
              CTRL + /
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Grid3X3 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Mail className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <User className="w-5 h-5" />
          </button>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
