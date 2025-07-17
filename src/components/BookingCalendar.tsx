"use client";

import { useState, useEffect } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isPast,
  getDay,
  getDaysInMonth,
} from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  bookingId?: string;
}

interface BookingCalendarProps {
  agentId: string;
  serviceId?: string;
  onTimeSlotSelect: (date: Date, time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export default function BookingCalendar({
  agentId,
  serviceId,
  onTimeSlotSelect,
  selectedDate,
  selectedTime,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        available: true,
      });
      if (hour < 17) {
        slots.push({
          time: `${hour.toString().padStart(2, "0")}:30`,
          available: true,
        });
      }
    }
    return slots;
  };

  // Calculate all days in the current month
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = getDay(monthStart); // 0 = Sunday

  // For grid alignment: how many empty cells before the 1st?
  const blanks = Array((firstDayOfWeek + 6) % 7).fill(null); // Make Monday first

  const fetchAvailability = async (date: Date) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/agents/${agentId}/availability?date=${format(date, "yyyy-MM-dd")}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Available slots from API:', data.timeSlots);
        setAvailableSlots(data.timeSlots || generateTimeSlots());
      } else {
        console.log('API request failed, using default slots');
        setAvailableSlots(generateTimeSlots());
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailableSlots(generateTimeSlots());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, agentId]);

  const handleDateSelect = (date: Date) => {
    onTimeSlotSelect(date, "");
    fetchAvailability(date);
  };

  const handleTimeSelect = (time: string) => {
    if (selectedDate) {
      onTimeSlotSelect(selectedDate, time);
    }
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {/* Empty cells before the 1st */}
          {blanks.map((_, idx) => (
            <div key={"blank-" + idx}></div>
          ))}
          {/* Days of the month */}
          {daysInMonth.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => handleDateSelect(date)}
              disabled={isPast(date) && !isToday(date)}
              className={`
                p-3 text-sm rounded-lg border transition-all flex flex-col items-center
                ${isSameDay(date, selectedDate || new Date())
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "hover:bg-gray-50 border-gray-200"
                }
                ${isPast(date) && !isToday(date) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="font-medium">{format(date, "d")}</div>
              {isToday(date) && (
                <div className="text-xs text-green-600 font-medium">Today</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold mb-4 text-gray-900">
            Available times for {format(selectedDate, "EEEE, MMMM d")}
          </h4>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableSlots
                .filter(slot => slot.available) // Only show available slots
                .map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleTimeSelect(slot.time)}
                    className={`
                      p-3 text-sm rounded-lg border transition-all
                      ${selectedTime === slot.time
                        ? "bg-green-600 text-white border-green-600"
                        : "hover:bg-green-50 border-gray-200 text-gray-700"
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              {availableSlots.filter(slot => slot.available).length === 0 && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No available time slots for this date
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 