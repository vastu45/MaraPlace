"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace</span>
        <div className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-green-600">Home</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
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

export default function AgentProfile() {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/agents/${id}`)
      .then(res => res.json())
      .then(data => {
        setAgent(data.agent);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load agent");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="max-w-2xl mx-auto py-12 px-4">Loading...</div>;
  if (error || !agent) return <div className="max-w-2xl mx-auto py-12 px-4 text-red-500">{error || "Agent not found"}</div>;

  const photoDoc = agent.documents?.find((doc: any) => doc.type === 'photo');

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Agent Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center md:col-span-1">
          <div className="relative mb-4">
            {photoDoc ? (
              <img src={photoDoc.url} alt={agent.name} className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-5xl text-gray-400 border-4 border-green-200 shadow">
                <span>{agent.name?.[0]}</span>
              </div>
            )}
            {/* Verification badge */}
            <span className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg" title="Verified">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1 text-center">{agent.name}</div>
          <div className="text-green-700 font-semibold text-sm mb-1 text-center">{agent.businessName}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="font-bold text-gray-700">{agent.rating?.toFixed(1) ?? 'N/A'}</span>
            <span className="text-gray-500 text-xs">({agent.totalReviews} reviews)</span>
          </div>
          <div className="text-xs text-gray-500 mb-2 text-center">MARA No: <span className="font-semibold text-gray-700">{agent.maraNumber}</span></div>
          <div className="text-xs text-gray-500 mb-2 text-center">ABN: <span className="font-semibold text-gray-700">{agent.abn || '---'}</span></div>
          <div className="text-xs text-gray-500 mb-2 text-center">{agent.businessCity}, {agent.businessState}</div>
          <div className="text-xs text-gray-500 mb-2 text-center">Phone: <span className="font-semibold text-gray-700">{agent.phone || '---'}</span></div>
          <div className="text-xs text-gray-500 mb-2 text-center">Email: <span className="font-semibold text-gray-700">{agent.email || '---'}</span></div>
          {/* Social icons placeholder */}
          <div className="flex gap-3 mt-3">
            <a href="#" className="text-blue-600 hover:text-blue-800"><svg width="20" height="20" fill="currentColor"><circle cx="10" cy="10" r="10" /></svg></a>
            <a href="#" className="text-blue-400 hover:text-blue-600"><svg width="20" height="20" fill="currentColor"><rect width="20" height="20" rx="4" /></svg></a>
            <a href="#" className="text-blue-700 hover:text-blue-900"><svg width="20" height="20" fill="currentColor"><polygon points="10,2 18,18 2,18" /></svg></a>
          </div>
        </div>
        {/* Right: Details and Stats */}
        <div className="md:col-span-2 flex flex-col gap-8">
          {/* Agent Details */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Agent details</h2>
            <div className="text-gray-600 mb-4">{agent.bio || 'No bio provided.'}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-600">●</span>
                <span className="font-semibold">Agency:</span>
                <span className="ml-1 text-gray-700">{agent.businessName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">●</span>
                <span className="font-semibold">Agent License:</span>
                <span className="ml-1 text-gray-700">{agent.maraNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">●</span>
                <span className="font-semibold">Tax Number:</span>
                <span className="ml-1 text-gray-700">{agent.abn || '---'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-600">●</span>
                <span className="font-semibold">Service area:</span>
                <span className="ml-1 text-gray-700">{[agent.businessCity, agent.businessState].filter(Boolean).join(', ') || '---'}</span>
              </div>
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="text-blue-600">●</span>
                <span className="font-semibold">Languages:</span>
                <span className="ml-1 text-gray-700">{agent.languages?.join(', ') || '---'}</span>
              </div>
            </div>
          </div>
          {/* Property/Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-green-700">{agent.totalBookings ?? 0}</div>
              <div className="text-gray-500 text-sm mt-1 text-center">Total Consultations</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-600">{agent.totalReviews ?? 0}</div>
              <div className="text-gray-500 text-sm mt-1 text-center">Total Reviews</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <div className="text-2xl font-bold text-purple-600">{agent.services?.length ?? 0}</div>
              <div className="text-gray-500 text-sm mt-1 text-center">Services Listed</div>
            </div>
          </div>
          {/* Uploaded Documents */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Uploaded Documents</h2>
            <ul className="list-disc ml-5 mt-2">
              {agent.documents && agent.documents.length > 0 ? (
                agent.documents.map((doc: any) => (
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
          {/* Services */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Services</h2>
            <ul className="list-disc ml-5 mt-2">
              {agent.services && agent.services.length > 0 ? (
                agent.services.map((service: any) => (
                  <li key={service.id}>
                    <span className="font-medium">{service.name}</span> - ${service.price} ({service.duration} min)
                  </li>
                ))
              ) : (
                <li>No services listed</li>
              )}
            </ul>
          </div>
          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-4">
            <h2 className="text-lg font-bold mb-2 text-gray-800">Recent Reviews</h2>
            <ul className="list-disc ml-5 mt-2">
              {agent.recentReviews && agent.recentReviews.length > 0 ? (
                agent.recentReviews.map((review: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-medium">Rating:</span> {review.rating} <span className="text-xs text-gray-500">({new Date(review.createdAt).toLocaleDateString()})</span>
                    <div className="text-sm text-gray-700">{review.comment}</div>
                  </li>
                ))
              ) : (
                <li>No reviews yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 