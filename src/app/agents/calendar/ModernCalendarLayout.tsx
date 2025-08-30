"use client";
import { useState, useEffect } from "react";
import { ChevronDown, RefreshCw, Calendar, MoreVertical, Plus, X, Copy, Clock, Check, Settings } from "lucide-react";

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

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

// Modern Calendar View Component
function CalendarView({ weeklyHours, onSlotClick }: { 
  weeklyHours: WeeklyHours[], 
  onSlotClick: (dayIndex: number, slotIndex: number) => void 
}) {
  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"
  ];

  const isSlotActive = (dayIndex: number, time: string) => {
    const day = weeklyHours[dayIndex];
    if (day.unavailable) return false;
    
    return day.slots.some(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;
      return time >= slotStart && time < slotEnd;
    });
  };

  const getSlotInfo = (dayIndex: number, time: string) => {
    const day = weeklyHours[dayIndex];
    if (day.unavailable) return null;
    
    const slot = day.slots.find(slot => {
      const slotStart = slot.start;
      const slotEnd = slot.end;
      return time >= slotStart && time < slotEnd;
    });
    
    return slot;
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl p-8 border border-blue-100/50">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Weekly Calendar View
          </h2>
          <p className="text-gray-600 mt-1">Visual representation of your weekly availability</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-8 gap-2 mb-4">
            <div className="h-10"></div> {/* Empty corner */}
            {DAYS_OF_WEEK.map((day) => (
              <div key={day.key} className="h-10 flex items-center justify-center text-sm font-bold text-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                {day.name}
              </div>
            ))}
          </div>
          
          {/* Time Slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-2 mb-2">
              <div className="h-14 flex items-center justify-end pr-3 text-sm font-medium text-gray-600">
                {time}
              </div>
              {DAYS_OF_WEEK.map((day, dayIndex) => {
                const isActive = isSlotActive(dayIndex, time);
                const slotInfo = getSlotInfo(dayIndex, time);
                const isStartOfSlot = slotInfo && time === slotInfo.start;
                
                return (
                  <div
                    key={dayIndex}
                    className={`h-14 border-2 rounded-xl relative transition-all duration-200 hover:shadow-md ${
                      isActive 
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 shadow-sm' 
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200'
                    }`}
                  >
                    {isStartOfSlot && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-3 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                          <Clock className="w-3 h-3" />
                          <span className="font-semibold">{slotInfo.start} - {slotInfo.end}</span>
                        </div>
                      </div>
                    )}
                    {isActive && !isStartOfSlot && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full shadow-sm"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {/* Modern Legend */}
      <div className="mt-8 flex items-center space-x-8 text-sm">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg shadow-sm"></div>
          <span className="font-medium text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg shadow-sm"></div>
          <span className="font-medium text-gray-700">Unavailable</span>
        </div>
      </div>
    </div>
  );
}

export default function ModernCalendarLayout() {
  const [agentId, setAgentId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  // Fetch agent data and services on mount
  useEffect(() => {
    async function fetchAgentData() {
      try {
        const res = await fetch("/api/agents/me");
        if (res.ok) {
          const data = await res.json();
          setAgentId(data.user.agentProfile.id);
          
          // Fetch services
          const servicesRes = await fetch(`/api/agents/${data.user.agentProfile.id}/services`);
          if (servicesRes.ok) {
            const servicesData = await servicesRes.json();
            const activeServices = servicesData.services || [];
            setServices(activeServices);
            
            // Set the first active service as selected
            if (activeServices.length > 0) {
              setSelectedService(activeServices[0].id);
            }
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

  // Fetch weekly hours when selected service changes
  useEffect(() => {
    async function fetchWeeklyHours() {
      if (!agentId || !selectedService) {
        setWeeklyHours(getDefaultWeeklyHours());
        return;
      }

      try {
        const hoursRes = await fetch(`/api/agents/${agentId}/availability?serviceId=${selectedService}`);
        if (hoursRes.ok) {
          const hoursData = await hoursRes.json();
          setWeeklyHours(hoursData.weeklyHours || getDefaultWeeklyHours());
        } else {
          setWeeklyHours(getDefaultWeeklyHours());
        }
      } catch (error) {
        console.error("Error fetching weekly hours:", error);
        setWeeklyHours(getDefaultWeeklyHours());
      }
    }

    fetchWeeklyHours();
  }, [agentId, selectedService]);

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
          ? {
              ...day,
              slots: [...day.slots, { start: "09:00", end: "10:00" }],
            }
          : day
      )
    );
  };

  const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: day.slots.filter((_, j) => j !== slotIndex),
            }
          : day
      )
    );
  };

  const handleDuplicateSlot = (dayIndex: number, slotIndex: number) => {
    setWeeklyHours((prev) =>
      prev.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              slots: [...day.slots, { ...day.slots[slotIndex] }],
            }
          : day
      )
    );
  };



  const handleSaveWeeklyHours = async () => {
    setSaving(true);
    try {
      if (agentId && selectedService) {
        const response = await fetch(`/api/agents/${agentId}/availability`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serviceId: selectedService,
            weeklyHours: weeklyHours,
          }),
        });
        
        if (!response.ok) {
          throw new Error("Failed to save weekly hours");
        }
      }
    } catch (error) {
      console.error("Error saving weekly hours:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes}${ampm}`;
  };

  const handleSlotClick = (dayIndex: number, slotIndex: number) => {
    // This could open a modal to edit the slot
    console.log(`Clicked slot ${slotIndex} for day ${dayIndex}`);
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl shadow-2xl p-8 md:p-12 w-full h-full">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-white to-blue-50 rounded-3xl shadow-lg p-8 mb-8 border border-blue-100/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Working Hours
                </h1>
                <p className="text-gray-600 mt-1">Manage your availability and schedule</p>
              </div>
            </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-white/50 p-2 rounded-xl"
              >
              <ChevronDown className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200">
              <span className="text-sm font-semibold text-green-700">
              Active on: {services.length} service{services.length !== 1 ? 's' : ''}
            </span>
          </div>
          
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  viewMode === "calendar"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }`}
              >
                Calendar View
              </button>
            </div>
            <button className="p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-white/50 transition-all duration-200">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Service Selector */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Service Selection
            </h2>
            <p className="text-gray-600 mt-1">Select a service to configure its working hours</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-xl transform hover:scale-105 ${
                selectedService === service.id
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 shadow-md'
              }`}
            >
                {selectedService === service.id && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      ${service.price} AUD
                    </div>
                    <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {service.duration} min
                    </div>
                  </div>
              </div>
              </div>
            </div>
          ))}
        </div>
        
        {services.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Services Found</h3>
            <p className="text-gray-500 mb-4">Please add services in the Settings tab to configure working hours.</p>
          </div>
        )}
      </div>

      {isExpanded && selectedService && (
        <>
          {viewMode === "list" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Modern Weekly Hours Section */}
          <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-lg p-8 border border-green-100/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Weekly Hours for {selectedServiceData?.name}
                  </h2>
                <p className="text-gray-600 mt-1">
                  Set when you are typically available for {selectedServiceData?.name.toLowerCase()} consultations
            </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {weeklyHours.map((day, dayIndex) => (
                <div key={dayIndex} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 flex items-center justify-center font-bold text-green-600 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border-2 border-green-200 shadow-sm">
                    {DAYS_OF_WEEK[dayIndex].label}
                  </div>
                  
                  {day.unavailable ? (
                    <>
                        <span className="text-gray-500 text-sm font-medium flex-1">Unavailable</span>
                      <button
                        onClick={() => handleToggleUnavailable(dayIndex)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                        title="Add availability"
                      >
                          <Plus className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                      <div className="flex-1 space-y-3">
                      {day.slots.map((slot, slotIndex) => (
                          <div key={slotIndex} className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-3 rounded-xl border border-gray-200/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                              <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Remove slot"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleAddSlot(dayIndex)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Add another slot"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateSlot(dayIndex, slotIndex)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="Duplicate slot"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                              </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => handleToggleUnavailable(dayIndex)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
                        title="Set unavailable"
                      >
                          <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modern Date-specific Hours Section */}
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-lg p-8 border border-purple-100/50">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Date-specific Hours
                </h2>
                <p className="text-gray-600 mt-1">Adjust hours for specific days</p>
              </div>
            </div>
            
            <button className="inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              <Plus className="w-5 h-5" />
              <span>Add Hours</span>
            </button>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/50">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">No date-specific hours set</p>
                <p className="text-xs text-gray-400 mt-1">Add custom hours for specific dates</p>
              </div>
            </div>
          </div>
        </div>
          ) : (
            <CalendarView weeklyHours={weeklyHours} onSlotClick={handleSlotClick} />
          )}
        </>
      )}



      {/* Modern Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveWeeklyHours}
          disabled={saving || !selectedService}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-2xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
        >
          {saving ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Saving Changes...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>Save Changes for {selectedServiceData?.name || 'Service'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
} 