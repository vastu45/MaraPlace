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
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="mb-8">
          <div className="flex items-center gap-6 p-6">
            <div className="flex-shrink-0">
              {photoDoc ? (
                <img src={photoDoc.url} alt={agent.name} className="w-28 h-28 rounded-full object-cover border-2 border-green-200 shadow" />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400 border-2 border-green-200 shadow">
                  <span>{agent.name?.[0]}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <CardHeader className="p-0 pb-2">
                <CardTitle className="text-2xl font-bold truncate">{agent.name}</CardTitle>
                <CardDescription className="truncate">
                  {agent.businessName}
                  {agent.businessCity ? ` - ${agent.businessCity}` : ""}
                  {agent.businessState ? `, ${agent.businessState}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-2 items-center text-sm mb-1">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">MARA No: {agent.maraNumber}</span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full font-medium">ABN: {agent.abn}</span>
                  <span className="text-yellow-600">★ {agent.rating?.toFixed(1) ?? 'N/A'}</span>
                  <span className="text-gray-500">({agent.totalReviews} reviews)</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-300 mb-1">Languages: {agent.languages?.join(", ")}</div>
                <div className="mt-1 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line">{agent.bio}</div>
                {agent.calendlyUrl && (
                  <div className="mt-4">
                    <a
                      href={agent.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow transition"
                    >
                      Book Now
                    </a>
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <div className="mt-8 text-center">
          <Link href="/" className="text-green-700 underline">&larr; Back to Home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
} 