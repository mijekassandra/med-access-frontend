# Frontend Implementation Guide - Video Call with Socket.io & WebRTC

## 📋 Table of Contents

1. [Overview](#overview)
2. [Backend API Reference](#backend-api-reference)
3. [Backend Socket.io Events](#backend-socketio-events)
4. [Mobile App Implementation (Reference)](#mobile-app-implementation-reference)
5. [Frontend Requirements](#frontend-requirements)
6. [Implementation Checklist](#implementation-checklist)
7. [Code Examples](#code-examples)

---

## Overview

This document provides comprehensive information for implementing real-time video calling in the frontend application. The backend and mobile app are already implemented and working. The frontend needs to integrate Socket.io client and WebRTC to match the existing implementations.

### Current Status

- ✅ **Backend**: Fully implemented with Socket.io server and REST API
- ✅ **Mobile App**: Fully implemented with Socket.io client and WebRTC
- ⚠️ **Frontend**: Needs Socket.io client and WebRTC signaling implementation

---

## Backend API Reference

### REST API Endpoints

#### 1. Initiate Video Call

```
POST /api/video-calls/initiate
Authorization: Bearer <token>
Body: {
  receiverId: string,
  appointmentId?: string
}
Response: {
  success: boolean,
  data: {
    _id: string,
    caller: User,
    receiver: User,
    status: 'ringing' | 'active' | 'ended' | 'rejected' | 'cancelled',
    startedAt?: Date,
    endedAt?: Date,
    duration?: number,
    appointmentId?: string
  }
}
```

#### 2. Update Video Call Status

```
PATCH /api/video-calls/:id/status
Authorization: Bearer <token>
Body: {
  status: 'ringing' | 'active' | 'ended' | 'rejected' | 'cancelled',
  startedAt?: Date
}
Response: {
  success: boolean,
  data: VideoCall
}
```

#### 3. End Video Call

```
POST /api/video-calls/:id/end
Authorization: Bearer <token>
Body: {
  duration?: number
}
Response: {
  success: boolean,
  data: VideoCall
}
```

#### 4. Get Video Call by ID

```
GET /api/video-calls/:id
Authorization: Bearer <token>
Response: {
  success: boolean,
  data: VideoCall
}
```

---

## Backend Socket.io Events

### Events the Backend LISTENS for (Frontend must EMIT):

#### 1. `call:initiate`

**Purpose**: Notify backend that a call is being initiated

```typescript
socket.emit("call:initiate", {
  receiverId: string,
  callId: string,
  appointmentId: string,
});
```

#### 2. `call:accept`

**Purpose**: Accept an incoming call

```typescript
socket.emit("call:accept", {
  callId: string,
});
```

#### 3. `call:reject`

**Purpose**: Reject an incoming call

```typescript
socket.emit("call:reject", {
  callId: string,
});
```

#### 4. `call:cancel`

**Purpose**: Cancel an outgoing call (before it's answered)

```typescript
socket.emit("call:cancel", {
  callId: string,
});
```

#### 5. `call:end`

**Purpose**: End an active call

```typescript
socket.emit("call:end", {
  callId: string,
  duration: number,
});
```

#### 6. `webrtc:offer`

**Purpose**: Send WebRTC offer to receiver

```typescript
socket.emit("webrtc:offer", {
  callId: string,
  offer: {
    type: "offer",
    sdp: string,
  },
  receiverId: string,
});
```

#### 7. `webrtc:answer`

**Purpose**: Send WebRTC answer to caller

```typescript
socket.emit("webrtc:answer", {
  callId: string,
  answer: {
    type: "answer",
    sdp: string,
  },
  callerId: string,
});
```

#### 8. `webrtc:ice-candidate`

**Purpose**: Send ICE candidate for NAT traversal

```typescript
socket.emit("webrtc:ice-candidate", {
  callId: string,
  candidate: {
    candidate: string,
    sdpMLineIndex: number,
    sdpMid: string,
  },
  targetUserId: string,
});
```

### Events the Backend EMITS (Frontend must LISTEN):

#### 1. `call:incoming`

**Purpose**: Notify receiver of incoming call

```typescript
socket.on(
  "call:incoming",
  (data: {
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
    // Handle incoming call notification
  }
);
```

#### 2. `call:accepted`

**Purpose**: Notify caller that call was accepted

```typescript
socket.on("call:accepted", (data: { callId: string }) => {
  // Call was accepted, start WebRTC connection
});
```

#### 3. `call:rejected`

**Purpose**: Notify caller that call was rejected

```typescript
socket.on("call:rejected", (data: { callId: string }) => {
  // Call was rejected
});
```

#### 4. `call:cancelled`

**Purpose**: Notify receiver that call was cancelled

```typescript
socket.on("call:cancelled", (data: { callId: string }) => {
  // Call was cancelled by caller
});
```

#### 5. `call:ended`

**Purpose**: Notify other participant that call ended

```typescript
socket.on("call:ended", (data: { callId: string; duration?: number }) => {
  // Call ended
});
```

#### 6. `call:error`

**Purpose**: Notify of call errors

```typescript
socket.on("call:error", (data: { callId: string; message: string }) => {
  // Handle call error
});
```

#### 7. `webrtc:offer`

**Purpose**: Receive WebRTC offer from caller

```typescript
socket.on(
  "webrtc:offer",
  (data: {
    callId: string;
    offer: {
      type: "offer";
      sdp: string;
    };
    callerId: string;
  }) => {
    // Handle WebRTC offer
  }
);
```

#### 8. `webrtc:answer`

**Purpose**: Receive WebRTC answer from receiver

```typescript
socket.on(
  "webrtc:answer",
  (data: {
    callId: string;
    answer: {
      type: "answer";
      sdp: string;
    };
    receiverId: string;
  }) => {
    // Handle WebRTC answer
  }
);
```

#### 9. `webrtc:ice-candidate`

**Purpose**: Receive ICE candidate from peer

```typescript
socket.on(
  "webrtc:ice-candidate",
  (data: {
    callId: string;
    candidate: {
      candidate: string;
      sdpMLineIndex: number;
      sdpMid: string;
    };
    fromUserId: string;
  }) => {
    // Handle ICE candidate
  }
);
```

---

## Mobile App Implementation (Reference)

### Socket.io Service Structure

The mobile app uses a singleton service pattern:

```typescript
// services/socketService.ts
import { io, Socket } from "socket.io-client";
import { store } from "../store/store";

class SocketService {
  private socket: Socket | null = null;

  connect(): void {
    const token = store.getState().auth.token;
    const baseUrl = ENV.LIVE_URL.replace(/\/api$/, "");

    this.socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
    });

    this.setupEventHandlers();
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: Function): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback: Function): void {
    this.socket?.off(event, callback);
  }
}
```

### WebRTC Implementation Pattern

```typescript
// Initialize Peer Connection
const initializePeerConnection = () => {
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const pc = new RTCPeerConnection(configuration);

  // Handle remote stream
  pc.ontrack = (event) => {
    if (event.streams[0]) {
      setRemoteStream(event.streams[0]);
    }
  };

  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate && socket.connected) {
      socket.emit("webrtc:ice-candidate", {
        callId,
        candidate: {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid,
        },
        targetUserId: receiverId,
      });
    }
  };

  return pc;
};

// Get Local Stream
const getLocalStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  return stream;
};

// Create and Send Offer (Initiator)
const createOffer = async () => {
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit("webrtc:offer", {
    callId,
    offer: {
      type: offer.type,
      sdp: offer.sdp,
    },
    receiverId,
  });
};

// Handle Offer and Create Answer (Receiver)
socket.on("webrtc:offer", async (data) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.offer)
  );

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  socket.emit("webrtc:answer", {
    callId: data.callId,
    answer: {
      type: answer.type,
      sdp: answer.sdp,
    },
    callerId: data.callerId,
  });
});

// Handle Answer (Initiator)
socket.on("webrtc:answer", async (data) => {
  await peerConnection.setRemoteDescription(
    new RTCSessionDescription(data.answer)
  );
});

// Handle ICE Candidate
socket.on("webrtc:ice-candidate", async (data) => {
  await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
});
```

---

## Frontend Requirements

### What's Missing in Frontend

Based on the test code analysis (`test-codes/frontend/VideoCall.tsx`), the frontend currently has:

✅ **Has:**

- WebRTC peer connection setup
- Local media stream access
- REST API integration
- Basic UI components

❌ **Missing:**

1. **Socket.io Client Connection**

   - No Socket.io client initialization
   - No connection to backend Socket.io server
   - No authentication with JWT token

2. **Socket.io Event Listeners**

   - Not listening to `call:incoming`
   - Not listening to `call:accepted`
   - Not listening to `call:rejected`
   - Not listening to `call:cancelled`
   - Not listening to `call:ended`
   - Not listening to `call:error`
   - Not listening to `webrtc:offer`
   - Not listening to `webrtc:answer`
   - Not listening to `webrtc:ice-candidate`

3. **Socket.io Event Emissions**

   - Not emitting `call:initiate` (line 73 has TODO)
   - Not emitting `call:accept`
   - Not emitting `call:reject`
   - Not emitting `call:cancel`
   - Not emitting `call:end`
   - Not emitting `webrtc:offer` (line 214 has TODO)
   - Not emitting `webrtc:answer`
   - Not emitting `webrtc:ice-candidate`

4. **WebRTC Signaling Integration**
   - ICE candidates not being sent via Socket.io (line 73 TODO)
   - WebRTC offer not being sent via Socket.io (line 214 TODO)
   - WebRTC answer not being sent via Socket.io
   - ICE candidates not being received and added to peer connection

### What Needs to Be Implemented

#### 1. Install Dependencies

```bash
npm install socket.io-client
```

#### 2. Create Socket.io Service

Create a service similar to mobile app's `socketService.ts`:

- Connect to backend Socket.io server
- Authenticate with JWT token
- Handle reconnection
- Provide emit/on/off methods

#### 3. Initialize Socket.io on App Start

- Connect when user is authenticated
- Disconnect when user logs out
- Reconnect on token refresh

#### 4. Integrate Socket.io with Video Call Component

- Add Socket.io event listeners
- Emit Socket.io events for call management
- Integrate WebRTC signaling with Socket.io

#### 5. Complete WebRTC Signaling

- Send ICE candidates via Socket.io
- Send WebRTC offer via Socket.io
- Send WebRTC answer via Socket.io
- Receive and handle WebRTC signaling events

---

## Implementation Checklist

### Phase 1: Socket.io Setup

- [ ] Install `socket.io-client`
- [ ] Create Socket.io service/utility
- [ ] Initialize Socket.io connection on app start
- [ ] Handle authentication with JWT token
- [ ] Test Socket.io connection

### Phase 2: Call Management Events

- [ ] Listen to `call:incoming` event
- [ ] Listen to `call:accepted` event
- [ ] Listen to `call:rejected` event
- [ ] Listen to `call:cancelled` event
- [ ] Listen to `call:ended` event
- [ ] Listen to `call:error` event
- [ ] Emit `call:initiate` event
- [ ] Emit `call:accept` event
- [ ] Emit `call:reject` event
- [ ] Emit `call:cancel` event
- [ ] Emit `call:end` event

### Phase 3: WebRTC Signaling

- [ ] Listen to `webrtc:offer` event
- [ ] Listen to `webrtc:answer` event
- [ ] Listen to `webrtc:ice-candidate` event
- [ ] Emit `webrtc:offer` event
- [ ] Emit `webrtc:answer` event
- [ ] Emit `webrtc:ice-candidate` event
- [ ] Integrate ICE candidate sending with Socket.io
- [ ] Integrate offer/answer exchange with Socket.io

### Phase 4: Testing

- [ ] Test call initiation
- [ ] Test incoming call notification
- [ ] Test call acceptance
- [ ] Test call rejection
- [ ] Test WebRTC connection establishment
- [ ] Test video/audio streaming
- [ ] Test call ending
- [ ] Test error handling

---

## Code Examples

### Example 1: Socket.io Service (Frontend)

```typescript
// services/socketService.ts
import { io, Socket } from "socket.io-client";
import { store } from "../store/store"; // Your Redux store

class SocketService {
  private socket: Socket | null = null;
  private isConnecting: boolean = false;

  connect(): void {
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const state = store.getState();
    const token = state.auth.token; // Adjust path to your auth state

    if (!token) {
      console.error("No authentication token available");
      return;
    }

    this.isConnecting = true;

    // Get base URL (remove /api if present)
    const baseUrl =
      process.env.REACT_APP_API_URL?.replace(/\/api$/, "") ||
      "http://localhost:5000";

    this.socket = io(baseUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket.io connected:", this.socket?.id);
      this.isConnecting = false;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket.io disconnected:", reason);
      this.isConnecting = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error.message);
      this.isConnecting = false;
    });
  }

  emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit:", event);
    }
  }

  on(event: string, callback: Function): void {
    this.socket?.on(event, callback);
  }

  off(event: string, callback: Function): void {
    this.socket?.off(event, callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
```

### Example 2: React Hook for Socket.io

```typescript
// hooks/useSocket.ts
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { socketService } from "../services/socketService";

export const useSocket = () => {
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect();
    } else {
      socketService.disconnect();
    }

    return () => {
      // Optionally disconnect on unmount
      // socketService.disconnect();
    };
  }, [isAuthenticated, token]);

  return {
    socket: socketService.getSocket(),
    isConnected: socketService.isConnected(),
    emit: socketService.emit.bind(socketService),
    on: socketService.on.bind(socketService),
    off: socketService.off.bind(socketService),
  };
};
```

### Example 3: Video Call Component Integration

```typescript
// components/VideoCall.tsx
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import {
  useInitiateVideoCallMutation,
  useUpdateVideoCallStatusMutation,
} from "../api/videoCallApi";

const VideoCall = ({ patientId, appointmentId }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callId, setCallId] = useState<string | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const receiverIdRef = useRef<string | null>(null);

  const { socket, isConnected, emit, on, off } = useSocket();
  const [initiateCall] = useInitiateVideoCallMutation();
  const [updateStatus] = useUpdateVideoCallStatusMutation();

  // Initialize peer connection
  const initializePeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    };

    const pc = new RTCPeerConnection(configuration);
    peerConnectionRef.current = pc;

    // Handle remote stream
    pc.ontrack = (event) => {
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && isConnected && receiverIdRef.current) {
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

    return pc;
  };

  // Get local stream
  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    setLocalStream(stream);

    if (peerConnectionRef.current) {
      stream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, stream);
      });
    }

    return stream;
  };

  // Initiate call
  const handleInitiateCall = async () => {
    const receiverId = patientId; // Get from props or state
    receiverIdRef.current = receiverId;

    // Initialize peer connection
    initializePeerConnection();

    // Get local stream
    await getLocalStream();

    // Create call via REST API
    const result = await initiateCall({
      receiverId,
      appointmentId,
    }).unwrap();

    const newCallId = result.data._id;
    setCallId(newCallId);

    // Notify via Socket.io
    if (isConnected) {
      emit("call:initiate", {
        receiverId,
        callId: newCallId,
        appointmentId,
      });
    }

    // Create and send WebRTC offer
    if (peerConnectionRef.current) {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      emit("webrtc:offer", {
        callId: newCallId,
        offer: {
          type: offer.type,
          sdp: offer.sdp,
        },
        receiverId,
      });
    }
  };

  // Setup Socket.io event listeners
  useEffect(() => {
    if (!isConnected || !socket) return;

    // Incoming call
    const handleIncomingCall = (data: any) => {
      console.log("Incoming call:", data);
      setCallId(data.callId);
      receiverIdRef.current = data.caller.id;
      initializePeerConnection();
      getLocalStream();
    };

    // Call accepted
    const handleCallAccepted = async (data: any) => {
      if (data.callId === callId) {
        await updateStatus({
          id: callId,
          body: { status: "active" },
        }).unwrap();
      }
    };

    // WebRTC Offer (receiver side)
    const handleWebRTCOffer = async (data: any) => {
      if (!peerConnectionRef.current || data.callId !== callId) return;

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.offer)
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
    };

    // WebRTC Answer (initiator side)
    const handleWebRTCAnswer = async (data: any) => {
      if (!peerConnectionRef.current || data.callId !== callId) return;

      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    };

    // ICE Candidate
    const handleICECandidate = async (data: any) => {
      if (!peerConnectionRef.current || data.callId !== callId) return;

      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(data.candidate)
      );
    };

    // Register listeners
    on("call:incoming", handleIncomingCall);
    on("call:accepted", handleCallAccepted);
    on("webrtc:offer", handleWebRTCOffer);
    on("webrtc:answer", handleWebRTCAnswer);
    on("webrtc:ice-candidate", handleICECandidate);

    // Cleanup
    return () => {
      off("call:incoming", handleIncomingCall);
      off("call:accepted", handleCallAccepted);
      off("webrtc:offer", handleWebRTCOffer);
      off("webrtc:answer", handleWebRTCAnswer);
      off("webrtc:ice-candidate", handleICECandidate);
    };
  }, [isConnected, socket, callId, on, off, emit, updateStatus]);

  // ... rest of component
};
```

---

## Important Notes

1. **Backend URL**: Make sure to use the correct backend URL. Socket.io runs on the base URL (not `/api`), while REST API runs on `/api`.

2. **Authentication**: Socket.io connection requires JWT token in the `auth` object.

3. **WebRTC STUN Servers**: Currently using Google's public STUN servers. For production, consider adding TURN servers.

4. **Error Handling**: Always handle connection errors, WebRTC errors, and Socket.io errors.

5. **Cleanup**: Properly clean up Socket.io listeners and WebRTC connections on component unmount.

6. **Testing**: Test on real devices/networks, not just localhost, as WebRTC requires proper network conditions.

---

## Reference Files

- **Backend Socket.io Service**: `test-codes/backend/socketService.ts`
- **Backend Video Call Controller**: `test-codes/backend/videoCallController.ts`
- **Mobile App Socket Service**: `services/socketService.ts` (in mobile app)
- **Mobile App Video Call**: `app/dashboard/appointment/video-call.tsx` (in mobile app)
- **Frontend Test Code**: `test-codes/frontend/VideoCall.tsx` (has TODOs that need implementation)

---

## Support

For questions or issues, refer to:

- Backend implementation in `test-codes/backend/`
- Mobile app implementation in the mobile app codebase
- Socket.io documentation: https://socket.io/docs/v4/
- WebRTC documentation: https://webrtc.org/
