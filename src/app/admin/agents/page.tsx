"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  type: string;
  url: string;
  name: string;
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

function AdminNavbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace Admin</span>
        <div className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Link href="/admin" className="hover:text-green-600">Dashboard</Link>
          <Link href="/admin/users" className="hover:text-green-600">Users</Link>
          <Link href="/admin/agents" className="hover:text-green-600 font-medium">Agents</Link>
          <Link href="/admin/verifications" className="hover:text-green-600">Verifications</Link>
          <Link href="/admin/payments" className="hover:text-green-600">Payments</Link>
          <Link href="/admin/disputes" className="hover:text-green-600">Disputes</Link>
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

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-8 mt-12 text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="font-bold text-green-600 text-lg">MaraPlace</div>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-green-600">About</Link>
          <Link href="#" className="hover:text-green-600">Contact</Link>
          <Link href="#" className="hover:text-green-600">Terms</Link>
          <Link href="#" className="hover:text-green-600">Privacy</Link>
        </div>
        <div className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} MaraPlace. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function AdminAgents() {
  const { data: session, status } = useSession();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});

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
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load agents:", error);
          setError("Failed to load agents");
          setLoading(false);
        });
    }
  }, [session, status, router, statusFilter]);

  async function updateStatus(id: string, status: string) {
    let suspendReason = undefined;
    if (status === "SUSPENDED") {
      suspendReason = window.prompt("Please provide a reason for suspension:");
      if (!suspendReason || !suspendReason.trim()) {
        alert("Suspension reason is required.");
        return;
      }
    }
    setActionLoading(id + status);
    const res = await fetch(`/api/admin/agents/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, suspendReason }),
    });
    if (res.ok) {
      setAgents(agents => agents.map(a => a.id === id ? { ...a, status, suspendReason: status === "SUSPENDED" ? suspendReason : undefined } : a));
    } else {
      alert("Failed to update status");
    }
    setActionLoading(null);
  }

  async function updateCalendlyUrl(id: string, currentUrl: string) {
    const calendlyUrl = window.prompt("Enter Calendly booking link (leave blank to remove):", currentUrl || "");
    if (calendlyUrl === null) return; // Cancelled
    setActionLoading(id + "CALENDLY");
    const res = await fetch(`/api/agents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendlyUrl }),
    });
    if (res.ok) {
      setAgents(agents => agents.map(a => a.id === id ? { ...a, calendlyUrl } : a));
    } else {
      alert("Failed to update Calendly link");
    }
    setActionLoading(null);
  }

  function startEdit(agent: Agent) {
    setEditingId(agent.id);
    setEditForm({ ...agent });
    setExpanded(String(agent.id ?? '')); // Ensure the row is expanded for editing
  }
  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }
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
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return null; // Will redirect to login
  }

  return (
    <div>
      <AdminNavbar />
      <div className="max-w-5xl mx-auto py-12 px-4">
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
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        {!loading && agents.length === 0 && <div className="text-center mt-8">No agents found.</div>}
      </div>
      <Footer />
    </div>
  );
}

export const dynamic = 'force-dynamic'; 