"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

const calendarProviders: CalendarProvider[] = [
  {
    id: "google",
    name: "Google Calendar",
    icon: "📅",
    color: "bg-blue-500",
    description: "Sync with your Google Calendar"
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    icon: "📧",
    color: "bg-blue-600",
    description: "Sync with your Outlook Calendar"
  },
  {
    id: "apple",
    name: "Apple Calendar",
    icon: "🍎",
    color: "bg-gray-600",
    description: "Sync with your Apple Calendar"
  },
  {
    id: "caldav",
    name: "CalDAV",
    icon: "📋",
    color: "bg-green-600",
    description: "Connect any CalDAV calendar"
  }
];

interface CalendarSyncProps {
  agentId: string;
  onConnect?: (provider: string) => void;
  onDisconnect?: (provider: string) => void;
}

export default function CalendarSync({ agentId, onConnect, onDisconnect }: CalendarSyncProps) {
  const [connectedCalendars, setConnectedCalendars] = useState<string[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (provider: string) => {
    setConnecting(provider);
    
    try {
      // In a real implementation, this would redirect to OAuth or open a modal
      // For now, we'll simulate the connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnectedCalendars(prev => [...prev, provider]);
      onConnect?.(provider);
      
      // Show success message
      alert(`${calendarProviders.find(p => p.id === provider)?.name} connected successfully!`);
    } catch (error) {
      console.error('Error connecting calendar:', error);
      alert('Failed to connect calendar. Please try again.');
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      // In a real implementation, this would call an API to disconnect
      setConnectedCalendars(prev => prev.filter(p => p !== provider));
      onDisconnect?.(provider);
      
      alert(`${calendarProviders.find(p => p.id === provider)?.name} disconnected successfully!`);
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      alert('Failed to disconnect calendar. Please try again.');
    }
  };

  const isConnected = (provider: string) => connectedCalendars.includes(provider);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar Integration</h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect your external calendars to automatically sync your availability and prevent double bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {calendarProviders.map((provider) => (
          <div
            key={provider.id}
            className={`border rounded-lg p-4 transition-all ${
              isConnected(provider.id)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${provider.color}`}>
                  <span className="text-lg">{provider.icon}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{provider.name}</h4>
                  <p className="text-sm text-gray-600">{provider.description}</p>
                </div>
              </div>
              
              {isConnected(provider.id) && (
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm font-medium">Connected</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              {isConnected(provider.id) ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(provider.id)}
                    className="flex-1"
                  >
                    Disconnect
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Settings modal would open here')}
                    className="flex-1"
                  >
                    Settings
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => handleConnect(provider.id)}
                  disabled={connecting === provider.id}
                  className={`flex-1 ${provider.color.replace('bg-', 'bg-')} hover:${provider.color.replace('bg-', 'bg-')} text-white`}
                >
                  {connecting === provider.id ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Connecting...
                    </div>
                  ) : (
                    'Connect'
                  )}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sync Settings */}
      {connectedCalendars.length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Sync Settings</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Sync Direction</label>
                <p className="text-sm text-gray-600">Choose how calendars sync with each other</p>
              </div>
              <select className="border rounded-lg px-3 py-2">
                <option value="bidirectional">Bidirectional</option>
                <option value="maraplace_to_external">MaraPlace → External</option>
                <option value="external_to_maraplace">External → MaraPlace</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="font-medium text-gray-700">Sync Frequency</label>
                <p className="text-sm text-gray-600">How often to check for updates</p>
              </div>
              <select className="border rounded-lg px-3 py-2">
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto-decline"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="auto-decline" className="text-sm text-gray-700">
                Automatically decline conflicting appointments
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sync-availability"
                className="rounded border-gray-300"
                defaultChecked
              />
              <label htmlFor="sync-availability" className="text-sm text-gray-700">
                Sync availability settings
              </label>
            </div>
          </div>

          <div className="mt-6">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Save Sync Settings
            </Button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">How Calendar Sync Works</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your external calendar events will be checked for conflicts</li>
          <li>• New bookings will automatically appear in your connected calendars</li>
          <li>• You can choose which direction to sync (one-way or two-way)</li>
          <li>• Sync happens automatically in the background</li>
        </ul>
      </div>
    </div>
  );
} 