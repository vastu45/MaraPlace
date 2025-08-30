"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ExternalLink, 
  XCircle,
  Settings,
  Clock
} from "lucide-react";

interface CalendarConnection {
  id: string;
  provider: 'GOOGLE' | 'APPLE' | 'OUTLOOK' | 'OFFICE365';
  name: string;
  calendarId: string;
  isActive: boolean;
  syncEnabled: boolean;
  lastSyncAt: string | null;
}

export default function CalendarSync({ agentId }: { agentId: string }) {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const providers = [
    {
      id: 'GOOGLE',
      name: 'Google Calendar',
      description: 'Sync with your Google Calendar',
      icon: '📅',
      color: 'bg-blue-500',
      authUrl: '/api/calendar/google/auth'
    },
    {
      id: 'APPLE',
      name: 'Apple Calendar',
      description: 'Sync with your Apple Calendar',
      icon: '🍎',
      color: 'bg-gray-800',
      authUrl: '/api/calendar/apple/auth'
    },
    {
      id: 'OUTLOOK',
      name: 'Outlook Calendar',
      description: 'Sync with your Outlook Calendar',
      icon: '📧',
      color: 'bg-blue-600',
      authUrl: '/api/calendar/outlook/auth'
    },
    {
      id: 'OFFICE365',
      name: 'Office 365 Calendar',
      description: 'Sync with your Office 365 Calendar',
      icon: '🏢',
      color: 'bg-red-600',
      authUrl: '/api/calendar/office365/auth'
    }
  ];

  useEffect(() => {
    if (agentId && agentId.trim() !== '') {
      fetchConnections();
    } else {
      setLoading(false);
    }
  }, [agentId]);

  const fetchConnections = async () => {
    if (!agentId || agentId.trim() === '') {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/calendar/connections?agentId=${agentId}`);
      if (response.ok) {
        const data = await response.json();
        setConnections(data.connections || []);
      }
    } catch (error) {
      console.error('Error fetching calendar connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (provider: 'GOOGLE' | 'APPLE' | 'OUTLOOK' | 'OFFICE365') => {
    if (!agentId || agentId.trim() === '') {
      alert('Agent ID not available. Please refresh the page and try again.');
      return;
    }
    
    const providerConfig = providers.find(p => p.id === provider);
    if (providerConfig) {
      window.open(`${providerConfig.authUrl}?agentId=${agentId}`, '_blank', 'width=500,height=600');
    }
  };

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('Are you sure you want to disconnect this calendar?')) return;
    
    try {
      const response = await fetch(`/api/calendar/connections/${connectionId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      }
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
    }
  };

  const handleToggleSync = async (connectionId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/calendar/connections/${connectionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ syncEnabled: enabled })
      });
      
      if (response.ok) {
        setConnections(prev => 
          prev.map(conn => 
            conn.id === connectionId 
              ? { ...conn, syncEnabled: enabled }
              : conn
          )
        );
      }
    } catch (error) {
      console.error('Error toggling sync:', error);
    }
  };

  const handleSyncNow = async (connectionId: string) => {
    setSyncing(true);
    try {
      const response = await fetch(`/api/calendar/sync/${connectionId}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error syncing calendar:', error);
    } finally {
      setSyncing(false);
    }
  };

  const getProviderIcon = (provider: string) => {
    const providerConfig = providers.find(p => p.id === provider);
    return providerConfig?.icon || '📅';
  };

  const getProviderColor = (provider: string) => {
    const providerConfig = providers.find(p => p.id === provider);
    return providerConfig?.color || 'bg-gray-500';
  };

  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return 'Never';
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading calendar connections...</span>
      </div>
    );
  }

  if (!agentId || agentId.trim() === '') {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Agent ID not available</h3>
          <p className="text-gray-600 mb-4">
            Please refresh the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar Sync</h2>
          <p className="text-gray-600 mt-1">
            Connect your external calendars to automatically sync availability and bookings
          </p>
        </div>
        <Button
          onClick={() => setShowConnectModal(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Connect Calendar
        </Button>
      </div>

      {/* Connected Calendars */}
      <div className="grid gap-4">
        {connections.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No calendars connected</h3>
            <p className="text-gray-600 mb-4">
              Connect your external calendars to automatically sync your availability and bookings.
            </p>
            <Button onClick={() => setShowConnectModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First Calendar
            </Button>
          </div>
        ) : (
          connections.map((connection) => (
            <div key={connection.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getProviderColor(connection.provider)}`}>
                    <span className="text-lg">{getProviderIcon(connection.provider)}</span>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">{connection.name}</h3>
                    <p className="text-gray-600">{connection.provider} Calendar</p>
                </div>
              </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${connection.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {connection.isActive ? "Active" : "Inactive"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSyncNow(connection.id)}
                    disabled={syncing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                    Sync Now
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(connection.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={connection.syncEnabled}
                    onChange={(e) => handleToggleSync(connection.id, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">Auto-sync enabled</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last sync: {formatLastSync(connection.lastSyncAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Calendar ID: {connection.calendarId}</span>
                </div>
              </div>
                    </div>
          ))
              )}
            </div>

      {/* Connect Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Connect Calendar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConnectModal(false)}
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleConnect(provider.id as any)}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${provider.color}`}>
                    <span className="text-sm">{provider.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900">{provider.name}</h4>
                    <p className="text-sm text-gray-600">{provider.description}</p>
          </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </button>
        ))}
      </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowConnectModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Sync Settings</h3>
        </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
              <h4 className="font-medium text-gray-900">Two-way sync</h4>
              <p className="text-sm text-gray-600">
                Bookings created in MaraPlace will be added to your external calendars
              </p>
              </div>
            <input type="checkbox" defaultChecked className="rounded" />
            </div>
            <div className="flex items-center justify-between">
              <div>
              <h4 className="font-medium text-gray-900">Conflict resolution</h4>
              <p className="text-sm text-gray-600">
                When there's a conflict, prioritize MaraPlace bookings
              </p>
              </div>
            <input type="checkbox" defaultChecked className="rounded" />
            </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-sync interval</h4>
              <p className="text-sm text-gray-600">
                Sync external calendars every 15 minutes
              </p>
            </div>
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">15 min</span>
          </div>
        </div>
      </div>
    </div>
  );
} 