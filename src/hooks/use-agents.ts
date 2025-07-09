import { useEffect, useState } from "react";

export interface Agent {
  id: string;
  name: string;
  email: string;
  image?: string;
  maraNumber?: string;
  maraVerified?: boolean;
  businessName?: string;
  businessCity?: string;
  businessState?: string;
  businessAddress?: string;
  abn?: string;
  bio?: string;
  specializations?: string[];
  languages?: string[];
  hourlyRate?: number;
  consultationFee?: number;
  experience?: number;
  rating?: number;
  totalReviews?: number;
  totalBookings?: number;
  services?: any[];
  recentReviews?: any[];
  documents?: any[];
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/agents?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch agents");
        setLoading(false);
      });
  }, []);

  return { agents, loading, error };
} 