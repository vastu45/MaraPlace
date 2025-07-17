"use client";
import { useState, useEffect } from "react";
import { ChevronDown, RefreshCw, Calendar, MoreVertical, Plus, X, Copy } from "lucide-react";

const DAYS_OF_WEEK = [
  { key: 0, label: "S", name: "Sunday" },
  { key: 1, label: "M", name: "Monday" },
  { key: 2, label: "T", name: "Tuesday" },
  { key: 3, label: "W", name: "Wednesday" },
  { key: 4, label: "T", name: "Thursday" },
  { key: 5, label: "F", name: "Friday" },
  { key: 6, label: "S", name: "Saturday" },
];

const DURATION_OPTIONS = [15, 30, 45, 60];

interface TimeSlot {
  start: string;
  end: string;
}

interface WeeklyHours {
  day: number;
  unavailable: boolean;
  slots: TimeSlot[];
}

export default function ModernCalendarLayout() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [defaultDuration, setDefaultDuration] = useState<number>(30);
  const [durationSaving, setDurationSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [isExpanded, setIsExpanded] = useState(true);

  // Initialize default weekly hours
  const getDefaultWeeklyHours = (): WeeklyHours[] => {
    return DAYS_OF_WEEK.map((day) => ({
      day: day.key,
      unavailable: day.key === 0 || day.key === 6, // Sunday and Saturday unavailable by default
      slots: day.key === 0 || day.key === 6 ? [] : [{ start: "11:00", end: "17:00" }],
    }));
  };

  // Fetch agent data on mount
  useEffect(() => {
    async function fetchAgentData() {
      try {
        const res = await fetch("/api/agents/me");
        if (res.ok) {
          const data = await res.json();
          setAgentId(data.user.agentProfile.id);
          setDefaultDuration(data.user.agentProfile.defaultMeetingDuration || 30);
          
          // Fetch weekly hours
          const hoursRes = await fetch(`/api/agents/${data.user.agentProfile.id}/availability?weekly=1`);
          if (hoursRes.ok) {
            const hoursData = await hoursRes.json();
            setWeeklyHours(hoursData.weeklyHours || getDefaultWeeklyHours());
          } else {
            setWeeklyHours(getDefaultWeeklyHours());
          }
        }
      } catch (error) {
        console.error("Error fetching agent data:", error);
        setWeeklyHours(getDefaultWeeklyHours());
      } finally {
        setLoading(false);
      }
    }
    fetchAgentData();
  }, []);

  const handleToggleUnavailable = (dayIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              unavailable: !day.unavailable,
              slots: !day.unavailable ? [] : day.slots.length === 0 ? [{ start: "11:00", end: "17:00" }] : day.slots,
            }
          : day
      )
    );
  };

  const handleSlotChange = (dayIndex: number, slotIndex: number, field: "start" | "end", value: string) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.map((slot, j) =>
                j === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
  };

  const handleAddSlot = (dayIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: [...day.slots, { start: "11:00", end: "17:00" }] }
          : day
      )
    );
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: day.slots.filter((_, j) => j !== slotIndex) }
          : day
      )
    );
  };

  const handleDuplicateSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? { ...day, slots: [...day.slots, { ...day.slots[slotIndex] }] }
          : day
      )
    );
  };

  const handleSaveWeeklyHours = async () => {
    if (!agentId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${agentId}/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weeklyHours: weeklyHours }),
      });
      if (res.ok) {
        alert("Working hours saved successfully!");
      } else {
        alert("Failed to save working hours");
      }
    } catch (error) {
      console.error("Error saving weekly hours:", error);
      alert("Failed to save working hours");
    } finally {
      setSaving(false);
    }
  };

  const handleDurationChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setDefaultDuration(value);
    setDurationSaving(true);
    
    try {
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
        setDefaultDuration(defaultDuration);
      }
    } catch (error) {
      console.error('Error updating default meeting duration:', error);
      alert('Failed to update default meeting duration. Please try again.');
      setDefaultDuration(defaultDuration);
    } finally {
      setDurationSaving(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes}${ampm}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold text-gray-900">Working hours (default)</h1>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
            <span className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
              Active on: 1 event type
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Calendar
              </button>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Hours Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <RefreshCw className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Weekly hours</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Set when you are typically available for meetings
            </p>
            
            <div className="space-y-3">
              {weeklyHours.map((day, dayIndex) => (
                <div key={dayIndex} className="flex items-center space-x-3">
                  <div className="w-8 h-8 flex items-center justify-center font-semibold text-green-600 bg-green-50 rounded-full border border-green-200">
                    {DAYS_OF_WEEK[dayIndex].label}
                  </div>
                  
                  {day.unavailable ? (
                    <>
                      <span className="text-gray-500 text-sm flex-1">Unavailable</span>
                      <button
                        onClick={() => handleToggleUnavailable(dayIndex)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Add availability"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 space-y-2">
                      {day.slots.map((slot, slotIndex) => (
                        <div key={slotIndex} className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <span className="text-sm font-medium">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                          <div className="flex items-center space-x-1 ml-auto">
                            <button
                              onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Remove slot"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddSlot(dayIndex)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Add another slot"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateSlot(dayIndex, slotIndex)}
                              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Duplicate slot"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleToggleUnavailable(dayIndex)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Set unavailable"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Date-specific Hours Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Date-specific hours</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Adjust hours for specific days
            </p>
            
            <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Hours</span>
            </button>
            
            <div className="mt-4 text-sm text-gray-400">
              No date-specific hours set
            </div>
          </div>
        </div>
      )}

      {/* Default Meeting Duration Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Meeting Duration</h3>
        <div className="flex items-center space-x-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={defaultDuration}
            onChange={handleDurationChange}
            disabled={durationSaving}
          >
            {DURATION_OPTIONS.map((min) => (
              <option key={min} value={min}>{min} minutes</option>
            ))}
          </select>
          {durationSaving && (
            <span className="text-sm text-gray-500">Saving...</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          This duration will be used for bookings without a selected service.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSaveWeeklyHours}
          disabled={saving}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
} 