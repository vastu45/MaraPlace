"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer } from "@/components/Toast";

interface ProfileUpdate {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  updatedFields: any;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  agent: {
    id: string;
    user: {
      name: string;
      email: string;
      phone: string;
    };
  };
}

export default function ProfileUpdatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileUpdates, setProfileUpdates] = useState<ProfileUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUpdate, setProcessingUpdate] = useState<string | null>(null);
  const [selectedUpdate, setSelectedUpdate] = useState<ProfileUpdate | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Check if user is admin
  useEffect(() => {
    if (status === "loading") return;
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const fetchProfileUpdates = async () => {
    try {
      const response = await fetch('/api/admin/profile-updates');
      if (response.ok) {
        const data = await response.json();
        setProfileUpdates(data.profileUpdates || []);
      } else {
        console.error('Failed to fetch profile updates');
        addToast('Failed to fetch profile updates', 'error');
      }
    } catch (error) {
      console.error('Error fetching profile updates:', error);
      addToast('Error fetching profile updates', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((session?.user as any)?.role === 'ADMIN') {
      fetchProfileUpdates();
    }
  }, [session]);

  const handleApprove = async (updateId: string) => {
    setProcessingUpdate(updateId);
    try {
      const response = await fetch(`/api/admin/profile-updates/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          notes: adminNotes
        }),
      });

      if (response.ok) {
        addToast('Profile update approved successfully');
        setShowModal(false);
        setSelectedUpdate(null);
        setAdminNotes("");
        fetchProfileUpdates(); // Refresh the list
      } else {
        const error = await response.json();
        addToast(error.error || 'Failed to approve update', 'error');
      }
    } catch (error) {
      console.error('Error approving update:', error);
      addToast('Error approving update', 'error');
    } finally {
      setProcessingUpdate(null);
    }
  };

  const handleReject = async (updateId: string) => {
    setProcessingUpdate(updateId);
    try {
      const response = await fetch(`/api/admin/profile-updates/${updateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          notes: adminNotes
        }),
      });

      if (response.ok) {
        addToast('Profile update rejected successfully');
        setShowModal(false);
        setSelectedUpdate(null);
        setAdminNotes("");
        fetchProfileUpdates(); // Refresh the list
      } else {
        const error = await response.json();
        addToast(error.error || 'Failed to reject update', 'error');
      }
    } catch (error) {
      console.error('Error rejecting update:', error);
      addToast('Error rejecting update', 'error');
    } finally {
      setProcessingUpdate(null);
    }
  };

  const openModal = (update: ProfileUpdate) => {
    setSelectedUpdate(update);
    setAdminNotes(update.adminNotes || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUpdate(null);
    setAdminNotes("");
  };

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return <div className="flex items-center justify-center min-h-screen">Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Updates</h1>
              <p className="text-gray-600 mt-1">Review and approve agent profile changes</p>
            </div>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading profile updates...</span>
          </div>
        ) : profileUpdates.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Pending Updates</h3>
            <p className="text-gray-500">All profile updates have been reviewed.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {profileUpdates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {update.agent.user.name} - Profile Update
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {update.agent.user.email} • {update.agent.user.phone}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                      Pending Review
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Updated Fields:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(update.updatedFields).map(([field, value]) => (
                          <div key={field} className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-gray-700 capitalize">
                              {field.replace(/([A-Z])/g, ' $1').trim()}:
                            </div>
                            <div className="text-sm text-gray-900 mt-1">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-500">
                        Submitted: {new Date(update.createdAt).toLocaleDateString()} at {new Date(update.createdAt).toLocaleTimeString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openModal(update)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Review Update
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Review Profile Update
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Agent Information:</h3>
                  <p className="text-gray-600">
                    <strong>Name:</strong> {selectedUpdate.agent.user.name}<br />
                    <strong>Email:</strong> {selectedUpdate.agent.user.email}<br />
                    <strong>Phone:</strong> {selectedUpdate.agent.user.phone}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Changes Requested:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedUpdate.updatedFields).map(([field, value]) => (
                      <div key={field} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}:
                        </div>
                        <div className="text-sm text-gray-900 mt-1">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes (Optional):
                  </label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add any notes about this update..."
                    rows={3}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleApprove(selectedUpdate.id)}
                    disabled={processingUpdate === selectedUpdate.id}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    {processingUpdate === selectedUpdate.id ? 'Approving...' : 'Approve Update'}
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedUpdate.id)}
                    disabled={processingUpdate === selectedUpdate.id}
                    className="bg-red-600 hover:bg-red-700 flex-1"
                  >
                    {processingUpdate === selectedUpdate.id ? 'Rejecting...' : 'Reject Update'}
                  </Button>
                  <Button
                    onClick={closeModal}
                    variant="outline"
                    disabled={processingUpdate === selectedUpdate.id}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
