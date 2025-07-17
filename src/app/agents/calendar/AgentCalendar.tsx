import { useEffect, useState } from "react";
import WeeklyHoursEditor, { WeeklyHours } from "./WeeklyHoursEditor";

const DURATION_OPTIONS = [15, 30, 45, 60];

export default function AgentCalendar() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState<number>(30);
  const [durationSaving, setDurationSaving] = useState(false);

  // Fetch agentId and default duration on mount
  useEffect(() => {
    async function fetchAgentIdAndDuration() {
      const res = await fetch("/api/agents/me");
      if (res.ok) {
        const data = await res.json();
        setAgentId(data.user.agentProfile.id);
        setDefaultDuration(data.user.agentProfile.defaultMeetingDuration || 30);
      }
    }
    fetchAgentIdAndDuration();
  }, []);

  // Fetch weekly hours when agentId is available
  useEffect(() => {
    if (!agentId) return;
    const fetchWeeklyHours = async () => {
      setLoading(true);
      const res = await fetch(`/api/agents/${agentId}/availability?weekly=1`);
      if (res.ok) {
        const data = await res.json();
        setWeeklyHours(data.weeklyHours || null);
      } else {
        setWeeklyHours(null);
      }
      setLoading(false);
    };
    fetchWeeklyHours();
  }, [agentId]);

  const handleSave = async (hours: WeeklyHours) => {
    if (!agentId) return;
    setSaving(true);
    const res = await fetch(`/api/agents/${agentId}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weeklyHours: hours }),
    });
    setSaving(false);
    if (res.ok) {
      setWeeklyHours(hours);
      alert("Working hours saved!");
    } else {
      alert("Failed to save working hours");
    }
  };

  const handleDurationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setDefaultDuration(value);
    setDurationSaving(true);
    
    try {
      // PATCH agent profile
      const formData = new FormData();
      formData.append("defaultMeetingDuration", value.toString());
      const response = await fetch("/api/agents/me", {
        method: "PATCH",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to update default meeting duration:', errorData);
        alert('Failed to update default meeting duration. Please try again.');
        // Revert the UI state
        setDefaultDuration(defaultDuration);
      }
    } catch (error) {
      console.error('Error updating default meeting duration:', error);
      alert('Failed to update default meeting duration. Please try again.');
      // Revert the UI state
      setDefaultDuration(defaultDuration);
    } finally {
      setDurationSaving(false);
    }
  };

  if (loading || !weeklyHours) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <WeeklyHoursEditor initial={weeklyHours} onSave={handleSave} loading={saving} />
      <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <label className="block font-semibold mb-2">Default Meeting Duration</label>
        <select
          className="border rounded px-3 py-2 w-40"
          value={defaultDuration}
          onChange={handleDurationChange}
          disabled={durationSaving}
        >
          {DURATION_OPTIONS.map((min) => (
            <option key={min} value={min}>{min} minutes</option>
          ))}
        </select>
        {durationSaving && <span className="ml-2 text-sm text-gray-500">Saving...</span>}
        <div className="text-xs text-gray-500 mt-2">This duration will be used for bookings without a selected service.</div>
      </div>
    </div>
  );
} 