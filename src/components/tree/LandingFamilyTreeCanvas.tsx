"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Move,
  Link2,
  Plus,
  Minus,
  RotateCcw,
  Trash2,
  Sparkles,
  User,
  GitMerge,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Check,
  ChevronDown,
  Info,
} from "lucide-react";

export interface DemoMember {
  id: string;
  name: string;
  role: string;
  emoji: string;
  gender: "MALE" | "FEMALE";
  isYou?: boolean;
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

export default function LandingFamilyTreeCanvas() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasSurfaceRef = useRef<HTMLDivElement>(null);

  // Tree Data State
  const [members, setMembers] = useState<DemoMember[]>(DEFAULT_MEMBERS);
  const [connections, setConnections] = useState<DemoConnection[]>(DEFAULT_CONNECTIONS);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  // Interaction Mode & Selection
  const [activeTool, setActiveTool] = useState<"MOVE" | "LINK">("MOVE");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>("you");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Dragging State
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

  // Calculate default centered positions based on canvas width
  const calculateDefaultPositions = (width: number) => {
    const cx = Math.max(width / 2, 480);
    return {
      // Top Row: Paternal & Maternal Grandparents (Y: 35)
      pat_grandfather: { x: cx - 400, y: 35 },
      pat_grandmother: { x: cx - 250, y: 35 },
      mat_grandfather: { x: cx + 120, y: 35 },
      mat_grandmother: { x: cx + 270, y: 35 },

      // Middle Row: Father & Mother (Y: 175)
      father: { x: cx - 190, y: 175 },
      mother: { x: cx + 60, y: 175 },

      // Bottom Row: Brother, You, Sister (Y: 315)
      brother: { x: cx - 210, y: 315 },
      you: { x: cx - 65, y: 310 },
      sister: { x: cx + 80, y: 315 },
    };
  };

  // 1. Initialize Positions on Mount / Resize
  useEffect(() => {
    const width = canvasContainerRef.current?.clientWidth || 800;
    const savedPositions = localStorage.getItem("landing_tree_positions_v4");
    const savedMembers = localStorage.getItem("landing_tree_members_v4");
    const savedConnections = localStorage.getItem("landing_tree_connections_v4");

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
        setNodePositions(calculateDefaultPositions(width));
      }
    } else {
      setNodePositions(calculateDefaultPositions(width));
    }
  }, []);

  // Save to LocalStorage whenever tree changes
  const persistTree = (
    newMembers = members,
    newConnections = connections,
    newPositions = nodePositions
  ) => {
    try {
      localStorage.setItem("landing_tree_members_v4", JSON.stringify(newMembers));
      localStorage.setItem("landing_tree_connections_v4", JSON.stringify(newConnections));
      localStorage.setItem("landing_tree_positions_v4", JSON.stringify(newPositions));
    } catch (e) {
      console.error("LocalStorage save failed", e);
    }
  };

  // Reset to initial clean state
  const handleReset = () => {
    localStorage.removeItem("landing_tree_members_v4");
    localStorage.removeItem("landing_tree_connections_v4");
    localStorage.removeItem("landing_tree_positions_v4");

    const width = canvasContainerRef.current?.clientWidth || 800;
    setMembers(DEFAULT_MEMBERS);
    setConnections(DEFAULT_CONNECTIONS);
    setNodePositions(calculateDefaultPositions(width));
    setSelectedMemberId("you");
    setZoomLevel(100);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 160));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  // Pointer Down on Node Card (Move or Link selection)
  const handleNodePointerDown = (e: React.PointerEvent, memberId: string) => {
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

    // Select the node
    setSelectedMemberId(memberId);

    // Start dragging
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const canvasRect = canvasSurfaceRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const scale = zoomLevel / 100;
    const currentPos = nodePositions[memberId] || { x: 50, y: 50 };
    setDraggingNodeId(memberId);
    setDragOffset({
      x: (e.clientX - canvasRect.left) / scale - currentPos.x,
      y: (e.clientY - canvasRect.top) / scale - currentPos.y,
    });
  };

  // Start connector dot drag
  const handleHandlePointerDown = (e: React.PointerEvent, memberId: string) => {
    e.stopPropagation();
    setLinkingFromId(memberId);
    const canvasRect = canvasSurfaceRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const scale = zoomLevel / 100;
      setLinkingCursor({
        x: (e.clientX - canvasRect.left) / scale,
        y: (e.clientY - canvasRect.top) / scale,
      });
    }
  };

  // Pointer Move on canvas
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasSurfaceRef.current) return;
    const canvasRect = canvasSurfaceRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;

    const currentX = (e.clientX - canvasRect.left) / scale;
    const currentY = (e.clientY - canvasRect.top) / scale;

    if (linkingFromId) {
      setLinkingCursor({ x: currentX, y: currentY });
      return;
    }

    if (draggingNodeId) {
      const nodeWidth = 135;
      const nodeHeight = 75;
      const newX = Math.max(10, Math.min(canvasRect.width / scale - nodeWidth - 10, currentX - dragOffset.x));
      const newY = Math.max(10, Math.min(canvasRect.height / scale - nodeHeight - 10, currentY - dragOffset.y));

      const updated = {
        ...nodePositions,
        [draggingNodeId]: { x: newX, y: newY },
      };
      setNodePositions(updated);
    }
  };

  // Pointer Up on canvas (drop node or connector)
  const handleCanvasPointerUp = (e: React.PointerEvent) => {
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
  const handleConfirmLink = () => {
    if (!linkSourceId || !linkTargetId) return;

    // Avoid duplicate connection
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
    }

    setLinkSourceId(null);
    setLinkTargetId(null);
    setIsLinkModalOpen(false);
  };

  // Delete connection
  const handleDeleteConnection = (connId: string) => {
    const updated = connections.filter((c) => c.id !== connId);
    setConnections(updated);
    persistTree(members, updated, nodePositions);
  };

  // Add new relative
  const handleAddRelative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelativeName.trim()) return;

    const newId = `rel_${Date.now()}`;
    const newMember: DemoMember = {
      id: newId,
      name: newRelativeName.trim(),
      role: newRelativeRole,
      emoji: newRelativeEmoji,
      gender: newRelativeGender,
    };

    // Calculate a nice open spot on canvas
    const canvasRect = canvasSurfaceRef.current?.getBoundingClientRect();
    const width = canvasRect?.width || 800;
    const height = canvasRect?.height || 450;
    const randomX = Math.floor(Math.random() * (width - 250)) + 40;
    const randomY = Math.floor(Math.random() * (height - 180)) + 60;

    const updatedMembers = [...members, newMember];
    const updatedPositions = {
      ...nodePositions,
      [newId]: { x: randomX, y: randomY },
    };

    setMembers(updatedMembers);
    setNodePositions(updatedPositions);
    setSelectedMemberId(newId);

    // If a node was currently selected, auto-create a connection to it!
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

    // Reset modal form
    setNewRelativeName("");
    setIsAddModalOpen(false);
  };

  // Delete selected relative
  const handleDeleteMember = (memberId: string) => {
    if (members.length <= 1) {
      alert("You need at least one family member in your tree!");
      return;
    }

    const updatedMembers = members.filter((m) => m.id !== memberId);
    const updatedConnections = connections.filter(
      (c) => c.fromId !== memberId && c.toId !== memberId
    );
    const updatedPositions = { ...nodePositions };
    delete updatedPositions[memberId];

    setMembers(updatedMembers);
    setConnections(updatedConnections);
    setNodePositions(updatedPositions);
    setSelectedMemberId(updatedMembers[0]?.id || null);

    persistTree(updatedMembers, updatedConnections, updatedPositions);
  };

  const selectedMember = members.find((m) => m.id === selectedMemberId);
  const nodeWidth = 130;
  const nodeHeight = 65;

  return (
    <div
      ref={canvasContainerRef}
      className={`w-full relative transition-all duration-300 ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl p-4 sm:p-8 flex flex-col justify-between overflow-hidden"
          : "my-8"
      }`}
    >
      {/* 2D Interactive Canvas Surface (Always Full-Width & Self-Contained) */}
      <div
        ref={canvasSurfaceRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className={`w-full relative ${
          isFullScreen
            ? "flex-1 h-full min-h-[500px]"
            : "h-[500px] sm:h-[560px] lg:h-[620px]"
        } rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden select-none touch-none bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] transition-colors`}
      >
        {/* Top-Left Live Indicator Pill */}
        <div className="absolute top-3.5 left-3.5 z-30 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl text-xs font-semibold text-slate-800 dark:text-slate-200">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold">Interactive Sanctuary Tree</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-normal">| Drag & connect relatives</span>
        </div>

        {/* Top-Right Floating Controls Bar (Placed inside the canvas where requested) */}
        <div className="absolute top-3.5 right-3.5 z-30 flex flex-wrap items-center gap-1.5 sm:gap-2 p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 shadow-2xl transition-all max-w-[calc(100%-28px)]">
          {/* Add Relative Button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add Relative</span>
          </button>

          {/* Mode Switch: Drag & Move */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("MOVE");
              setLinkSourceId(null);
            }}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "MOVE"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Move className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Drag & Move</span>
          </button>

          {/* Mode Switch: Connect */}
          <button
            type="button"
            onClick={() => setActiveTool("LINK")}
            className={`px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "LINK"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Connect</span>
          </button>

          {/* Explicit Zoom Controls: - and + buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
            {/* Zoom Out (-) Button */}
            <button
              type="button"
              onClick={handleZoomOut}
              className="h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom Out (-)"
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>

            {/* Current Zoom % / Reset Zoom */}
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xs cursor-pointer transition-colors"
              title="Click to reset zoom to 100%"
            >
              {zoomLevel}%
            </button>

            {/* Zoom In (+) Button */}
            <button
              type="button"
              onClick={handleZoomIn}
              className="h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-base flex items-center justify-center cursor-pointer transition-colors"
              title="Zoom In (+)"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Reset Layout */}
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Reset to default tree"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden lg:inline text-xs">Reset</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              isFullScreen
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            }`}
            title={isFullScreen ? "Exit Fullscreen" : "Full Screen Canvas"}
          >
            {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Link Mode Guidance Banner inside canvas */}
        {activeTool === "LINK" && (
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-2xl bg-indigo-600 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 max-w-[90%]">
            <Link2 className="h-4 w-4 animate-pulse shrink-0" />
            <span className="truncate">
              {linkSourceId
                ? `Selected "${members.find((m) => m.id === linkSourceId)?.name}". Click target relative card to link!`
                : "Click the first relative card, or drag connector dots to link."}
            </span>
            {linkSourceId && (
              <button
                type="button"
                onClick={() => setLinkSourceId(null)}
                className="ml-2 text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg font-bold cursor-pointer shrink-0"
              >
                Cancel
              </button>
            )}
          </div>
        )}
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center center",
            width: `${100 * (100 / zoomLevel)}%`,
            height: `${100 * (100 / zoomLevel)}%`,
          }}
          className="absolute inset-0 transition-transform duration-75"
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
                  {/* Connection Tag with Delete on hover */}
                  <foreignObject
                    x={(x1 + x2) / 2 - 40}
                    y={(y1 + y2) / 2 - 12}
                    width="80"
                    height="24"
                    className="pointer-events-auto"
                  >
                    <div
                      onClick={() => handleDeleteConnection(conn.id)}
                      title="Click to remove connection"
                      className="bg-white/95 dark:bg-slate-800/95 border border-indigo-200 dark:border-indigo-700 rounded-full text-[9px] font-bold text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 text-center shadow-sm truncate hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 cursor-pointer transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="truncate">{conn.type}</span>
                      <X className="h-2.5 w-2.5 shrink-0 opacity-60 hover:opacity-100" />
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Rubberband line during connector handle drag */}
            {linkingFromId && linkingCursor && nodePositions[linkingFromId] && (
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

          {/* Draggable Relative Nodes */}
          {members.map((m) => {
            const pos = nodePositions[m.id] || { x: 80, y: 80 };
            const isSelected = selectedMemberId === m.id;
            const isSelectedSource = linkSourceId === m.id;
            const isDragging = draggingNodeId === m.id;

            return (
              <div
                key={m.id}
                data-member-id={m.id}
                onPointerDown={(e) => handleNodePointerDown(e, m.id)}
                style={{
                  transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                  width: `${nodeWidth}px`,
                }}
                className={`absolute top-0 left-0 p-3 rounded-2xl bg-white dark:bg-slate-800 border transition-all duration-150 cursor-grab active:cursor-grabbing z-10 ${
                  isDragging
                    ? "shadow-2xl ring-4 ring-indigo-500/30 scale-105 border-indigo-600 z-30"
                    : isSelected
                    ? "shadow-xl ring-4 ring-indigo-600/25 border-2 border-indigo-600 dark:border-indigo-500 z-20"
                    : isSelectedSource
                    ? "shadow-xl ring-4 ring-amber-500/30 border-2 border-amber-500 bg-amber-50/20 z-20"
                    : "border-slate-200/90 dark:border-slate-700 shadow-md hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-600"
                }`}
              >
                {/* Top Connector Dot */}
                <div
                  onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                  title="Drag to connect with another relative"
                >
                  <div className="h-1.5 w-1.5 bg-white rounded-full" />
                </div>

                {/* Node Card Content */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-9 w-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                      m.isYou
                        ? "bg-indigo-600 text-white shadow-indigo-600/30"
                        : m.gender === "FEMALE"
                        ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                        : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                    }`}
                  >
                    <span>{m.emoji}</span>
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

                {/* Bottom Connector Dot */}
                <div
                  onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                  title="Drag to connect with another relative"
                >
                  <div className="h-1.5 w-1.5 bg-white rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Relative Inspector Floating Bar */}
        {selectedMember && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-3 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-base">
                {selectedMember.emoji}
              </div>
              <div className="text-left">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block">
                  {selectedMember.name} {selectedMember.isYou && "(You)"}
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 block">
                  {selectedMember.role} • {connections.filter((c) => c.fromId === selectedMember.id || c.toId === selectedMember.id).length} links
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Connect action from selected node */}
              <button
                type="button"
                onClick={() => {
                  setLinkSourceId(selectedMember.id);
                  setActiveTool("LINK");
                }}
                className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Link2 className="h-3.5 w-3.5" />
                <span>Connect</span>
              </button>

              {/* Delete relative */}
              <button
                type="button"
                onClick={() => handleDeleteMember(selectedMember.id)}
                className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Delete this relative"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connect Relationship Modal */}
      {isLinkModalOpen && linkSourceId && linkTargetId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <GitMerge className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Connect Family Relationship</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkSourceId(null);
                  setLinkTargetId(null);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Select relationship type between{" "}
              <strong className="text-slate-900 dark:text-white">
                {members.find((m) => m.id === linkSourceId)?.name}
              </strong>{" "}
              and{" "}
              <strong className="text-slate-900 dark:text-white">
                {members.find((m) => m.id === linkTargetId)?.name}
              </strong>
              :
            </p>

            <select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

      {/* Add Relative Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span>Add Family Relative</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRelative} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Relative Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mother, Uncle David, Baby Maya"
                  value={newRelativeName}
                  onChange={(e) => setNewRelativeName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Relationship / Role
                  </label>
                  <select
                    value={newRelativeRole}
                    onChange={(e) => setNewRelativeRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Gender
                  </label>
                  <select
                    value={newRelativeGender}
                    onChange={(e) => setNewRelativeGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
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
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/80 ring-2 ring-indigo-500 scale-110"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {selectedMember && (
                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
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
    </div>
  );
}
