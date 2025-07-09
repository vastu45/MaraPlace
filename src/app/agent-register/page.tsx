"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <span className="text-2xl font-extrabold text-green-600 tracking-tight">MaraPlace</span>
        <div className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-gray-200">
          <Link href="/" className="hover:text-green-600">Home</Link>
          <Link href="/agent-register" className="hover:text-green-600">Register as Agent</Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-8 mt-12 text-center text-gray-600 dark:text-gray-400">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="font-bold text-green-600 text-lg">MaraPlace</div>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-green-600">About</Link>
          <Link href="#" className="hover:text-green-600">Contact</Link>
          <Link href="#" className="hover:text-green-600">Terms</Link>
          <Link href="#" className="hover:text-green-600">Privacy</Link>
        </div>
        <div className="text-xs mt-2 md:mt-0">&copy; {new Date().getFullYear()} MaraPlace. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default function AgentRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    address: "",
    abn: "",
    maraOrLawyerNumber: "",
    businessAddress: "",
    calendlyUrl: "",
    photo: null as File | null,
    businessRegistration: null as File | null,
    maraCertificate: null as File | null,
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (files) {
      setForm(f => ({ ...f, [name]: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function validate() {
    const newErrors: { [k: string]: string } = {};
    // Name
    if (!form.name.trim()) newErrors.name = "Name is required";
    // Email
    if (!form.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Invalid email format";
    // Phone
    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{8,15}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Invalid phone number";
    // Business Name
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
    // Address
    if (!form.address.trim()) newErrors.address = "Address is required";
    // ABN
    if (!form.abn) newErrors.abn = "ABN is required";
    else if (!/^\d{9,11}$/.test(form.abn.replace(/\D/g, ''))) newErrors.abn = "Invalid ABN (should be 9-11 digits)";
    // MARA/Lawyer Number
    if (!form.maraOrLawyerNumber.trim()) newErrors.maraOrLawyerNumber = "MARA or Lawyer Number is required";
    // Business Address
    if (!form.businessAddress.trim()) newErrors.businessAddress = "Business address is required";
    // Calendly URL (optional)
    if (form.calendlyUrl && !/^https?:\/\//.test(form.calendlyUrl)) newErrors.calendlyUrl = "Calendly URL must start with http:// or https://";
    // Photo (optional)
    if (form.photo) {
      if (!form.photo.type.startsWith("image/")) newErrors.photo = "Photo must be an image file";
      if (form.photo.size > 5 * 1024 * 1024) newErrors.photo = "Photo must be less than 5MB";
    }
    // Business Registration (optional)
    if (form.businessRegistration) {
      if (!/(pdf|image)/.test(form.businessRegistration.type)) newErrors.businessRegistration = "Business registration must be PDF or image";
      if (form.businessRegistration.size > 5 * 1024 * 1024) newErrors.businessRegistration = "File must be less than 5MB";
    }
    // MARA Certificate (optional)
    if (form.maraCertificate) {
      if (!/(pdf|image)/.test(form.maraCertificate.type)) newErrors.maraCertificate = "MARA certificate must be PDF or image";
      if (form.maraCertificate.size > 5 * 1024 * 1024) newErrors.maraCertificate = "File must be less than 5MB";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSuccess(false);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value as any);
    });
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          businessName: "",
          address: "",
          abn: "",
          maraOrLawyerNumber: "",
          businessAddress: "",
          calendlyUrl: "",
          photo: null,
          businessRegistration: null,
          maraCertificate: null,
        });
        setErrors({});
      } else {
        const data = await res.json();
        setErrors({ form: data.error || "Registration failed" });
      }
    } catch (err) {
      setErrors({ form: "Registration failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4">
        <form
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h1 className="text-2xl font-bold mb-4 text-center text-green-700 dark:text-green-400">Migration Agent Registration</h1>
          {success && <div className="text-green-600 text-center mb-4">Registration successful!</div>}
          {errors.form && <div className="text-red-500 text-center mb-4">{errors.form}</div>}
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.businessName && <div className="text-red-500 text-xs mt-1">{errors.businessName}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.address && <div className="text-red-500 text-xs mt-1">{errors.address}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">ABN *</label>
              <input
                type="text"
                name="abn"
                value={form.abn}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.abn && <div className="text-red-500 text-xs mt-1">{errors.abn}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">MARA Number or Lawyer Number *</label>
              <input
                type="text"
                name="maraOrLawyerNumber"
                value={form.maraOrLawyerNumber}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.maraOrLawyerNumber && <div className="text-red-500 text-xs mt-1">{errors.maraOrLawyerNumber}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Business Address *</label>
              <input
                type="text"
                name="businessAddress"
                value={form.businessAddress}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.businessAddress && <div className="text-red-500 text-xs mt-1">{errors.businessAddress}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Calendly Booking Link (optional)</label>
              <input
                type="url"
                name="calendlyUrl"
                value={form.calendlyUrl}
                onChange={handleChange}
                placeholder="https://calendly.com/your-link"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              {errors.calendlyUrl && <div className="text-red-500 text-xs mt-1">{errors.calendlyUrl}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Agent Photo (optional)</label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {errors.photo && <div className="text-red-500 text-xs mt-1">{errors.photo}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">Business Registration File (optional)</label>
              <input
                type="file"
                name="businessRegistration"
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {errors.businessRegistration && <div className="text-red-500 text-xs mt-1">{errors.businessRegistration}</div>}
            </div>
            <div>
              <label className="block font-medium mb-1">MARA Certificate File (optional)</label>
              <input
                type="file"
                name="maraCertificate"
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
              {errors.maraCertificate && <div className="text-red-500 text-xs mt-1">{errors.maraCertificate}</div>}
            </div>
          </div>
          <Button type="submit" className="w-full text-lg" disabled={submitting}>
            {submitting ? "Registering..." : "Register as Agent"}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
} 