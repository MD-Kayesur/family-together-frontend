"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Search,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Users,
  Sparkles,
  Circle,
  Image as ImageIcon,
  Heart,
  Pin,
  Check,
} from "lucide-react";
import { useGetMembersQuery } from "@/redux/api/familyApi";
import { useAppSelector } from "@/redux/store";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  avatar?: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status?: "sent" | "delivered" | "read";
  reactions?: string[];
}

interface Conversation {
  id: string;
  name: string;
  type: "GROUP" | "DIRECT";
  avatar?: string;
  roleDescription?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  membersCount?: number;
}

interface MessagesTabProps {
  role?: string;
  currentUserId?: string;
}

export default function MessagesTab({ role = "MEMBER", currentUserId }: MessagesTabProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { data: members = [] } = useGetMembersQuery();

  const [activeFilter, setActiveFilter] = useState<"ALL" | "CHANNELS" | "DIRECT">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversationId, setActiveConversationId] = useState("sanctuary-circle");
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic conversation contacts
  const initialConversations: Conversation[] = [
    {
      id: "sanctuary-circle",
      name: "Family Sanctuary Circle",
      type: "GROUP",
      roleDescription: "Sanctuary-wide Announcements & Chat",
      lastMessage: "Don't forget tomorrow's virtual family reunion at 6 PM!",
      lastMessageTime: "10:30 AM",
      unreadCount: 2,
      online: true,
      membersCount: members.length > 0 ? members.length : 12,
    },
    ...members.slice(0, 6).map((m: any, idx: number) => ({
      id: m.id || `member-${idx}`,
      name: `${m.firstName} ${m.lastName}`.trim(),
      type: "DIRECT" as const,
      avatar: m.photoUrl,
      roleDescription: m.bio || (idx === 0 ? "Sanctuary Owner" : "Family Relative"),
      lastMessage:
        idx === 0
          ? "I updated our family tree with the new documents."
          : idx === 1
          ? "Looking forward to seeing everyone this weekend!"
          : "Shared a new photo in the memories vault!",
      lastMessageTime: `${10 - idx}:15 AM`,
      unreadCount: idx === 1 ? 1 : 0,
      online: idx % 2 === 0,
    })),
  ];

  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);

  // Sync with members if loaded
  useEffect(() => {
    if (members.length > 0) {
      setConversations((prev) => {
        const hasCircle = prev.find((c) => c.id === "sanctuary-circle");
        const directContacts: Conversation[] = members.slice(0, 8).map((m: any, idx: number) => ({
          id: m.id,
          name: `${m.firstName} ${m.lastName}`.trim(),
          type: "DIRECT",
          avatar: m.photoUrl,
          roleDescription: m.bio || (idx === 0 ? "Sanctuary Owner" : "Family Relative"),
          lastMessage:
            idx === 0
              ? "I updated our family tree with the new documents."
              : "Looking forward to seeing everyone this weekend!",
          lastMessageTime: `${10 - idx}:15 AM`,
          unreadCount: idx === 0 ? 1 : 0,
          online: idx % 2 === 0,
        }));

        return hasCircle ? [hasCircle, ...directContacts] : directContacts;
      });
    }
  }, [members]);

  // Message store per conversation
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    "sanctuary-circle": [
      {
        id: "m-1",
        senderId: "owner-1",
        senderName: "Sanctuary Owner",
        text: "Assalamu Alaikum everyone! Welcome to our private FamilyRoots sanctuary chat channel. 🌟",
        timestamp: "9:15 AM",
        isMe: false,
        status: "read",
        reactions: ["❤️", "🙏"],
      },
      {
        id: "m-2",
        senderId: "member-2",
        senderName: "Tariq Rahman",
        text: "Walaykum Assalam! It's wonderful having everyone connected in one unified portal.",
        timestamp: "9:24 AM",
        isMe: false,
        status: "read",
      },
      {
        id: "m-3",
        senderId: currentUserId || "me",
        senderName: user?.fullName || "You",
        text: "So happy to explore our family lineage and connect with all of you here!",
        timestamp: "9:45 AM",
        isMe: true,
        status: "read",
      },
      {
        id: "m-4",
        senderId: "owner-1",
        senderName: "Sanctuary Owner",
        text: "Don't forget tomorrow's virtual family reunion at 6 PM! Everyone can join with one click.",
        timestamp: "10:30 AM",
        isMe: false,
        status: "read",
        reactions: ["🎉", "👍"],
      },
    ],
  });

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const currentMessages = messagesMap[activeConversationId] || [
    {
      id: "intro-1",
      senderId: activeConversation?.id || "other",
      senderName: activeConversation?.name || "Relative",
      text: `Hello! Let's stay connected here in our family sanctuary.`,
      timestamp: "10:00 AM",
      isMe: false,
      status: "read",
    },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId || "me",
      senderName: user?.fullName || "You",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "sent",
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    // Update conversation snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversationId
          ? { ...c, lastMessage: newMsg.text, lastMessageTime: "Just now", unreadCount: 0 }
          : c
      )
    );

    setInputText("");
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === "CHANNELS") return c.type === "GROUP";
    if (activeFilter === "DIRECT") return c.type === "DIRECT";
    return true;
  });

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* 1. Left Sidebar: Contacts & Channels */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-900/90 shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                <MessageSquare className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white leading-tight">
                  Family Messages
                </h3>
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                  Live Sanctuary Chat
                </span>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
              {role}
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search family chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 pt-1">
            {(["ALL", "CHANNELS", "DIRECT"] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeFilter === filter
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {filter === "ALL" ? "All Chats" : filter === "CHANNELS" ? "Channels" : "Direct"}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations Scroll List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-1">
              <MessageSquare className="h-8 w-8 mx-auto text-slate-600 mb-2 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    // Mark as read
                    setConversations((prev) =>
                      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                    );
                  }}
                  className={`w-full p-3 rounded-2xl flex items-start gap-3 transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-purple-950/60 border border-purple-800/70 shadow-md"
                      : "hover:bg-slate-800/60 border border-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={`h-11 w-11 rounded-2xl font-extrabold flex items-center justify-center text-sm shadow-sm ${
                        conv.type === "GROUP"
                          ? "bg-indigo-600 text-white"
                          : "bg-purple-950 text-purple-300 border border-purple-800"
                      }`}
                    >
                      {conv.type === "GROUP" ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        conv.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {conv.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 shadow-sm" />
                    )}
                  </div>

                  {/* Name & Snippet */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isActive ? "text-white" : "text-slate-200"
                        }`}
                      >
                        {conv.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-semibold text-purple-400/80 truncate">
                        {conv.roleDescription}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="h-4 min-w-[16px] px-1 rounded-full bg-purple-600 text-[10px] font-extrabold text-white flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Right Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/80 min-w-0">
        {/* Active Conversation Top Bar */}
        <div className="h-16 shrink-0 px-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-10 w-10 rounded-2xl font-bold flex items-center justify-center text-sm shrink-0 shadow-sm ${
                activeConversation?.type === "GROUP"
                  ? "bg-indigo-600 text-white"
                  : "bg-purple-950 text-purple-300 border border-purple-800"
              }`}
            >
              {activeConversation?.type === "GROUP" ? (
                <Users className="h-5 w-5" />
              ) : (
                activeConversation?.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="min-w-0">
              <h4 className="font-extrabold text-white text-sm truncate flex items-center gap-2">
                <span>{activeConversation?.name}</span>
                {activeConversation?.type === "GROUP" && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-[10px] font-bold text-indigo-300">
                    {activeConversation.membersCount} Members
                  </span>
                )}
              </h4>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {activeConversation?.type === "GROUP"
                    ? "Active sanctuary broadcast channel"
                    : activeConversation?.online
                    ? "Active now"
                    : "Offline"}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Voice Call"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Family Video Gathering"
            >
              <Video className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Timestamp Badge */}
          <div className="flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 shadow-sm">
              Today
            </span>
          </div>

          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              {!msg.isMe && (
                <div className="h-8 w-8 rounded-full bg-purple-950 border border-purple-800 text-purple-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {msg.senderName.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-md lg:max-w-lg space-y-1 ${
                  msg.isMe ? "items-end text-right" : "items-start text-left"
                }`}
              >
                {!msg.isMe && (
                  <span className="text-[10px] font-bold text-slate-400 ml-1">
                    {msg.senderName}
                  </span>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm relative group ${
                    msg.isMe
                      ? "bg-linear-to-br from-purple-600 to-indigo-600 text-white rounded-br-xs"
                      : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Reaction Badges */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      {msg.reactions.map((r, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-1.5 py-0.5 rounded-full bg-slate-950/70 border border-white/10 text-[10px]"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center gap-1.5 text-[10px] text-slate-500 font-medium ${
                    msg.isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isMe && <CheckCheck className="h-3.5 w-3.5 text-purple-400" />}
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Attach media or memories"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${activeConversation?.name || "your family"}...`}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-purple-600/25 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
