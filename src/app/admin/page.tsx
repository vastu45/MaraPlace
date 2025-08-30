"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  UserCheck, 
  Shield, 
  Ban, 
  Settings, 
  BarChart3, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  ChevronUp,
  ChevronDown,
  Search,
  Grid3X3,
  Bell,
  Mail,
  User,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  TrendingUp,
  Building,
  Briefcase,
  Target,
  Award,
  UserPlus,
  Eye,
  Plus
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalAgents: number;
  totalLawyers: number;
  totalCounsellors: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingAgents: number;
  suspendedUsers: number;
  pendingVerifications: number;
  pendingProfileUpdates: number;
}

function AdminNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace Admin</span>
        <div className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Link href="/admin" className="hover:text-green-600 font-medium">Dashboard</Link>
          <Link href="/admin/users" className="hover:text-green-600">Users</Link>
          <Link href="/admin/agents" className="hover:text-green-600">Agents</Link>
          <Link href="/admin/profile-updates" className="hover:text-green-600">Profile Updates</Link>
          <Link href="/admin/verifications" className="hover:text-green-600">Verifications</Link>
          <Link href="/admin/categories" className="hover:text-green-600">Categories</Link>
          <Link href="/admin/payments" className="hover:text-green-600">Payments</Link>
          <Link href="/admin/disputes" className="hover:text-green-600">Disputes</Link>
          <Link href="/admin/theme" className="hover:text-green-600">Theme</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Welcome, {session?.user?.name || 'Admin'}
        </span>
        <Button 
          variant="outline" 
          asChild
        >
          <Link href="/">Back to Site</Link>
        </Button>
      </div>
    </nav>
  );
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

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAgents: 0,
    totalLawyers: 0,
    totalCounsellors: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingAgents: 0,
    suspendedUsers: 0,
    pendingVerifications: 0,
    pendingProfileUpdates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (status === "loading") return;
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [session, status, router]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null; // Will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Dashboard / Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                2025
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <ArrowUp className="w-4 h-4" />
              </Button>
            </div>
        </div>

          {/* Welcome Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Adrian"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">Welcome Back, Adrian</h2>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-gray-600">
                      You have <strong>{stats.pendingAgents}</strong> Pending Approvals & <strong>{stats.pendingProfileUpdates}</strong> Leave Requests
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Project
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Requests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">12.5%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalUsers.toLocaleString()}</p>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700">View All Users</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">8.3%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Agents</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.totalAgents.toLocaleString()}</p>
                <Link href="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">View All Agents</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">15.2%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Lawyers</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{(stats.totalLawyers || 0).toLocaleString()}</p>
                <Link href="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">View All Lawyers</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">6.7%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Counsellors</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{(stats.totalCounsellors || 0).toLocaleString()}</p>
                <Link href="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">View All Counsellors</Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">18.5%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">${(stats.totalRevenue || 0).toLocaleString()}</p>
                <Link href="/admin/payments" className="text-sm text-blue-600 hover:text-blue-700">View Revenue Details</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <ArrowUp className="w-4 h-4" />
                    <span className="text-sm font-medium">10.2%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">${(stats.monthlyRevenue || 0).toLocaleString()}</p>
                <Link href="/admin/payments" className="text-sm text-blue-600 hover:text-blue-700">View Monthly Report</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Pending</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Pending Approvals</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.pendingAgents}</p>
                <Link href="/admin/agents" className="text-sm text-blue-600 hover:text-blue-700">Review Pending</Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Ban className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <ArrowDown className="w-4 h-4" />
                    <span className="text-sm font-medium">Suspended</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Suspended Users</h3>
                <p className="text-2xl font-bold text-gray-900 mb-2">{stats.suspendedUsers}</p>
                <Link href="/admin/users" className="text-sm text-blue-600 hover:text-blue-700">Manage Users</Link>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agents By Category Chart */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Agents By Category</CardTitle>
                <Button variant="outline" size="sm">This Month</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Lawyers', count: stats.totalLawyers || 0, color: 'bg-purple-500' },
                    { name: 'Migration Agents', count: (stats.totalAgents || 0) - (stats.totalLawyers || 0), color: 'bg-green-500' },
                    { name: 'Counsellors', count: stats.totalCounsellors || 0, color: 'bg-orange-500' },
                    { name: 'Consultants', count: Math.max(0, (stats.totalAgents || 0) - (stats.totalLawyers || 0) - (stats.totalCounsellors || 0)), color: 'bg-blue-500' }
                  ].map((category, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700 w-24">{category.name}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${category.color} h-3 rounded-full`}
                          style={{ width: `${(stats.totalAgents || 0) > 0 ? (category.count / (stats.totalAgents || 1)) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">{category.count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Total agents increased by <strong>+{Math.round(((stats.totalAgents || 0) / Math.max(1, (stats.totalAgents || 0) - 10)) * 100 - 100)}%</strong> from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Overview Chart */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Revenue Overview</CardTitle>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-900">${(stats.totalRevenue || 0).toLocaleString()}</span>
                  <Button variant="outline" size="sm">This Month</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-20">Total Revenue</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16">${(stats.totalRevenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-20">Monthly</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                                              <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(stats.totalRevenue || 0) > 0 ? ((stats.monthlyRevenue || 0) / (stats.totalRevenue || 1)) * 100 : 0}%` }}></div>
                    </div>
                                          <span className="text-sm font-medium text-gray-900 w-16">${(stats.monthlyRevenue || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700 w-20">Growth</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16">+18.5%</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Revenue increased by <strong>+18.5%</strong> from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 