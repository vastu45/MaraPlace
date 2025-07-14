"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const initialProfile = {
  fullName: "",
  marnOrLpn: "",
  mobile: "",
  email: "",
  profilePicture: "",
  businessLogo: "",
  abn: "",
  businessName: "",
  businessEmail: "",
  languages: "",
  areasOfPractice: "",
  industries: "",
  officeAddress: "",
  aboutCompany: "",
  stripeOnboarding: false,
  calendarConnected: false,
  consultancyFee: "",
  consultancyAgreement: false,
};

export default function EditProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [logoPreview, setLogoPreview] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [consultancyFee, setConsultancyFee] = useState("");
  const [agreementUploaded, setAgreementUploaded] = useState(false);
  const [availability, setAvailability] = useState([
    { day: "Mon", start: "09:00", end: "17:00", unavailable: false },
    { day: "Tue", start: "09:00", end: "17:00", unavailable: false },
    { day: "Wed", start: "09:00", end: "17:00", unavailable: false },
    { day: "Thu", start: "09:00", end: "17:00", unavailable: false },
    { day: "Fri", start: "09:00", end: "17:00", unavailable: false },
    { day: "Sat", start: "09:00", end: "17:00", unavailable: true },
    { day: "Sun", start: "09:00", end: "17:00", unavailable: true },
  ]);

  const updateAvailability = (idx: number, field: string, value: any) => {
    setAvailability(prev => prev.map((d, i) =>
      i === idx ? { ...d, [field]: value, ...(field === 'unavailable' && value ? { start: "09:00", end: "17:00" } : {}) } : d
    ));
  };

  const handleAgreementUpload = () => {
    // TODO: Implement file upload logic
    setAgreementUploaded(true);
    alert("Agreement uploaded (placeholder)");
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setProfile({ ...profile, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      if (name === "profilePicture") {
        setPhotoPreview(URL.createObjectURL(file));
      } else if (name === "businessLogo") {
        setLogoPreview(URL.createObjectURL(file));
      }
      setProfile({ ...profile, [name]: file });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: Implement backend update logic
    alert("Profile saved (not yet connected to backend)");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center py-10 px-2">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center text-green-700">Edit Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile fields */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">MARN or LPN</label>
                <input name="marnOrLpn" value={profile.marnOrLpn} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile</label>
                <input name="mobile" value={profile.mobile} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input name="email" value={profile.email} onChange={handleChange} className="w-full border rounded px-3 py-2" type="email" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="w-full" />
                {photoPreview && <img src={photoPreview} alt="Profile Preview" className="mt-2 w-20 h-20 rounded-full object-cover" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Logo</label>
                <input name="businessLogo" type="file" accept="image/*" onChange={handleChange} className="w-full" />
                {logoPreview && <img src={logoPreview} alt="Logo Preview" className="mt-2 w-20 h-20 object-contain bg-gray-100 rounded" />}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ABN</label>
                <input name="abn" value={profile.abn} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Name</label>
                <input name="businessName" value={profile.businessName} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Email</label>
                <input name="businessEmail" value={profile.businessEmail} onChange={handleChange} className="w-full border rounded px-3 py-2" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Languages</label>
                <input name="languages" value={profile.languages} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. English, Hindi" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Areas of Practice</label>
                <input name="areasOfPractice" value={profile.areasOfPractice} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Student Visa, Work Visa" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industries</label>
                <input name="industries" value={profile.industries} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Education, Health" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Office Address</label>
                <input name="officeAddress" value={profile.officeAddress} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">About Company</label>
                <textarea name="aboutCompany" value={profile.aboutCompany} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <label className="block text-sm font-medium">Stripe Onboarding</label>
                <input name="stripeOnboarding" type="checkbox" checked={profile.stripeOnboarding} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 flex items-center gap-4">
                <label className="block text-sm font-medium">Connect your Calendar</label>
                <input name="calendarConnected" type="checkbox" checked={profile.calendarConnected} onChange={handleChange} />
              </div>
              {/* --- Consultancy Settings Fields --- */}
              <div className="md:col-span-2 border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4 text-green-700">Consultancy Settings</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Consultancy fee per session (AUD)</label>
                  <input type="number" min="0" step="0.01" value={consultancyFee} onChange={e => setConsultancyFee(e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Time per session</label>
                  <div className="bg-gray-50 border rounded px-3 py-2">30 Minutes</div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Availability</label>
                  <div className="space-y-2">
                    {availability.map((day, idx) => (
                      <div key={day.day} className="flex items-center gap-2">
                        <span className="w-16 font-medium">{day.day}</span>
                        <input type="time" value={day.start} onChange={e => updateAvailability(idx, 'start', e.target.value)} className="border rounded px-2 py-1" disabled={day.unavailable} />
                        <span>-</span>
                        <input type="time" value={day.end} onChange={e => updateAvailability(idx, 'end', e.target.value)} className="border rounded px-2 py-1" disabled={day.unavailable} />
                        <label className="ml-2 text-xs"><input type="checkbox" checked={day.unavailable} onChange={e => updateAvailability(idx, 'unavailable', e.target.checked)} /> Unavailable</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Calendar setting</label>
                  <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                    <span className="inline-block"><img src="/google-calendar.svg" alt="Google Calendar" className="w-6 h-6" /></span>
                    <span>Google Calendar</span>
                    <Button size="sm" className="ml-auto">Connect</Button>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-1">Consultancy Terms & Conditions Agreement</label>
                  <div className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-2">
                    <span>{agreementUploaded ? "Agreement uploaded" : "Agreement not uploaded"}</span>
                    <Button size="sm" className="ml-auto" onClick={handleAgreementUpload}>Upload agreement</Button>
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">Save Changes</Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
} 