"use client";

import React, { useState, useRef } from "react";
import {
  Move,
  Link2,
  Plus,
  RotateCcw,
  Trash2,
  User,
  Sparkles,
  GitMerge,
  X,
  Edit2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  CheckCircle2
} from "lucide-react";

interface DemoNode {
  id: string;
  name: string;
  role: string;
  emoji: string;
  x: number;
  y: number;
  isMain?: boolean;
}

interface DemoConnection {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
}

const INITIAL_DEMO_NODES: DemoNode[] = [
  { id: "node_1", name: "Grandfather", role: "Grandparent", emoji: "👴", x: 340, y: 50 },
  { id: "node_2", name: "Grandmother", role: "Grandparent", emoji: "👵", x: 560, y: 50 },
  { id: "node_3", name: "Father", role: "Parent", emoji: "👨", x: 450, y: 190 },
  { id: "node_4", name: "Brother", role: "Sibling", emoji: "👦", x: 250, y: 330 },
  { id: "node_5", name: "You", role: "Sanctuary Owner", emoji: "👩", x: 450, y: 330, isMain: true },
  { id: "node_6", name: "Sister", role: "Sibling", emoji: "👧", x: 650, y: 330 },
];

const INITIAL_DEMO_CONNECTIONS: DemoConnection[] = [
  { id: "conn_1", fromId: "node_1", toId: "node_3", label: "Parent" },
  { id: "conn_2", fromId: "node_2", toId: "node_3", label: "Parent" },
  { id: "conn_3", fromId: "node_3", toId: "node_5", label: "Parent ➔ Child" },
  { id: "conn_4", fromId: "node_3", toId: "node_4", label: "Parent ➔ Child" },
  { id: "conn_5", fromId: "node_3", toId: "node_6", label: "Parent ➔ Child" },
];

const EMOJI_OPTIONS = ["👴", "👵", "👨", "👩", "👦", "👧", "👶", "👑", "💖"];

export default function LandingDemoCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  // In-Memory Demo States (Resets on page refresh)
  const [nodes, setNodes] = useState<DemoNode[]>(INITIAL_DEMO_NODES);
  const [connections, setConnections] = useState<DemoConnection[]>(INITIAL_DEMO_CONNECTIONS);
  const [activeTool, setActiveTool] = useState<"MOVE" | "LINK">("MOVE");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Add Person Input Controls State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Relative");
  const [selectedEmoji, setSelectedEmoji] = useState("👨");

  // Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Linking State
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  const [linkingCursor, setLinkingCursor] = useState<{ x: number; y: number } | null>(null);

  // Custom Modal States
  const [editingNode, setEditingNode] = useState<DemoNode | null>(null);
  const [editingConnection, setEditingConnection] = useState<DemoConnection | null>(null);
  const [customLineLabel, setCustomLineLabel] = useState("");

  // Handle Add Person Form Submit
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const canvasWidth = canvasRef.current?.getBoundingClientRect().width || 900;
    const canvasHeight = canvasRef.current?.getBoundingClientRect().height || 550;

    const newX = Math.max(30, Math.min(canvasWidth - 170, 260 + Math.random() * 260));
    const newY = Math.max(30, Math.min(canvasHeight - 90, 200 + Math.random() * 180));

    const newNode: DemoNode = {
      id: `demo_${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || "Relative",
      emoji: selectedEmoji,
      x: newX,
      y: newY,
    };

    setNodes((prev) => [...prev, newNode]);

    const parentNode = nodes.find((n) => n.isMain) || nodes[0];
    if (parentNode) {
      setConnections((prev) => [
        ...prev,
        {
          id: `conn_${Date.now()}`,
          fromId: parentNode.id,
          toId: newNode.id,
          label: "Relative Link",
        },
      ]);
    }

    setNewName("");
    setNewRole("Relative");
  };

  // Reset Tree to Default
  const handleReset = () => {
    setNodes(INITIAL_DEMO_NODES);
    setConnections(INITIAL_DEMO_CONNECTIONS);
    setSelectedSourceId(null);
    setLinkingFromId(null);
    setEditingConnection(null);
    setEditingNode(null);
    setZoomLevel(100);
  };

  // Zoom Controls
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 15, 180));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 15, 50));
  const handleResetZoom = () => setZoomLevel(100);

  // Node Pointer Down
  const handleNodePointerDown = (e: React.PointerEvent, memberId: string) => {
    if (activeTool === "LINK") {
      if (!selectedSourceId) {
        setSelectedSourceId(memberId);
      } else if (selectedSourceId !== memberId) {
        const newConn: DemoConnection = {
          id: `conn_${Date.now()}`,
          fromId: selectedSourceId,
          toId: memberId,
          label: "Connected Link",
        };
        setConnections((prev) => [...prev, newConn]);
        setSelectedSourceId(null);
      } else {
        setSelectedSourceId(null);
      }
      return;
    }

    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const scale = zoomLevel / 100;
    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    const rawX = e.clientX - canvasRect.left;
    const rawY = e.clientY - canvasRect.top;

    const currentX = centerX + (rawX - centerX) / scale;
    const currentY = centerY + (rawY - centerY) / scale;

    const node = nodes.find((n) => n.id === memberId);
    if (!node) return;

    setDraggingNodeId(memberId);
    setDragOffset({
      x: currentX - node.x,
      y: currentY - node.y,
    });
  };

  // Start handle drag connection
  const handleHandlePointerDown = (e: React.PointerEvent, memberId: string) => {
    e.stopPropagation();
    setLinkingFromId(memberId);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      const scale = zoomLevel / 100;
      const centerX = canvasRect.width / 2;
      const centerY = canvasRect.height / 2;

      const rawX = e.clientX - canvasRect.left;
      const rawY = e.clientY - canvasRect.top;

      setLinkingCursor({
        x: centerX + (rawX - centerX) / scale,
        y: centerY + (rawY - centerY) / scale,
      });
    }
  };

  // Pointer Move
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const scale = zoomLevel / 100;

    const centerX = canvasRect.width / 2;
    const centerY = canvasRect.height / 2;

    const rawX = e.clientX - canvasRect.left;
    const rawY = e.clientY - canvasRect.top;

    const currentX = centerX + (rawX - centerX) / scale;
    const currentY = centerY + (rawY - centerY) / scale;

    if (linkingFromId) {
      setLinkingCursor({ x: currentX, y: currentY });
      return;
    }

    if (draggingNodeId) {
      const newX = Math.max(10, Math.min(canvasRect.width - 150, currentX - dragOffset.x));
      const newY = Math.max(10, Math.min(canvasRect.height - 70, currentY - dragOffset.y));

      setNodes((prev) =>
        prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
      );
    }
  };

  // Pointer Up
  const handleCanvasPointerUp = (e: React.PointerEvent) => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }

    if (linkingFromId) {
      const elem = document.elementFromPoint(e.clientX, e.clientY);
      const nodeElem = elem?.closest("[data-demo-node-id]");
      const targetId = nodeElem?.getAttribute("data-demo-node-id");

      if (targetId && targetId !== linkingFromId) {
        setConnections((prev) => [
          ...prev,
          {
            id: `conn_${Date.now()}`,
            fromId: linkingFromId,
            toId: targetId,
            label: "Connected Link",
          },
        ]);
      }

      setLinkingFromId(null);
      setLinkingCursor(null);
    }
  };

  // Delete Connection Line
  const handleRemoveConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  };

  // Open Custom Modal for Editing Connection Line Label
  const openEditConnectionModal = (connId: string) => {
    const conn = connections.find((c) => c.id === connId);
    if (conn) {
      setEditingConnection(conn);
      setCustomLineLabel(conn.label || "Connected Link");
    }
  };

  // Save Connection Line Label from Custom Modal
  const handleSaveConnectionLabel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConnection) return;
    setConnections((prev) =>
      prev.map((c) =>
        c.id === editingConnection.id
          ? { ...c, label: customLineLabel.trim() || "Connected Link" }
          : c
      )
    );
    setEditingConnection(null);
  };

  // Delete Node
  const handleRemoveNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.fromId !== nodeId && c.toId !== nodeId));
  };

  // Save Node Edits
  const handleSaveNodeEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNode) return;
    setNodes((prev) =>
      prev.map((n) => (n.id === editingNode.id ? { ...editingNode } : n))
    );
    setEditingNode(null);
  };

  const nodeWidth = 140;
  const nodeHeight = 65;

  return (
    <div
      className={`w-full space-y-3 select-none ${
        isFullScreen
          ? "fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 flex flex-col justify-between overflow-hidden"
          : ""
      }`}
    >
      {/* Input Form & Action Bar Above Canvas */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-lg space-y-3 shrink-0 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Full-Screen Sandbox Canvas</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              (Always 100% full width with center zoom scaling)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tool Mode Selectors */}
            <button
              type="button"
              onClick={() => {
                setActiveTool("MOVE");
                setSelectedSourceId(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTool === "MOVE"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Move className="h-3.5 w-3.5" />
              <span>Drag & Move</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool("LINK")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTool === "LINK"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-2 ring-indigo-400/30"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Connect Lines</span>
            </button>

            {/* Zoom & Fullscreen Controls */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
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

            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset Demo Tree"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Add Person Input Form */}
        <form onSubmit={handleAddPerson} className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <span className="text-xs font-bold text-slate-400 pl-1">Avatar:</span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-[140px] sm:max-w-none">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`h-7 w-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                    selectedEmoji === emoji
                      ? "bg-indigo-600 text-white shadow-sm scale-110"
                      : "hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Person Name (e.g. Uncle Sam)"
            className="flex-1 min-w-[150px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Role/Relation (e.g. Uncle)"
            className="w-28 sm:w-36 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Person</span>
          </button>
        </form>
      </div>

      {/* Guidance Banner when Link Tool is active */}
      {activeTool === "LINK" && (
        <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center justify-between shrink-0 w-full">
          <div className="flex items-center gap-2">
            <GitMerge className="h-4 w-4 text-indigo-600 animate-pulse" />
            <span>
              {selectedSourceId
                ? `Click any target relative card to draw a connection line!`
                : `Click a starting node card, then click a target node to connect with a line!`}
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

      {/* 2D 100% Full-Width Interactive Demo Canvas Container */}
      <div
        ref={canvasRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className={`relative w-full ${
          isFullScreen
            ? "h-[calc(100vh-210px)]"
            : "h-[75vh] min-h-[550px] lg:h-[calc(100vh-180px)]"
        } bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden select-none touch-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] transition-all`}
      >
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "50% 50%",
            width: "100%",
            height: "100%",
          }}
          className="absolute inset-0 transition-transform duration-150 w-full h-full"
        >
          {/* SVG Connection Lines Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((conn) => {
              const posA = nodes.find((n) => n.id === conn.fromId);
              const posB = nodes.find((n) => n.id === conn.toId);
              if (!posA || !posB) return null;

              const x1 = posA.x + nodeWidth / 2;
              const y1 = posA.y + nodeHeight / 2;
              const x2 = posB.x + nodeWidth / 2;
              const y2 = posB.y + nodeHeight / 2;

              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;
              const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

              return (
                <g key={conn.id} className="group pointer-events-auto">
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="group-hover:stroke-rose-400 transition-colors cursor-pointer"
                    onClick={() => handleRemoveConnection(conn.id)}
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  <foreignObject
                    x={midX - 50}
                    y={midY - 14}
                    width="100"
                    height="28"
                    className="overflow-visible"
                  >
                    <div className="flex items-center justify-center gap-1 bg-white border border-indigo-200 shadow-md rounded-full px-2 py-0.5 text-[10px] font-bold text-indigo-700 hover:bg-rose-50 hover:border-rose-300 transition-all cursor-pointer">
                      <span
                        onClick={() => openEditConnectionModal(conn.id)}
                        title="Click to edit line label"
                        className="hover:underline"
                      >
                        {conn.label || "Link"}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveConnection(conn.id);
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-0.5 ml-0.5 cursor-pointer"
                        title="Delete connection line"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Rubberband line during connector handle drag */}
            {linkingFromId && linkingCursor && (
              <path
                d={`M ${
                  (nodes.find((n) => n.id === linkingFromId)?.x || 0) + nodeWidth / 2
                } ${
                  (nodes.find((n) => n.id === linkingFromId)?.y || 0) + nodeHeight / 2
                } L ${linkingCursor.x} ${linkingCursor.y}`}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeDasharray="4 4"
              />
            )}
          </svg>

          {/* Draggable Relative Node Cards */}
          {nodes.map((node) => {
            const isSelectedSource = selectedSourceId === node.id;
            const isDragging = draggingNodeId === node.id;

            return (
              <div
                key={node.id}
                data-demo-node-id={node.id}
                onPointerDown={(e) => handleNodePointerDown(e, node.id)}
                style={{
                  transform: `translate3d(${node.x}px, ${node.y}px, 0)`,
                }}
                className={`absolute top-0 left-0 w-[140px] p-2.5 rounded-2xl bg-white border transition-shadow duration-150 cursor-grab active:cursor-grabbing z-10 ${
                  node.isMain
                    ? "border-2 border-indigo-600 shadow-xl ring-4 ring-indigo-600/15"
                    : isDragging
                    ? "shadow-2xl ring-4 ring-indigo-500/20 scale-105 border-indigo-600 z-30"
                    : isSelectedSource
                    ? "shadow-xl ring-4 ring-indigo-500/40 border-indigo-600 bg-indigo-50/30 z-20"
                    : "border-slate-200 shadow-md hover:shadow-lg hover:border-indigo-300"
                }`}
              >
                {/* Connector Handles Top & Bottom */}
                <div
                  onPointerDown={(e) => handleHandlePointerDown(e, node.id)}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 h-4 w-4 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                  title="Drag handle to draw connection line"
                >
                  <div className="h-1.5 w-1.5 bg-white rounded-full" />
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 shadow-sm ${
                      node.isMain ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {node.emoji}
                  </div>
                  <div className="overflow-hidden text-left flex-1">
                    <h5
                      className={`font-bold text-xs truncate leading-tight ${
                        node.isMain ? "text-indigo-600 font-extrabold" : "text-slate-800"
                      }`}
                    >
                      {node.name}
                    </h5>
                    <span className="text-[10px] font-semibold text-slate-400 block truncate">
                      {node.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNode(node);
                      }}
                      className="text-slate-300 hover:text-indigo-600 transition-colors p-0.5"
                      title="Edit Node"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>

                    {!node.isMain && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveNode(node.id);
                        }}
                        className="text-slate-300 hover:text-rose-600 transition-colors p-0.5"
                        title="Remove Node"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div
                  onPointerDown={(e) => handleHandlePointerDown(e, node.id)}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                  title="Drag handle to draw connection line"
                >
                  <div className="h-1.5 w-1.5 bg-white rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Connection Lines Control Bar */}
      {connections.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 shrink-0 w-full">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <GitMerge className="h-4 w-4 text-indigo-600" />
              <span>Active Connection Lines ({connections.length})</span>
            </h4>
            <button
              type="button"
              onClick={() => setConnections([])}
              className="text-[11px] text-rose-600 hover:text-rose-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete All Lines</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {connections.map((c) => {
              const m1 = nodes.find((n) => n.id === c.fromId);
              const m2 = nodes.find((n) => n.id === c.toId);
              return (
                <div
                  key={c.id}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2 shadow-2xs hover:border-indigo-300 transition-all"
                >
                  <span>
                    {m1?.name || "Relative A"} ➔ {m2?.name || "Relative B"}{" "}
                    <strong
                      onClick={() => openEditConnectionModal(c.id)}
                      className="text-indigo-600 cursor-pointer hover:underline"
                      title="Click to edit line label"
                    >
                      ({c.label || "Connected"})
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveConnection(c.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                    title="Delete this line connection"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Edit Connection Line Label Modal */}
      {editingConnection && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveConnectionLabel}
            className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <GitMerge className="h-4 w-4 text-indigo-600" />
                <span>Edit Line Connection Label</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingConnection(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 block">Line Label Name:</label>
              <input
                type="text"
                value={customLineLabel}
                onChange={(e) => setCustomLineLabel(e.target.value)}
                placeholder="e.g. Father, Parent ➔ Child, Spouse"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                autoFocus
                required
              />
              <p className="text-[11px] text-slate-400">
                This label will appear on the connection line curve in the sandbox demo.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingConnection(null)}
                className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer"
              >
                Save Label
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Node Modal */}
      {editingNode && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveNodeEdit}
            className="bg-white rounded-3xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-indigo-600" />
                <span>Edit Person Details</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingNode(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Name:</label>
                <input
                  type="text"
                  value={editingNode.name}
                  onChange={(e) => setEditingNode({ ...editingNode, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Role/Relation:</label>
                <input
                  type="text"
                  value={editingNode.role}
                  onChange={(e) => setEditingNode({ ...editingNode, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Avatar Emoji:</label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setEditingNode({ ...editingNode, emoji })}
                      className={`h-8 w-8 rounded-lg text-sm flex items-center justify-center transition-all ${
                        editingNode.emoji === emoji
                          ? "bg-indigo-600 text-white shadow-sm scale-110"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
