import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Video,
  Microphone2,
  MicrophoneSlash,
  VideoSlash,
  CallSlash,
} from "iconsax-react";
import {
  useInitiateVideoCallMutation,
  useUpdateVideoCallStatusMutation,
  useEndVideoCallMutation,
  useGetVideoCallByIdQuery,
  VideoCallStatus,
} from "../api/videoCallApi";
import Button from "../../../global-components/Button";
import ButtonsIcon from "../../../global-components/ButtonsIcon";
import Spinner from "../../../global-components/Spinner";
import { useSocket } from "../../../hooks/useSocket";

const VideoCall: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get URL parameters
  const patientId = searchParams.get("patientId");
  const appointmentId = searchParams.get("appointmentId");
  const patientName = searchParams.get("patientName") || "Patient";

  // State
  // Using ref (localStreamRef) instead of state to avoid re-renders and flickering
  const [_localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [callId, setCallId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionState, setConnectionState] = useState<string>("new");
  const [error, setError] = useState<string | null>(null);
  const [waitingForParticipant, setWaitingForParticipant] = useState(false);
  const [waitingTime, setWaitingTime] = useState(0); // in seconds

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const receiverIdRef = useRef<string | null>(null);
  const isInitiatorRef = useRef<boolean>(false);
  const callInitiatedRef = useRef<boolean>(false); // Prevent multiple call initiations
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

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setRemoteStream(event.streams[0]);
        // Stop waiting when remote stream is received
        if (isWaitingRef.current) {
          stopWaitingForParticipant();
        }
      }
    };

    // Handle ICE candidates - send via Socket.io
    pc.onicecandidate = (event) => {
      if (event.candidate && isConnected && receiverIdRef.current && callId) {
        emit("webrtc:ice-candidate", {
          callId,
          candidate: {
            candidate: event.candidate.candidate,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            sdpMid: event.candidate.sdpMid,
          },
          targetUserId: receiverIdRef.current,
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      setConnectionState(state);
      console.log("Connection state:", state);
      if (state === "connected") {
        setIsConnecting(false);
        // Stop waiting when connection is established
        if (isWaitingRef.current) {
          stopWaitingForParticipant();
        }
      } else if (state === "failed" || state === "disconnected") {
        // Don't set error immediately - might be temporary, keep waiting
        console.warn("Connection state changed to:", state);
      }
    };

    return pc;
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
      if (data.callId === callId && isInitiatorRef.current) {
        console.log("Call accepted:", data);
        // Stop waiting when call is accepted
        stopWaitingForParticipant();
        try {
          await updateVideoCallStatus({
            id: callId!,
            body: { status: VideoCallStatus.ACTIVE },
          }).unwrap();
        } catch (err) {
          console.error("Failed to update call status:", err);
        }
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
      if (data.callId === callId) {
        console.log("Call ended:", data);
        cleanup();
        navigate("/appointments");
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
      if (!peerConnectionRef.current || data.callId !== callId) return;

      console.log("Received WebRTC answer:", data);

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
      if (!peerConnectionRef.current || data.callId !== callId) return;

      try {
        await peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
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
    getLocalStream();

    return () => {
      isMountedRef.current = false;
    };
  }, []); // Only run once on mount - camera is LOCAL, doesn't need backend

  // Initialize call (only if patientId is provided - means we're initiating)
  useEffect(() => {
    // Prevent multiple initializations
    if (callInitiatedRef.current) {
      return;
    }

    // Only initiate call if patientId is provided (we're the caller)
    if (!patientId) {
      // If no patientId, we might be receiving a call, so don't show error
      // The incoming call handler will set up the connection
      return;
    }

    // Wait for Socket.io connection before initiating call
    if (!isConnected) {
      console.log("Waiting for Socket.io connection...");
      return;
    }

    // Camera should already be loaded (it loads on mount independently)
    // Just check if we have the stream reference
    if (!localStreamRef.current) {
      console.log("Waiting for camera stream...");
      return;
    }

    // Mark as initiated to prevent re-running
    callInitiatedRef.current = true;

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
        console.log("Initiating video call with:", {
          receiverId: patientId,
          appointmentId,
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
          if (isConnected) {
            emitRef.current("call:initiate", {
              receiverId: patientId,
              callId: videoCallId,
              appointmentId: appointmentId || undefined,
            });
          }

          // Check again before creating offer
          if (!isMountedRef.current || !peerConnectionRef.current) {
            return;
          }

          // Check if peer connection is closed before creating offer
          if (
            peerConnectionRef.current.signalingState === "closed" ||
            peerConnectionRef.current.connectionState === "closed"
          ) {
            console.warn("Peer connection is closed, cannot create offer");
            setError("Connection was closed. Please try again.");
            setIsConnecting(false);
            return;
          }

          // Create offer (for WebRTC signaling)
          try {
            const offer = await peerConnectionRef.current.createOffer();
            if (isMountedRef.current && peerConnectionRef.current) {
              await peerConnectionRef.current.setLocalDescription(offer);

              // Send offer via Socket.io
              if (isConnected) {
                emit("webrtc:offer", {
                  callId: videoCallId,
                  offer: {
                    type: offer.type,
                    sdp: offer.sdp,
                  },
                  receiverId: patientId,
                });
              }
            }
          } catch (offerError: any) {
            console.error("Error creating offer:", offerError);
            if (offerError.message?.includes("closed")) {
              setError("Connection was closed. Please try again.");
              setIsConnecting(false);
              return;
            }
            throw offerError;
          }
        }
      } catch (err: any) {
        // Log full error for debugging
        console.error("Failed to initiate call - Full error:", err);
        console.error("Error status:", err?.status);
        console.error("Error data:", err?.data);
        console.error("Error message:", err?.message);

        // Extract error message from RTK Query error format
        let errorMessage = "Failed to start video call. Please try again.";

        // RTK Query error format: err.data.message or err.data
        if (err?.data) {
          if (typeof err.data === "object") {
            if (err.data.message) {
              errorMessage = err.data.message;
            } else if (err.data.error) {
              errorMessage = err.data.error;
            }
          } else if (typeof err.data === "string") {
            errorMessage = err.data;
          }
        }
        // Standard error format
        else if (err?.message) {
          errorMessage = err.message;
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
        if (err?.status === 401) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (err?.status === 403) {
          errorMessage = "You don't have permission to start this call.";
        } else if (err?.status === 404) {
          errorMessage = "Patient not found. Please check the appointment.";
        } else if (err?.status === 400) {
          errorMessage =
            errorMessage || "Invalid request. Please check the patient ID.";
        } else if (err?.status === 500) {
          errorMessage = "Server error. Please try again in a few seconds.";
        } else if (err?.status === "FETCH_ERROR") {
          errorMessage =
            "Network error. Please check your connection and the backend URL (VITE_APP_BE_URL).";
        } else if (err?.status === "PARSING_ERROR") {
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
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  // End call
  const handleEndCall = async () => {
    try {
      if (callId && isConnected) {
        // Emit call:end event via Socket.io
        emit("call:end", {
          callId,
          duration: 0, // Calculate actual duration if needed
        });

        // Also call REST API
        await endVideoCall({ id: callId }).unwrap();
      }
    } catch (err) {
      console.error("Failed to end call:", err);
    } finally {
      cleanup();
      // Close the tab/window
      window.close();
      // Fallback: navigate back if window.close() doesn't work
      setTimeout(() => {
        navigate("/appointments");
      }, 100);
    }
  };

  if (error && !isConnecting) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CallSlash className="text-red-600 icon-lg" />
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
      <div className="flex-1 relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
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
        {(!remoteStream || connectionState !== "connected") &&
          !isConnecting && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="mb-4 flex justify-center">
                  <Spinner size="large" className="text-white" />
                </div>
                <p className="text-lg font-semibold text-white">
                  Waiting for patient to join call
                </p>
                <p className="text-sm text-gray-300 mt-2">{patientName}</p>
                {waitingForParticipant && waitingTime > 0 && (
                  <p className="text-xs text-gray-400 mt-2">
                    Waiting for {Math.floor(waitingTime / 60)}:
                    {String(waitingTime % 60).padStart(2, "0")}
                  </p>
                )}
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
