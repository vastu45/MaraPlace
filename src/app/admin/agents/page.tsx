"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import ServiceManager from "@/components/ServiceManager";

interface Document {
  id: string;
  type: string;
  url: string;
  name: string;
}

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Agent {
  id: string;
  name: string;
  businessName?: string;
  email?: string;
  phone?: string;
  businessAddress?: string;
  abn?: string;
  maraNumber?: string;
  documents?: Document[];
  services?: Service[];
  status: string;
  suspendReason?: string;
  calendlyUrl?: string;
}

const statusOptions = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
];



export default function AdminAgents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [agentServices, setAgentServices] = useState<Record<string, Service[]>>({});
  const [showServices, setShowServices] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is admin
    if (status === "loading") return;
    
    if (!session || (session.user as any)?.role !== "ADMIN") {
      router.push("/login");
      return;
    }

    // Only fetch data if we have a valid admin session
    if (session && (session.user as any)?.role === "ADMIN") {
      setLoading(true);
      fetch(`/api/admin/agents?limit=100${statusFilter ? `&status=${statusFilter}` : ""}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          setAgents(data.agents || []);
          
          // Initialize services for each agent
          const servicesMap: Record<string, Service[]> = {};
          data.agents?.forEach((agent: Agent) => {
            if (agent.services) {
              servicesMap[agent.id] = agent.services;
            }
          });
          setAgentServices(servicesMap);
          
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load agents:", error);
          setError("Failed to load agents");
          setLoading(false);
        });
    }
  }, [session, status, router, statusFilter]);

  // State for modal dialogs
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string; action: string; currentUrl?: string } | null>(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [calendlyUrl, setCalendlyUrl] = useState("");

  async function updateStatus(id: string, status: string) {
    if (status === "SUSPENDED") {
      setPendingAction({ id, action: "suspend" });
      setShowSuspendModal(true);
        return;
      }
    
    // For non-suspend actions, proceed directly
    await performStatusUpdate(id, status);
    }

  async function performStatusUpdate(id: string, status: string, reason?: string) {
    setActionLoading(id + status);
    const res = await fetch(`/api/admin/agents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, suspendReason: reason }),
    });
    if (res.ok) {
      setAgents(agents => agents.map(a => a.id === id ? { ...a, status, suspendReason: status === "SUSPENDED" ? reason : undefined } : a));
    } else {
      alert("Failed to update status");
    }
    setActionLoading(null);
  }

  async function updateCalendlyUrl(id: string, currentUrl: string) {
    setPendingAction({ id, action: "calendly", currentUrl });
    setCalendlyUrl(currentUrl || "");
    setShowCalendlyModal(true);
  }

  async function performCalendlyUpdate(id: string, url: string) {
    setActionLoading(id + "CALENDLY");
    const res = await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendlyUrl: url }),
    });
    if (res.ok) {
      setAgents(agents => agents.map(a => a.id === id ? { ...a, calendlyUrl: url } : a));
    } else {
      alert("Failed to update Calendly link");
    }
    setActionLoading(null);
  }

  const handleSuspendConfirm = async () => {
    if (!pendingAction || !suspendReason.trim()) {
      alert("Suspension reason is required.");
      return;
    }
    
    await performStatusUpdate(pendingAction.id, "SUSPENDED", suspendReason.trim());
    setShowSuspendModal(false);
    setPendingAction(null);
    setSuspendReason("");
  };

  const handleCalendlyConfirm = async () => {
    if (!pendingAction) return;
    
    await performCalendlyUpdate(pendingAction.id, calendlyUrl);
    setShowCalendlyModal(false);
    setPendingAction(null);
    setCalendlyUrl("");
  };

  function startEdit(agent: Agent) {
    setEditingId(agent.id);
    setEditForm({ ...agent });
    setExpanded(String(agent.id ?? '')); // Ensure the row is expanded for editing
  }
  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  const fetchAgentServices = async (agentId: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/services`);
      if (response.ok) {
        const data = await response.json();
        setAgentServices(prev => ({
          ...prev,
          [agentId]: data.services || []
        }));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServicesChange = async (agentId: string, services: Service[]) => {
    try {
      // Update local state immediately for better UX
      setAgentServices(prev => ({
        ...prev,
        [agentId]: services
      }));

      // Send updates to server
      const response = await fetch(`/api/agents/${agentId}/services`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services }),
      });

      if (!response.ok) {
        throw new Error('Failed to update services');
      }

      const data = await response.json();
      // Update with server response to get proper IDs
      setAgentServices(prev => ({
        ...prev,
        [agentId]: data.services || services
      }));
    } catch (error) {
      console.error('Error updating services:', error);
      alert('Failed to update services. Please try again.');
    }
  };

  const toggleServices = (agentId: string) => {
    if (showServices === agentId) {
      setShowServices(null);
    } else {
      setShowServices(agentId);
      // Fetch services if not already loaded
      if (!agentServices[agentId]) {
        fetchAgentServices(agentId);
      }
    }
  };
  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm((f: any) => ({ ...f, [name]: value }));
  }
  async function saveEdit(id: string | undefined) {
    setActionLoading(String(id ?? '') + "EDIT");
    // Only send editable fields
    const updateFields = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      businessName: editForm.businessName,
      businessAddress: editForm.businessAddress,
      maraNumber: editForm.maraNumber,
      bio: editForm.bio,
      calendlyUrl: editForm.calendlyUrl,
    };
    const res = await fetch(`/api/agents/${String(id ?? '')}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateFields),
    });
    if (res.ok) {
      setAgents(agents => agents.map(a => String(a.id ?? '') === String(id ?? '') ? { ...a, ...updateFields } : a));
      setEditingId(null);
      setEditForm({});
    } else {
      alert("Failed to update agent");
    }
    setActionLoading(null);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null; // Will redirect to login
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Agent Management</h1>
        <div className="mb-4 flex gap-2 items-center">
          <span className="font-medium">Filter by status:</span>
          {statusOptions.map(opt => (
            <Button
              key={opt.value}
              size="sm"
              variant={statusFilter === opt.value ? "default" : "outline"}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <table className="w-full border rounded shadow text-sm mb-8">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Business</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <>
                <tr key={agent.id} className="border-t">
                  <td className="p-2 cursor-pointer underline" onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}>{agent.name}</td>
                  <td className="p-2">{agent.businessName}</td>
                  <td className="p-2">{agent.email}</td>
                  <td className="p-2">{agent.status}</td>
                  <td className="p-2 flex gap-2">
                    {agent.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          disabled={actionLoading === agent.id + "APPROVED"}
                          onClick={() => updateStatus(agent.id, "APPROVED")}
                        >
                          {actionLoading === agent.id + "APPROVED" ? "Approving..." : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoading === agent.id + "REJECTED"}
                          onClick={() => updateStatus(agent.id, "REJECTED")}
                        >
                          {actionLoading === agent.id + "REJECTED" ? "Rejecting..." : "Reject"}
                        </Button>
                      </>
                    )}
                    {agent.status === "APPROVED" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoading === agent.id + "SUSPENDED"}
                        onClick={() => updateStatus(agent.id, "SUSPENDED")}
                      >
                        {actionLoading === agent.id + "SUSPENDED" ? "Suspending..." : "Suspend"}
                      </Button>
                    )}
                    {agent.status === "SUSPENDED" && (
                      <Button
                        size="sm"
                        variant="default"
                        disabled={actionLoading === agent.id + "APPROVED"}
                        onClick={() => updateStatus(agent.id, "APPROVED")}
                      >
                        {actionLoading === agent.id + "APPROVED" ? "Restoring..." : "Restore"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEdit(agent)}
                      disabled={editingId === agent.id}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleServices(agent.id)}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {showServices === agent.id ? "Hide Services" : "Manage Services"}
                    </Button>
                  </td>
                </tr>
                {expanded === agent.id && (
                  <tr>
                    <td colSpan={5} className="bg-gray-50 dark:bg-gray-900 p-4">
                      {editingId === agent.id ? (
                        <form
                          className="space-y-4"
                          onSubmit={e => { e.preventDefault(); saveEdit(String(agent.id ?? '')); }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block font-medium mb-1">Full Name</label>
                              <input
                                type="text"
                                name="name"
                                value={editForm.name || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">Email</label>
                              <input
                                type="email"
                                name="email"
                                value={editForm.email || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">Phone</label>
                              <input
                                type="text"
                                name="phone"
                                value={editForm.phone || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">Business Name</label>
                              <input
                                type="text"
                                name="businessName"
                                value={editForm.businessName || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">Business Address</label>
                              <input
                                type="text"
                                name="businessAddress"
                                value={editForm.businessAddress || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">ABN</label>
                              <input
                                type="text"
                                name="abn"
                                value={editForm.abn || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">MARA/Lawyer Number</label>
                              <input
                                type="text"
                                name="maraNumber"
                                value={editForm.maraNumber || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                              <label className="block font-medium mb-1 mt-2">Calendly Link</label>
                              <input
                                type="url"
                                name="calendlyUrl"
                                value={editForm.calendlyUrl || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2"
                              />
                            </div>
                            <div>
                              <label className="block font-medium mb-1">Bio</label>
                              <textarea
                                name="bio"
                                value={editForm.bio || ''}
                                onChange={handleEditChange}
                                className="w-full border rounded px-3 py-2 min-h-[120px]"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button type="submit" size="sm" disabled={actionLoading === (String(agent.id ?? '') + 'EDIT')}>
                              {actionLoading === (String(agent.id ?? '') + 'EDIT') ? 'Saving...' : 'Save'}
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div><b>Full Name:</b> {agent.name}</div>
                            <div><b>Email:</b> {agent.email}</div>
                            <div><b>Phone:</b> {agent.phone}</div>
                            <div><b>Business Name:</b> {agent.businessName}</div>
                            <div><b>Business Address:</b> {agent.businessAddress}</div>
                            <div><b>ABN:</b> {agent.abn}</div>
                            <div><b>MARA/Lawyer Number:</b> {agent.maraNumber}</div>
                            <div><b>Status:</b> {agent.status}</div>
                            {agent.suspendReason && (
                              <div className="text-red-600"><b>Suspend Reason:</b> {agent.suspendReason}</div>
                            )}
                            {agent.calendlyUrl && (
                              <div><b>Calendly Link:</b> <a href={agent.calendlyUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">{agent.calendlyUrl}</a></div>
                            )}
                          </div>
                          <div>
                            <b>Uploaded Files:</b>
                            <ul className="list-disc ml-5 mt-2">
                              {agent.documents && agent.documents.length > 0 ? (
                                agent.documents.map(doc => (
                                  <li key={doc.id}>
                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">
                                      {doc.type.replace(/_/g, ' ')} ({doc.name})
                                    </a>
                                  </li>
                                ))
                              ) : (
                                <li>No files uploaded</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Services Management Section */}
                      {showServices === agent.id && (
                        <div className="mt-6 border-t pt-6">
                          <ServiceManager
                            agentId={agent.id}
                            services={agentServices[agent.id] || []}
                            onServicesChange={(services) => handleServicesChange(agent.id, services)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {!loading && agents.length === 0 && <div className="text-center mt-8">No agents found.</div>}
      </div>
      </div>

      {/* Suspend Agent Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Suspend Agent</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for suspending this agent:</p>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-[100px] mb-4"
              placeholder="Enter suspension reason..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowSuspendModal(false);
                  setPendingAction(null);
                  setSuspendReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSuspendConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Suspend Agent
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Calendly URL Modal */}
      {showCalendlyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Calendly Link</h3>
            <p className="text-gray-600 mb-4">Enter the Calendly booking link (leave blank to remove):</p>
            <input
              type="url"
              value={calendlyUrl}
              onChange={(e) => setCalendlyUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              placeholder="https://calendly.com/..."
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCalendlyModal(false);
                  setPendingAction(null);
                  setCalendlyUrl("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCalendlyConfirm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Link
              </Button>
            </div>
          </div>
    </div>
      )}
    </AdminLayout>
  );
}

export const dynamic = 'force-dynamic'; 