"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Sparkles,
  Maximize2,
  Minimize2,
  Users,
} from "lucide-react";
import { Socket } from "socket.io-client";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  socket: Socket | null;
  targetUser: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  conversationId: string;
  myUser: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
  isVideoCall: boolean;
  isIncoming?: boolean;
  incomingOffer?: any;
}

export default function CallModal({
  isOpen,
  onClose,
  socket,
  targetUser,
  conversationId,
  myUser,
  isVideoCall,
  isIncoming = false,
  incomingOffer,
}: CallModalProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "connected" | "ended">(
    isIncoming ? "ringing" : "connecting"
  );
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(!isVideoCall);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize peer connection & media stream
  useEffect(() => {
    if (!isOpen) return;

    let pc: RTCPeerConnection;

    const setupCall = async () => {
      try {
        pc = new RTCPeerConnection({
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
          ],
        });
        peerConnectionRef.current = pc;

        // Capture local audio & video
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: isVideoCall,
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });
        } catch (mediaErr) {
          console.warn("[WebRTC] Media device access warning (mic/cam might be unavailable in sandbox):", mediaErr);
        }

        // Listen for remote tracks
        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setCallStatus("connected");
          }
        };

        // Send ICE candidate to peer
        pc.onicecandidate = (event) => {
          if (event.candidate && socket) {
            socket.emit("webrtc_ice_candidate", {
              targetUserId: targetUser.id,
              candidate: event.candidate,
            });
          }
        };

        // If initiating call, create and send offer
        if (!isIncoming) {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket?.emit("webrtc_call_user", {
            recipientId: targetUser.id,
            conversationId,
            callerName: myUser.fullName,
            callerAvatar: myUser.avatarUrl,
            isVideo: isVideoCall,
            offer,
          });
        }
      } catch (err) {
        console.error("[WebRTC] Setup call error:", err);
      }
    };

    setupCall();

    // Socket listeners for call events
    const handleAnswer = async (data: any) => {
      if (data.answer && peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer));
        setCallStatus("connected");
      }
    };

    const handleIceCandidate = async (data: any) => {
      if (data.candidate && peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (e) {
          console.debug("[WebRTC] Add ICE candidate note:", e);
        }
      }
    };

    const handleCallEnded = () => {
      setCallStatus("ended");
      setTimeout(() => {
        cleanup();
        onClose();
      }, 1000);
    };

    socket?.on("webrtc_call_answered", handleAnswer);
    socket?.on("webrtc_ice_candidate", handleIceCandidate);
    socket?.on("webrtc_call_ended", handleCallEnded);

    return () => {
      socket?.off("webrtc_call_answered", handleAnswer);
      socket?.off("webrtc_ice_candidate", handleIceCandidate);
      socket?.off("webrtc_call_ended", handleCallEnded);
      cleanup();
    };
  }, [isOpen, isIncoming, isVideoCall, targetUser.id, myUser, conversationId, socket, onClose]);

  // Handle incoming call acceptance
  const handleAcceptCall = async () => {
    if (!peerConnectionRef.current || !incomingOffer) return;
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      socket?.emit("webrtc_answer_call", {
        callerId: targetUser.id,
        conversationId,
        answer,
      });

      setCallStatus("connected");
    } catch (err) {
      console.error("[WebRTC] Accept call error:", err);
    }
  };

  // Timer for connected call
  useEffect(() => {
    if (callStatus !== "connected") return;
    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callStatus]);

  const cleanup = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
  };

  const handleEndCall = () => {
    socket?.emit("webrtc_end_call", {
      targetUserId: targetUser.id,
      conversationId,
    });
    setCallStatus("ended");
    cleanup();
    setTimeout(onClose, 500);
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoDisabled(!videoTrack.enabled);
      }
    }
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Call Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-sm">
              {targetUser.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm">{targetUser.fullName}</h3>
              <p className="text-[11px] text-slate-400">
                {callStatus === "connecting" && "Calling..."}
                {callStatus === "ringing" && "Incoming Call..."}
                {callStatus === "connected" && `Connected • ${formatDuration(duration)}`}
                {callStatus === "ended" && "Call Ended"}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5">
            {isVideoCall ? <Video className="h-3.5 w-3.5 text-indigo-400" /> : <Phone className="h-3.5 w-3.5 text-emerald-400" />}
            <span>{isVideoCall ? "Video Gathering" : "Voice Call"}</span>
          </span>
        </div>

        {/* Video / Call Center Display */}
        <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* Remote Video Stream */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${callStatus === "connected" && isVideoCall ? "block" : "hidden"}`}
          />

          {/* Fallback Avatar Placeholder when audio-only or connecting */}
          {!(callStatus === "connected" && isVideoCall) && (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-24 w-24 rounded-full bg-indigo-600/25 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-300 font-extrabold text-3xl shadow-xl animate-pulse">
                {targetUser.fullName.charAt(0).toUpperCase()}
              </div>
              <p className="text-white font-bold text-base">{targetUser.fullName}</p>
              <p className="text-xs text-slate-400">
                {callStatus === "ringing" ? "Incoming gathering call..." : "Connecting peer-to-peer..."}
              </p>
            </div>
          )}

          {/* Local Pip Video */}
          {isVideoCall && (
            <div className="absolute top-4 right-4 w-32 aspect-video bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Call Action Bar */}
        <div className="p-5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-center gap-4">
          {callStatus === "ringing" && isIncoming ? (
            <>
              <button
                type="button"
                onClick={handleEndCall}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <PhoneOff className="h-4 w-4" />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={handleAcceptCall}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 animate-bounce"
              >
                <Phone className="h-4 w-4" />
                <span>Accept Call</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleMic}
                className={`p-3.5 rounded-2xl font-bold transition-all cursor-pointer ${
                  isMicMuted
                    ? "bg-rose-950/80 border border-rose-800 text-rose-300"
                    : "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
                }`}
                title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
              >
                {isMicMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              {isVideoCall && (
                <button
                  type="button"
                  onClick={toggleVideo}
                  className={`p-3.5 rounded-2xl font-bold transition-all cursor-pointer ${
                    isVideoDisabled
                      ? "bg-rose-950/80 border border-rose-800 text-rose-300"
                      : "bg-slate-800 border border-slate-700 text-white hover:bg-slate-700"
                  }`}
                  title={isVideoDisabled ? "Turn Video On" : "Turn Video Off"}
                >
                  {isVideoDisabled ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleEndCall}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-600/30"
              >
                <PhoneOff className="h-5 w-5" />
                <span>End Call</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
