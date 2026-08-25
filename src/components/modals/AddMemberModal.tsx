"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Sparkles,
  Loader2,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Camera,
  Heart,
  FileText,
  Building,
} from "lucide-react";
import { useAddMemberMutation } from "@/redux/api/familyApi";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  // Primary Recognition Fields
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");

  // Demographics & Life Status
  const [gender, setGender] = useState("MALE");
  const [isDeceased, setIsDeceased] = useState(false);
  const [dob, setDob] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [dateOfPassing, setDateOfPassing] = useState("");

  // Professional & Residence Details
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addMember, { isLoading }] = useAddMemberMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }

    try {
      await addMember({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        middleName: middleName.trim(),
        nickname: nickname.trim(),
        gender,
        isDeceased,
        dob,
        birthplace: birthplace.trim(),
        dateOfPassing: isDeceased ? dateOfPassing : undefined,
        occupation: occupation.trim(),
        location: location.trim(),
        contactInfo: contactInfo.trim(),
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim(),
      }).unwrap();

      setSuccessMsg("Family member profile & recognition details saved to PostgreSQL Database!");
      setTimeout(() => {
        // Reset form
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setNickname("");
        setGender("MALE");
        setIsDeceased(false);
        setDob("");
        setBirthplace("");
        setDateOfPassing("");
        setOccupation("");
        setLocation("");
        setContactInfo("");
        setAvatarUrl("");
        setBio("");
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to add family member.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <UserPlus className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-xl text-slate-900 dark:text-white leading-tight">
                Add Family Member Profile
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Record personal identification and recognition details into your PostgreSQL sanctuary.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Name & Personal Identification */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>1. Personal Name & Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Omar"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Middle / Maiden Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Naseem"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahman"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Nickname / Known As
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Abba", "Babul", "Choto Kaka"'
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vital Recognition & Demographics */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-stone-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>2. Vital Birth & Life Status</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Place of Birth / Hometown
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {/* Life Status Toggle */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-stone-800/60 border border-slate-200 dark:border-stone-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className={`h-4 w-4 ${isDeceased ? "text-slate-400" : "text-rose-500"}`} />
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {isDeceased ? "Person is Deceased" : "Person is Living"}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-700" />
              </label>
            </div>

            {isDeceased && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Date of Passing
                </label>
                <input
                  type="date"
                  value={dateOfPassing}
                  onChange={(e) => setDateOfPassing(e.target.value)}
                  className="w-full max-w-sm px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>
            )}
          </div>

          {/* Section 3: Occupation, Location & Recognition Photo */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-stone-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>3. Occupation, Location & Profile Photo</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Profession / Occupation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Civil Engineer, Professor"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Current City / Country of Residence
                </label>
                <input
                  type="text"
                  placeholder="e.g. London, United Kingdom"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Contact Phone / Email
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0192 / omar@gmail.com"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                Biography, Achievements & Distinction Notes
              </label>
              <textarea
                rows={3}
                placeholder="Add biography, key achievements, historical details, or distinguishing features..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 bg-slate-50 dark:bg-stone-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-medium resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-stone-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/25 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save Member Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
