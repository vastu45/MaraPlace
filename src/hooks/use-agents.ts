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
    const fetchAgents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/agents?limit=20");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.agents && Array.isArray(data.agents)) {
          setAgents(data.agents);
        } else {
          console.error('Invalid agents data structure:', data);
          setError("Invalid data structure received");
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
} 