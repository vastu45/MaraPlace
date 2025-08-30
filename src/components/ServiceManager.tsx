"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Plus, Edit, Trash2, Save, X } from "lucide-react";

interface Service {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface ServiceManagerProps {
  agentId: string;
  services: Service[];
  onServicesChange: (services: Service[]) => void;
}

export default function ServiceManager({ agentId, services, onServicesChange }: ServiceManagerProps) {
  console.log("ServiceManager rendered with:", { agentId, services, onServicesChange });
  
  const [localServices, setLocalServices] = useState<Service[]>(services);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState<Service>({
    name: "",
    description: "",
    price: 0,
    duration: 60,
    isActive: true,
  });

  useEffect(() => {
    // Ensure all services have proper number values for price
    const normalizedServices = services.map(service => ({
      ...service,
      price: typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0
    }));
    setLocalServices(normalizedServices);
  }, [services]);

  const handleAddService = () => {
    if (!newService.name || newService.price <= 0) {
      alert("Please fill in all required fields and ensure price is greater than 0");
      return;
    }

    const serviceToAdd = {
      ...newService,
      id: `temp-${Date.now()}`, // Temporary ID for new services
    };

    const updatedServices = [...localServices, serviceToAdd];
    setLocalServices(updatedServices);
    onServicesChange(updatedServices);
    
    // Reset form
    setNewService({
      name: "",
      description: "",
      price: 0,
      duration: 60,
      isActive: true,
    });
    setIsAdding(false);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
  };

  const handleSaveEdit = () => {
    if (!editingService || !editingService.name || editingService.price <= 0) {
      alert("Please fill in all required fields and ensure price is greater than 0");
      return;
    }

    const updatedServices = localServices.map(service =>
      service.id === editingService.id ? editingService : service
    );
    
    setLocalServices(updatedServices);
    onServicesChange(updatedServices);
    setEditingService(null);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const updatedServices = localServices.filter(service => service.id !== serviceId);
      setLocalServices(updatedServices);
      onServicesChange(updatedServices);
    }
  };

  const handleToggleActive = (serviceId: string) => {
    const updatedServices = localServices.map(service =>
      service.id === serviceId ? { ...service, isActive: !service.isActive } : service
    );
    setLocalServices(updatedServices);
    onServicesChange(updatedServices);
  };

  const durationOptions = [
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 45, label: "45 minutes" },
    { value: 60, label: "1 hour" },
    { value: 90, label: "1.5 hours" },
    { value: 120, label: "2 hours" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Consulting Services
            </h2>
            <p className="text-gray-600 mt-1">Manage your professional services and pricing</p>
          </div>
          <Button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Service
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Add New Service Form */}
        {isAdding && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200/50 shadow-xl backdrop-blur-sm">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
                <p className="text-gray-600">Create a new consulting service for your clients</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="serviceName" className="text-sm font-semibold text-gray-700">Service Name *</Label>
                <Input
                  id="serviceName"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="e.g., Business Visa Consultation"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servicePrice" className="text-sm font-semibold text-gray-700">Price (AUD) *</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDuration" className="text-sm font-semibold text-gray-700">Duration *</Label>
                <Select
                  value={newService.duration.toString()}
                  onValueChange={(value) => setNewService({ ...newService, duration: parseInt(value) })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceActive" className="text-sm font-semibold text-gray-700">Status</Label>
                <Select
                  value={newService.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setNewService({ ...newService, isActive: value === "active" })}
                >
                  <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="serviceDescription" className="text-sm font-semibold text-gray-700">Description</Label>
                <Textarea
                  id="serviceDescription"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe what this service includes..."
                  rows={3}
                  className="border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <Button 
                onClick={handleAddService} 
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Add Service
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewService({
                    name: "",
                    description: "",
                    price: 0,
                    duration: 60,
                    isActive: true,
                  });
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl font-semibold"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-4">
          {localServices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Services Yet</h3>
              <p className="text-gray-500 mb-4">Start by adding your first consulting service</p>
              <Button
                onClick={() => setIsAdding(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Service
              </Button>
            </div>
          ) : (
            localServices.map((service) => (
              <div
                key={service.id}
                className={`relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                  service.isActive 
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50" 
                    : "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200/50"
                }`}
              >
                <div className="p-6">
                  {editingService?.id === service.id ? (
                    // Edit Mode
                    <div className="space-y-6">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Edit Service</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Service Name *</Label>
                          <Input
                            value={editingService?.name || ''}
                            onChange={(e) => setEditingService(editingService ? { ...editingService, name: e.target.value } : null)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Price (AUD) *</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editingService?.price || 0}
                            onChange={(e) => setEditingService(editingService ? { ...editingService, price: parseFloat(e.target.value) || 0 } : null)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Duration *</Label>
                          <Select
                            value={editingService?.duration?.toString() || '60'}
                            onValueChange={(value) => setEditingService(editingService ? { ...editingService, duration: parseInt(value) } : null)}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {durationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Status</Label>
                          <Select
                            value={editingService?.isActive ? "active" : "inactive"}
                            onValueChange={(value) => setEditingService(editingService ? { ...editingService, isActive: value === "active" } : null)}
                          >
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">Description</Label>
                          <Textarea
                            value={editingService?.description || ''}
                            onChange={(e) => setEditingService(editingService ? { ...editingService, description: e.target.value } : null)}
                            rows={3}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button 
                          onClick={handleSaveEdit} 
                          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingService(null)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-xl font-semibold"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  service.isActive
                                    ? "bg-green-100 text-green-800 border border-green-200"
                                    : "bg-gray-100 text-gray-800 border border-gray-200"
                                }`}
                              >
                                <div className={`w-2 h-2 rounded-full mr-2 ${service.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                {service.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Price</span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">${(typeof service.price === 'number' ? service.price : parseFloat(service.price) || 0).toFixed(2)} AUD</div>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Duration</span>
                              </div>
                              <div className="text-lg font-bold text-gray-900">{durationOptions.find(opt => opt.value === service.duration)?.label || `${service.duration} minutes`}</div>
                            </div>
                            
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">ID</span>
                              </div>
                              <div className="text-sm font-mono text-gray-600 truncate">{service.id}</div>
                            </div>
                          </div>
                          
                          {service.description && (
                            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                              <div className="flex items-center mb-2">
                                <svg className="w-4 h-4 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">Description</span>
                              </div>
                              <p className="text-gray-700">{service.description}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditService(service)}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(service.id!)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                              service.isActive 
                                ? "border-orange-300 text-orange-700 hover:bg-orange-50" 
                                : "border-green-300 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.isActive ? "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" : "M5 13l4 4L19 7"} />
                            </svg>
                            {service.isActive ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(service.id!)}
                            className="border-red-300 text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {localServices.length > 0 && (
          <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200/50 shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900">Services Summary</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Total Services</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{localServices.length}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Active Services</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{localServices.filter(s => s.isActive).length}</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">Price Range</span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ${Math.min(...localServices.map(s => typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0)).toFixed(2)} - ${Math.max(...localServices.map(s => typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
