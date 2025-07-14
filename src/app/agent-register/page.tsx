"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    businessLogo: null as File | null, // NEW
    businessRegistration: null as File | null,
    maraCertificate: null as File | null,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

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
    // Password
    if (!form.password) newErrors.password = "Password is required";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
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
    // Business Logo (optional)
    if (form.businessLogo) {
      if (!form.businessLogo.type.startsWith("image/")) newErrors.businessLogo = "Business logo must be an image file";
      if (form.businessLogo.size > 5 * 1024 * 1024) newErrors.businessLogo = "Business logo must be less than 5MB";
    }
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to the terms and conditions.";
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
      if (key !== "confirmPassword" && value) formData.append(key, value as any);
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
          businessLogo: null, // NEW
          businessRegistration: null,
          maraCertificate: null,
          password: "",
          confirmPassword: "",
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {/* Left: Marketing/Brand Panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-[30%] bg-gradient-to-br from-green-200 via-green-400 to-green-600 text-white p-10">
          <div className="max-w-xs text-center">
            <h2 className="text-2xl font-extrabold mb-4">A few clicks away from creating your MaraPlace Agent Profile</h2>
            <p className="mb-8 text-green-100">Showcase your expertise, connect with clients, and grow your business on MaraPlace.</p>
            <div className="w-full flex justify-center mb-4">
              {/* Placeholder for illustration */}
              <svg width="120" height="90" viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="100" height="70" rx="12" fill="#fff" fillOpacity="0.15" />
                <rect x="25" y="25" width="70" height="40" rx="8" fill="#fff" fillOpacity="0.25" />
                <rect x="40" y="40" width="40" height="10" rx="4" fill="#fff" fillOpacity="0.4" />
              </svg>
            </div>
          </div>
        </div>
        {/* Right: Registration Form */}
        <div className="flex flex-col justify-center items-center w-full md:w-[70%] bg-white dark:bg-gray-900">
          <form
            className="w-11/12 md:w-[90%] bg-white dark:bg-gray-900 rounded-none shadow-none p-0 space-y-6 mx-auto"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <h1 className="text-2xl font-bold mb-2 text-green-700 dark:text-green-400">Register</h1>
            <p className="mb-6 text-gray-500 dark:text-gray-300 text-sm">Manage your agent profile efficiently. Fill in your details to get started.</p>
            {success && <div className="text-green-600 text-center mb-4">Registration successful!</div>}
            {errors.form && <div className="text-red-500 text-center mb-4">{errors.form}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block font-medium mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
              </div>
            </div>
            {/* Additional fields below the grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                <label className="block font-medium mb-1">MARA or Lawyer Number *</label>
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
                <label className="block font-medium mb-1">Calendly URL</label>
                <input
                  type="url"
                  name="calendlyUrl"
                  value={form.calendlyUrl}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {errors.calendlyUrl && <div className="text-red-500 text-xs mt-1">{errors.calendlyUrl}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Photo</label>
                <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:border-green-400 transition w-full">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Choose File</span>
                  <span className="text-gray-500 text-sm truncate">{form.photo instanceof File ? form.photo.name : "No file chosen"}</span>
                </label>
                {errors.photo && <div className="text-red-500 text-xs mt-1">{errors.photo}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Business Logo</label>
                <input
                  type="file"
                  name="businessLogo"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                {form.businessLogo && (
                  <div className="mt-2 text-xs text-gray-500">Selected: {form.businessLogo.name}</div>
                )}
                {errors.businessLogo && <div className="text-red-500 text-xs mt-1">{errors.businessLogo}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">Business Registration (PDF/Image)</label>
                <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:border-green-400 transition w-full">
                  <input
                    type="file"
                    name="businessRegistration"
                    accept="application/pdf,image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Choose File</span>
                  <span className="text-gray-500 text-sm truncate">{form.businessRegistration instanceof File ? form.businessRegistration.name : "No file chosen"}</span>
                </label>
                {errors.businessRegistration && <div className="text-red-500 text-xs mt-1">{errors.businessRegistration}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1">MARA Certificate (PDF/Image)</label>
                <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm hover:border-green-400 transition w-full">
                  <input
                    type="file"
                    name="maraCertificate"
                    accept="application/pdf,image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Choose File</span>
                  <span className="text-gray-500 text-sm truncate">{form.maraCertificate instanceof File ? form.maraCertificate.name : "No file chosen"}</span>
                </label>
                {errors.maraCertificate && <div className="text-red-500 text-xs mt-1">{errors.maraCertificate}</div>}
              </div>
            </div>
            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mr-2 accent-green-600 w-5 h-5 rounded border-gray-300 focus:ring-green-400"
                required
              />
              <label htmlFor="agreeTerms" className="text-sm text-gray-700 dark:text-gray-300">
                I agree to the <a href="/terms" className="text-green-700 underline hover:text-green-900" target="_blank" rel="noopener noreferrer">terms and conditions</a>.
              </label>
            </div>
            {errors.agreeTerms && <div className="text-red-500 text-xs mt-1">{errors.agreeTerms}</div>}
            <Button type="submit" className="w-full mt-6 py-3 text-lg rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow">Register</Button>
            <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-300">
              Already have an account?{' '}
              <Link href="/login" className="text-green-700 hover:underline font-semibold">Log in</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
} 