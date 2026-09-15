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
  { id: "node_1", name: "Grandfather", role: "Grandparent", emoji: "👴", x: 260, y: 30 },
  { id: "node_2", name: "Grandmother", role: "Grandparent", emoji: "👵", x: 440, y: 30 },
  { id: "node_3", name: "Father", role: "Parent", emoji: "👨", x: 350, y: 150 },
  { id: "node_4", name: "Brother", role: "Sibling", emoji: "👦", x: 190, y: 270 },
  { id: "node_5", name: "You", role: "Sanctuary Owner", emoji: "👩", x: 350, y: 270, isMain: true },
  { id: "node_6", name: "Sister", role: "Sibling", emoji: "👧", x: 510, y: 270 },
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

  // Add Person Input Controls State
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("Relative");
  const [selectedEmoji, setSelectedEmoji] = useState("👨");
  const [showAddForm, setShowAddForm] = useState(true);

  // Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Linking State
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [linkingFromId, setLinkingFromId] = useState<string | null>(null);
  const [linkingCursor, setLinkingCursor] = useState<{ x: number; y: number } | null>(null);

  // Handle Add Person Form Submit
  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const canvasWidth = canvasRef.current?.getBoundingClientRect().width || 700;
    const canvasHeight = canvasRef.current?.getBoundingClientRect().height || 420;

    // Randomize initial position slightly near center-bottom
    const newX = Math.max(20, Math.min(canvasWidth - 160, 200 + Math.random() * 200));
    const newY = Math.max(20, Math.min(canvasHeight - 90, 160 + Math.random() * 150));

    const newNode: DemoNode = {
      id: `demo_${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || "Relative",
      emoji: selectedEmoji,
      x: newX,
      y: newY,
    };

    setNodes((prev) => [...prev, newNode]);

    // Automatically connect to "You" (node_5) or first node if available
    const parentNode = nodes.find((n) => n.isMain) || nodes[0];
    if (parentNode) {
      setConnections((prev) => [
        ...prev,
        {
          id: `conn_${Date.now()}`,
          fromId: parentNode.id,
          toId: newNode.id,
          label: "Relative",
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
  };

  // Node Pointer Down (Drag or Link selection)
  const handleNodePointerDown = (e: React.PointerEvent, memberId: string) => {
    if (activeTool === "LINK") {
      if (!selectedSourceId) {
        setSelectedSourceId(memberId);
      } else if (selectedSourceId !== memberId) {
        // Create line connection between selectedSourceId and memberId
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

    // Move / Drag mode
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const node = nodes.find((n) => n.id === memberId);
    if (!node) return;

    setDraggingNodeId(memberId);
    setDragOffset({
      x: e.clientX - canvasRect.left - node.x,
      y: e.clientY - canvasRect.top - node.y,
    });
  };

  // Start handle drag connection
  const handleHandlePointerDown = (e: React.PointerEvent, memberId: string) => {
    e.stopPropagation();
    setLinkingFromId(memberId);
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (canvasRect) {
      setLinkingCursor({
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top,
      });
    }
  };

  // Pointer Move
  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - canvasRect.left;
    const currentY = e.clientY - canvasRect.top;

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

  // Remove connection
  const handleRemoveConnection = (connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
  };

  // Remove node
  const handleRemoveNode = (nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.fromId !== nodeId && c.toId !== nodeId));
  };

  const nodeWidth = 140;
  const nodeHeight = 65;

  return (
    <div className="w-full space-y-3 select-none">
      {/* Input Form & Action Bar Above Canvas */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Interactive Sandbox Demo</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
              (Drag nodes, connect lines, or add new people below)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Selectors */}
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
        <div className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold flex items-center justify-between">
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

      {/* 2D Interactive Demo Canvas Box */}
      <div
        ref={canvasRef}
        onPointerMove={handleCanvasPointerMove}
        onPointerUp={handleCanvasPointerUp}
        className="relative w-full h-[440px] bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden select-none touch-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]"
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

            const midY = (y1 + y2) / 2;
            const pathD = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

            return (
              <g key={conn.id} className="group">
                <path
                  d={pathD}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d={pathD}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
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
                title="Drag to connect line"
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

              <div
                onPointerDown={(e) => handleHandlePointerDown(e, node.id)}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-4 w-4 bg-indigo-600 border-2 border-white rounded-full flex items-center justify-center cursor-crosshair shadow-md hover:scale-125 transition-transform z-20"
                title="Drag to connect line"
              >
                <div className="h-1.5 w-1.5 bg-white rounded-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
