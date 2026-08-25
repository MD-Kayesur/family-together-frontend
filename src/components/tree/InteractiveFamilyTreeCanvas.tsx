"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  useGetMembersQuery,
  useGetRelationshipsQuery,
  useAddRelationshipMutation,
} from "@/redux/api/familyApi";
import {
  Move,
  Link2,
  Plus,
  Save,
  RotateCcw,
  Trash2,
  Check,
  Sparkles,
  User,
  Heart,
  GitMerge,
  HelpCircle,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  type: string;
}

export default function InteractiveFamilyTreeCanvas({
  isCompact = false,
}: {
  isCompact?: boolean;
}) {
  const { data: members = [], isLoading: isLoadingMembers } = useGetMembersQuery();
  const { data: serverRelationships = [] } = useGetRelationshipsQuery();
  const [addRelationship] = useAddRelationshipMutation();

  const canvasRef = useRef<HTMLDivElement>(null);

  // Layout & State
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTool, setActiveTool] = useState<"MOVE" | "LINK">("MOVE");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Link Modal States
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [pendingTargetId, setPendingTargetId] = useState<string | null>(null);
  const [relType, setRelType] = useState("Parent-Child");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle Drag-to-Connect rubberband state
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  const [linkingCursor, setLinkingCursor] = useState<{ x: number; y: number } | null>(null);

  // 1. Initial Positions & LocalStorage Restore
  useEffect(() => {
    if (members.length === 0) return;

    const savedPositions = localStorage.getItem("family_tree_positions_v1");
    if (savedPositions) {
      try {
        setNodePositions(JSON.parse(savedPositions));
      } catch (e) {
        console.error("Failed to parse stored node positions", e);
      }
    } else {
      const initial: Record<string, { x: number; y: number }> = {};
      const startX = 60;
      const startY = 50;

      members.forEach((m, idx) => {
        const row = Math.floor(idx / 3);
        const col = idx % 3;
        initial[m.id] = {
          x: startX + col * (isCompact ? 170 : 220),
          y: startY + row * (isCompact ? 110 : 130),
        };
      });
      setNodePositions(initial);
    }
  }, [members, isCompact]);

  // 2. Load connections from server & LocalStorage
  useEffect(() => {
    const savedConnections = localStorage.getItem("family_tree_connections_v1");
    if (savedConnections) {
      try {
        setConnections(JSON.parse(savedConnections));
        return;
      } catch (e) {}
    }

    if (serverRelationships.length > 0 && members.length > 0) {
      const mapped: Connection[] = serverRelationships.map((r) => {
        const fromMember = members.find((m) => `${m.firstName} ${m.lastName}`.trim() === r.from) || members[0];
        const toMember = members.find((m) => `${m.firstName} ${m.lastName}`.trim() === r.to) || members[1] || members[0];
        return {
          id: r.id,
          fromId: fromMember ? fromMember.id : members[0]?.id || "1",
          toId: toMember ? toMember.id : members[1]?.id || "2",
          type: r.type || "Family Connection",
        };
      });
      setConnections(mapped);
    } else if (members.length >= 2) {
      setConnections([
        {
          id: "conn_default_1",
          fromId: members[0].id,
          toId: members[1].id,
          type: "Parent-Child",
        },
      ]);
    }
  }, [serverRelationships, members]);

  // Save Layout
  const saveLayout = () => {
    localStorage.setItem("family_tree_positions_v1", JSON.stringify(nodePositions));
    localStorage.setItem("family_tree_connections_v1", JSON.stringify(connections));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  // Reset Layout
  const resetLayout = () => {
    localStorage.removeItem("family_tree_positions_v1");
    localStorage.removeItem("family_tree_connections_v1");
    const initial: Record<string, { x: number; y: number }> = {};
    const startX = 60;
    const startY = 50;
    members.forEach((m, idx) => {
      const row = Math.floor(idx / 3);
      const col = idx % 3;
      initial[m.id] = {
        x: startX + col * (isCompact ? 170 : 220),
        y: startY + row * (isCompact ? 110 : 130),
      };
    });
    setNodePositions(initial);
    setZoomLevel(100);
    if (members.length >= 2) {
      setConnections([{ id: "conn_1", fromId: members[0].id, toId: members[1].id, type: "Parent-Child" }]);
    } else {
      setConnections([]);
    }
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 180));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  // Pointer Down (Node move or Link selection)
  const handleNodePointerDown = (e: React.PointerEvent, memberId: string) => {
    if (activeTool === "LINK") {
      if (!selectedSourceId) {
        setSelectedSourceId(memberId);
      } else if (selectedSourceId !== memberId) {
        setPendingTargetId(memberId);
        setIsLinkModalOpen(true);
      } else {
        setSelectedSourceId(null);
      }
      return;
    }

    // Drag move mode
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const scale = zoomLevel / 100;
    const currentPos = nodePositions[memberId] || { x: 50, y: 50 };
    setDraggingNodeId(memberId);
    setDragOffset({
      x: (e.clientX - canvasRect.left) / scale - currentPos.x,
      y: (e.clientY - canvasRect.top) / scale - currentPos.y,
    });
  };

  // Start Handle Drag-to-Connect
  const handleHandlePointerDown = (e: React.PointerEvent, memberId: string) => {
    e.stopPropagation();
    setLinkingFromId(memberId);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const scale = zoomLevel / 100;
      setLinkingCursor({
        x: (e.clientX - canvasRect.left) / scale,
        y: (e.clientY - canvasRect.top) / scale,
      });
    }
  };

  // Pointer Move (Node drag or Handle rubberband line)
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;

    const currentX = (e.clientX - canvasRect.left) / scale;
    const currentY = (e.clientY - canvasRect.top) / scale;

    if (linkingFromId) {
      setLinkingCursor({ x: currentX, y: currentY });
      return;
    }

    if (draggingNodeId) {
      const nodeW = isCompact ? 150 : 180;
      const newX = Math.max(10, Math.min(canvasRect.width / scale - nodeW, currentX - dragOffset.x));
      const newY = Math.max(10, Math.min(canvasRect.height / scale - 80, currentY - dragOffset.y));

      setNodePositions((prev) => ({
        ...prev,
        [draggingNodeId]: { x: newX, y: newY },
      }));
    }
  };

  // Pointer Up (Drop node or Drop connector handle over target)
  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
      saveLayout();
    }

    if (linkingFromId) {
      // Find element under cursor
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      const nodeElem = elem?.closest("[data-member-id]");
      const targetId = nodeElem?.getAttribute("data-member-id");

      if (targetId && targetId !== linkingFromId) {
        setSelectedSourceId(linkingFromId);
        setPendingTargetId(targetId);
        setIsLinkModalOpen(true);
      }

      setLinkingFromId(null);
      setLinkingCursor(null);
    }
  };

  // Confirm Relationship Link Creation
  const handleCreateLink = async () => {
    if (!selectedSourceId || !pendingTargetId) return;

    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      fromId: selectedSourceId,
      toId: pendingTargetId,
      type: relType,
    };

    const updated = [...connections, newConn];
    setConnections(updated);
    localStorage.setItem("family_tree_connections_v1", JSON.stringify(updated));

    // Try posting to backend
    const fromM = members.find((m) => m.id === selectedSourceId);
    const toM = members.find((m) => m.id === pendingTargetId);
    if (fromM && toM) {
      try {
        await addRelationship({
          fromPersonId: fromM.id,
          toPersonId: toM.id,
          typeCode: relType,
        }).unwrap();
      } catch (err) {}
    }

    setSelectedSourceId(null);
    setPendingTargetId(null);
    setIsLinkModalOpen(false);
  };

  // Delete Link
  const handleDeleteConnection = (connId: string) => {
    const updated = connections.filter((c) => c.id !== connId);
    setConnections(updated);
    localStorage.setItem("family_tree_connections_v1", JSON.stringify(updated));
  };

  // Dimensions
  const nodeWidth = isCompact ? 150 : 180;
  const nodeHeight = isCompact ? 60 : 70;

  return (
    <div
      className={`space-y-3 w-full ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden"
          : ""
      }`}
    >
      {/* Canvas Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2">
          {/* Move Tool Button */}
          <button
            type="button"
            onClick={() => {
              setActiveTool("MOVE");
              setSelectedSourceId(null);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "MOVE"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Move className="h-3.5 w-3.5" />
            <span>Drag & Move</span>
          </button>

          {/* Link / Connect Tool Button */}
          <button
            type="button"
            onClick={() => setActiveTool("LINK")}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTool === "LINK"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-400/30"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Connect Links</span>
          </button>

          {/* Zoom & Fullscreen Controls */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Zoom In (+)"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              title="Zoom Out (-)"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-extrabold text-[11px] cursor-pointer"
              title="Reset Zoom"
            >
              {zoomLevel}%
            </button>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className={`p-1.5 rounded-lg border font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                isFullScreen
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
              title={isFullScreen ? "Exit Fullscreen" : "Full Screen Canvas"}
            >
              {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isFullScreen ? "Exit" : "Full Screen"}</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {savedToast && (
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" /> Saved!
            </span>
          )}

          <button
            type="button"
            onClick={saveLayout}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Save className="h-3.5 w-3.5 text-indigo-600" />
            <span>Save Layout</span>
          </button>

          <button
            type="button"
            onClick={resetLayout}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Reset positions"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Link Mode Guidance Banner */}
      {activeTool === "LINK" && (
        <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-indigo-600 animate-bounce" />
            <span>
              Drag connector handles or click relative cards to connect lines like each other!
            </span>
          </div>
          {selectedSourceId && (
            <button
              type="button"
              onClick={() => setSelectedSourceId(null)}
              className="text-[10px] bg-white px-2 py-1 rounded-lg border border-indigo-200 font-bold hover:bg-indigo-100"
            >
              Cancel Selection
            </button>
          )}
        </div>
      )}

      {/* 2D Interactive Canvas Surface */}
      <div
        ref={canvasRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className={`relative w-full ${
          isCompact
            ? "h-[360px]"
            : isFullScreen
            ? "h-[calc(100vh-130px)]"
            : "h-[calc(100vh-210px)] min-h-[640px]"
        } rounded-3xl bg-slate-50 border border-slate-200/90 shadow-inner overflow-hidden select-none touch-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]`}
      >
        {isLoadingMembers ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-400">
            Loading tree nodes...
          </div>
        ) : members.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
            <User className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">No members added yet</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Add family members to position and connect relative nodes on this interactive canvas.
            </p>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "0 0",
              width: `${100 * (100 / zoomLevel)}%`,
              height: `${100 * (100 / zoomLevel)}%`,
            }}
            className="absolute inset-0 transition-transform duration-100"
          >
            {/* SVG Connecting Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {/* Existing Relationship Lines */}
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
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth={isCompact ? 3 : 4}
                      strokeLinecap="round"
                    />
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth={isCompact ? 2 : 2.5}
                      strokeDasharray="6 4"
                      className="animate-[dash_15s_linear_infinite]"
                    />
                    <foreignObject
                      x={(x1 + x2) / 2 - 35}
                      y={(y1 + y2) / 2 - 12}
                      width="70"
                      height="24"
                    >
                      <div className="bg-white/95 border border-indigo-200 rounded-full text-[9px] font-bold text-indigo-700 px-1.5 py-0.5 text-center shadow-sm truncate">
                        {conn.type}
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
            {members.map((m, idx) => {
              const pos = nodePositions[m.id] || { x: 50 + idx * 160, y: 60 };
              const isSelectedSource = selectedSourceId === m.id;
              const isDragging = draggingNodeId === m.id;

              return (
                <div
                  key={m.id}
                  data-member-id={m.id}
                  onPointerDown={(e) => handleNodePointerDown(e, m.id)}
                  style={{
                    transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
                  }}
                  className={`absolute top-0 left-0 ${
                    isCompact ? "w-[150px] p-2.5" : "w-[180px] p-3.5"
                  } rounded-2xl bg-white border transition-shadow duration-150 cursor-grab active:cursor-grabbing z-10 ${
                    isDragging
                      ? "shadow-2xl ring-4 ring-indigo-500/20 scale-105 border-indigo-600 z-30"
                      : isSelectedSource
                      ? "shadow-xl ring-4 ring-indigo-500/40 border-indigo-600 bg-indigo-50/30 z-20"
                      : "border-slate-200/90 shadow-md hover:shadow-lg hover:border-indigo-300"
                  }`}
                >
                  {/* Connector Handle Dots on Top & Bottom for Direct Linking */}
                  <div
                    onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                    title="Drag handle to link with relative"
                  >
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-9 w-9 rounded-full font-bold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                        m.gender === "FEMALE"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {m.gender === "FEMALE" ? "👩" : "👨"}
                    </div>
                    <div className="overflow-hidden space-y-0.5 text-left">
                      <h5 className="font-extrabold text-slate-900 text-xs truncate leading-snug">
                        {m.firstName} {m.lastName}
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 block truncate">
                        {idx === 0 ? "Sanctuary Owner" : m.bio || m.gender || "Relative"}
                      </span>
                    </div>
                  </div>

                  <div
                    onPointerDown={(e) => handleHandlePointerDown(e, m.id)}
                    className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 h-5 w-5 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                    title="Drag handle to link with relative"
                  >
                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Link Connection Modal */}
      {isLinkModalOpen && selectedSourceId && pendingTargetId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <GitMerge className="h-4 w-4 text-indigo-600" />
                <span>Connect Family Relationship Link</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setSelectedSourceId(null);
                  setPendingTargetId(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select relationship type between{" "}
              <strong className="text-slate-900">
                {members.find((m) => m.id === selectedSourceId)?.firstName}
              </strong>{" "}
              and{" "}
              <strong className="text-slate-900">
                {members.find((m) => m.id === pendingTargetId)?.firstName}
              </strong>
              :
            </p>

            <select
              value={relType}
              onChange={(e) => setRelType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="Parent ➔ Child">Parent ➔ Child</option>
              <option value="Spouse / Married">Spouse / Married</option>
              <option value="Brother ➔ Sister">Brother ➔ Sister</option>
              <option value="Uncle ➔ Niece/Nephew">Uncle ➔ Niece/Nephew</option>
              <option value="Cousin">Cousin</option>
            </select>

            <button
              type="button"
              onClick={handleCreateLink}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              Confirm Connection Line
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Link List & Quick Delete */}
      {connections.length > 0 && !isCompact && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <h4 className="font-bold text-xs text-slate-800 flex items-center justify-between">
            <span>Active Canvas Relationship Links ({connections.length})</span>
            <span className="text-[10px] text-slate-400 font-normal">Click bin to remove connection</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {connections.map((c) => {
              const m1 = members.find((m) => m.id === c.fromId);
              const m2 = members.find((m) => m.id === c.toId);
              return (
                <div
                  key={c.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2"
                >
                  <span>
                    {m1?.firstName || "Relative A"} ➔ {m2?.firstName || "Relative B"} ({c.type})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteConnection(c.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
