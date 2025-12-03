import {
  CallSlash,
  Microphone2,
  MicrophoneSlash,
  Video,
  VideoSlash,
} from "iconsax-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Avatar from "../../../global-components/Avatar";
import Button from "../../../global-components/Button";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import Spinner from "../../../global-components/Spinner";
import { useSocket } from "../../../hooks/useSocket";
import {
  useEndVideoCallMutation,
  useGetVideoCallByIdQuery,
  useInitiateVideoCallMutation,
  useUpdateVideoCallStatusMutation,
  VideoCallStatus,
} from "../api/videoCallApi";

const VideoCall: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get URL parameters
  const patientId = searchParams.get("patientId");
  const appointmentId = searchParams.get("appointmentId");
  const patientName = searchParams.get("patientName") || "Patient";

  // ✅ DEBUG: Log URL params on mount
  useEffect(() => {
    console.log("🔍 VideoCall component mounted with URL params:", {
      patientId,
      appointmentId,
      patientName,
      allParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State
  // Using ref (localStreamRef) instead of state to avoid re-renders and flickering
  const [, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callId, setCallId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [error, setError] = useState<string | null>(null);
  const [waitingForParticipant, setWaitingForParticipant] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0); // in seconds
  const [isRemoteCameraOff, setIsRemoteCameraOff] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callDuration, setCallDuration] = useState<number | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number>(5);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const receiverIdRef = useRef<string | null>(null);
  const isInitiatorRef = useRef<boolean>(false);
  const callInitiatedRef = useRef<boolean>(false); // Prevent multiple call initiations
  const callIdRef = useRef<string | null>(null); // ✅ FIX: Use ref for callId to avoid state timing issues
  const localStreamRef = useRef<MediaStream | null>(null); // Store stream in ref to avoid state updates
  const cameraLoadedRef = useRef<boolean>(false); // Track if camera is already loaded
  const pollingIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingBackoffRef = useRef<number>(3000); // Start with 3 seconds
  const lastPollTimeRef = useRef<number>(0);
  const isWaitingRef = useRef<boolean>(false);

  // Socket.io hook
  const { socket, isConnected, emit, on, off } = useSocket();

  // RTK Query hooks
  const [initiateVideoCall] = useInitiateVideoCallMutation();
  const [updateVideoCallStatus] = useUpdateVideoCallStatusMutation();
  const [endVideoCall, { isLoading: isEnding }] = useEndVideoCallMutation();

  // Get video call by ID for polling (refetch will work even when skipped)
  const { refetch: checkCallStatus } = useGetVideoCallByIdQuery(callId || "", {
    skip: !callId, // Only skip if no callId, allow refetch when waiting
  });

  // Store functions in refs to prevent useEffect re-runs
  const emitRef = useRef(emit);
  const initiateVideoCallRef = useRef(initiateVideoCall);
  const updateVideoCallStatusRef = useRef(updateVideoCallStatus);
  const checkCallStatusRef = useRef(checkCallStatus);

  // Update refs when functions change (without triggering re-renders)
  emitRef.current = emit;
  initiateVideoCallRef.current = initiateVideoCall;
  updateVideoCallStatusRef.current = updateVideoCallStatus;
  checkCallStatusRef.current = checkCallStatus;

  // Stop waiting for participant
  const stopWaitingForParticipant = () => {
    isWaitingRef.current = false;
    setWaitingForParticipant(false);

    if (pollingIntervalRef.current) {
      clearTimeout(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    if (waitingTimerRef.current) {
      clearInterval(waitingTimerRef.current);
      waitingTimerRef.current = null;
    }
  };

  // Start waiting for participant with exponential backoff polling
  const startWaitingForParticipant = () => {
    if (isWaitingRef.current || !callId) return;

    isWaitingRef.current = true;
    setWaitingForParticipant(true);
    setWaitingTime(0);
    pollingBackoffRef.current = 3000; // Reset to 3 seconds
    lastPollTimeRef.current = Date.now();

    // UI Timer: Updates display every second (NO backend request - just local state)
    // This is separate from the polling mechanism below
    waitingTimerRef.current = setInterval(() => {
      setWaitingTime((prev) => prev + 1);
    }, 1000);

    // Polling Timer: Makes API requests with exponential backoff
    // Starts at 3s, then 5s, 8s, 12s, 15s (max) - NOT every second!
    const pollCallStatus = async () => {
      if (!isMountedRef.current || !callId || !isWaitingRef.current) {
        return;
      }

      try {
        const result = await checkCallStatusRef.current();

        if (result.data?.data) {
          const callData = result.data.data;

          // Check if call status indicates participant has joined
          if (
            callData.status === VideoCallStatus.ACTIVE ||
            callData.status === VideoCallStatus.ENDED ||
            callData.status === VideoCallStatus.REJECTED ||
            callData.status === VideoCallStatus.CANCELLED
          ) {
            // If call is active, participant has joined
            if (callData.status === VideoCallStatus.ACTIVE) {
              stopWaitingForParticipant();
            }
            // For other statuses, stop waiting (call ended/rejected/cancelled)
            else {
              stopWaitingForParticipant();
            }
            return;
          }
          // If status is still RINGING or INITIATED, continue waiting silently
          // Don't show any errors - this is expected while waiting
        }
      } catch (err) {
        // Silently continue polling on error - don't show error modal
        // This could be a temporary network issue or the call might not exist yet
        console.log("Polling check failed (will retry):", err);
        // Continue polling even on error (might be temporary network issue)
      }

      // Schedule next poll with exponential backoff
      // This ensures we don't spam the backend - requests get less frequent over time
      if (isMountedRef.current && isWaitingRef.current && callId) {
        // Increase backoff: 3s -> 5s -> 8s -> 12s -> 15s (max)
        // After 1 minute of waiting: ~12 requests total (not 60!)
        pollingBackoffRef.current = Math.min(
          pollingBackoffRef.current * 1.5,
          15000 // Cap at 15 seconds between requests
        );

        pollingIntervalRef.current = setTimeout(
          pollCallStatus,
          pollingBackoffRef.current
        );
      }
    };

    // Start first poll after initial 3 second delay
    // Subsequent polls will use exponential backoff (5s, 8s, 12s, 15s...)
    pollingIntervalRef.current = setTimeout(
      pollCallStatus,
      pollingBackoffRef.current
    );
  };

  // Initialize WebRTC peer connection
  const initializePeerConnection = () => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    pc.addTransceiver("audio", { direction: "sendrecv" });
    pc.addTransceiver("video", { direction: "sendrecv" });

    // Handle remote stream
    pc.ontrack = (event) => {
      console.log("📹 Remote track received:", {
        streams: event.streams?.length || 0,
        tracks: event.track?.kind,
        trackId: event.track?.id,
        trackEnabled: event.track?.enabled,
      });

      // Monitor video track state changes
      if (event.track && event.track.kind === "video") {
        const videoTrack = event.track;

        // Check initial state - check enabled, muted, and readyState
        const readyState: MediaStreamTrackState = videoTrack.readyState;
        const isActive =
          videoTrack.enabled && !videoTrack.muted && readyState === "live";
        setIsRemoteCameraOff(!isActive);
        console.log("📹 Video track state:", {
          enabled: videoTrack.enabled,
          muted: videoTrack.muted,
          readyState: videoTrack.readyState,
          isActive,
        });

        // Monitor track state changes
        videoTrack.onended = () => {
          console.log("📹 Remote video track ended");
          setIsRemoteCameraOff(true);
        };

        videoTrack.onmute = () => {
          console.log("📹 Remote video track muted");
          setIsRemoteCameraOff(true);
        };

        videoTrack.onunmute = () => {
          console.log("📹 Remote video track unmuted");
          // Check state after unmute, including readyState and muted
          setTimeout(() => {
            const readyState: MediaStreamTrackState = videoTrack.readyState;
            const isActive =
              videoTrack.enabled && !videoTrack.muted && readyState === "live";
            setIsRemoteCameraOff(!isActive);
            // Force video element to play when track becomes active
            if (isActive && remoteVideoRef.current) {
              // Ensure srcObject is set
              if (remoteVideoRef.current.srcObject !== remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;
              }
              remoteVideoRef.current.play().catch(console.warn);
            }
          }, 200); // Slightly longer delay to ensure state is updated
        };
      }

      if (event.streams && event.streams.length > 0) {
        const stream = event.streams[0];
        console.log("✅ Setting remote stream:", {
          id: stream.id,
          tracks: stream.getTracks().length,
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
        });

        // Monitor video tracks in the stream
        stream.getVideoTracks().forEach((track) => {
          const readyState: MediaStreamTrackState = track.readyState;
          const isActive =
            track.enabled && !track.muted && readyState === "live";
          setIsRemoteCameraOff(!isActive);

          console.log("📹 Stream video track state:", {
            trackId: track.id,
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState,
            isActive,
          });

          track.onended = () => {
            console.log("📹 Remote video track ended");
            setIsRemoteCameraOff(true);
          };

          track.onmute = () => {
            console.log("📹 Remote video track muted");
            setIsRemoteCameraOff(true);
          };

          track.onunmute = () => {
            console.log("📹 Remote video track unmuted");
            // Check state after unmute, including readyState and muted
            setTimeout(() => {
              const readyState: MediaStreamTrackState = track.readyState;
              const isActive =
                track.enabled && !track.muted && readyState === "live";
              setIsRemoteCameraOff(!isActive);
              // Force video element to play when track becomes active
              if (isActive && remoteVideoRef.current) {
                // Ensure srcObject is set
                if (remoteVideoRef.current.srcObject !== stream) {
                  remoteVideoRef.current.srcObject = stream;
                }
                remoteVideoRef.current.play().catch(console.warn);
              }
            }, 200); // Slightly longer delay to ensure state is updated
          };
        });

        // ✅ FIX: Set stream on video element immediately
        if (remoteVideoRef.current) {
          // Always update srcObject to ensure we get the latest stream/tracks
          remoteVideoRef.current.srcObject = stream;
          console.log("✅ Remote video element srcObject set");

          // Force play in case autoplay is blocked
          remoteVideoRef.current.play().catch((err) => {
            console.warn("⚠️ Autoplay blocked, trying to play manually:", err);
          });
        }

        setRemoteStream(stream);
        setIsConnecting(false);

        // Set call start time when remote stream is received
        if (!callStartTime) {
          setCallStartTime(Date.now());
        }

        // Stop waiting when remote stream is received
        if (isWaitingRef.current) {
          stopWaitingForParticipant();
        }
      } else if (event.track) {
        // ✅ FIX: Handle case where track comes without stream
        console.log("📹 Track received without stream, creating stream...");
        const stream = new MediaStream([event.track]);

        if (remoteVideoRef.current) {
          // If we already have a stream, add track to it
          if (remoteVideoRef.current.srcObject) {
            const existingStream = remoteVideoRef.current
              .srcObject as MediaStream;
            existingStream.addTrack(event.track);
            setRemoteStream(existingStream);
            // Force update and play
            remoteVideoRef.current.srcObject = existingStream;
            remoteVideoRef.current.play().catch(console.warn);
          } else {
            remoteVideoRef.current.srcObject = stream;
            setRemoteStream(stream);
            remoteVideoRef.current.play().catch(console.warn);
          }
        } else {
          setRemoteStream(stream);
        }
        setIsConnecting(false);

        // Set call start time when remote stream is received
        if (!callStartTime) {
          setCallStartTime(Date.now());
        }
      } else {
        console.warn("⚠️ Track received but no streams or track");
      }
    };

    // Handle ICE candidates - send via Socket.io
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 ICE candidate generated:", {
          candidate: event.candidate.candidate?.substring(0, 50) + "...",
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
          isConnected,
          hasReceiverId: !!receiverIdRef.current,
          hasCallId: !!callIdRef.current,
        });

        if (isConnected && receiverIdRef.current && callIdRef.current) {
          emit("webrtc:ice-candidate", {
            callId: callIdRef.current, // ✅ Use ref
            candidate: {
              candidate: event.candidate.candidate,
              sdpMLineIndex: event.candidate.sdpMLineIndex,
              sdpMid: event.candidate.sdpMid,
            },
            targetUserId: receiverIdRef.current,
          });
          console.log("✅ ICE candidate sent");
        } else {
          console.warn("⚠️ ICE candidate not sent:", {
            isConnected,
            hasReceiverId: !!receiverIdRef.current,
            hasCallId: !!callIdRef.current,
          });
        }
      } else {
        console.log("🧊 ICE candidate gathering complete");
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionState(state);
      console.log("🔗 WebRTC connection state changed:", state);

      if (state === "connected") {
        console.log("✅ WebRTC CONNECTED!");
        setIsConnecting(false);
        // Stop waiting when connection is established
        if (isWaitingRef.current) {
          stopWaitingForParticipant();
        }
      } else if (state === "connecting") {
        console.log("🔄 WebRTC connecting...");
      } else if (state === "failed") {
        console.error("❌ WebRTC connection FAILED");
        setError("Connection failed. Please try again.");
        setIsConnecting(false);
      } else if (state === "disconnected") {
        console.warn("⚠️ WebRTC disconnected");
      } else if (state === "closed") {
        console.warn("⚠️ WebRTC connection closed");
      }
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      const iceState = pc.iceConnectionState;
      console.log("🧊 ICE connection state:", iceState);

      if (iceState === "connected" || iceState === "completed") {
        console.log("✅ ICE connection established!");
      } else if (iceState === "failed") {
        console.error("❌ ICE connection FAILED - may need TURN servers");
        setError("Connection failed. This may be due to network restrictions.");
      }
    };

    return pc;
  };

  // ✅ FIX: Create and send WebRTC offer (called after call is accepted)
  const createAndSendOffer = async () => {
    console.log("🔍 createAndSendOffer check:", {
      hasPeerConnection: !!peerConnectionRef.current,
      callId: callId,
      callIdRef: callIdRef.current,
      hasReceiverId: !!receiverIdRef.current,
      receiverId: receiverIdRef.current,
    });

    // ✅ FIX: Use ref for callId to avoid state timing issues
    if (
      !peerConnectionRef.current ||
      !callIdRef.current ||
      !receiverIdRef.current
    ) {
      console.warn(
        "❌ Cannot create offer: missing peer connection, callId, or receiverId"
      );
      return;
    }

    try {
      // Check if peer connection is closed
      if (
        peerConnectionRef.current.signalingState === "closed" ||
        peerConnectionRef.current.connectionState === "closed"
      ) {
        console.warn("Peer connection is closed, cannot create offer");
        setError("Connection was closed. Please try again.");
        setIsConnecting(false);
        return;
      }

      // ⭐ IMPORTANT: Prevent WebRTC race condition
      if (peerConnectionRef.current.signalingState !== "stable") {
        console.warn(
          "Skipping createOffer(): signalingState not stable:",
          peerConnectionRef.current.signalingState
        );
        // Retry after a short delay
        setTimeout(() => {
          if (isMountedRef.current && peerConnectionRef.current) {
            createAndSendOffer();
          }
        }, 500);
        return;
      }

      console.log("Creating WebRTC offer after call accepted...");

      // ✅ Verify tracks are added before creating offer
      const senders = peerConnectionRef.current.getSenders();
      console.log("📊 Peer connection senders:", {
        count: senders.length,
        tracks: senders.map((s) => s.track?.kind).filter(Boolean),
      });

      if (senders.length === 0) {
        console.error(
          "❌ No tracks added to peer connection! Adding tracks..."
        );
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
          });
          console.log("✅ Tracks added to peer connection");
        }
      }

      const offer = await peerConnectionRef.current.createOffer();
      console.log("✅ Offer created:", {
        type: offer.type,
        sdpLength: offer.sdp?.length || 0,
      });

      if (isMountedRef.current && peerConnectionRef.current) {
        await peerConnectionRef.current.setLocalDescription(offer);
        console.log(
          "✅ Local description set, signaling state:",
          peerConnectionRef.current.signalingState
        );

        // Send offer via Socket.io
        if (isConnected) {
          const offerData = {
            callId: callIdRef.current, // ✅ Use ref
            offer: {
              type: offer.type,
              sdp: offer.sdp,
            },
            receiverId: receiverIdRef.current,
          };

          console.log("📤 Emitting webrtc:offer:", {
            callId: offerData.callId,
            receiverId: offerData.receiverId,
            offerType: offerData.offer.type,
            socketConnected: isConnected,
            socketId: socket?.id,
          });

          emit("webrtc:offer", offerData);
          console.log("✅ WebRTC offer sent successfully via Socket.io");
        } else {
          console.error("❌ Socket not connected, cannot send offer");
          console.error("Socket state:", {
            isConnected,
            socketExists: !!socket,
            socketConnected: socket?.connected,
          });
          setError("Connection lost. Please try again.");
        }
      }
    } catch (offerError: unknown) {
      console.error("Error creating/sending offer:", offerError);
      const error = offerError as { message?: string };
      if (error.message?.includes("closed")) {
        setError("Connection was closed. Please try again.");
        setIsConnecting(false);
        return;
      }
      setError("Failed to establish connection. Please try again.");
    }
  };

  // Get local media stream (only once, never reload)
  const getLocalStream = async () => {
    // If already loaded, return existing stream
    if (cameraLoadedRef.current && localStreamRef.current) {
      return localStreamRef.current;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Store in both ref and state
      localStreamRef.current = stream;
      setLocalStream(stream);
      cameraLoadedRef.current = true;

      // Set video element srcObject immediately
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setError("Failed to access camera/microphone. Please check permissions.");
      return null;
    }
  };

  // Setup Socket.io event listeners
  useEffect(() => {
    if (!isConnected || !socket) return;

    // Handle incoming call
    const handleIncomingCall = async (data: {
      callId: string;
      caller: {
        id: string;
        username: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
      };
      appointmentId?: string;
    }) => {
      console.log("Incoming call:", data);
      setCallId(data.callId);
      receiverIdRef.current = data.caller.id;
      isInitiatorRef.current = false;

      // Initialize peer connection
      initializePeerConnection();

      // Get local stream (will return existing if already loaded)
      const stream = await getLocalStream();

      // Add tracks to peer connection if stream exists
      if (stream && peerConnectionRef.current) {
        stream.getTracks().forEach((track) => {
          peerConnectionRef.current?.addTrack(track, stream);
        });
      }
    };

    // Handle call accepted
    const handleCallAccepted = async (data: { callId: string }) => {
      console.log("🔔 call:accepted event received:", {
        receivedCallId: data.callId,
        currentCallId: callId,
        callIdRef: callIdRef.current,
        isInitiator: isInitiatorRef.current,
        hasPeerConnection: !!peerConnectionRef.current,
        peerConnectionState: peerConnectionRef.current?.connectionState,
        signalingState: peerConnectionRef.current?.signalingState,
      });

      // ✅ FIX: Use ref for callId check to avoid state timing issues
      if (data.callId === callIdRef.current && isInitiatorRef.current) {
        console.log("✅ Call accepted - processing...");
        // Stop waiting when call is accepted
        stopWaitingForParticipant();
        try {
          await updateVideoCallStatus({
            id: callIdRef.current!,
            body: { status: VideoCallStatus.ACTIVE },
          }).unwrap();

          // ✅ FIX: Send WebRTC offer AFTER call is accepted
          // This ensures patient has created their peer connection
          if (peerConnectionRef.current) {
            console.log("📤 Sending WebRTC offer after call accepted...");

            // Wait a bit to ensure patient's peer connection is ready
            await new Promise((resolve) => setTimeout(resolve, 500));

            await createAndSendOffer();
          } else {
            console.error(
              "❌ Peer connection not available when call accepted"
            );
            setError("Connection error. Please try again.");
          }
        } catch (err) {
          console.error("❌ Failed to update call status:", err);
        }
      } else {
        console.warn("⚠️ Call accepted event ignored:", {
          reason:
            data.callId !== callIdRef.current
              ? "callId mismatch"
              : "not initiator",
          dataCallId: data.callId,
          callIdRef: callIdRef.current,
          isInitiator: isInitiatorRef.current,
        });
      }
    };

    // Handle call rejected
    const handleCallRejected = (data: { callId: string }) => {
      if (data.callId === callId) {
        console.log("Call rejected:", data);
        stopWaitingForParticipant();
        setError("Call was rejected by the patient.");
        setIsConnecting(false);
        cleanup();
      }
    };

    // Handle call cancelled
    const handleCallCancelled = (data: { callId: string }) => {
      if (data.callId === callId) {
        console.log("Call cancelled:", data);
        stopWaitingForParticipant();
        setError("Call was cancelled.");
        setIsConnecting(false);
        cleanup();
      }
    };

    // Handle call ended
    const handleCallEnded = (data: { callId: string; duration?: number }) => {
      if (data.callId === callId || data.callId === callIdRef.current) {
        console.log("Call ended:", data);

        // Calculate duration if not provided
        let finalDuration = data.duration;
        if (!finalDuration && callStartTime) {
          finalDuration = Math.floor((Date.now() - callStartTime) / 1000); // in seconds
        }

        setCallDuration(finalDuration || 0);
        setCallEnded(true);
        setIsConnecting(false);
        cleanup();
      }
    };

    // Handle call error
    const handleCallError = (data: { callId: string; message: string }) => {
      if (data.callId === callId) {
        console.error("Call error:", data);

        const errorMessage =
          data.message || "An error occurred during the call.";
        const isOfflineError =
          errorMessage.toLowerCase().includes("offline") ||
          errorMessage.toLowerCase().includes("not connected");

        // If this is an "offline" error and we're the initiator, start waiting instead of showing error
        // The patient might come online later
        if (isOfflineError && isInitiatorRef.current) {
          console.log(
            "Receiver appears offline, starting to wait for them to join..."
          );

          // Start waiting if not already waiting
          if (!isWaitingRef.current && callId) {
            startWaitingForParticipant();
          }

          // Don't show error modal - just wait silently
          return;
        }

        // If we're already waiting and get an offline error, just continue waiting
        if (isWaitingRef.current && isOfflineError) {
          console.log("Receiver appears offline, but continuing to wait...");
          return;
        }

        // For other errors (not offline), show the error modal
        setError(errorMessage);
        setIsConnecting(false);
        stopWaitingForParticipant(); // Stop waiting if there's a real error
      }
    };

    // Handle WebRTC offer (receiver side)
    const handleWebRTCOffer = async (data: {
      callId: string;
      offer: { type: string; sdp: string };
      callerId: string;
    }) => {
      if (!peerConnectionRef.current || data.callId !== callId) return;

      console.log("Received WebRTC offer:", data);

      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.offer as RTCSessionDescriptionInit)
        );

        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);

        emit("webrtc:answer", {
          callId: data.callId,
          answer: {
            type: answer.type,
            sdp: answer.sdp,
          },
          callerId: data.callerId,
        });
      } catch (err) {
        console.error("Error handling WebRTC offer:", err);
        setError("Failed to establish connection.");
      }
    };

    // Handle WebRTC answer (initiator side)
    const handleWebRTCAnswer = async (data: {
      callId: string;
      answer: { type: string; sdp: string };
      receiverId: string;
    }) => {
      console.log("🔔 WebRTC answer received:", {
        receivedCallId: data.callId,
        currentCallId: callId,
        callIdRef: callIdRef.current,
        hasPeerConnection: !!peerConnectionRef.current,
      });

      // ✅ FIX: Use ref for callId check to avoid state timing issues
      if (!peerConnectionRef.current || data.callId !== callIdRef.current) {
        console.warn("⚠️ Answer ignored:", {
          reason: !peerConnectionRef.current
            ? "no peer connection"
            : "callId mismatch",
        });
        return;
      }

      console.log("✅ Processing WebRTC answer...");

      // Stop waiting when we receive the answer (participant has joined)
      if (isWaitingRef.current && isInitiatorRef.current) {
        stopWaitingForParticipant();
      }

      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer as RTCSessionDescriptionInit)
        );
      } catch (err) {
        console.error("Error handling WebRTC answer:", err);
        setError("Failed to establish connection.");
      }
    };

    // Handle ICE candidate
    const handleICECandidate = async (data: {
      callId: string;
      candidate: {
        candidate: string;
        sdpMLineIndex: number | null;
        sdpMid: string | null;
      };
      fromUserId: string;
    }) => {
      console.log("🧊 ICE candidate received:", {
        callId: data.callId,
        currentCallId: callId,
        callIdRef: callIdRef.current,
        match: data.callId === callIdRef.current,
        hasPeerConnection: !!peerConnectionRef.current,
        candidate: data.candidate?.candidate?.substring(0, 50) + "...",
      });

      // ✅ FIX: Use ref for callId check
      if (!peerConnectionRef.current || data.callId !== callIdRef.current) {
        console.warn("⚠️ ICE candidate ignored:", {
          reason: !peerConnectionRef.current
            ? "no peer connection"
            : "callId mismatch",
        });
        return;
      }

      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
        console.log("✅ ICE candidate added successfully");
      } catch (err) {
        console.error("❌ Error adding ICE candidate:", err);
      }
    };

    // Register all event listeners
    on("call:incoming", handleIncomingCall);
    on("call:accepted", handleCallAccepted);
    on("call:rejected", handleCallRejected);
    on("call:cancelled", handleCallCancelled);
    on("call:ended", handleCallEnded);
    on("call:error", handleCallError);
    on("webrtc:offer", handleWebRTCOffer);
    on("webrtc:answer", handleWebRTCAnswer);
    on("webrtc:ice-candidate", handleICECandidate);

    // Cleanup listeners on unmount
    return () => {
      off("call:incoming", handleIncomingCall);
      off("call:accepted", handleCallAccepted);
      off("call:rejected", handleCallRejected);
      off("call:cancelled", handleCallCancelled);
      off("call:ended", handleCallEnded);
      off("call:error", handleCallError);
      off("webrtc:offer", handleWebRTCOffer);
      off("webrtc:answer", handleWebRTCAnswer);
      off("webrtc:ice-candidate", handleICECandidate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    socket,
    callId,
    on,
    off,
    emit,
    updateVideoCallStatus,
    navigate,
  ]);

  // Get camera stream immediately on mount (completely independent - NO backend needed)
  useEffect(() => {
    isMountedRef.current = true;

    // Load camera immediately, regardless of any connection status
    console.log("📹 Loading camera stream...");
    getLocalStream().then((stream) => {
      if (stream) {
        console.log("✅ Camera stream loaded successfully:", {
          streamId: stream.id,
          videoTracks: stream.getVideoTracks().length,
          audioTracks: stream.getAudioTracks().length,
        });
      } else {
        console.error("❌ Failed to load camera stream");
      }
    });

    return () => {
      isMountedRef.current = false;
    };
  }, []); // Only run once on mount - camera is LOCAL, doesn't need backend

  // ✅ FIX: Monitor connection state to help debug
  useEffect(() => {
    const interval = setInterval(() => {
      if (peerConnectionRef.current) {
        const pc = peerConnectionRef.current;
        console.log("📊 Connection State Monitor:", {
          connectionState: pc.connectionState,
          iceConnectionState: pc.iceConnectionState,
          signalingState: pc.signalingState,
          senders: pc.getSenders().length,
          receivers: pc.getReceivers().length,
          callId: callIdRef.current,
        });
      }
    }, 3000); // Log every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // ✅ FIX: Ensure remote video element updates when stream changes
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      console.log("🔄 Updating remote video element with stream:", {
        streamId: remoteStream.id,
        tracks: remoteStream.getTracks().length,
        videoTracks: remoteStream.getVideoTracks().length,
      });

      // Always update srcObject to ensure we have the latest stream/tracks
      // This is important when tracks are added/replaced (e.g., camera turned back on)
      remoteVideoRef.current.srcObject = remoteStream;

      // Check if there are active video tracks
      const videoTracks = remoteStream.getVideoTracks();
      const hasActiveVideo = videoTracks.some(
        (track) => track.enabled && !track.muted && track.readyState === "live"
      );

      // Only try to play if there's an active video track
      if (hasActiveVideo) {
        remoteVideoRef.current.play().catch((err) => {
          console.warn("⚠️ Failed to play remote video:", err);
        });
      }
    }
  }, [remoteStream]);

  // Monitor remote video track state changes
  useEffect(() => {
    if (!remoteStream) {
      setIsRemoteCameraOff(false);
      return;
    }

    const videoTracks = remoteStream.getVideoTracks();

    if (videoTracks.length === 0) {
      setIsRemoteCameraOff(true);
      return;
    }

    // Store video element reference for cleanup
    const videoElement = remoteVideoRef.current;

    // Helper function to check if video is actually active
    const checkVideoState = () => {
      const hasActiveVideo = videoTracks.some((track) => {
        // Track is active if: enabled, not muted, and live
        const readyState: MediaStreamTrackState = track.readyState;
        const isActive = track.enabled && !track.muted && readyState === "live";

        console.log("📹 Checking video track state:", {
          trackId: track.id,
          enabled: track.enabled,
          muted: track.muted,
          readyState: track.readyState,
          isActive,
        });

        return isActive;
      });

      const newState = !hasActiveVideo;
      console.log("📹 Video state check result:", {
        hasActiveVideo,
        isRemoteCameraOff: newState,
      });

      setIsRemoteCameraOff(newState);

      // If video becomes active, ensure video element plays
      if (!newState && videoElement) {
        // Make sure srcObject is set
        if (videoElement.srcObject !== remoteStream) {
          videoElement.srcObject = remoteStream;
        }
        videoElement.play().catch((err) => {
          console.warn(
            "⚠️ Failed to play remote video after track activation:",
            err
          );
        });
      }

      return hasActiveVideo;
    };

    // Check initial state
    checkVideoState();

    // Monitor each video track
    const trackStateHandlers = videoTracks.map((track) => {
      const handleEnded = () => {
        console.log("📹 Remote video track ended");
        setIsRemoteCameraOff(true);
      };

      const handleMute = () => {
        console.log("📹 Remote video track muted");
        setIsRemoteCameraOff(true);
      };

      const handleUnmute = () => {
        console.log("📹 Remote video track unmuted");
        // Check state after a brief delay to allow readyState to update
        setTimeout(() => {
          checkVideoState();
        }, 100);
      };

      track.addEventListener("ended", handleEnded);
      track.addEventListener("mute", handleMute);
      track.addEventListener("unmute", handleUnmute);

      // Monitor readyState and muted changes by polling (since there's no readyStateChange event)
      // This is important for when camera is turned back on
      const readyStateInterval = setInterval(() => {
        const isActive =
          track.readyState === "live" && track.enabled && !track.muted;

        if (isActive) {
          // Video is live, enabled, and not muted - make sure we show it
          setIsRemoteCameraOff(false);
          if (videoElement) {
            // Ensure srcObject is set
            if (videoElement.srcObject !== remoteStream) {
              videoElement.srcObject = remoteStream;
            }
            videoElement.play().catch(console.warn);
          }
        } else if (track.muted || !track.enabled) {
          // Track is muted or disabled - camera is off
          setIsRemoteCameraOff(true);
        }
      }, 300); // Check more frequently (300ms instead of 500ms)

      return {
        track,
        handleEnded,
        handleMute,
        handleUnmute,
        readyStateInterval,
      };
    });

    // Also monitor the video element for when it starts playing
    if (videoElement) {
      const handleVideoPlay = () => {
        console.log("📹 Remote video started playing");
        // Check actual track state when video plays
        checkVideoState();
      };

      const handleVideoPause = () => {
        console.log("📹 Remote video paused");
        // Check if this is because camera is off or just paused
        checkVideoState();
      };

      // Also listen for when video element loads/updates
      const handleLoadedMetadata = () => {
        console.log("📹 Remote video metadata loaded");
        checkVideoState();
      };

      const handleCanPlay = () => {
        console.log("📹 Remote video can play");
        checkVideoState();
        // Try to play if not already playing
        if (videoElement.paused) {
          videoElement.play().catch(console.warn);
        }
      };

      videoElement.addEventListener("play", handleVideoPlay);
      videoElement.addEventListener("pause", handleVideoPause);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("canplay", handleCanPlay);

      // Cleanup
      return () => {
        trackStateHandlers.forEach(
          ({
            track,
            handleEnded,
            handleMute,
            handleUnmute,
            readyStateInterval,
          }) => {
            track.removeEventListener("ended", handleEnded);
            track.removeEventListener("mute", handleMute);
            track.removeEventListener("unmute", handleUnmute);
            clearInterval(readyStateInterval);
          }
        );
        if (videoElement) {
          videoElement.removeEventListener("play", handleVideoPlay);
          videoElement.removeEventListener("pause", handleVideoPause);
          videoElement.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
          videoElement.removeEventListener("canplay", handleCanPlay);
        }
      };
    } else {
      // Cleanup without video element listeners
      return () => {
        trackStateHandlers.forEach(
          ({
            track,
            handleEnded,
            handleMute,
            handleUnmute,
            readyStateInterval,
          }) => {
            track.removeEventListener("ended", handleEnded);
            track.removeEventListener("mute", handleMute);
            track.removeEventListener("unmute", handleUnmute);
            clearInterval(readyStateInterval);
          }
        );
      };
    }
  }, [remoteStream]);

  // Initialize call (only if patientId is provided - means we're initiating)
  useEffect(() => {
    console.log("🔍 Call Initiation useEffect triggered:", {
      patientId,
      appointmentId,
      isConnected,
      hasLocalStream: !!localStreamRef.current,
      callInitiated: callInitiatedRef.current,
      searchParams: Object.fromEntries(searchParams.entries()),
    });

    // Prevent multiple initializations
    if (callInitiatedRef.current) {
      console.log("⚠️ Call already initiated, skipping...");
      return;
    }

    // Only initiate call if patientId is provided (we're the caller)
    if (!patientId) {
      console.log("ℹ️ No patientId - might be receiving a call, waiting...");
      // If no patientId, we might be receiving a call, so don't show error
      // The incoming call handler will set up the connection
      return;
    }

    // Wait for Socket.io connection before initiating call
    if (!isConnected) {
      console.log("⏳ Waiting for Socket.io connection...");
      return;
    }

    // Camera should already be loaded (it loads on mount independently)
    // Just check if we have the stream reference
    if (!localStreamRef.current) {
      console.log("⏳ Waiting for camera stream...");
      return;
    }

    // Mark as initiated to prevent re-running
    callInitiatedRef.current = true;
    console.log("✅ Starting call initiation process...");

    const initializeCall = async () => {
      try {
        // Validate patientId
        if (!patientId) {
          setError("Missing patient ID. Please return to appointments.");
          setIsConnecting(false);
          return;
        }

        receiverIdRef.current = patientId;
        isInitiatorRef.current = true;

        // Initialize peer connection
        initializePeerConnection();

        // Check if component is still mounted
        if (!isMountedRef.current || !peerConnectionRef.current) {
          return;
        }

        // Add existing stream tracks to peer connection
        if (localStreamRef.current && peerConnectionRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            peerConnectionRef.current?.addTrack(track, localStreamRef.current!);
          });
        }

        // Initiate video call via API
        console.log("📞 Initiating video call via API:", {
          receiverId: patientId,
          appointmentId,
          hasPeerConnection: !!peerConnectionRef.current,
          hasLocalStream: !!localStreamRef.current,
          socketConnected: isConnected,
        });

        const result = await initiateVideoCallRef
          .current({
            receiverId: patientId,
            appointmentId: appointmentId || undefined,
          })
          .unwrap();

        console.log("Video call initiated successfully:", result);

        // Check if component is still mounted and peer connection is still valid
        if (!isMountedRef.current || !peerConnectionRef.current) {
          return;
        }

        if (result.data?._id) {
          const videoCallId = result.data._id;
          setCallId(videoCallId);
          callIdRef.current = videoCallId; // ✅ FIX: Also set ref

          // Update status to ringing
          await updateVideoCallStatusRef
            .current({
              id: videoCallId,
              body: { status: VideoCallStatus.RINGING },
            })
            .unwrap();

          // Start waiting for participant to join BEFORE emitting socket event
          // This way if backend immediately sends "offline" error, we're already in waiting state
          startWaitingForParticipant();

          // Notify via Socket.io
          if (isConnected && socket?.connected) {
            console.log("📤 Emitting call:initiate via Socket.io:", {
              receiverId: patientId,
              callId: videoCallId,
              appointmentId: appointmentId || undefined,
              socketId: socket?.id,
              socketConnected: socket?.connected,
              note: "Backend will look up receiverId in userSockets map. Patient must be connected with matching userId.",
            });
            emitRef.current("call:initiate", {
              receiverId: patientId,
              callId: videoCallId,
              appointmentId: appointmentId || undefined,
            });
            console.log("✅ call:initiate event emitted successfully");
            console.log(
              "⏳ Waiting for backend to find patient's socket and send call:incoming..."
            );
          } else {
            console.error(
              "❌ Socket not connected, cannot emit call:initiate:",
              {
                isConnected,
                socketExists: !!socket,
                socketConnected: socket?.connected,
              }
            );
            setError(
              "Socket connection lost. Please check your connection and try again."
            );
          }

          // ✅ FIX: Don't send offer here - wait for call:accepted event
          // Offer will be sent in handleCallAccepted after patient accepts
        }
      } catch (err: unknown) {
        // Log full error for debugging
        const error = err as {
          status?: number | string;
          data?: unknown;
          message?: string;
        };
        console.error("Failed to initiate call - Full error:", err);
        console.error("Error status:", error?.status);
        console.error("Error data:", error?.data);
        console.error("Error message:", error?.message);

        // Extract error message from RTK Query error format
        let errorMessage = "Failed to start video call. Please try again.";

        // RTK Query error format: err.data.message or err.data
        if (error?.data) {
          if (typeof error.data === "object" && error.data !== null) {
            const data = error.data as { message?: string; error?: string };
            if (data.message) {
              errorMessage = data.message;
            } else if (data.error) {
              errorMessage = data.error;
            }
          } else if (typeof error.data === "string") {
            errorMessage = error.data;
          }
        }
        // Standard error format
        else if (error?.message) {
          errorMessage = error.message;
        }

        // Check if this is an "offline" error - if so, don't show error, just wait
        const isOfflineError =
          errorMessage.toLowerCase().includes("offline") ||
          errorMessage.toLowerCase().includes("not connected");

        if (isOfflineError) {
          console.log(
            "Receiver appears offline, but will wait for them to join..."
          );
          // Don't show error modal - just continue waiting
          // The waiting mechanism will handle checking when they come online
          return;
        }

        // Add more context based on error status
        if (error?.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error?.status === 403) {
          errorMessage = "You don't have permission to start this call.";
        } else if (error?.status === 404) {
          errorMessage = "Patient not found. Please check the appointment.";
        } else if (error?.status === 400) {
          errorMessage =
            errorMessage || "Invalid request. Please check the patient ID.";
        } else if (error?.status === 500) {
          errorMessage = "Server error. Please try again in a few seconds.";
        } else if (error?.status === "FETCH_ERROR") {
          errorMessage =
            "Network error. Please check your connection and the backend URL (VITE_APP_BE_URL).";
        } else if (error?.status === "PARSING_ERROR") {
          errorMessage = "Server response error. Please check the backend API.";
        }

        if (isMountedRef.current) {
          setError(errorMessage);
          setIsConnecting(false);
        }
      }
    };

    initializeCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, appointmentId, isConnected]); // Camera is independent, no need to wait for localStream state

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      callInitiatedRef.current = false; // Reset on unmount
      stopWaitingForParticipant(); // Stop polling
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run cleanup on unmount

  // Cleanup function
  const cleanup = () => {
    // Stop local stream (only stop, don't clear ref until unmount)
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      cameraLoadedRef.current = false;
    }

    // Stop remote stream
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Clear video refs
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  // Toggle camera
  const toggleCamera = async () => {
    if (localStreamRef.current && peerConnectionRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newEnabledState = !isCameraOn;

        // ✅ FIX: Update peer connection sender to reflect camera state
        // This ensures the patient sees the camera turn off
        // Find video sender - check transceivers to find the video sender even if track is null
        const transceivers = peerConnectionRef.current.getTransceivers();
        const videoTransceiver = transceivers.find(
          (t) =>
            t.receiver.track?.kind === "video" ||
            t.sender.track?.kind === "video"
        );
        const videoSender =
          videoTransceiver?.sender ||
          peerConnectionRef.current
            .getSenders()
            .find((sender) => sender.track?.kind === "video");

        if (videoSender) {
          try {
            if (newEnabledState) {
              // Camera turned on - enable track and replace in sender
              videoTrack.enabled = true;
              await videoSender.replaceTrack(videoTrack);
              console.log(
                "✅ Camera track enabled and replaced in peer connection"
              );
            } else {
              // Camera turned off - replace with null to stop sending video
              // First disable the track locally
              videoTrack.enabled = false;
              // Then remove it from the peer connection
              await videoSender.replaceTrack(null);
              console.log("✅ Camera track removed from peer connection");
            }
          } catch (err) {
            console.error("❌ Error updating video track:", err);
            // Fallback: just enable/disable the track locally
            videoTrack.enabled = newEnabledState;
          }
        } else {
          // Fallback: just enable/disable the track if no sender found
          console.warn("⚠️ No video sender found, only toggling track locally");
          videoTrack.enabled = newEnabledState;
        }

        setIsCameraOn(newEnabledState);
      }
    }
  };

  // Toggle microphone
  const toggleMic = async () => {
    if (localStreamRef.current && peerConnectionRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        const newEnabledState = !isMicOn;

        // ✅ FIX: Update peer connection sender to reflect microphone state
        // This ensures the patient hears the microphone turn off
        // Find audio sender - check transceivers to find the audio sender even if track is null
        const transceivers = peerConnectionRef.current.getTransceivers();
        const audioTransceiver = transceivers.find(
          (t) =>
            t.receiver.track?.kind === "audio" ||
            t.sender.track?.kind === "audio"
        );
        const audioSender =
          audioTransceiver?.sender ||
          peerConnectionRef.current
            .getSenders()
            .find((sender) => sender.track?.kind === "audio");

        if (audioSender) {
          try {
            if (newEnabledState) {
              // Microphone turned on - enable track and replace in sender
              audioTrack.enabled = true;
              await audioSender.replaceTrack(audioTrack);
              console.log(
                "✅ Audio track enabled and replaced in peer connection"
              );
            } else {
              // Microphone turned off - replace with null to stop sending audio
              // First disable the track locally
              audioTrack.enabled = false;
              // Then remove it from the peer connection
              await audioSender.replaceTrack(null);
              console.log("✅ Audio track removed from peer connection");
            }
          } catch (err) {
            console.error("❌ Error updating audio track:", err);
            // Fallback: just enable/disable the track locally
            audioTrack.enabled = newEnabledState;
          }
        } else {
          // Fallback: just enable/disable the track if no sender found
          console.warn("⚠️ No audio sender found, only toggling track locally");
          audioTrack.enabled = newEnabledState;
        }

        setIsMicOn(newEnabledState);
      }
    }
  };

  // End call
  const handleEndCall = async () => {
    try {
      // Calculate duration
      let duration = 0;
      if (callStartTime) {
        duration = Math.floor((Date.now() - callStartTime) / 1000); // in seconds
      }

      if (callId && isConnected) {
        // Emit call:end event via Socket.io
        emit("call:end", {
          callId,
          duration,
        });

        // Also call REST API
        await endVideoCall({ id: callId }).unwrap();
      }
    } catch (err) {
      console.error("Failed to end call:", err);
    } finally {
      cleanup();
      // ✅ FIX: Properly close the tab/window
      // Try to close the window (works if opened via window.open)
      try {
        window.close();
        // If window.close() doesn't work (browser security), navigate away as fallback
        setTimeout(() => {
          navigate("/appointments");
        }, 100);
      } catch {
        // Fallback: navigate back if close fails
        navigate("/appointments");
      }
    }
  };

  // Close call (used when patient ends call)
  const handleCloseCall = () => {
    cleanup();
    // Try to close the window
    try {
      window.close();
      // If window.close() doesn't work (browser security), navigate away as fallback
      setTimeout(() => {
        navigate("/appointments");
      }, 100);
    } catch {
      // Fallback: navigate back if close fails
      navigate("/appointments");
    }
  };

  // Parse patient name for avatar initials
  const parsePatientName = () => {
    if (!patientName) return { firstName: "", lastName: "" };

    // Handle "Last, First" format
    if (patientName.includes(",")) {
      const parts = patientName.split(",").map((p) => p.trim());
      return {
        lastName: parts[0] || "",
        firstName: parts[1] || "",
      };
    }

    // Handle "First Last" format
    const parts = patientName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        firstName: parts[0],
        lastName: parts.slice(1).join(" "),
      };
    }

    return {
      firstName: parts[0] || "",
      lastName: "",
    };
  };

  const patientNameParts = parsePatientName();

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        secs
      ).padStart(2, "0")}`;
    }
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  // Auto-close tab after 5 seconds when call ends
  useEffect(() => {
    if (!callEnded) {
      setAutoCloseCountdown(5);
      return;
    }

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setAutoCloseCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Set up auto-close timeout
    const closeTimeout = setTimeout(() => {
      console.log("⏰ Auto-closing tab after 5 seconds...");
      // Close the tab/window
      cleanup();
      try {
        window.close();
        // If window.close() doesn't work (browser security), navigate away as fallback
        setTimeout(() => {
          navigate("/appointments");
        }, 100);
      } catch {
        // Fallback: navigate back if close fails
        navigate("/appointments");
      }
    }, 5000);

    // Cleanup
    return () => {
      clearInterval(countdownInterval);
      clearTimeout(closeTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callEnded]);

  // Show call ended screen
  if (callEnded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-6 mx-4 text-center w-[300px] h-[300px]">
          <div className="mb-4">
            <div className="w-fit flex justify-center items-center mx-auto bg-gray-100 mb-3 rounded-full p-4">
              <CallSlash className="text-gray-600 icon-lg" />
            </div>
            <h3 className="text-h3 font-semibold mb-2 text-red-500">
              Call Ended
            </h3>
            {callDuration !== null && (
              <p className="text-gray-600 mb-3 text-md">
                Duration: {formatDuration(callDuration)}
              </p>
            )}
            <p className="text-gray-500 text-sm mb-3">
              Closing automatically in {autoCloseCountdown} second
              {autoCloseCountdown !== 1 ? "s" : ""}...
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              label="Exit Now"
              variant="primary"
              onClick={handleCloseCall}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  }

  if (error && !isConnecting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CallSlash className="text-red-500 icon-lg" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-gray-900">
              Call Error
            </h2>
            <p className="text-gray-600 mb-6 text-sm">{error}</p>
          </div>
          <div className="flex gap-3">
            <Button
              label="Close"
              variant="ghost"
              onClick={handleEndCall}
              className="flex-1"
            />
            <Button
              label="Retry"
              variant="primary"
              onClick={() => {
                setError(null);
                setIsConnecting(true);
                // Retry by reloading the page with same params
                window.location.reload();
              }}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Remote Video (Full Screen) */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {isRemoteCameraOff ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900">
            <Avatar
              size="large"
              firstName={patientNameParts.firstName}
              lastName={patientNameParts.lastName}
            />
            <p className="text-white text-lg font-semibold mt-4">
              {patientName}'s camera is turned off
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="max-w-full max-h-full object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        )}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-center text-white">
              <div className="mb-4 flex justify-center">
                <Spinner size="large" className="text-white" />
              </div>
              <p className="text-lg font-semibold text-white">
                Connecting to {patientName}...
              </p>
            </div>
          </div>
        )}
        {!remoteStream &&
          (isConnecting || connectionState === "connecting") && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="mb-4 flex justify-center">
                  <Spinner size="large" className="text-white" />
                </div>
                <p className="text-lg font-semibold text-white">
                  {connectionState === "connecting"
                    ? "Connecting..."
                    : "Waiting for patient to join call"}
                </p>
                <p className="text-sm text-gray-300 mt-2">{patientName}</p>
                {waitingForParticipant && waitingTime > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Waiting for {Math.floor(waitingTime / 60)}:
                    {String(waitingTime % 60).padStart(2, "0")}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-4">
                  Connection: {connectionState} | ICE:{" "}
                  {peerConnectionRef.current?.iceConnectionState || "unknown"}
                </p>
              </div>
            </div>
          )}
      </div>

      {/* Local Video (Floating) */}
      <div className="absolute top-4 right-4 w-32 h-24 sm:w-48 sm:h-36 md:w-64 md:h-48 rounded-lg overflow-hidden shadow-lg border-2 border-white z-10">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover pointer-events-none"
          style={{ transform: "scaleX(-1)" }} // Mirror the video for better UX
        />
        {!isCameraOn && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <VideoSlash className="text-white icon-lg" />
          </div>
        )}

        {/* Status Indicators */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {!isCameraOn && (
            <div className="bg-red-600 rounded-full p-1.5 flex items-center justify-center">
              <VideoSlash className="text-white icon-sm" />
            </div>
          )}
          {!isMicOn && (
            <div className="bg-red-600 rounded-full p-1.5 flex items-center justify-center">
              <MicrophoneSlash className="text-white icon-sm" />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 items-center">
        {/* Toggle Camera */}
        <ButtonsIcon
          icon={isCameraOn ? <Video /> : <VideoSlash />}
          size="large"
          variant={isCameraOn ? "primary" : "warning"}
          onClick={toggleCamera}
          ariaLabel={isCameraOn ? "Turn off camera" : "Turn on camera"}
        />

        {/* Toggle Microphone */}
        <ButtonsIcon
          icon={isMicOn ? <Microphone2 /> : <MicrophoneSlash />}
          size="large"
          variant={isMicOn ? "primary" : "warning"}
          onClick={toggleMic}
          ariaLabel={isMicOn ? "Mute microphone" : "Unmute microphone"}
        />

        {/* End Call */}
        <Button
          label="End Call"
          size="medium"
          variant="red"
          onClick={handleEndCall}
          disabled={isEnding}
          loading={isEnding}
          loadingText="Ending..."
          leftIcon={<CallSlash />}
        />
      </div>

      {/* Patient Name */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded-lg px-4 py-2">
        <p className="text-white font-semibold">{patientName}</p>
      </div>
    </div>
  );
};

export default VideoCall;
