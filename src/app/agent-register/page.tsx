"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PasswordInput from "@/components/PasswordInput";

export default function AgentRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
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
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    // Phone
    if (!form.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{8,15}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Invalid phone number";
    // Business Name
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
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
                <PasswordInput
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  error={errors.password}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Confirm Password *</label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  error={errors.confirmPassword}
                />
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
              {/* Address field removed */}
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
      
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-green-700 mb-4">Registration Successful!</h3>
            <p className="text-gray-600 text-lg mb-8">Your agent account has been created successfully!</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Your account is now pending approval. You'll receive an email once it's been reviewed.</p>
              <p className="text-sm text-gray-500">You can log in once your account is approved.</p>
            </div>
            <div className="mt-8 space-y-3">
              <Button 
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Go to Login
              </Button>
              <Button 
                onClick={() => {
                  setSuccess(false);
                  setForm({
                    name: "",
                    email: "",
                    phone: "",
                    businessName: "",
                    abn: "",
                    maraOrLawyerNumber: "",
                    businessAddress: "",
                    calendlyUrl: "",
                    photo: null,
                    businessLogo: null,
                    businessRegistration: null,
                    maraCertificate: null,
                    password: "",
                    confirmPassword: "",
                  });
                  setErrors({});
                  setAgreeTerms(false);
                }}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold"
              >
                Register Another Account
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
} 