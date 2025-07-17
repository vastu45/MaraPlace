import { useState } from "react";
import { Button } from "@/components/ui/button";

const daysOfWeek = [
  { key: 0, label: "S" },
  { key: 1, label: "M" },
  { key: 2, label: "T" },
  { key: 3, label: "W" },
  { key: 4, label: "T" },
  { key: 5, label: "F" },
  { key: 6, label: "S" },
];

const defaultHours = [
  { start: "11:00", end: "17:00" },
];

function getTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Local Time";
  }
}

export type WeeklyHours = Array<{
  day: number; // 0=Sun, 1=Mon, ...
  unavailable: boolean;
  slots: { start: string; end: string }[];
}>;

export default function WeeklyHoursEditor({
  initial,
  onSave,
  loading,
}: {
  initial?: WeeklyHours;
  onSave: (hours: WeeklyHours) => void;
  loading?: boolean;
}) {
  const [hours, setHours] = useState<WeeklyHours>(
    initial ||
      daysOfWeek.map((d) => ({ day: d.key, unavailable: d.key === 0 || d.key === 6, slots: d.key === 0 || d.key === 6 ? [] : [...defaultHours] }))
  );
  const [saving, setSaving] = useState(false);

  const handleToggleUnavailable = (idx: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === idx ? { ...h, unavailable: !h.unavailable, slots: !h.unavailable ? [] : h.slots.length === 0 ? [...defaultHours] : h.slots } : h
      )
    );
  };

  const handleSlotChange = (dayIdx: number, slotIdx: number, field: "start" | "end", value: string) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === dayIdx
          ? {
              ...h,
              slots: h.slots.map((s, j) => (j === slotIdx ? { ...s, [field]: value } : s)),
            }
          : h
      )
    );
  };

  const handleAddSlot = (dayIdx: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === dayIdx ? { ...h, slots: [...h.slots, { start: "11:00", end: "17:00" }] } : h
      )
    );
  };

  const handleRemoveSlot = (dayIdx: number, slotIdx: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === dayIdx ? { ...h, slots: h.slots.filter((_, j) => j !== slotIdx) } : h
      )
    );
  };

  const handleDuplicateSlot = (dayIdx: number, slotIdx: number) => {
    setHours((prev) =>
      prev.map((h, i) =>
        i === dayIdx ? { ...h, slots: [...h.slots, { ...h.slots[slotIdx] }] } : h
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(hours);
    setSaving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Working hours (default)</h2>
        <span className="text-sm text-blue-700">{getTimeZone()}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Weekly hours */}
        <div>
          <div className="font-semibold mb-2">Weekly hours</div>
          <div className="text-xs text-gray-500 mb-4">Set when you are typically available for meetings</div>
          <div className="space-y-2">
            {hours.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-blue-900 bg-blue-50 rounded-full border border-blue-200">
                  {daysOfWeek[i].label}
                </span>
                {h.unavailable ? (
                  <>
                    <span className="text-gray-500 text-sm">Unavailable</span>
                    <Button size="icon" variant="ghost" onClick={() => handleToggleUnavailable(i)} title="Set available">
                      +
                    </Button>
                  </>
                ) : (
                  <>
                    {h.slots.map((slot, j) => (
                      <div key={j} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => handleSlotChange(i, j, "start", e.target.value)}
                          className="border rounded px-1 py-0.5 w-20"
                        />
                        <span className="mx-1">-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => handleSlotChange(i, j, "end", e.target.value)}
                          className="border rounded px-1 py-0.5 w-20"
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleRemoveSlot(i, j)} title="Remove">
                          ×
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleAddSlot(i)} title="Add">
                          +
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDuplicateSlot(i, j)} title="Duplicate">
                          <span role="img" aria-label="Duplicate">📋</span>
                        </Button>
                      </div>
                    ))}
                    <Button size="icon" variant="ghost" onClick={() => handleToggleUnavailable(i)} title="Set unavailable">
                      ×
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Date-specific hours (placeholder) */}
        <div>
          <div className="font-semibold mb-2">Date-specific hours</div>
          <div className="text-xs text-gray-500 mb-4">Adjust hours for specific days</div>
          <Button variant="outline" className="mb-2">+ Hours</Button>
          <div className="text-gray-400 text-sm">(Coming soon)</div>
        </div>
      </div>
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave} disabled={saving || loading} className="px-8 py-2 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded">
          {saving || loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
} 