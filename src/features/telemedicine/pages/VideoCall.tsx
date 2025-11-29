import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Call,
  CallSlash,
  Video,
  Microphone2,
  MicrophoneSlash,
  ArrowLeft2,
  VideoSlash,
} from "iconsax-react";
import Button from "../../../global-components/Button";
import Avatar from "../../../global-components/Avatar";
import {
  useInitiateVideoCallMutation,
  useUpdateVideoCallStatusMutation,
  useEndVideoCallMutation,
  useGetVideoCallByIdQuery,
  VideoCallStatus,
} from "../api/videoCallApi";
import ButtonsIcon from "../../../global-components/ButtonsIcon";

const VideoCall: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const patientId = searchParams.get("patientId") || "";
  const patientName = searchParams.get("patientName") || "";
  const patientFirstName = searchParams.get("patientFirstName") || "";
  const patientLastName = searchParams.get("patientLastName") || "";
  const appointmentId = searchParams.get("appointmentId") || "";

  const [callId, setCallId] = useState<string | null>(null);
  const [callStatus, setCallStatus] = useState<VideoCallStatus | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  // Patient connection and status - will be updated via WebRTC signaling when implemented
  const [patientConnected, setPatientConnected] = useState(false);
  const [patientMuted, setPatientMuted] = useState(false);
  const [patientVideoOff, setPatientVideoOff] = useState(false);

  // TODO: Update patientConnected, patientMuted, and patientVideoOff via WebRTC signaling
  // when patient joins the call and when their mute/camera status changes
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const previewVideoRef = React.useRef<HTMLVideoElement>(null);
  const previewInitiatedRef = React.useRef(false);

  const [initiateCall, { isLoading: isInitiating }] =
    useInitiateVideoCallMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateVideoCallStatusMutation();
  const [endCall, { isLoading: isEnding }] = useEndVideoCallMutation();

  // Poll for call status if callId exists
  const { data: callData } = useGetVideoCallByIdQuery(callId || "", {
    skip: !callId,
    pollingInterval: callId && callStatus !== VideoCallStatus.ENDED ? 2000 : 0,
  });

  // Stop all media tracks
  const stopMediaStream = React.useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = null;
    }
    setIsPreviewActive(false);
  }, [localStream]);

  // Start camera preview
  const startCameraPreview = React.useCallback(async () => {
    try {
      console.log("Starting camera preview...");
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false, // Only video for preview
      });

      console.log("Camera stream obtained:", stream);
      setLocalStream(stream);
      setIsPreviewActive(true);

      return stream;
    } catch (error: any) {
      console.error("Error accessing camera for preview:", error);
      let errorMessage =
        "Unable to access camera. Please check your permissions.";

      if (error.name === "NotAllowedError") {
        errorMessage =
          "Camera access denied. Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage =
          "No camera found. Please connect a camera and try again.";
      } else if (error.name === "NotReadableError") {
        errorMessage =
          "Camera is being used by another application. Please close other apps and try again.";
      }

      setCameraError(errorMessage);
      setIsPreviewActive(false);
      return null;
    }
  }, []);

  const handleClose = () => {
    stopMediaStream();
    setCallId(null);
    setCallStatus(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
    setCameraError(null);
    previewInitiatedRef.current = false;
    // If opened in a new tab, close it; otherwise navigate back
    if (window.opener) {
      window.close();
    } else {
      navigate("/appointments");
    }
  };

  // Start camera preview on component mount (only once)
  useEffect(() => {
    if (!callId && !localStream && !previewInitiatedRef.current) {
      previewInitiatedRef.current = true;
      startCameraPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update preview video when stream becomes available
  useEffect(() => {
    const videoElement = previewVideoRef.current;
    if (localStream && videoElement) {
      console.log("Setting stream to video element", {
        hasStream: !!localStream,
        hasVideoElement: !!videoElement,
        videoTracks: localStream.getVideoTracks().length,
        videoTrackEnabled: localStream.getVideoTracks()[0]?.enabled,
      });

      // Set the stream
      if (videoElement.srcObject !== localStream) {
        videoElement.srcObject = localStream;
      }

      // Try to play - use a small delay to ensure element is ready
      const playVideo = () => {
        videoElement.play().catch((error) => {
          if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
            console.error("Error playing video:", error);
          }
        });
      };

      // If video is already loaded, play immediately
      if (videoElement.readyState >= 2) {
        playVideo();
      } else {
        // Otherwise wait for canplay event
        videoElement.addEventListener("canplay", playVideo, { once: true });
      }

      return () => {
        videoElement.removeEventListener("canplay", playVideo);
      };
    }
  }, [localStream]);

  // Update local video ref when stream is available and call is active
  useEffect(() => {
    const videoElement = localVideoRef.current;
    if (
      localStream &&
      videoElement &&
      callStatus === VideoCallStatus.ACTIVE &&
      !isVideoOff
    ) {
      console.log("Setting stream to local video element for active call");

      // Set the stream
      if (videoElement.srcObject !== localStream) {
        videoElement.srcObject = localStream;
      }

      // Try to play
      const playVideo = () => {
        videoElement.play().catch((error) => {
          if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
            console.error("Error playing local video:", error);
          }
        });
      };

      if (videoElement.readyState >= 2) {
        playVideo();
      } else {
        videoElement.addEventListener("canplay", playVideo, { once: true });
      }

      return () => {
        videoElement.removeEventListener("canplay", playVideo);
      };
    }
  }, [localStream, callStatus, isVideoOff]);

  // Update video tracks when isVideoOff changes
  useEffect(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        // When video is off, disable the track (enabled = false)
        // When video is on, enable the track (enabled = true)
        track.enabled = !isVideoOff;
        console.log(
          "Video track enabled set to:",
          track.enabled,
          "isVideoOff:",
          isVideoOff
        );
      });
    }
  }, [localStream, isVideoOff]);

  // Update audio tracks when isMuted changes
  useEffect(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        // When muted, disable the track (enabled = false)
        // When unmuted, enable the track (enabled = true)
        track.enabled = !isMuted;
        console.log(
          "Audio track enabled set to:",
          track.enabled,
          "isMuted:",
          isMuted
        );
      });
    }
  }, [localStream, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, [stopMediaStream]);

  // Update local state when call data changes
  useEffect(() => {
    if (callData?.data) {
      const newStatus = callData.data.status;
      const previousStatus = callStatus;
      setCallStatus(newStatus);

      // If status changed to ACTIVE, log it for debugging
      if (
        newStatus === VideoCallStatus.ACTIVE &&
        previousStatus !== VideoCallStatus.ACTIVE
      ) {
        console.log("Call is now ACTIVE - patient has joined");
      }

      if (newStatus === VideoCallStatus.ENDED) {
        // Call ended, navigate back after a delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callData]);

  // Timer for call duration
  useEffect(() => {
    let interval: number | null = null;
    if (callStatus === VideoCallStatus.ACTIVE) {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [callStatus]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Request camera and microphone access
  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      // Set the stream to the video element (for floating preview)
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch(console.error);
      }

      return stream;
    } catch (error: any) {
      console.error("Error accessing media devices:", error);
      alert(
        "Unable to access camera/microphone. Please check your permissions."
      );
      return null;
    }
  };

  const handleStartCall = async () => {
    try {
      // If we already have a video stream from preview, add audio to it
      if (localStream && isPreviewActive) {
        try {
          // Get audio track and add it to existing stream
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          audioStream.getAudioTracks().forEach((track) => {
            localStream.addTrack(track);
          });
          // Ensure localVideoRef is set for the floating preview during call
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(console.error);
          }
        } catch (error: any) {
          console.error("Error accessing microphone:", error);
          alert("Unable to access microphone. Please check your permissions.");
          return;
        }
      } else {
        // Request camera/microphone access if no preview exists
        const stream = await requestMediaAccess();
        if (!stream) {
          return; // User denied permission or error occurred
        }
      }

      const result = await initiateCall({
        receiverId: patientId,
        appointmentId,
      }).unwrap();

      if (result.data) {
        setCallId(result.data._id);
        setCallStatus(result.data.status);
        setIsPreviewActive(false); // Hide preview when call starts
      }
    } catch (error: any) {
      console.error("Failed to initiate call:", error);
      stopMediaStream();
    }
  };

  const handleAcceptCall = async () => {
    if (!callId) return;
    try {
      // If we already have a video stream from preview, add audio to it
      if (localStream && isPreviewActive) {
        try {
          // Get audio track and add it to existing stream
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
          });
          audioStream.getAudioTracks().forEach((track) => {
            localStream.addTrack(track);
          });
          // Ensure localVideoRef is set for the floating preview during call
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
            localVideoRef.current.play().catch(console.error);
          }
        } catch (error: any) {
          console.error("Error accessing microphone:", error);
          alert("Unable to access microphone. Please check your permissions.");
          return;
        }
      } else {
        // Request camera/microphone access if no preview exists
        const stream = await requestMediaAccess();
        if (!stream) {
          return; // User denied permission or error occurred
        }
      }

      await updateStatus({
        id: callId,
        body: { status: VideoCallStatus.ACTIVE },
      }).unwrap();

      setIsPreviewActive(false); // Hide preview when call is accepted
    } catch (error: any) {
      console.error("Failed to accept call:", error);
      stopMediaStream();
    }
  };

  const handleEndCall = async () => {
    if (!callId) return;
    try {
      await endCall({ id: callId }).unwrap();
    } catch (error: any) {
      console.error("Failed to end call:", error);
    } finally {
      stopMediaStream();
      handleClose();
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case VideoCallStatus.INITIATED:
        return "Calling...";
      case VideoCallStatus.RINGING:
        return "Ringing...";
      case VideoCallStatus.ACTIVE:
        return formatDuration(callDuration);
      case VideoCallStatus.ENDED:
        return "Call Ended";
      default:
        return "Ready to call";
    }
  };

  const isLoading = isInitiating || isUpdating || isEnding;

  // Redirect if required params are missing
  if (!patientId || !appointmentId) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">
            Invalid video call parameters
          </p>
          <Button
            label="Go Back"
            variant="primary"
            onClick={() => navigate("/appointments")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <ButtonsIcon
            variant="ghost"
            size="medium"
            onClick={handleClose}
            icon={<ArrowLeft2 size={20} className="text-white sm:w-6 sm:h-6" />}
            ariaLabel="Go back"
            customColor="white"
          />
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Avatar
              firstName={patientFirstName}
              lastName={patientLastName}
              alt={patientName}
              size="medium"
            />
            <div className="min-w-0">
              <h6 className="text-white text-sm sm:text-h6 font-semibold truncate">
                {patientName}
              </h6>
              <p className="text-gray-400 text-xs sm:text-sm">
                {getStatusText()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Local Video - Upper Right Corner */}
      {localStream && callStatus === VideoCallStatus.ACTIVE && (
        <div className="fixed top-20 sm:top-24 right-2 sm:right-8 z-30 w-32 h-24 sm:w-64 sm:h-48 bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600 flex items-center justify-center">
          {!isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true}
              className="w-full h-full object-contain bg-black"
              onLoadedMetadata={(e) => {
                const video = e.currentTarget;
                video.play().catch((error) => {
                  if (
                    error.name !== "AbortError" &&
                    error.name !== "NotAllowedError"
                  ) {
                    console.error("Error playing floating video:", error);
                  }
                });
              }}
              onCanPlay={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                  video.play().catch((error) => {
                    if (error.name !== "AbortError") {
                      console.error("Error playing floating video:", error);
                    }
                  });
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <VideoSlash size={40} className="text-gray-400" />
            </div>
          )}
          {/* Small label */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-1 sm:px-2 py-0.5 sm:py-1.5">
            <p className="text-[10px] sm:text-xs text-white font-medium text-center">
              You
            </p>
          </div>
          {/* Mute indicator on floating video */}
          {isMuted && (
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 rounded-full p-1 sm:p-1.5 flex items-center justify-center">
              <MicrophoneSlash size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
          )}
          {/* Camera off indicator */}
          {isVideoOff && (
            <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 rounded-full p-1 sm:p-1.5 flex items-center justify-center">
              <VideoSlash size={12} className="text-white sm:w-4 sm:h-4" />
            </div>
          )}
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-2 sm:p-4 md:p-8 min-h-0">
        <div className="w-full max-w-7xl h-full bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
          {callStatus === VideoCallStatus.ACTIVE ? (
            <div className="w-full h-full relative">
              {/* Video status indicators - only show patient's status */}
              {patientConnected && (
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2 z-10 flex-wrap">
                  {patientMuted && (
                    <div className="bg-red-600 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2">
                      <MicrophoneSlash size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Muted
                      </span>
                    </div>
                  )}
                  {patientVideoOff && (
                    <div className="bg-red-600 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 sm:gap-2">
                      <VideoSlash size={14} className="sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        Camera Off
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Main video area - show patient's video (placeholder for now) */}
              <div className="text-white text-center w-full h-full flex flex-col items-center justify-center relative px-4">
                <Video
                  size={60}
                  className="mx-auto mb-3 sm:mb-6 text-gray-400 sm:w-[120px] sm:h-[120px]"
                />
                <p className="text-lg sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-2 text-center">
                  Video call in progress
                </p>
                {patientConnected ? (
                  <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-2 sm:mb-4 text-center">
                    Patient connected
                  </p>
                ) : (
                  <p className="text-sm sm:text-lg md:text-xl text-gray-400 mb-2 sm:mb-4 text-center">
                    Waiting for patient to join...
                  </p>
                )}
                <div className="mt-2 sm:mt-4">
                  <p className="text-2xl sm:text-4xl md:text-5xl font-bold text-green-400">
                    {formatDuration(callDuration)}
                  </p>
                </div>

                {/* Call duration overlay */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold text-white bg-black bg-opacity-50 px-3 sm:px-4 py-1 sm:py-2 rounded-lg">
                    {formatDuration(callDuration)}
                  </p>
                </div>
              </div>
            </div>
          ) : callStatus === VideoCallStatus.RINGING ||
            callStatus === VideoCallStatus.INITIATED ? (
            <div className="w-full h-full relative">
              {localStream ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  {!isVideoOff ? (
                    <video
                      ref={previewVideoRef}
                      autoPlay
                      playsInline
                      muted={true}
                      className="w-full h-full object-contain bg-black"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        backgroundColor: "#000",
                        display: "block",
                      }}
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        console.log(
                          "Video metadata loaded during calling, playing..."
                        );
                        video.play().catch((error) => {
                          if (error.name !== "AbortError") {
                            console.error("Error playing video:", error);
                          }
                        });
                      }}
                      onCanPlay={(e) => {
                        const video = e.currentTarget;
                        if (video.paused) {
                          video.play().catch((error) => {
                            if (error.name !== "AbortError") {
                              console.error("Error playing video:", error);
                            }
                          });
                        }
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                      <VideoSlash
                        size={60}
                        className="mx-auto mb-3 sm:mb-6 text-gray-400 sm:w-[120px] sm:h-[120px]"
                      />
                      <p className="text-lg sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-2 text-center text-white">
                        Camera Off
                      </p>
                    </div>
                  )}
                  {/* Overlay with calling status */}
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full px-2 sm:px-0">
                    <div className="bg-black bg-opacity-70 px-3 sm:px-6 py-2 sm:py-3 rounded-lg mx-auto max-w-fit">
                      <div className="flex items-center justify-center">
                        <div className="animate-pulse">
                          <Video
                            size={20}
                            className="text-white sm:w-6 sm:h-6"
                          />
                        </div>
                        <p className="text-white text-sm sm:text-lg font-semibold">
                          Calling patient...
                        </p>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm text-center">
                        Waiting for patient to answer
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-center px-4 h-full flex flex-col items-center justify-center">
                  <div className="animate-pulse">
                    <Video
                      size={60}
                      className="mx-auto mb-3 sm:mb-6 sm:w-[120px] sm:h-[120px]"
                    />
                  </div>
                  <p className="text-lg sm:text-2xl md:text-3xl font-semibold mb-1">
                    Calling patient...
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500">
                    Waiting for patient to answer
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full relative">
              {localStream ? (
                <div className="w-full h-full relative flex items-center justify-center bg-black">
                  <video
                    key="preview-video"
                    ref={previewVideoRef}
                    autoPlay
                    playsInline
                    muted={true}
                    className="w-full h-full object-contain bg-black"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      backgroundColor: "#000",
                      display: "block",
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget;
                      console.log("Video metadata loaded, playing...");
                      video.play().catch((error) => {
                        if (error.name !== "AbortError") {
                          console.error("Error playing video:", error);
                        }
                      });
                    }}
                    onCanPlay={(e) => {
                      const video = e.currentTarget;
                      console.log("Video can play, current state:", {
                        paused: video.paused,
                        readyState: video.readyState,
                      });
                      if (video.paused) {
                        video.play().catch((error) => {
                          if (error.name !== "AbortError") {
                            console.error("Error playing video:", error);
                          }
                        });
                      }
                    }}
                    onPlay={() => {
                      console.log("Video is now playing!");
                    }}
                    onError={(e) => {
                      console.error("Video error:", e);
                    }}
                  />
                  <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-10 w-full px-2 sm:px-0">
                    <div className="bg-black bg-opacity-70 px-3 sm:px-6 py-2 sm:py-3 rounded-lg mx-auto max-w-fit">
                      <p className="text-white text-sm sm:text-lg font-semibold">
                        Camera Preview
                      </p>
                      <p className="text-gray-300 text-xs sm:text-sm mt-1 text-center">
                        {!callId
                          ? "Click 'Start Call' to begin"
                          : "Preparing connection..."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : cameraError ? (
                <div className="text-gray-400 text-center flex flex-col items-center justify-center h-full px-4">
                  <VideoSlash
                    size={60}
                    className="mx-auto mb-3 sm:mb-6 text-red-500 sm:w-[120px] sm:h-[120px]"
                  />
                  <p className="text-lg sm:text-2xl md:text-3xl font-semibold mb-1 sm:mb-2 text-red-400 text-center">
                    Camera Access Error
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 mt-2 mb-4 sm:mb-6 max-w-md text-center">
                    {cameraError}
                  </p>
                  <Button
                    label="Retry Camera"
                    variant="primary"
                    size="medium"
                    onClick={() => {
                      setCameraError(null);
                      startCameraPreview();
                    }}
                    leftIcon={<Video />}
                  />
                </div>
              ) : (
                <div className="text-gray-400 text-center px-4 h-full flex flex-col items-center justify-center">
                  <Video
                    size={60}
                    className="mx-auto mb-3 sm:mb-6 w-[115px] h-[115px] "
                  />
                  <p className="text-lg sm:text-2xl md:text-3xl font-semibold mb-1">
                    Ready to start call
                  </p>
                  <p className="text-sm sm:text-base md:text-lg text-gray-500">
                    {!callId
                      ? "Loading camera preview..."
                      : "Preparing connection..."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="bg-gray-800 px-3 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto flex-wrap">
          {!callId ? (
            <Button
              label="Start Call"
              variant="primary"
              size="medium"
              onClick={handleStartCall}
              loading={isInitiating}
              loadingText="Starting..."
              leftIcon={<Call />}
              //   className="px-8 py-4 "
            />
          ) : callStatus === VideoCallStatus.RINGING ||
            callStatus === VideoCallStatus.INITIATED ? (
            <>
              <Button
                label="Accept"
                variant="primary"
                size="medium"
                onClick={handleAcceptCall}
                loading={isUpdating}
                loadingText="Accepting..."
                leftIcon={<Call />}
              />
              <Button
                label="End"
                variant="red"
                size="medium"
                onClick={handleEndCall}
                disabled={isLoading}
                leftIcon={<CallSlash />}
              />
            </>
          ) : callStatus === VideoCallStatus.ACTIVE ? (
            <>
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                }}
                className={`flex items-center justify-center rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all ${
                  isMuted
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <MicrophoneSlash
                    size={20}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                  />
                ) : (
                  <Microphone2
                    size={20}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                  />
                )}
              </button>
              <button
                onClick={() => {
                  setIsVideoOff(!isVideoOff);
                }}
                className={`flex items-center justify-center rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 transition-all ${
                  isVideoOff
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                aria-label={isVideoOff ? "Turn on video" : "Turn off video"}
                title={isVideoOff ? "Turn on video" : "Turn off video"}
              >
                {isVideoOff ? (
                  <VideoSlash
                    size={20}
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6"
                  />
                ) : (
                  <Video size={20} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
                )}
              </button>

              <Button
                label="End Call"
                variant="red"
                size="medium"
                onClick={handleEndCall}
                loading={isEnding}
                loadingText="Ending..."
                leftIcon={<CallSlash />}
              />
            </>
          ) : (
            <Button
              label="Close"
              variant="ghost"
              size="medium"
              onClick={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
