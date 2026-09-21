"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Sparkles,
  Loader2,
  User,
  Calendar,
  MapPin,
  Briefcase,
  Camera,
  Heart,
  FileText,
  KeyRound,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Info,
  Link2,
  CheckCircle2,
  Search,
  ArrowLeft,
  X,
} from "lucide-react";
import {
  useAddMemberMutation,
  useGetMembersQuery,
  useGetRelationshipsQuery,
  FamilyMemberRecord,
} from "@/redux/api/familyApi";
import { useAppSelector } from "@/redux/store";

interface CreateMemberFormProps {
  role?: string;
}

export default function CreateMemberForm({ role }: CreateMemberFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryRelativeTo = searchParams.get("relativeTo");
  const queryRelativeToName = searchParams.get("relativeToName");
  const fromTab = searchParams.get("from") || "members";

  const { user } = useAppSelector((state) => state.auth);
  const activeRole = role || user?.role || "MEMBER";
  const isMember = activeRole === "MEMBER";

  // Fetch existing members from database
  const { data: existingMembers = [], refetch: refetchMembers } = useGetMembersQuery();
  const { refetch: refetchRelationships } = useGetRelationshipsQuery();

  // Determine current member profile if user is a member
  const currentMember = existingMembers.find(
    (m: any) =>
      (user?.id && (m.userId === user.id || m.user?.id === user.id)) ||
      (user?.email &&
        (m.email?.toLowerCase() === user.email.toLowerCase() ||
          m.user?.email?.toLowerCase() === user.email.toLowerCase()))
  );

  const resolvedRelativeToId = queryRelativeTo || (isMember ? currentMember?.id : undefined);
  const resolvedRelativeToName =
    queryRelativeToName ||
    (currentMember ? `${currentMember.firstName} ${currentMember.lastName}` : undefined);

  // Relationship selection when adding a relative
  const [relationshipType, setRelationshipType] = useState("CHILD");

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

  // Platform User Account & Login Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Professional & Residence Details
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  // Deduplication & Linking State
  const [selectedLinkedMember, setSelectedLinkedMember] = useState<FamilyMemberRecord | null>(null);
  const [previewMemberDetails, setPreviewMemberDetails] = useState<FamilyMemberRecord | null>(null);

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [addMember, { isLoading }] = useAddMemberMutation();

  // Navigation target back
  const backTarget = isMember
    ? `/user-dashboard?tab=${fromTab}`
    : `/owner-dashboard?tab=${fromTab}`;

  // Real-time suggestions filtering based on entered names
  const queryStr = `${firstName} ${lastName} ${nickname}`.trim().toLowerCase();

  const suggestedDuplicateMembers =
    queryStr.length >= 2
      ? existingMembers.filter((m: any) => {
          const fullName = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
          const nick = (m.nickname || "").toLowerCase();
          const em = (m.email || "").toLowerCase();
          return (
            fullName.includes(queryStr) ||
            queryStr.split(" ").some((part) => part.length >= 2 && fullName.includes(part)) ||
            (nick && nick.includes(queryStr)) ||
            (em && em.includes(queryStr))
          );
        })
      : [];

  const handleSelectExistingMember = (member: FamilyMemberRecord) => {
    setSelectedLinkedMember(member);
    setFirstName(member.firstName || "");
    setLastName(member.lastName || "");
    if ((member as any).bio) setBio((member as any).bio);
    if ((member as any).email) setEmail((member as any).email);
    if ((member as any).photoUrl) setAvatarUrl((member as any).photoUrl);
    setPreviewMemberDetails(null);
  };

  const handleClearLink = () => {
    setSelectedLinkedMember(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setBio("");
    setAvatarUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg("First Name and Last Name are required.");
      return;
    }

    try {
      if (selectedLinkedMember) {
        await addMember({
          existingPersonId: selectedLinkedMember.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          relativeToPersonId: resolvedRelativeToId || undefined,
          relationshipType: resolvedRelativeToId ? relationshipType : undefined,
        }).unwrap();

        setSuccessMsg(
          `Linked existing person profile "${selectedLinkedMember.firstName} ${selectedLinkedMember.lastName}" cleanly to family sanctuary. Duplicate entry prevented!`
        );
      } else {
        await addMember({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          middleName: middleName.trim(),
          nickname: nickname.trim(),
          email: email.trim() || undefined,
          password: password.trim() || undefined,
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
          relativeToPersonId: resolvedRelativeToId || undefined,
          relationshipType: resolvedRelativeToId ? relationshipType : undefined,
        }).unwrap();

        setSuccessMsg(
          email.trim()
            ? `Relative added successfully! Active login account created for ${email.trim()} with password "${password.trim() || "Family@123"}".`
            : "Family relative profile and recognition details saved to PostgreSQL Database!"
        );
      }

      refetchMembers();
      refetchRelationships();

      setTimeout(() => {
        router.push(backTarget);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err?.data?.message || "Failed to add family member.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Back Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={backTarget}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-bold shadow-sm group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-purple-400" />
          <span>Back to {fromTab === "tree" ? "Family Tree" : "Family Directory"}</span>
        </Link>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          <span>Sanctuary</span> &gt;{" "}
          <span>{fromTab === "tree" ? "Tree" : "Members"}</span> &gt;{" "}
          <span className="text-purple-400 font-bold">
            {isMember || resolvedRelativeToId ? "Add Relative" : "Add Member"}
          </span>
        </div>
      </div>

      {/* Main Page Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 shrink-0">
              <UserPlus className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl text-white leading-tight">
                {isMember || resolvedRelativeToId ? "Add Family Relative" : "Add Family Member Profile"}
              </h1>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {resolvedRelativeToName
                  ? `Adding a relative connected to ${resolvedRelativeToName} in your family sanctuary.`
                  : "Record personal identification, lineage relationships, and recognition details into your PostgreSQL sanctuary."}
              </p>
            </div>
          </div>

          {/* Role / Auto-connection Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-900/60 text-purple-300 text-xs font-bold self-start sm:self-auto">
            <UserCheck className="h-4 w-4 text-purple-400" />
            <span>
              {isMember ? "Adding as Family Member" : "Owner / Administrator Access"}
            </span>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Banner: Linked Existing Member Active */}
        {selectedLinkedMember && (
          <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-200 text-xs font-medium flex items-center justify-between gap-3 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <span className="font-extrabold text-white">
                  Linked Existing Profile: {selectedLinkedMember.firstName} {selectedLinkedMember.lastName}
                </span>
                <p className="text-[11px] text-indigo-300 font-medium">
                  Submitting will link this existing person to the sanctuary. No duplicate database row will be created.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearLink}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-indigo-800 text-indigo-300 hover:bg-slate-800 font-bold text-[11px] cursor-pointer"
            >
              Clear Link
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Relationship to Member Selector */}
          {(resolvedRelativeToId || isMember) && (
            <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-800/60 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Heart className="h-4 w-4 text-purple-400" />
                  <span>Relationship to You {resolvedRelativeToName ? `(${resolvedRelativeToName})` : ""}:</span>
                </div>
                <span className="text-[10px] text-purple-400/80 font-semibold">
                  Auto-adjusts gender
                </span>
              </div>

              <select
                value={relationshipType}
                onChange={(e) => {
                  const val = e.target.value;
                  setRelationshipType(val);
                  if (val === "FATHER" || val === "SON" || val === "BROTHER") {
                    setGender("MALE");
                  } else if (val === "MOTHER" || val === "DAUGHTER" || val === "SISTER") {
                    setGender("FEMALE");
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-700/60 bg-slate-950 text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="FATHER">Father (Parent)</option>
                <option value="MOTHER">Mother (Parent)</option>
                <option value="SPOUSE">Spouse / Partner</option>
                <option value="SON">Son (Child)</option>
                <option value="DAUGHTER">Daughter (Child)</option>
                <option value="BROTHER">Brother (Sibling)</option>
                <option value="SISTER">Sister (Sibling)</option>
                <option value="PARENT_CHILD">Other Relative</option>
              </select>
            </div>
          )}

          {/* Section 1: Name & Personal Identification */}
          <div className="space-y-3 relative">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>1. Personal Name &amp; Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Omar"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Middle / Maiden Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Naseem"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahman"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  required
                />
              </div>
            </div>

            {/* Smart Suggestions Dropdown for Duplicate Prevention */}
            {!selectedLinkedMember && suggestedDuplicateMembers.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <div className="flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-amber-400" />
                    <span>Matching existing members found in database ({suggestedDuplicateMembers.length}):</span>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-medium">
                    Click <Eye className="h-3 w-3 inline text-purple-400" /> to preview details or link to prevent duplicate
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {suggestedDuplicateMembers.map((member: any) => (
                    <div
                      key={member.id}
                      className="p-2.5 rounded-xl bg-slate-950 border border-amber-900/40 flex items-center justify-between gap-2 shadow-xs hover:border-purple-500 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-extrabold flex items-center justify-center text-xs overflow-hidden shrink-0">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`
                          )}
                        </div>

                        <div>
                          <div className="font-extrabold text-white text-xs">
                            {member.firstName} {member.lastName}
                            {(member.nickname || (member as any).user?.email) && (
                              <span className="text-[10px] text-slate-400 font-medium ml-1.5">
                                ({member.nickname || (member as any).user?.email})
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-md">
                            {member.bio || "Existing family record in database"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setPreviewMemberDetails(member)}
                          title="Preview full profile details"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4 w-4 text-purple-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectExistingMember(member)}
                          className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Link2 className="h-3 w-3" />
                          <span>Link Person</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Nickname / Known As
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Abba", "Babul", "Choto Kaka"'
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                >
                  <option value="MALE" className="bg-slate-950 text-white">Male</option>
                  <option value="FEMALE" className="bg-slate-950 text-white">Female</option>
                  <option value="OTHER" className="bg-slate-950 text-white">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Vital Recognition & Demographics */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Heart className="h-4 w-4" />
              <span>2. Life Status &amp; Demographics</span>
            </h3>

            <div className="flex items-center gap-4 py-1">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                <input
                  type="checkbox"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500"
                />
                <span>Is Deceased / Remembranced Relative</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-purple-400" />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-purple-400" />
                  <span>Birthplace / Homeland</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            {isDeceased && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-900/40 space-y-2 animate-fadeIn">
                <label className="block font-bold text-rose-300 mb-1">
                  Date of Passing / Departure
                </label>
                <input
                  type="date"
                  value={dateOfPassing}
                  onChange={(e) => setDateOfPassing(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-rose-800 bg-slate-950 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                />
              </div>
            )}
          </div>

          {/* Section 3: Professional & Contact Details */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" />
              <span>3. Occupation, Contact &amp; Bio</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Occupation / Profession
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Civil Engineer"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  Current Residence / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Toronto, Canada"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                <Camera className="h-3.5 w-3.5 text-purple-400" />
                <span>Avatar Photo URL (Optional)</span>
              </label>
              <input
                type="url"
                placeholder="e.g. https://images.unsplash.com/photo-..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-purple-400" />
                <span>Biography / Life Summary Notes</span>
              </label>
              <textarea
                rows={3}
                placeholder="Write a brief life story, milestone memories, or family legacy notes..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium resize-none"
              />
            </div>
          </div>

          {/* Section 4: Login Credentials & User Account */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>4. Account Credentials &amp; Login Access</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active USER Role
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Provide an email address to automatically create an active user login. This member will be able to log in directly to explore their family tree and credentials.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-purple-400" />
                  <span>Member Email (Gmail)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. member@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1">
                  <KeyRound className="h-3.5 w-3.5 text-purple-400" />
                  <span>Initial Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="e.g. Family@123 (Defaults if blank)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-800">
            <Link
              href={backTarget}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-300 font-bold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02]"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {selectedLinkedMember
                  ? `Link "${selectedLinkedMember.firstName}" (Prevent Duplicate)`
                  : "Save Relative Profile"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Member Details Preview Modal */}
      {previewMemberDetails && (
        <div className="fixed inset-0 top-16 md:left-64 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm">
                <Info className="h-4 w-4" />
                <span>Existing Member Profile Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewMemberDetails(null)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <div className="h-20 w-20 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 font-extrabold flex items-center justify-center text-xl mx-auto overflow-hidden shadow-md">
                {previewMemberDetails.photoUrl ? (
                  <img src={previewMemberDetails.photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  `${previewMemberDetails.firstName?.[0] || ""}${previewMemberDetails.lastName?.[0] || ""}`
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-white">
                  {previewMemberDetails.firstName} {previewMemberDetails.lastName}
                </h3>
                <p className="text-xs text-purple-400 font-semibold">
                  Gender: {previewMemberDetails.gender || "Not specified"}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 space-y-2 text-xs text-slate-300 border border-slate-800">
              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-slate-400">Database ID:</span>
                <span className="font-mono text-[10px] text-slate-400">{previewMemberDetails.id}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-1.5">
                <span className="font-bold text-slate-400">Member Status:</span>
                <span className="font-bold text-emerald-400">Active Sanctuary Relative</span>
              </div>

              {previewMemberDetails.bio && (
                <div className="pt-1">
                  <span className="font-bold text-slate-400 block mb-0.5">Bio / Notes:</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {previewMemberDetails.bio}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPreviewMemberDetails(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Preview
              </button>
              <button
                type="button"
                onClick={() => handleSelectExistingMember(previewMemberDetails)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Select &amp; Link Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
