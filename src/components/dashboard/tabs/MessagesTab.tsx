"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
  ArrowLeft,
  ShieldAlert,
  Lock,
  UserCheck,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import { useGetMembersQuery } from "@/redux/api/familyApi";
import {
  useGetConversationsQuery,
  useGetConversationMessagesQuery,
  useSendChatMessageMutation,
  useMarkConversationAsReadMutation,
  useCreateConversationMutation,
  useUpdateChatMessageMutation,
  useDeleteChatMessageMutation,
  useDeleteConversationMutation,
  useGetOnlineUsersQuery,
  useGetChatUsersQuery,
} from "@/redux/api/chatApi";
import { useAppSelector } from "@/redux/store";
import { getBackendUrl } from "@/lib/apiConfig";
import { getAuthToken } from "@/lib/utils/cookieUtils";

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

interface LastActiveDetail {
  relativeText: string;
  exactTimeStr: string;
  combinedText: string;
  fullTooltip: string;
}

interface Conversation {
  id: string;
  name: string;
  type: "GROUP" | "DIRECT";
  avatar?: string;
  roleDescription?: string;
  targetRole?: string;
  isOwnerTarget?: boolean;
  canMessage?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  lastActiveText?: string;
  lastActiveCombined?: string;
  lastActiveExactTime?: string;
  lastActiveTooltip?: string;
  lastActiveAt?: string;
  membersCount?: number;
  recipientId?: string;
}

function formatLastActive(timestamp?: string | null, nowMs: number = Date.now()): LastActiveDetail {
  if (!timestamp) {
    return {
      relativeText: "Offline",
      exactTimeStr: "",
      combinedText: "Offline",
      fullTooltip: "Offline • No activity timestamp recorded",
    };
  }
  try {
    const date = new Date(timestamp);
    const time = date.getTime();
    if (isNaN(time)) {
      return {
        relativeText: "Offline",
        exactTimeStr: "",
        combinedText: "Offline",
        fullTooltip: "Offline",
      };
    }
    const diffMs = nowMs - time;
    // Guard against negative clock offset between server and client
    const elapsedSec = Math.max(0, Math.floor(diffMs / 1000));
    const elapsedMin = Math.floor(elapsedSec / 60);
    const elapsedHour = Math.floor(elapsedMin / 60);
    const elapsedDay = Math.floor(elapsedHour / 24);

    const timeFormatted = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    const dateFormatted = date.toLocaleDateString([], { month: "short", day: "numeric" });
    const fullDateFormatted = date.toLocaleDateString([], { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    const fullTooltip = `Last seen: ${fullDateFormatted} at ${timeFormatted}`;

    let relativeText = "Active just now";
    let combinedText = `Active just now • ${timeFormatted}`;

    // Exact threshold logic requested:
    // < 1 minute: Active just now
    // < 60 minutes: Active 5m ago, Active 15m ago, etc.
    // < 24 hours: Active 2h ago, Active 8h ago, etc.
    // 1 to 2 days: Active yesterday
    // > 2 days: Active 3d ago or exact date
    if (elapsedMin < 1) {
      relativeText = "Active just now";
      combinedText = `Active just now • ${timeFormatted}`;
    } else if (elapsedMin < 60) {
      relativeText = `Active ${elapsedMin}m ago`;
      combinedText = `Active ${elapsedMin}m ago • ${timeFormatted}`;
    } else if (elapsedHour < 24) {
      relativeText = `Active ${elapsedHour}h ago`;
      combinedText = `Active ${elapsedHour}h ago • ${timeFormatted}`;
    } else if (elapsedDay === 1 || (elapsedHour >= 24 && elapsedHour < 48)) {
      relativeText = "Active yesterday";
      combinedText = `Active yesterday • ${timeFormatted}`;
    } else if (elapsedDay < 7) {
      relativeText = `Active ${elapsedDay}d ago`;
      combinedText = `Active ${elapsedDay}d ago • ${dateFormatted} ${timeFormatted}`;
    } else {
      relativeText = `Active ${dateFormatted}`;
      combinedText = `Active ${dateFormatted} • ${timeFormatted}`;
    }

    return {
      relativeText,
      exactTimeStr: timeFormatted,
      combinedText,
      fullTooltip,
    };
  } catch {
    return {
      relativeText: "Offline",
      exactTimeStr: "",
      combinedText: "Offline",
      fullTooltip: "Offline",
    };
  }
}

interface MessagesTabProps {
  role?: string;
  currentUserId?: string;
}

export default function MessagesTab({ role = "MEMBER", currentUserId }: MessagesTabProps) {
  const { user } = useAppSelector((state) => state.auth);
  const myUserId = currentUserId || user?.id || "";
  const myRole = role || user?.role || "MEMBER";

  // RTK Queries
  const { data: members = [] } = useGetMembersQuery();
  const { data: dbConversations = [], refetch: refetchConversations } = useGetConversationsQuery(undefined, {
    pollingInterval: 5000,
  });
  const { data: chatUsers = [], refetch: refetchChatUsers } = useGetChatUsersQuery(undefined, {
    pollingInterval: 8000,
  });
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);

  const { data: dbMessages = [], refetch: refetchMessages } = useGetConversationMessagesQuery(
    activeConversationId,
    { skip: !activeConversationId }
  );

  const [sendChatMessage] = useSendChatMessageMutation();
  const [markConversationAsRead] = useMarkConversationAsReadMutation();
  const [createConversation] = useCreateConversationMutation();
  const [updateChatMessage, { isLoading: isUpdatingMessage }] = useUpdateChatMessageMutation();
  const [deleteChatMessage, { isLoading: isDeletingMessage }] = useDeleteChatMessageMutation();
  const [deleteConversation, { isLoading: isDeletingConversation }] = useDeleteConversationMutation();
  const { data: onlineUsersData } = useGetOnlineUsersQuery(undefined, {
    pollingInterval: 10000,
  });

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [lastActiveMap, setLastActiveMap] = useState<Record<string, string>>({});

  const [mounted, setMounted] = useState(false);
  // Real-time ticking state: initialized safely on client mount to eliminate SSR hydration mismatch
  const [nowTimestamp, setNowTimestamp] = useState<number>(0);

  useEffect(() => {
    setMounted(true);
    setNowTimestamp(Date.now());
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Initialize online users and last active timestamps from initial REST fetch
  useEffect(() => {
    if (onlineUsersData?.onlineUserIds) {
      setOnlineUserIds(new Set(onlineUsersData.onlineUserIds));
    }
    if (onlineUsersData?.lastActiveMap) {
      setLastActiveMap((prev) => ({ ...prev, ...onlineUsersData.lastActiveMap }));
    }
  }, [onlineUsersData]);

  const [activeFilter, setActiveFilter] = useState<"ALL" | "CONVERSATIONS" | "USERS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [inputText, setInputText] = useState("");
  const [isTypingRemote, setIsTypingRemote] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [authExpired, setAuthExpired] = useState(false);

  // Message Editing & Deletion State
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [isDeleteConvModalOpen, setIsDeleteConvModalOpen] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Stable refs to prevent effect recreation & unnecessary disconnect storms
  const refetchConversationsRef = useRef(refetchConversations);
  refetchConversationsRef.current = refetchConversations;

  const refetchMessagesRef = useRef(refetchMessages);
  refetchMessagesRef.current = refetchMessages;

  const activeConversationIdRef = useRef(activeConversationId);
  activeConversationIdRef.current = activeConversationId;

  const myUserIdRef = useRef(myUserId);
  myUserIdRef.current = myUserId;

  // Real message state - Clean empty state for new users (NO mock data)
  const [localMessages, setLocalMessages] = useState<Record<string, Message[]>>({});

  // Sync DB messages into active conversation
  useEffect(() => {
    if (dbMessages && activeConversationId) {
      const formatted: Message[] = dbMessages.map((m) => ({
        id: m.id,
        senderId: m.senderId,
        senderName: m.senderName,
        avatar: m.avatar,
        text: m.text,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: m.senderId === myUserId,
        status: m.status?.toLowerCase() as any,
      }));
      setLocalMessages((prev) => ({
        ...prev,
        [activeConversationId]: formatted,
      }));
    }
  }, [dbMessages, activeConversationId, myUserId]);

  // Connect Socket.io client (Persistent, fast-negotiating singleton connection)
  useEffect(() => {
    const backendUrl = getBackendUrl();
    const token = getAuthToken();

    if (!token) {
      setSocketConnected(false);
      return;
    }

    const socket = io(backendUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      upgrade: true,
      rememberUpgrade: true,
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 6,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      setAuthExpired(false);
      if (activeConversationIdRef.current) {
        socket.emit("join_conversation", { conversationId: activeConversationIdRef.current });
      }
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("auth_error", (err: any) => {
      console.warn("Socket auth_error:", err?.message);
      if (err?.message?.includes("expired") || err?.message?.includes("jwt")) {
        setAuthExpired(true);
        socket.disconnect(); // Terminate retry loop if JWT is expired
      }
    });

    socket.on("connect_error", (err: any) => {
      console.warn("Socket connect_error:", err?.message);
      if (err?.message?.includes("expired") || err?.message?.includes("jwt")) {
        setAuthExpired(true);
        socket.disconnect();
      }
    });

    socket.on("new_message", (savedMessage: any) => {
      const incoming: Message = {
        id: savedMessage.id,
        senderId: savedMessage.senderId,
        senderName: savedMessage.senderName,
        avatar: savedMessage.avatar,
        text: savedMessage.text,
        timestamp: new Date(savedMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isMe: savedMessage.senderId === myUserIdRef.current,
        status: "delivered",
      };

      setLocalMessages((prev) => {
        const currentList = prev[savedMessage.conversationId] || [];
        if (currentList.some((m) => m.id === incoming.id)) return prev;
        return {
          ...prev,
          [savedMessage.conversationId]: [...currentList, incoming],
        };
      });

      refetchConversationsRef.current?.();
    });

    socket.on("user_typing", (data: any) => {
      if (data.conversationId === activeConversationIdRef.current && data.userId !== myUserIdRef.current) {
        setIsTypingRemote(data.isTyping);
      }
    });

    socket.on("message_read", () => {
      refetchMessagesRef.current?.();
    });

    // Real-Time Online Presence & Last Active Listeners
    socket.on("presence_data", (data: { onlineUserIds: string[]; lastActiveMap: Record<string, string> }) => {
      if (data.onlineUserIds) setOnlineUserIds(new Set(data.onlineUserIds));
      if (data.lastActiveMap) setLastActiveMap((prev) => ({ ...prev, ...data.lastActiveMap }));
    });

    socket.on("online_users_list", (userIds: string[]) => {
      setOnlineUserIds(new Set(userIds));
    });

    socket.on("user_status_changed", (data: { userId: string; status: "online" | "offline"; lastActiveAt?: string }) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (data.status === "online") {
          next.add(data.userId);
        } else {
          next.delete(data.userId);
        }
        return next;
      });

      if (data.lastActiveAt) {
        setLastActiveMap((prev) => ({ ...prev, [data.userId]: data.lastActiveAt! }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []); // Run ONCE on mount; stays connected persistently!

  // Join active conversation room when conversation changes (without tearing down socket)
  useEffect(() => {
    if (socketRef.current && socketConnected && activeConversationId) {
      socketRef.current.emit("join_conversation", { conversationId: activeConversationId });
    }
  }, [activeConversationId, socketConnected]);

  // Switch conversation and join room
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    setMobileView("chat");
    setIsTypingRemote(false);

    if (socketRef.current && socketConnected) {
      socketRef.current.emit("join_conversation", { conversationId: id });
    }

    markConversationAsRead(id);
  };

  // Build unified conversation list strictly from database conversations
  const conversations: Conversation[] = useMemo(() => {
    const list: Conversation[] = [];

    dbConversations.forEach((conv) => {
      const otherUser = conv.otherUser;
      const otherUserId = otherUser?.id;
      const isOwner = otherUser?.role === "OWNER";
      const isRestrictedForMe = myRole === "MEMBER" && isOwner;
      const isOnline = otherUserId ? onlineUserIds.has(otherUserId) : false;
      const lastActiveIso = otherUserId ? lastActiveMap[otherUserId] : undefined;
      const activeDetails = mounted && nowTimestamp > 0
        ? formatLastActive(lastActiveIso, nowTimestamp)
        : { relativeText: "Offline", exactTimeStr: "", combinedText: "Offline", fullTooltip: "Offline" };
      const lastActiveText = isOnline ? "Active now" : activeDetails.relativeText;
      const lastActiveCombined = isOnline ? "Active now" : activeDetails.combinedText;
      const lastActiveExactTime = isOnline ? "" : activeDetails.exactTimeStr;
      const lastActiveTooltip = isOnline ? "Online now (Active)" : activeDetails.fullTooltip;

      list.push({
        id: conv.id,
        name: conv.title || otherUser?.fullName || "Family Relative",
        type: "DIRECT",
        avatar: otherUser?.avatarUrl,
        targetRole: otherUser?.role,
        roleDescription: otherUser?.role === "OWNER" ? "Sanctuary Owner" : "Connected Relative",
        isOwnerTarget: isOwner,
        canMessage: !isRestrictedForMe,
        lastMessage: conv.lastMessage || "No messages yet",
        lastMessageTime: conv.lastMessageTime
          ? (mounted ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "")
          : isOnline
          ? "Active now"
          : activeDetails.relativeText,
        unreadCount: conv.unreadCount || 0,
        online: isOnline,
        lastActiveText,
        lastActiveCombined,
        lastActiveExactTime,
        lastActiveTooltip,
        lastActiveAt: lastActiveIso,
        recipientId: otherUserId,
      });
    });

    return list;
  }, [dbConversations, myRole, onlineUserIds, lastActiveMap, nowTimestamp, mounted]);

  // Build available users list from all registered platform/family accounts
  const availableUsers = useMemo(() => {
    return chatUsers
      .filter((u) => u.id !== myUserId)
      .map((u) => {
        const isOnline = onlineUserIds.has(u.id) || u.online;
        const lastActiveIso = lastActiveMap[u.id] || u.lastActiveAt;
        const activeDetails = mounted && nowTimestamp > 0
          ? formatLastActive(lastActiveIso, nowTimestamp)
          : { relativeText: "Offline", exactTimeStr: "", combinedText: "Offline", fullTooltip: "Offline" };
        const isOwner = u.role === "OWNER";
        const isRestrictedForMe = myRole === "MEMBER" && isOwner;

        const existingConv = conversations.find((c) => c.recipientId === u.id);

        return {
          id: u.id,
          fullName: u.fullName || u.email,
          email: u.email,
          avatarUrl: u.avatarUrl,
          role: u.role,
          online: isOnline,
          lastActiveText: isOnline ? "Active now" : activeDetails.relativeText,
          lastActiveCombined: isOnline ? "Active now" : activeDetails.combinedText,
          lastActiveExactTime: isOnline ? "" : activeDetails.exactTimeStr,
          lastActiveTooltip: isOnline ? "Online now (Active)" : activeDetails.fullTooltip,
          canMessage: !isRestrictedForMe,
          isOwnerTarget: isOwner,
          existingConversationId: existingConv?.id,
          hasExistingConversation: !!existingConv,
        };
      });
  }, [chatUsers, myUserId, onlineUserIds, lastActiveMap, mounted, nowTimestamp, myRole, conversations]);

  // Handle selecting or starting a conversation with any user
  const handleSelectUser = async (u: {
    id: string;
    fullName: string;
    role: string;
    isOwnerTarget: boolean;
    existingConversationId?: string;
  }) => {
    if (u.isOwnerTarget && myRole === "MEMBER") {
      alert("Direct messaging restricted: Members cannot message the Sanctuary Owner directly. Please wait for the Owner to message first or post in sanctuary updates.");
      return;
    }

    if (u.existingConversationId) {
      handleSelectConversation(u.existingConversationId);
      return;
    }

    try {
      setIsCreatingChat(true);
      const res = await createConversation({ recipientId: u.id }).unwrap();
      if (res?.id) {
        setActiveConversationId(res.id);
        setMobileView("chat");
        setIsTypingRemote(false);
        if (socketRef.current) {
          socketRef.current.emit("join_conversation", { conversationId: res.id });
        }
        refetchConversations();
      }
    } catch (err: any) {
      console.error("Failed to start conversation:", err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const activeMessages = activeConversationId ? (localMessages[activeConversationId] || []) : [];

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (socketRef.current && activeConversationId) {
      socketRef.current.emit("typing", {
        conversationId: activeConversationId,
        isTyping: e.target.value.length > 0,
      });
    }
  };

  // Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // RULE ENFORCEMENT: Member cannot message Owner directly
    if (activeConversation?.isOwnerTarget && myRole === "MEMBER") {
      alert("Direct messaging restricted: Members cannot message the Sanctuary Owner directly. Please use the Family Circle.");
      return;
    }

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg: Message = {
      id: `client-${Date.now()}`,
      senderId: myUserId || "me",
      senderName: user?.fullName || "You",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
      status: "sent",
    };

    // Optimistic UI update
    setLocalMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] || []), newMsg],
    }));

    // Send via WebSocket or REST
    if (socketRef.current && socketConnected && activeConversationId) {
      socketRef.current.emit("send_message", {
        conversationId: activeConversationId,
        text: textToSend,
      });
    } else if (activeConversationId) {
      try {
        await sendChatMessage({
          conversationId: activeConversationId,
          text: textToSend,
        }).unwrap();
      } catch (err: any) {
        console.error("Message send fallback error:", err);
      }
    }
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return availableUsers;
    return availableUsers.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    );
  }, [availableUsers, searchQuery]);

  return (
    <div className="h-[calc(100vh-140px)] min-h-[580px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row">
      {/* 1. Left Sidebar: Contacts & Channels */}
      <div
        className={`w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex-col bg-slate-900/90 shrink-0 ${
          mobileView === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30">
                <MessageSquare className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white leading-tight">Family Messages</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      socketConnected
                        ? "bg-emerald-500 animate-pulse"
                        : authExpired
                        ? "bg-rose-500"
                        : "bg-amber-500 animate-ping"
                    }`}
                  />
                  <span className="text-[10px] font-bold text-slate-400">
                    {socketConnected
                      ? "Socket.io Live"
                      : authExpired
                      ? "Session Expired (Please Re-login)"
                      : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
              {myRole}
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search conversations & relatives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("CONVERSATIONS")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeFilter === "CONVERSATIONS"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              Chats ({filteredConversations.length})
            </button>
            <button
              onClick={() => setActiveFilter("USERS")}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                activeFilter === "USERS"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              All Users ({filteredUsers.length})
            </button>
          </div>
        </div>

        {/* Conversation List & Available Users */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-2 space-y-3">
          {/* Section A: Active Conversations */}
          {(activeFilter === "ALL" || activeFilter === "CONVERSATIONS") && (
            <div className="space-y-1">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Active Conversations</span>
                <span className="text-[10px] font-semibold text-purple-400">
                  {filteredConversations.length}
                </span>
              </div>

              {filteredConversations.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center my-1 space-y-1">
                  <p className="text-xs font-semibold text-slate-300">No conversations yet</p>
                  <p className="text-[11px] text-slate-500">
                    Pick a relative below to start your first chat!
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = conv.id === activeConversationId;
                  const isRestricted = conv.isOwnerTarget && myRole === "MEMBER";

                  return (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left p-3 rounded-2xl flex items-start gap-3 transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-purple-950/40 border border-purple-800/60 shadow-inner"
                          : "hover:bg-slate-800/50 border border-transparent"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0 mt-0.5">
                        {conv.avatar ? (
                          <img
                            src={conv.avatar}
                            alt={conv.name}
                            className="h-10 w-10 rounded-2xl object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-2xl bg-slate-800 text-purple-300 font-bold text-sm flex items-center justify-center border border-slate-700">
                            {conv.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        {conv.online ? (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5"
                            title={conv.lastActiveTooltip || "Online now (Active)"}
                          >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900 shadow-xs" />
                          </span>
                        ) : (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-slate-600 border-2 border-slate-900 cursor-help"
                            title={conv.lastActiveTooltip || "Offline"}
                          />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                            {conv.name}
                            {conv.isOwnerTarget && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                                Owner
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-500 shrink-0 font-medium">
                            {conv.lastMessageTime}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 truncate leading-snug">
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] text-purple-400/80 font-medium truncate flex items-center gap-1">
                            {isRestricted ? (
                              <>
                                <Lock className="h-2.5 w-2.5 text-amber-400" />
                                <span className="text-amber-400 text-[9px]">Restricted for Member</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-2.5 w-2.5 text-emerald-400" />
                                <span>{conv.roleDescription || "Connected"}</span>
                              </>
                            )}
                          </span>

                          {conv.unreadCount > 0 && (
                            <span className="h-4 min-w-4 px-1 rounded-full bg-purple-600 text-white font-extrabold text-[9px] flex items-center justify-center">
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
          )}

          {/* Section B: All Available Users / Relatives */}
          {(activeFilter === "ALL" || activeFilter === "USERS") && (
            <div className="space-y-1 pt-2">
              <div className="px-2 py-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Family Relatives &amp; Users</span>
                <span className="text-[10px] font-semibold text-emerald-400">
                  {filteredUsers.length}
                </span>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 text-center my-1">
                  <p className="text-xs text-slate-400">No other users found</p>
                </div>
              ) : (
                filteredUsers.map((u) => {
                  const isRestricted = u.isOwnerTarget && myRole === "MEMBER";

                  return (
                    <button
                      key={`user-${u.id}`}
                      onClick={() => handleSelectUser(u)}
                      className="w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-800/50 border border-transparent hover:border-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {u.avatarUrl ? (
                            <img
                              src={u.avatarUrl}
                              alt={u.fullName}
                              className="h-10 w-10 rounded-2xl object-cover border border-slate-700"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-2xl bg-indigo-950 text-indigo-300 font-bold text-sm flex items-center justify-center border border-indigo-800/60">
                              {u.fullName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          )}

                          {u.online ? (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5"
                              title={u.lastActiveTooltip || "Online now (Active)"}
                            >
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900 shadow-xs" />
                            </span>
                          ) : (
                            <span
                              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-slate-600 border-2 border-slate-900 cursor-help"
                              title={u.lastActiveTooltip || "Offline"}
                            />
                          )}
                        </div>

                        {/* User Details */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-xs text-white truncate">
                              {u.fullName}
                            </span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-800 text-slate-400 font-medium">
                              {u.role}
                            </span>
                          </div>

                          <p className="text-[11px] truncate flex items-center gap-1.5">
                            {u.online ? (
                              <span className="text-emerald-400 font-semibold">Active now</span>
                            ) : (
                              <span className="text-slate-400">{u.lastActiveText}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Action Pill */}
                      <div className="shrink-0">
                        {isRestricted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-950/40 text-amber-400 text-[10px] font-bold border border-amber-800/40">
                            <Lock className="h-3 w-3" />
                            <span>Restricted</span>
                          </span>
                        ) : u.hasExistingConversation ? (
                          <span className="px-2.5 py-1 rounded-xl bg-purple-950/60 text-purple-300 text-[10px] font-bold border border-purple-800/60 group-hover:bg-purple-600 group-hover:text-white transition-all">
                            Open Chat
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-[10px] font-bold group-hover:bg-purple-600 group-hover:text-white transition-all flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>Message</span>
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Side: Active Chat Stream or Empty State */}
      <div
        className={`flex-1 flex flex-col bg-slate-950 ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-3xl bg-linear-to-tr from-purple-900/60 to-indigo-900/60 border border-purple-800/80 text-purple-300 flex items-center justify-center shadow-2xl shadow-purple-950/40">
                <MessageSquare className="h-10 w-10 stroke-[1.75]" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
              </span>
            </div>

            <h3 className="font-extrabold text-xl text-white mb-2">Private Family Messenger</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              New to the sanctuary? You don&apos;t have any active conversations yet. Pick any relative or family member from the sidebar to start a real-time conversation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter("USERS")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer hover:scale-105"
              >
                <Users className="h-4 w-4" />
                <span>Browse Relatives &amp; Users</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="relative">
                  {activeConversation?.type === "GROUP" ? (
                    <div className="h-10 w-10 rounded-2xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                      <Users className="h-5 w-5" />
                    </div>
                  ) : activeConversation?.avatar ? (
                    <img
                      src={activeConversation.avatar}
                      alt={activeConversation.name}
                      className="h-10 w-10 rounded-2xl object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-2xl bg-slate-800 text-purple-300 font-bold text-sm flex items-center justify-center border border-slate-700">
                      {activeConversation?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    {activeConversation?.name}
                    {activeConversation?.type === "GROUP" && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-900/40 text-purple-300 border border-purple-800">
                        Group Channel
                      </span>
                    )}
                  </h3>
                  {activeConversation?.type === "GROUP" ? (
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>
                        {activeConversation?.membersCount || 0} family members
                        {onlineUserIds.size > 0 && ` (${onlineUserIds.size} online now)`}
                      </span>
                    </p>
                  ) : activeConversation?.online ? (
                    <p
                      className="text-[10px] flex items-center gap-1.5 cursor-help"
                      title={activeConversation?.lastActiveTooltip || "Online now (Active)"}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-emerald-400 font-bold">Active now</span>
                      {activeConversation?.roleDescription && (
                        <span className="text-slate-500">• {activeConversation.roleDescription}</span>
                      )}
                    </p>
                  ) : (
                    <p
                      className="text-[10px] flex items-center gap-1.5 cursor-help"
                      title={activeConversation?.lastActiveTooltip || "Offline"}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                      <span className="text-slate-300 font-semibold">
                        {activeConversation?.lastActiveText || "Offline"}
                      </span>
                      {activeConversation?.lastActiveExactTime && (
                        <span className="text-slate-500 font-medium">({activeConversation.lastActiveExactTime})</span>
                      )}
                      {activeConversation?.roleDescription && (
                        <span className="text-slate-500">• {activeConversation.roleDescription}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  className="p-2 rounded-xl hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Voice Call"
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-xl hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Video Gathering"
                >
                  <Video className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteConvModalOpen(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                  title="Delete Conversation Thread"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Facebook Messenger Rule Notice Banner if Member -> Owner */}
            {activeConversation?.isOwnerTarget && myRole === "MEMBER" && (
              <div className="bg-amber-950/40 border-b border-amber-800/40 p-3 px-4 flex items-center gap-2.5 text-xs text-amber-300">
                <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Facebook Messenger Rule:</strong> Members cannot initiate direct messages to the Sanctuary Owner. You can reply if the Owner messages you first.
                </span>
              </div>
            )}

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-800 text-purple-400 flex items-center justify-center mb-3 shadow-lg">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">
                    Start your conversation with {activeConversation?.name}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xs mb-4">
                    {activeConversation?.online
                      ? "They are online right now!"
                      : `Last active ${activeConversation?.lastActiveText || "recently"}.`}{" "}
                    Send your first greeting below.
                  </p>
                  <button
                    type="button"
                    onClick={() => setInputText("Hello! 👋 Great to connect in our Family Sanctuary.")}
                    className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-800 text-purple-200 text-xs font-semibold transition-all cursor-pointer hover:scale-105"
                  >
                    Say Hello 👋
                  </button>
                </div>
              ) : activeMessages.map((msg) => (
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
                  {editingMessageId === msg.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-purple-400 rounded-lg text-xs text-white focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (editingText.trim()) {
                              updateChatMessage({
                                id: msg.id,
                                conversationId: activeConversationId,
                                text: editingText.trim(),
                              });
                              setLocalMessages((prev) => ({
                                ...prev,
                                [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
                                  m.id === msg.id ? { ...m, text: editingText.trim() } : m
                                ),
                              }));
                              setEditingMessageId(null);
                            }
                          } else if (e.key === "Escape") {
                            setEditingMessageId(null);
                          }
                        }}
                      />
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingMessageId(null)}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (editingText.trim()) {
                              updateChatMessage({
                                id: msg.id,
                                conversationId: activeConversationId,
                                text: editingText.trim(),
                              });
                              setLocalMessages((prev) => ({
                                ...prev,
                                [activeConversationId]: (prev[activeConversationId] || []).map((m) =>
                                  m.id === msg.id ? { ...m, text: editingText.trim() } : m
                                ),
                              }));
                              setEditingMessageId(null);
                            }
                          }}
                          className="px-2 py-0.5 rounded text-[10px] bg-white text-purple-900 font-bold hover:bg-slate-200"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p>{msg.text}</p>
                      {(msg.isMe || myRole === "OWNER" || myRole === "ADMIN") && (
                        <div
                          className={`absolute top-1 ${
                            msg.isMe ? "-left-14" : "-right-14"
                          } hidden group-hover:flex items-center gap-1 bg-slate-900/95 border border-slate-700 rounded-lg p-1 shadow-md z-10`}
                        >
                          {msg.isMe && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMessageId(msg.id);
                                setEditingText(msg.text);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-400 transition-colors"
                              title="Edit message"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await deleteChatMessage({
                                  id: msg.id,
                                  conversationId: activeConversationId,
                                }).unwrap();
                              } catch (err) {
                                console.error("Error deleting msg:", err);
                              }
                              setLocalMessages((prev) => ({
                                ...prev,
                                [activeConversationId]: (prev[activeConversationId] || []).filter(
                                  (m) => m.id !== msg.id
                                ),
                              }));
                            }}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete message"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </>
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

          {/* Typing Indicator */}
          {isTypingRemote && (
            <div className="flex items-center gap-2 text-xs text-purple-400 italic py-1">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce" />
                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>{activeConversation?.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
          {activeConversation?.isOwnerTarget && myRole === "MEMBER" ? (
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Lock className="h-3.5 w-3.5 text-amber-400" />
              <span>Direct messages to Sanctuary Owner restricted. Share questions in Sanctuary Circle.</span>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                title="Attach media"
              >
                <Paperclip className="h-4 w-4" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder={`Message ${activeConversation?.name || "family"}...`}
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
          )}
        </div>
      </>
    )}
  </div>

      {/* Delete Conversation Confirmation Modal */}
      {isDeleteConvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-950/80 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Delete Conversation?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete this thread with{" "}
                <strong className="text-white">{activeConversation?.name}</strong>? All messages in
                this conversation will be permanently removed.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConvModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Keep Thread
              </button>
              <button
                type="button"
                disabled={isDeletingConversation}
                onClick={async () => {
                  try {
                    await deleteConversation(activeConversationId).unwrap();
                    setActiveConversationId("");
                    setIsDeleteConvModalOpen(false);
                    refetchConversations();
                  } catch (err) {
                    console.error("Failed to delete conversation:", err);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeletingConversation && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Conversation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
