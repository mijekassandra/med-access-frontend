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
  const localVideoRef = React.useRef<HTMLVideoElement>(null);

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
  }, [localStream]);

  const handleClose = () => {
    stopMediaStream();
    setCallId(null);
    setCallStatus(null);
    setCallDuration(0);
    setIsMuted(false);
    setIsVideoOff(false);
    // If opened in a new tab, close it; otherwise navigate back
    if (window.opener) {
      window.close();
    } else {
      navigate("/appointments");
    }
  };

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
      // Request camera/microphone access first
      const stream = await requestMediaAccess();
      if (!stream) {
        return; // User denied permission or error occurred
      }

      const result = await initiateCall({
        receiverId: patientId,
        appointmentId,
      }).unwrap();

      if (result.data) {
        setCallId(result.data._id);
        setCallStatus(result.data.status);
      }
    } catch (error: any) {
      console.error("Failed to initiate call:", error);
      stopMediaStream();
    }
  };

  const handleAcceptCall = async () => {
    if (!callId) return;
    try {
      // Request camera/microphone access when accepting
      const stream = await requestMediaAccess();
      if (!stream) {
        return; // User denied permission or error occurred
      }

      await updateStatus({
        id: callId,
        body: { status: VideoCallStatus.ACTIVE },
      }).unwrap();
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
    <div className="h-screen w-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <ButtonsIcon
            variant="ghost"
            size="medium"
            onClick={handleClose}
            icon={<ArrowLeft2 size={24} className="text-white" />}
            ariaLabel="Go back"
            customColor="white"
          />
          <div className="flex items-center gap-3">
            <Avatar
              firstName={patientFirstName}
              lastName={patientLastName}
              alt={patientName}
              size="medium"
            />
            <div>
              <h6 className="text-white text-h6 font-semibold">
                {patientName}
              </h6>
              <p className="text-gray-400 text-sm">{getStatusText()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Local Video - Upper Right Corner */}
      {localStream && callStatus === VideoCallStatus.ACTIVE && (
        <div className="fixed top-24 right-8 z-30 w-64 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-600">
          {!isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <VideoSlash size={40} className="text-gray-400" />
            </div>
          )}
          {/* Small label */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 px-2 py-1.5">
            <p className="text-xs text-white font-medium text-center">You</p>
          </div>
          {/* Mute indicator on floating video */}
          {isMuted && (
            <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 flex items-center justify-center">
              <MicrophoneSlash size={16} className="text-white" />
            </div>
          )}
          {/* Camera off indicator */}
          {isVideoOff && (
            <div className="absolute top-2 right-2 bg-red-600 rounded-full p-1.5 flex items-center justify-center">
              <VideoSlash size={16} className="text-white" />
            </div>
          )}
        </div>
      )}

      {/* Main Video Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900 p-8">
        <div className="w-full max-w-7xl h-full bg-gray-800 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden">
          {callStatus === VideoCallStatus.ACTIVE ? (
            <div className="text-white text-center w-full h-full flex flex-col items-center justify-center relative">
              {/* Video status indicators */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {isMuted && (
                  <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                    <MicrophoneSlash size={16} />
                    <span className="text-xs font-medium">Muted</span>
                  </div>
                )}
                {isVideoOff && (
                  <div className="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                    <VideoSlash size={16} />
                    <span className="text-xs font-medium">Camera Off</span>
                  </div>
                )}
              </div>

              {/* Main video area - for remote participant or placeholder */}
              <div className="w-full h-full relative">
                {/* Placeholder for remote participant */}
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <Video size={120} className="mx-auto mb-6 text-gray-400" />
                  <p className="text-3xl font-semibold mb-2">
                    Video call in progress
                  </p>
                  <p className="text-xl text-gray-400 mb-4">
                    Patient connected
                  </p>
                  <div className="mt-4">
                    <p className="text-5xl font-bold text-green-400">
                      {formatDuration(callDuration)}
                    </p>
                  </div>
                </div>

                {/* Call duration overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                  <p className="text-3xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    {formatDuration(callDuration)}
                  </p>
                </div>
              </div>
            </div>
          ) : callStatus === VideoCallStatus.RINGING ||
            callStatus === VideoCallStatus.INITIATED ? (
            <div className="text-gray-400 text-center">
              <div className="animate-pulse">
                <Video size={120} className="mx-auto mb-6" />
              </div>
              <p className="text-3xl font-semibold mb-2">Calling patient...</p>
              <p className="text-lg text-gray-500 mt-2">
                Waiting for patient to answer
              </p>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <Video size={120} className="mx-auto mb-6" />
              <p className="text-3xl font-semibold mb-2">Ready to start call</p>
              <p className="text-lg text-gray-500 mt-2">
                {!callId
                  ? "Click 'Start Call' to begin"
                  : "Preparing connection..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div
        className="bg-gray-800 px-8 py-4
       border-t border-gray-700"
      >
        <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
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
                  const newMutedState = !isMuted;
                  if (localStream) {
                    const audioTracks = localStream.getAudioTracks();
                    audioTracks.forEach((track) => {
                      track.enabled = newMutedState;
                    });
                  }
                  setIsMuted(newMutedState);
                }}
                className={`flex items-center justify-center rounded-full w-16 h-16 transition-all ${
                  isMuted
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                aria-label={isMuted ? "Unmute" : "Mute"}
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <MicrophoneSlash size={24} />
                ) : (
                  <Microphone2 size={24} />
                )}
              </button>
              <button
                onClick={() => {
                  const newVideoOffState = !isVideoOff;
                  if (localStream) {
                    const videoTracks = localStream.getVideoTracks();
                    videoTracks.forEach((track) => {
                      track.enabled = newVideoOffState;
                    });
                  }
                  setIsVideoOff(newVideoOffState);
                }}
                className={`flex items-center justify-center rounded-full w-16 h-16 transition-all ${
                  isVideoOff
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
                aria-label={isVideoOff ? "Turn on video" : "Turn off video"}
                title={isVideoOff ? "Turn on video" : "Turn off video"}
              >
                {isVideoOff ? <VideoSlash size={24} /> : <Video size={24} />}
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
