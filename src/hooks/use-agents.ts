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
  status?: string;
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
        
        console.log('Fetching agents from database...');
        const response = await fetch("/api/agents?limit=20");
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.agents && Array.isArray(data.agents)) {
          console.log(`Found ${data.agents.length} agents in database`);
          setAgents(data.agents);
        } else {
          console.error('Invalid agents data structure:', data);
          setAgents([]); // Set empty array instead of error
        }
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err instanceof Error ? err.message : "Failed to fetch agents");
        setAgents([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  return { agents, loading, error };
} 