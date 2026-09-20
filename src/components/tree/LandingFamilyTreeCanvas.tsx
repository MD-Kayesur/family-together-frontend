"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Move,
  Link2,
  Plus,
  Minus,
  Pencil,
  RotateCcw,
  Trash2,
  Sparkles,
  User,
  GitMerge,
  X,
  Maximize2,
  Minimize2,
  Info,
} from "lucide-react";
import { useAppSelector } from "@/redux/store";
import {
  useGetMembersQuery,
  useGetRelationshipsQuery,
  useAddMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useAddRelationshipMutation,
} from "@/redux/api/familyApi";

export interface DemoMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  gender: "MALE" | "FEMALE";
  isYou?: boolean;
  photoUrl?: string;
  bio?: string;
}

export interface DemoConnection {
  id: string;
  fromId: string;
  toId: string;
  type: string;
}

const DEFAULT_MEMBERS: DemoMember[] = [
  { id: "pat_grandfather", name: "Grandfather", role: "Paternal Grandfather", emoji: "👴", gender: "MALE" },
  { id: "pat_grandmother", name: "Grandmother", role: "Paternal Grandmother", emoji: "👵", gender: "FEMALE" },
  { id: "mat_grandfather", name: "Grandfather", role: "Maternal Grandfather", emoji: "👴", gender: "MALE" },
  { id: "mat_grandmother", name: "Grandmother", role: "Maternal Grandmother", emoji: "👵", gender: "FEMALE" },
  { id: "father", name: "Father", role: "Parent", emoji: "👨", gender: "MALE" },
  { id: "mother", name: "Mother", role: "Parent", emoji: "👩", gender: "FEMALE" },
  { id: "brother", name: "Brother", role: "Sibling", emoji: "👦", gender: "MALE" },
  { id: "you", name: "You", role: "Sanctuary Owner", emoji: "👩", gender: "FEMALE", isYou: true },
  { id: "sister", name: "Sister", role: "Sibling", emoji: "👧", gender: "FEMALE" },
];

const DEFAULT_CONNECTIONS: DemoConnection[] = [
  // Paternal Grandparents -> Father
  { id: "c1", fromId: "pat_grandfather", toId: "father", type: "Parent ➔ Child" },
  { id: "c2", fromId: "pat_grandmother", toId: "father", type: "Parent ➔ Child" },
  // Maternal Grandparents -> Mother
  { id: "c3", fromId: "mat_grandfather", toId: "mother", type: "Parent ➔ Child" },
  { id: "c4", fromId: "mat_grandmother", toId: "mother", type: "Parent ➔ Child" },
  // Parents Connected (Spouse)
  { id: "c5", fromId: "father", toId: "mother", type: "Spouse / Married" },
  // Parents -> You
  { id: "c6", fromId: "father", toId: "you", type: "Parent ➔ Child" },
  { id: "c7", fromId: "mother", toId: "you", type: "Parent ➔ Child" },
  // Parents -> Siblings
  { id: "c8", fromId: "father", toId: "brother", type: "Parent ➔ Child" },
  { id: "c9", fromId: "mother", toId: "sister", type: "Parent ➔ Child" },
];

// Offsets from exact center (cx, cy) to keep all relatives perfectly in the middle
const DEFAULT_NODE_OFFSETS: Record<string, { dx: number; dy: number }> = {
  // Top Row: Paternal & Maternal Grandparents
  pat_grandfather: { dx: -440, dy: -180 },
  pat_grandmother: { dx: -280, dy: -180 },
  mat_grandfather: { dx: 140, dy: -180 },
  mat_grandmother: { dx: 300, dy: -180 },

  // Middle Row: Father & Mother
  father: { dx: -190, dy: -30 },
  mother: { dx: 55, dy: -30 },

  // Bottom Row: Brother, You, Sister
  brother: { dx: -230, dy: 120 },
  you: { dx: -67, dy: 115 },
  sister: { dx: 95, dy: 120 },
};

interface LandingFamilyTreeCanvasProps {
  variant?: "fullscreen" | "card" | "dashboard";
  readOnly?: boolean;
  className?: string;
  storageKey?: string;
  useDatabaseData?: boolean;
}

export default function LandingFamilyTreeCanvas({
  variant = "fullscreen",
  readOnly = false,
  className = "",
  storageKey = "landing_tree_v6",
  useDatabaseData = false,
}: LandingFamilyTreeCanvasProps) {
  const isCard = variant === "card";
  const isDashboard = variant === "dashboard";
  const defaultZoom = isCard ? 70 : 100;

  const { user } = useAppSelector((state) => state.auth);
  const { data: dbMembers = [], refetch: refetchMembers } = useGetMembersQuery(undefined, {
    skip: !useDatabaseData,
  });
  const { data: dbRelationships = [], refetch: refetchRelationships } = useGetRelationshipsQuery(undefined, {
    skip: !useDatabaseData,
  });

  const [addMemberMutation] = useAddMemberMutation();
  const [updateMemberMutation] = useUpdateMemberMutation();
  const [deleteMemberMutation] = useDeleteMemberMutation();
  const [addRelationshipMutation] = useAddRelationshipMutation();

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasSurfaceRef = useRef<HTMLDivElement>(null);

  // Surface Dimensions for perfect middle alignment
  const [surfaceDimensions, setSurfaceDimensions] = useState<{ width: number; height: number }>({
    width: typeof window !== "undefined" ? (isCard ? 650 : window.innerWidth) : 1200,
    height: typeof window !== "undefined" ? (isCard ? 500 : window.innerHeight) : 800,
  });

  // Tree Data State
  const [members, setMembers] = useState<DemoMember[]>(DEFAULT_MEMBERS);
  const [connections, setConnections] = useState<DemoConnection[]>(DEFAULT_CONNECTIONS);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Interaction Mode & Selection (only used in interactive mode)
  const [activeTool, setActiveTool] = useState<"MOVE" | "LINK">("MOVE");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>("you");
  const [zoomLevel, setZoomLevel] = useState<number>(defaultZoom);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Canvas Panning State
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanningCanvas, setIsPanningCanvas] = useState<boolean>(false);

  const panStartRef = useRef<{ x: number; y: number; startPanX: number; startPanY: number }>({
    x: 0,
    y: 0,
    startPanX: 0,
    startPanY: 0,
  });

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle Drag-to-Connect rubberband state
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  const [linkingCursor, setLinkingCursor] = useState<{ x: number; y: number } | null>(null);

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkSourceId, setLinkSourceId] = useState<string | null>(null);
  const [linkTargetId, setLinkTargetId] = useState<string | null>(null);
  const [linkType, setLinkType] = useState<string>("Parent ➔ Child");

  // Add Relative Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRelativeName, setNewRelativeName] = useState("");
  const [newRelativeRole, setNewRelativeRole] = useState("Mother");
  const [newRelativeEmoji, setNewRelativeEmoji] = useState("👩");
  const [newRelativeGender, setNewRelativeGender] = useState<"MALE" | "FEMALE">("FEMALE");

  // Edit Relative Modal State
  const [editingMember, setEditingMember] = useState<DemoMember | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editGender, setEditGender] = useState<"MALE" | "FEMALE">("FEMALE");
  const [editEmoji, setEditEmoji] = useState("👩");

  // Calculate centered positions around (cx, cy)
  const calculateCenteredPositions = useCallback((width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    const positions: Record<string, { x: number; y: number }> = {};

    for (const [id, offset] of Object.entries(DEFAULT_NODE_OFFSETS)) {
      positions[id] = {
        x: cx + offset.dx,
        y: cy + offset.dy,
      };
    }
    return positions;
  }, []);

  // 1. Initialize Surface Dimensions and Tree on Mount & Resize
  useEffect(() => {
    const updateDimensions = () => {
      const surface = canvasSurfaceRef.current;
      const w = surface?.clientWidth || (isCard ? 650 : window.innerWidth) || 1200;
      const h = surface?.clientHeight || (isCard ? 500 : window.innerHeight) || 800;
      setSurfaceDimensions({ width: w, height: h });
      return { w, h };
    };

    const { w, h } = updateDimensions();

    const savedPositions = localStorage.getItem(`${storageKey}_positions`);
    const savedMembers = localStorage.getItem(`${storageKey}_members`);
    const savedConnections = localStorage.getItem(`${storageKey}_connections`);

    if (savedMembers) {
      try {
        setMembers(JSON.parse(savedMembers));
      } catch (e) {
        console.error("Failed to parse saved members", e);
      }
    }

    if (savedConnections) {
      try {
        setConnections(JSON.parse(savedConnections));
      } catch (e) {
        console.error("Failed to parse saved connections", e);
      }
    }

    if (savedPositions) {
      try {
        setNodePositions(JSON.parse(savedPositions));
      } catch (e) {
        console.error("Failed to parse saved positions", e);
        setNodePositions(calculateCenteredPositions(w, h));
      }
    } else {
      setNodePositions(calculateCenteredPositions(w, h));
    }

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [calculateCenteredPositions, isCard, storageKey]);

  // 1b. Load & Synchronize Real PostgreSQL Database Data when useDatabaseData is true
  useEffect(() => {
    if (!useDatabaseData) return;
    if (!dbMembers || dbMembers.length === 0) return;

    const mappedMembers: DemoMember[] = dbMembers.map((m: any) => {
      const isYou = user?.id && (m.userId === user.id || m.email === user.email);
      const fullName = `${m.firstName || ""} ${m.lastName || ""}`.trim() || "Family Member";
      return {
        id: m.id,
        name: fullName,
        role: isYou
          ? "Sanctuary Owner"
          : m.roleInFamily || (m.gender === "FEMALE" ? "Mother / Daughter" : "Father / Son"),
        emoji: m.photoUrl ? "" : (m.gender === "FEMALE" ? "👩" : "👨"),
        gender: (m.gender === "FEMALE" ? "FEMALE" : "MALE") as "MALE" | "FEMALE",
        isYou: Boolean(isYou),
        photoUrl: m.photoUrl || undefined,
        bio: m.bio,
      };
    });

    const mappedConns: DemoConnection[] = (dbRelationships || []).map((r: any) => {
      const fromMember = dbMembers.find(
        (m: any) => m.id === r.fromPersonId || `${m.firstName} ${m.lastName}`.trim() === r.from
      );
      const toMember = dbMembers.find(
        (m: any) => m.id === r.toPersonId || `${m.firstName} ${m.lastName}`.trim() === r.to
      );
      return {
        id: r.id,
        fromId: fromMember ? fromMember.id : (r.fromPersonId || dbMembers[0]?.id || "1"),
        toId: toMember ? toMember.id : (r.toPersonId || dbMembers[1]?.id || "2"),
        type: r.type || "Parent ➔ Child",
      };
    });

    const savedPositionsStr = localStorage.getItem(`${storageKey}_positions`);
    let savedPositions: Record<string, { x: number; y: number }> = {};
    if (savedPositionsStr) {
      try {
        savedPositions = JSON.parse(savedPositionsStr);
      } catch (e) {}
    }

    const cx = surfaceDimensions.width / 2;
    const cy = surfaceDimensions.height / 2;
    const newPositions: Record<string, { x: number; y: number }> = { ...savedPositions };

    mappedMembers.forEach((m, idx) => {
      if (!newPositions[m.id]) {
        const total = mappedMembers.length;
        const row = Math.floor(idx / 4) - Math.floor(total / 8);
        const col = (idx % 4) - 1.5;
        newPositions[m.id] = {
          x: Math.round(cx + col * 180),
          y: Math.round(cy + row * 130),
        };
      }
    });

    setMembers(mappedMembers);
    setConnections(mappedConns);
    setNodePositions(newPositions);
    if (!selectedMemberId && mappedMembers[0]) {
      setSelectedMemberId(mappedMembers[0].id);
    }
  }, [useDatabaseData, dbMembers, dbRelationships, user, storageKey, surfaceDimensions]);

  // 2. Real-time Synchronization across sections
  useEffect(() => {
    const handleSync = () => {
      const savedPositions = localStorage.getItem(`${storageKey}_positions`);
      const savedMembers = localStorage.getItem(`${storageKey}_members`);
      const savedConnections = localStorage.getItem(`${storageKey}_connections`);

      if (savedMembers) {
        try {
          setMembers(JSON.parse(savedMembers));
        } catch (e) {}
      }
      if (savedConnections) {
        try {
          setConnections(JSON.parse(savedConnections));
        } catch (e) {}
      }
      if (savedPositions) {
        try {
          setNodePositions(JSON.parse(savedPositions));
        } catch (e) {}
      }
    };

    window.addEventListener("landing_tree_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("landing_tree_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [storageKey]);

  // 3. Mouse Wheel Zoom In / Out (Enabled for both full-screen and view-only modes!)
  useEffect(() => {
    const surface = canvasSurfaceRef.current;
    if (!surface) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Stop outer page scroll
      const zoomStep = e.deltaY < 0 ? 8 : -8;
      setZoomLevel((prev) => Math.min(Math.max(prev + zoomStep, 30), 200));
    };

    surface.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      surface.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Save to LocalStorage and broadcast update event to synced view-only sections
  const persistTree = (
    newMembers = members,
    newConnections = connections,
    newPositions = nodePositions
  ) => {
    if (readOnly) return;
    try {
      localStorage.setItem(`${storageKey}_members`, JSON.stringify(newMembers));
      localStorage.setItem(`${storageKey}_connections`, JSON.stringify(newConnections));
      localStorage.setItem(`${storageKey}_positions`, JSON.stringify(newPositions));

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("landing_tree_updated"));
      }
    } catch (e) {
      console.error("LocalStorage save failed", e);
    }
  };

  // Reset to initial clean centered state
  const handleReset = () => {
    if (readOnly) return;
    localStorage.removeItem(`${storageKey}_members`);
    localStorage.removeItem(`${storageKey}_connections`);
    localStorage.removeItem(`${storageKey}_positions`);

    const w = surfaceDimensions.width;
    const h = surfaceDimensions.height;
    setMembers(DEFAULT_MEMBERS);
    setConnections(DEFAULT_CONNECTIONS);
    setNodePositions(calculateCenteredPositions(w, h));
    setSelectedMemberId("you");
    setZoomLevel(defaultZoom);
    setPanOffset({ x: 0, y: 0 });

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("landing_tree_updated"));
    }
  };

  // Zoom controls (Available in both interactive and read-only modes)
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 200));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 30));
  const handleResetZoom = () => {
    setZoomLevel(defaultZoom);
    setPanOffset({ x: 0, y: 0 });
  };

  // Convert Screen Mouse Coordinates to Canvas Coordinates
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const rect = canvasSurfaceRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    const cx = surfaceDimensions.width / 2;
    const cy = surfaceDimensions.height / 2;
    const scale = zoomLevel / 100;

    const mx = clientX - rect.left - panOffset.x;
    const my = clientY - rect.top - panOffset.y;

    return {
      x: cx + (mx - cx) / scale,
      y: cy + (my - cy) / scale,
    };
  };

  // Pointer Down on Canvas Background -> Panning
  const handleCanvasBackgroundPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;

    setIsPanningCanvas(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panOffset.x,
      startPanY: panOffset.y,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Down on Node Card (disabled in readOnly)
  const handleNodePointerDown = (e: React.PointerEvent, memberId: string) => {
    if (readOnly) return;
    e.stopPropagation();

    if (activeTool === "LINK") {
      if (!linkSourceId) {
        setLinkSourceId(memberId);
      } else if (linkSourceId !== memberId) {
        setLinkTargetId(memberId);
        setIsLinkModalOpen(true);
      } else {
        setLinkSourceId(null);
      }
      return;
    }

    setSelectedMemberId(memberId);

    // Start dragging
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const coords = getCanvasCoords(e.clientX, e.clientY);
    const currentPos = nodePositions[memberId] || { x: 50, y: 50 };

    setDraggingNodeId(memberId);
    setDragOffset({
      x: coords.x - currentPos.x,
      y: coords.y - currentPos.y,
    });
  };

  // Start connector dot drag (disabled in readOnly)
  const handleHandlePointerDown = (e: React.PointerEvent, memberId: string) => {
    if (readOnly) return;
    e.stopPropagation();
    setLinkingFromId(memberId);
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setLinkingCursor(coords);
  };

  // Pointer Move on canvas
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasSurfaceRef.current) return;

    // 1. Canvas background panning (Allowed in both modes so user can explore when zoomed)
    if (isPanningCanvas) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      setPanOffset({
        x: panStartRef.current.startPanX + dx,
        y: panStartRef.current.startPanY + dy,
      });
      return;
    }

    if (readOnly) return;

    const coords = getCanvasCoords(e.clientX, e.clientY);

    // 2. Connector rubberband
    if (linkingFromId) {
      setLinkingCursor(coords);
      return;
    }

    // 3. Node card dragging
    if (draggingNodeId) {
      const updated = {
        ...nodePositions,
        [draggingNodeId]: {
          x: coords.x - dragOffset.x,
          y: coords.y - dragOffset.y,
        },
      };
      setNodePositions(updated);
    }
  };

  // Pointer Up on canvas
  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (isPanningCanvas) {
      setIsPanningCanvas(false);
    }

    if (readOnly) return;

    if (draggingNodeId) {
      setDraggingNodeId(null);
      persistTree(members, connections, nodePositions);
    }

    if (linkingFromId) {
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      const nodeElem = elem?.closest("[data-member-id]");
      const targetId = nodeElem?.getAttribute("data-member-id");

      if (targetId && targetId !== linkingFromId) {
        setLinkSourceId(linkingFromId);
        setLinkTargetId(targetId);
        setIsLinkModalOpen(true);
      }

      setLinkingFromId(null);
      setLinkingCursor(null);
    }
  };

  // Confirm relationship creation
  const handleConfirmLink = async () => {
    if (readOnly || !linkSourceId || !linkTargetId) return;

    const exists = connections.some(
      (c) =>
        (c.fromId === linkSourceId && c.toId === linkTargetId) ||
        (c.fromId === linkTargetId && c.toId === linkSourceId)
    );

    if (!exists) {
      const newConn: DemoConnection = {
        id: `conn_${Date.now()}`,
        fromId: linkSourceId,
        toId: linkTargetId,
        type: linkType,
      };
      const updated = [...connections, newConn];
      setConnections(updated);
      persistTree(members, updated, nodePositions);

      if (useDatabaseData) {
        try {
          await addRelationshipMutation({
            fromPersonId: linkSourceId,
            toPersonId: linkTargetId,
            typeCode: linkType,
          }).unwrap();
          refetchRelationships();
        } catch (err) {
          console.error("Failed to add relationship to database:", err);
        }
      }
    }

    setLinkSourceId(null);
    setLinkTargetId(null);
    setIsLinkModalOpen(false);
  };

  // Delete connection
  const handleDeleteConnection = (connId: string) => {
    if (readOnly) return;
    const updated = connections.filter((c) => c.id !== connId);
    setConnections(updated);
    persistTree(members, updated, nodePositions);
  };

  // Add new relative
  const handleAddRelative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly || !newRelativeName.trim()) return;

    const newId = `rel_${Date.now()}`;
    const newMember: DemoMember = {
      id: newId,
      name: newRelativeName.trim(),
      role: newRelativeRole,
      emoji: newRelativeEmoji,
      gender: newRelativeGender,
    };

    const cx = surfaceDimensions.width / 2;
    const cy = surfaceDimensions.height / 2;
    const randomX = Math.floor(cx + (Math.random() * 160 - 80));
    const randomY = Math.floor(cy + (Math.random() * 120 - 60));

    const updatedMembers = [...members, newMember];
    const updatedPositions = {
      ...nodePositions,
      [newId]: { x: randomX, y: randomY },
    };

    setMembers(updatedMembers);
    setNodePositions(updatedPositions);
    setSelectedMemberId(newId);

    let updatedConnections = connections;
    if (selectedMemberId && selectedMemberId !== newId) {
      const autoConn: DemoConnection = {
        id: `conn_${Date.now()}`,
        fromId: selectedMemberId,
        toId: newId,
        type: `${newRelativeRole}`,
      };
      updatedConnections = [...connections, autoConn];
      setConnections(updatedConnections);
    }

    persistTree(updatedMembers, updatedConnections, updatedPositions);
    setNewRelativeName("");
    setIsAddModalOpen(false);

    if (useDatabaseData) {
      try {
        const parts = newRelativeName.trim().split(" ");
        const firstName = parts[0] || newRelativeName.trim();
        const lastName = parts.slice(1).join(" ") || "";
        await addMemberMutation({
          firstName,
          lastName,
          gender: newRelativeGender,
          relativeToPersonId: selectedMemberId || undefined,
          relationshipType: newRelativeRole,
        }).unwrap();
        refetchMembers();
        refetchRelationships();
      } catch (err) {
        console.error("Failed to add member to database:", err);
      }
    }
  };

  // Open Edit Relative Modal
  const handleOpenEdit = (m: DemoMember) => {
    if (readOnly) return;
    setEditingMember(m);
    setEditName(m.name);
    setEditRole(m.role);
    setEditGender(m.gender);
    setEditEmoji(m.emoji);
  };

  // Save Edited Relative
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly || !editingMember || !editName.trim()) return;

    const updated = members.map((m) =>
      m.id === editingMember.id
        ? {
            ...m,
            name: editName.trim(),
            role: editRole.trim(),
            gender: editGender,
            emoji: editEmoji,
          }
        : m
    );
    setMembers(updated);
    persistTree(updated, connections, nodePositions);
    setEditingMember(null);

    if (useDatabaseData) {
      try {
        const parts = editName.trim().split(" ");
        const firstName = parts[0] || editName.trim();
        const lastName = parts.slice(1).join(" ") || "";
        await updateMemberMutation({
          id: editingMember.id,
          data: {
            firstName,
            lastName,
            gender: editGender,
          },
        }).unwrap();
        refetchMembers();
      } catch (err) {
        console.error("Failed to update member in database:", err);
      }
    }
  };

  // Delete selected relative
  const handleDeleteMember = async (memberId: string) => {
    if (readOnly) return;
    const updatedMembers = members.filter((m) => m.id !== memberId);
    const updatedConnections = connections.filter(
      (c) => c.fromId !== memberId && c.toId !== memberId
    );
    const updatedPositions = { ...nodePositions };
    delete updatedPositions[memberId];

    setMembers(updatedMembers);
    setConnections(updatedConnections);
    setNodePositions(updatedPositions);
    if (selectedMemberId === memberId) {
      setSelectedMemberId(updatedMembers[0]?.id || null);
    }

    persistTree(updatedMembers, updatedConnections, updatedPositions);

    if (useDatabaseData) {
      try {
        await deleteMemberMutation(memberId).unwrap();
        refetchMembers();
        refetchRelationships();
      } catch (err) {
        console.error("Failed to delete member from database:", err);
      }
    }
  };

  // Clear all relatives from canvas
  const handleClearAll = () => {
    if (readOnly) return;
    setMembers([]);
    setConnections([]);
    setNodePositions({});
    setSelectedMemberId(null);
    persistTree([], [], {});
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId);
  const nodeWidth = 135;
  const nodeHeight = 68;
  const cx = surfaceDimensions.width / 2;
  const cy = surfaceDimensions.height / 2;

  return (
    <div
      ref={canvasContainerRef}
      className={`w-full relative transition-all duration-300 ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-2 sm:p-4 flex flex-col justify-between overflow-hidden"
          : isCard
          ? "h-[480px] sm:h-[540px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800"
          : isDashboard
          ? "h-[620px] sm:h-[660px] rounded-2xl overflow-hidden shadow-2xl border border-slate-800"
          : "h-screen min-h-screen p-0 m-0"
      } ${className}`}
    >
      {/* 2D Canvas Surface (Zoom in / Zoom out & Panning supported) */}
      <div
        ref={canvasSurfaceRef}
        onPointerDown={handleCanvasBackgroundPointerDown}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        style={{
          backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
        }}
        className={`w-full relative overflow-hidden select-none touch-none bg-[radial-gradient(#cbd5e1_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#334155_1.2px,transparent_1.2px)] [background-size:24px_24px] cursor-grab active:cursor-grabbing transition-colors ${
          isFullScreen
            ? "flex-1 h-full min-h-[600px] rounded-2xl"
            : isCard
            ? "h-full rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-xl"
            : isDashboard
            ? "h-full rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl"
            : "h-screen min-h-screen rounded-none border-y sm:border border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/95 backdrop-blur-xl"
        }`}
      >
        {/* Top-Left Live Indicator Pill */}
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3.5 left-3.5 z-30 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-md text-xs font-semibold text-slate-800 dark:text-slate-200 pointer-events-none"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-[11px]">
            {useDatabaseData
              ? "Live PostgreSQL Database Lineage"
              : readOnly
              ? "Live Signature Tree View"
              : "Interactive Sanctuary Tree"}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
            {useDatabaseData
              ? `| ${members.length} Database Members`
              : readOnly
              ? "| Auto-synced"
              : "| Drag & connect"}
          </span>
        </div>

        {/* Top-Right Controls: Only Zoom In and Zoom Out for readOnly mode */}
        {readOnly ? (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3.5 right-3.5 z-30 flex items-center gap-1 p-1 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-xl pointer-events-auto"
          >
            {/* Zoom Out (-) Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom Out (-)"
            >
              <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>

            {/* Current Zoom % / Reset Zoom */}
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] cursor-pointer transition-colors"
              title="Click to reset zoom"
            >
              {zoomLevel}%
            </button>

            {/* Zoom In (+) Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom In (+)"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* Full toolbar for interactive mode */
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute top-3.5 right-3.5 z-30 flex flex-wrap items-center gap-1 sm:gap-1.5 p-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl transition-all max-w-[calc(100%-28px)] pointer-events-auto"
          >
            {/* Add Relative Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Relative</span>
            </button>

            {/* Mode Switch: Drag & Move */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("MOVE");
                setLinkSourceId(null);
              }}
              className={`px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeTool === "MOVE"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Move className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Move</span>
            </button>

            {/* Mode Switch: Connect */}
            <button
              type="button"
              onClick={() => setActiveTool("LINK")}
              className={`px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                activeTool === "LINK"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Link</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={handleZoomOut}
                className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom Out (-)"
              >
                <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={handleResetZoom}
                className="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-[11px] cursor-pointer transition-colors"
                title="Click to reset zoom and center"
              >
                {zoomLevel}%
              </button>

              <button
                type="button"
                onClick={handleZoomIn}
                className="h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm flex items-center justify-center cursor-pointer transition-colors"
                title="Zoom In (+)"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Clear All Relatives */}
            <button
              type="button"
              onClick={handleClearAll}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 hover:text-rose-600 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Clear all relatives from canvas"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {/* Reset Layout */}
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset to default tree centered in the middle"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className={`p-1.5 rounded-lg border font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isFullScreen
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
              title={isFullScreen ? "Exit Fullscreen" : "Full Screen Canvas"}
            >
              {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}

        {/* Empty Canvas State */}
        {members.length === 0 && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-3 z-10 pointer-events-auto"
          >
            <User className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="font-extrabold text-slate-700 dark:text-slate-300 text-sm sm:text-base">
              Canvas is empty
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
              All relatives removed. Add relatives in the interactive sanctuary canvas above.
            </p>
          </div>
        )}

        {/* Bottom Tips Pill: Zoom in and out for readOnly mode */}
        {readOnly && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-md text-[10px] font-medium text-slate-600 dark:text-slate-300 pointer-events-none"
          >
            <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3 w-3" />
              Zoomable Tree
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>🖱️ Mouse wheel to zoom in & out ({zoomLevel}%)</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>🖐️ Drag to pan</span>
          </div>
        )}

        {/* Transformed Inner Canvas Layer: Panning & Zooming around exact middle (cx, cy) */}
        <div
          style={{
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel / 100})`,
            transformOrigin: `${cx}px ${cy}px`,
            width: "100%",
            height: "100%",
          }}
          className="absolute inset-0 pointer-events-auto"
        >
          {/* SVG Dynamic Connecting Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {/* Render Existing Connection Curves */}
            {connections.map((conn) => {
              const posA = nodePositions[conn.fromId];
              const posB = nodePositions[conn.toId];
              if (!posA || !posB) return null;

              const x1 = posA.x + nodeWidth / 2;
              const y1 = posA.y + nodeHeight / 2;
              const x2 = posB.x + nodeWidth / 2;
              const y2 = posB.y + nodeHeight / 2;

              const midY = (y1 + y2) / 2;
              const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

              return (
                <g key={conn.id} className="group">
                  {/* Outer glow stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeOpacity="0.4"
                  />
                  {/* Dynamic gradient / dashed active line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-[dash_12s_linear_infinite]"
                  />
                  {/* Connection Tag */}
                  <foreignObject
                    x={(x1 + x2) / 2 - 40}
                    y={(y1 + y2) / 2 - 12}
                    width="80"
                    height="24"
                    className={readOnly ? "pointer-events-none" : "pointer-events-auto"}
                  >
                    <div
                      onClick={(e) => {
                        if (readOnly) return;
                        e.stopPropagation();
                        handleDeleteConnection(conn.id);
                      }}
                      onPointerDown={(e) => e.stopPropagation()}
                      title={readOnly ? conn.type : "Click to remove connection"}
                      className={`bg-white/95 dark:bg-slate-800/95 border border-indigo-200 dark:border-indigo-700 rounded-full text-[9px] font-bold text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 text-center shadow-sm truncate flex items-center justify-center gap-1 ${
                        readOnly
                          ? "cursor-default"
                          : "hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 cursor-pointer transition-colors"
                      }`}
                    >
                      <span className="truncate">{conn.type}</span>
                      {!readOnly && <X className="h-2.5 w-2.5 shrink-0 opacity-60 hover:opacity-100" />}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Rubberband line during connector handle drag (interactive only) */}
            {!readOnly && linkingFromId && linkingCursor && nodePositions[linkingFromId] && (
              <path
                d={`M ${nodePositions[linkingFromId].x + nodeWidth / 2} ${
                  nodePositions[linkingFromId].y + nodeHeight / 2
                } L ${linkingCursor.x} ${linkingCursor.y}`}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Relative Nodes */}
          {members.map((m) => {
            const pos = nodePositions[m.id] || { x: cx - 65, y: cy };
            const isSelected = !readOnly && selectedMemberId === m.id;
            const isSelectedSource = !readOnly && linkSourceId === m.id;
            const isDragging = !readOnly && draggingNodeId === m.id;

            return (
              <div
                key={m.id}
                data-member-id={m.id}
                onPointerDown={(e) => handleNodePointerDown(e, m.id)}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                  width: `${nodeWidth}px`,
                }}
                className={`absolute top-0 left-0 p-3 rounded-2xl bg-white dark:bg-slate-800 border transition-all duration-150 z-10 ${
                  readOnly
                    ? "cursor-default border-slate-200/90 dark:border-slate-700 shadow-md"
                    : `cursor-grab active:cursor-grabbing ${
                        isDragging
                          ? "shadow-2xl ring-4 ring-indigo-500/30 scale-105 border-indigo-600 z-30"
                          : isSelected
                          ? "shadow-xl ring-4 ring-indigo-600/25 border-2 border-indigo-600 dark:border-indigo-500 z-20"
                          : isSelectedSource
                          ? "shadow-xl ring-4 ring-amber-500/30 border-2 border-amber-500 bg-amber-50/20 z-20"
                          : "border-slate-200/90 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600"
                      }`
                }`}
              >
                {/* Beside Relative: Edit & Delete Quick Action Buttons (Interactive mode only) */}
                {!readOnly && (
                  <div className="absolute -top-2.5 -right-2.5 flex items-center gap-1 z-30 opacity-90 hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(m);
                      }}
                      className="h-5 w-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/80 hover:border-indigo-400 text-slate-500 dark:text-slate-300 hover:text-indigo-600 shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                      title={`Edit ${m.name}`}
                    >
                      <Pencil className="h-2.5 w-2.5" />
                    </button>
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(m.id);
                      }}
                      className="h-5 w-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/80 hover:border-rose-400 text-slate-500 dark:text-slate-300 hover:text-rose-600 shadow-md flex items-center justify-center cursor-pointer transition-all hover:scale-110"
                      title={`Delete ${m.name}`}
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}

                {/* Top Connector Dot (Interactive mode only) */}
                {!readOnly && (
                  <div
                    onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                    title="Drag to connect with another relative"
                  >
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                  </div>
                )}

                {/* Node Card Content */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-9 w-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-sm overflow-hidden ${
                      m.isYou
                        ? "bg-indigo-600 text-white shadow-indigo-600/30"
                        : m.gender === "FEMALE"
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                        : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{m.emoji || (m.gender === "FEMALE" ? "👩" : "👨")}</span>
                    )}
                  </div>

                  <div className="overflow-hidden space-y-0.5 text-left">
                    <h5
                      className={`font-extrabold text-xs truncate leading-snug ${
                        m.isYou
                          ? "text-indigo-600 dark:text-indigo-400 font-black"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {m.name}
                    </h5>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block truncate">
                      {m.role}
                    </span>
                  </div>
                </div>

                {/* Bottom Connector Dot (Interactive mode only) */}
                {!readOnly && (
                  <div
                    onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                    title="Drag to connect with another relative"
                  >
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Relative Inspector Floating Bar (Interactive mode only) */}
        {!readOnly && selectedMember && (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-auto p-2.5 sm:p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-sm">
                {selectedMember.emoji}
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {selectedMember.name} {selectedMember.isYou && "(You)"}
                </span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 block">
                  {selectedMember.role} • {connections.filter((c) => c.fromId === selectedMember.id || c.toId === selectedMember.id).length} links
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-auto">
              <button
                type="button"
                onClick={() => handleOpenEdit(selectedMember)}
                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Edit this relative"
              >
                <Pencil className="h-3 w-3" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLinkSourceId(selectedMember.id);
                  setActiveTool("LINK");
                }}
                className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Link2 className="h-3 w-3" />
                <span>Connect</span>
              </button>

              <button
                type="button"
                onClick={() => handleDeleteMember(selectedMember.id)}
                className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Delete this relative"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connect Relationship Modal (Interactive mode only) */}
      {!readOnly && isLinkModalOpen && linkSourceId && linkTargetId && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto"
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <GitMerge className="h-4 w-4 text-indigo-400" />
                <span>Connect Family Relationship</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkSourceId(null);
                  setLinkTargetId(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select relationship type between{" "}
              <strong className="text-white">
                {members.find((m) => m.id === linkSourceId)?.name}
              </strong>{" "}
              and{" "}
              <strong className="text-white">
                {members.find((m) => m.id === linkTargetId)?.name}
              </strong>
              :
            </p>

            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Parent ➔ Child">Parent ➔ Child</option>
              <option value="Spouse / Married">Spouse / Married</option>
              <option value="Sibling">Sibling</option>
              <option value="Grandparent ➔ Grandchild">Grandparent ➔ Grandchild</option>
              <option value="Uncle / Aunt ➔ Niece / Nephew">Uncle / Aunt ➔ Niece / Nephew</option>
              <option value="Cousin">Cousin</option>
            </select>

            <button
              type="button"
              onClick={handleConfirmLink}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              Confirm Connection Line
            </button>
          </div>
        </div>
      )}

      {/* Add Relative Modal (Interactive mode only) */}
      {!readOnly && isAddModalOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto"
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-400" />
                <span>Add Family Relative</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelative} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Relative Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother, Uncle David, Baby Maya"
                  value={newRelativeName}
                  onChange={(e) => setNewRelativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Relationship / Role
                  </label>
                  <select
                    value={newRelativeRole}
                    onChange={(e) => setNewRelativeRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Cousin">Cousin</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Relative">Relative</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={newRelativeGender}
                    onChange={(e) => setNewRelativeGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Choose Avatar Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {["👩", "👨", "👵", "👴", "👧", "👦", "👶", "🧑", "🧔", "🧕"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewRelativeEmoji(emoji)}
                      className={`h-10 w-10 rounded-xl border text-lg flex items-center justify-center cursor-pointer transition-all ${
                        newRelativeEmoji === emoji
                          ? "border-indigo-500 bg-indigo-950/80 ring-2 ring-indigo-500 scale-110"
                          : "border-slate-800 bg-slate-950 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMember && (
                <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-[11px] text-indigo-200 flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span>
                    Will be connected to selected relative:{" "}
                    <strong>{selectedMember.name}</strong>
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer transition-all"
              >
                Add Relative to Tree
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Relative Modal (Interactive mode only) */}
      {!readOnly && editingMember && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto"
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Pencil className="h-4 w-4 text-indigo-400" />
                <span>Edit Relative: {editingMember.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Relative Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Relationship / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    placeholder="e.g. Father, Mother, Sibling"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Choose Avatar Emoji
                </label>
                <div className="flex flex-wrap gap-2">
                  {["👩", "👨", "👵", "👴", "👧", "👦", "👶", "🧑", "🧔", "🧕"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditEmoji(emoji)}
                      className={`h-10 w-10 rounded-xl border text-lg flex items-center justify-center cursor-pointer transition-all ${
                        editEmoji === emoji
                          ? "border-indigo-500 bg-indigo-950/80 ring-2 ring-indigo-500 scale-110"
                          : "border-slate-800 bg-slate-950 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteMember(editingMember.id);
                    setEditingMember(null);
                  }}
                  className="px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 font-bold text-xs cursor-pointer transition-all"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
