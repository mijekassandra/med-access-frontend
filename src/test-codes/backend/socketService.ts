import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';
import VideoCall from '../models/VideoCall';
import { VideoCallStatus } from '../types/videoCall.types';
import { IUserDocument } from '../types';

// WebRTC type definitions (browser types not available in Node.js)
interface RTCSessionDescriptionInit {
  type: 'offer' | 'answer' | 'pranswer' | 'rollback';
  sdp?: string;
}

interface RTCIceCandidateInit {
  candidate?: string;
  sdpMLineIndex?: number | null;
  sdpMid?: string | null;
  usernameFragment?: string | null;
}

interface AuthenticatedSocket extends Socket {
  userId?: string;
  user?: IUserDocument;
}

interface IJwtPayload extends JwtPayload {
  id: string;
  username: string;
  role: string;
}

// Store active calls: callId -> { callerSocketId, receiverSocketId }
const activeCalls = new Map<string, { callerSocketId?: string; receiverSocketId?: string }>();

// Store user socket mappings: userId -> socketId
const userSockets = new Map<string, string>();

let io: SocketIOServer | null = null;

export const initializeSocketIO = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174"
      ],
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware for Socket.io
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_key'
      ) as IJwtPayload;

      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        return next(new Error('Invalid or inactive user'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect();
      return;
    }

    console.log(`User ${socket.userId} connected with socket ID: ${socket.id}`);
    
    // Store user socket mapping
    userSockets.set(socket.userId, socket.id);

    // Handle user joining their own room
    socket.join(`user:${socket.userId}`);

    // Handle initiating a video call
    socket.on('call:initiate', async (data: { receiverId: string; callId: string; appointmentId?: string }) => {
      try {
        const { receiverId, callId, appointmentId } = data;

        if (!receiverId || !callId) {
          socket.emit('call:error', { message: 'Receiver ID and Call ID are required' });
          return;
        }

        // Check if receiver is online
        const receiverSocketId = userSockets.get(receiverId);
        
        if (receiverSocketId) {
          // Store call mapping
          activeCalls.set(callId, {
            callerSocketId: socket.id,
            receiverSocketId: receiverSocketId
          });

          // Update call status to ringing
          await VideoCall.findByIdAndUpdate(callId, {
            status: VideoCallStatus.RINGING
          });

          // Notify receiver
          io?.to(receiverSocketId).emit('call:incoming', {
            callId,
            caller: {
              id: socket.userId,
              username: socket.user?.username,
              firstName: socket.user?.firstName,
              lastName: socket.user?.lastName,
              profilePicture: socket.user?.profilePicture
            },
            appointmentId
          });

          socket.emit('call:initiated', { callId, receiverId });
        } else {
          // Receiver is offline
          await VideoCall.findByIdAndUpdate(callId, {
            status: VideoCallStatus.MISSED
          });

          socket.emit('call:error', { message: 'Receiver is offline', callId });
        }
      } catch (error) {
        console.error('Error initiating call:', error);
        socket.emit('call:error', { message: 'Failed to initiate call' });
      }
    });

    // Handle accepting a call
    socket.on('call:accept', async (data: { callId: string }) => {
      try {
        const { callId } = data;
        const callInfo = activeCalls.get(callId);

        if (!callInfo || callInfo.receiverSocketId !== socket.id) {
          socket.emit('call:error', { message: 'Invalid call or you are not the receiver' });
          return;
        }

        // Update call status
        await VideoCall.findByIdAndUpdate(callId, {
          status: VideoCallStatus.ACTIVE,
          startedAt: new Date()
        });

        // Notify caller
        if (callInfo.callerSocketId) {
          io?.to(callInfo.callerSocketId).emit('call:accepted', { callId });
        }

        socket.emit('call:accepted', { callId });
      } catch (error) {
        console.error('Error accepting call:', error);
        socket.emit('call:error', { message: 'Failed to accept call' });
      }
    });

    // Handle rejecting a call
    socket.on('call:reject', async (data: { callId: string }) => {
      try {
        const { callId } = data;
        const callInfo = activeCalls.get(callId);

        if (!callInfo) {
          socket.emit('call:error', { message: 'Invalid call' });
          return;
        }

        // Update call status
        await VideoCall.findByIdAndUpdate(callId, {
          status: VideoCallStatus.REJECTED,
          endedAt: new Date()
        });

        // Notify caller if they're still connected
        if (callInfo.callerSocketId && callInfo.callerSocketId !== socket.id) {
          io?.to(callInfo.callerSocketId).emit('call:rejected', { callId });
        }

        // Clean up
        activeCalls.delete(callId);
        socket.emit('call:rejected', { callId });
      } catch (error) {
        console.error('Error rejecting call:', error);
        socket.emit('call:error', { message: 'Failed to reject call' });
      }
    });

    // Handle cancelling a call (by caller)
    socket.on('call:cancel', async (data: { callId: string }) => {
      try {
        const { callId } = data;
        const callInfo = activeCalls.get(callId);

        if (!callInfo || callInfo.callerSocketId !== socket.id) {
          socket.emit('call:error', { message: 'Invalid call or you are not the caller' });
          return;
        }

        // Update call status
        await VideoCall.findByIdAndUpdate(callId, {
          status: VideoCallStatus.CANCELLED,
          endedAt: new Date()
        });

        // Notify receiver if they're still connected
        if (callInfo.receiverSocketId) {
          io?.to(callInfo.receiverSocketId).emit('call:cancelled', { callId });
        }

        // Clean up
        activeCalls.delete(callId);
        socket.emit('call:cancelled', { callId });
      } catch (error) {
        console.error('Error cancelling call:', error);
        socket.emit('call:error', { message: 'Failed to cancel call' });
      }
    });

    // Handle ending a call
    socket.on('call:end', async (data: { callId: string; duration?: number }) => {
      try {
        const { callId, duration } = data;
        const callInfo = activeCalls.get(callId);

        if (!callInfo) {
          socket.emit('call:error', { message: 'Invalid call' });
          return;
        }

        // Check if user is part of this call
        const isCaller = callInfo.callerSocketId === socket.id;
        const isReceiver = callInfo.receiverSocketId === socket.id;

        if (!isCaller && !isReceiver) {
          socket.emit('call:error', { message: 'You are not part of this call' });
          return;
        }

        // Update call status
        const videoCall = await VideoCall.findById(callId);
        let callDuration = duration;
        
        if (callDuration === undefined && videoCall?.startedAt) {
          callDuration = Math.floor((new Date().getTime() - videoCall.startedAt.getTime()) / 1000);
        }

        await VideoCall.findByIdAndUpdate(callId, {
          status: VideoCallStatus.ENDED,
          endedAt: new Date(),
          duration: callDuration || 0
        });

        // Notify the other participant
        const otherSocketId = isCaller ? callInfo.receiverSocketId : callInfo.callerSocketId;
        if (otherSocketId) {
          io?.to(otherSocketId).emit('call:ended', { callId });
        }

        // Clean up
        activeCalls.delete(callId);
        socket.emit('call:ended', { callId });
      } catch (error) {
        console.error('Error ending call:', error);
        socket.emit('call:error', { message: 'Failed to end call' });
      }
    });

    // WebRTC Signaling: Offer
    socket.on('webrtc:offer', (data: { callId: string; offer: RTCSessionDescriptionInit; receiverId: string }) => {
      const { callId, offer, receiverId } = data;
      const receiverSocketId = userSockets.get(receiverId);

      if (receiverSocketId) {
        io?.to(receiverSocketId).emit('webrtc:offer', {
          callId,
          offer,
          callerId: socket.userId
        });
      }
    });

    // WebRTC Signaling: Answer
    socket.on('webrtc:answer', (data: { callId: string; answer: RTCSessionDescriptionInit; callerId: string }) => {
      const { callId, answer, callerId } = data;
      const callerSocketId = userSockets.get(callerId);

      if (callerSocketId) {
        io?.to(callerSocketId).emit('webrtc:answer', {
          callId,
          answer,
          receiverId: socket.userId
        });
      }
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('webrtc:ice-candidate', (data: { callId: string; candidate: RTCIceCandidateInit; targetUserId: string }) => {
      const { callId, candidate, targetUserId } = data;
      const targetSocketId = userSockets.get(targetUserId);

      if (targetSocketId) {
        io?.to(targetSocketId).emit('webrtc:ice-candidate', {
          callId,
          candidate,
          fromUserId: socket.userId
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);

      // Remove user socket mapping
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }

      // Clean up any active calls involving this socket
      for (const [callId, callInfo] of activeCalls.entries()) {
        if (callInfo.callerSocketId === socket.id || callInfo.receiverSocketId === socket.id) {
          // Update call status if it was active
          VideoCall.findById(callId).then(call => {
            if (call && call.status === VideoCallStatus.ACTIVE) {
              const duration = call.startedAt
                ? Math.floor((new Date().getTime() - call.startedAt.getTime()) / 1000)
                : 0;
              VideoCall.findByIdAndUpdate(callId, {
                status: VideoCallStatus.ENDED,
                endedAt: new Date(),
                duration
              });
            }
          });

          // Notify other participant
          const otherSocketId = callInfo.callerSocketId === socket.id
            ? callInfo.receiverSocketId
            : callInfo.callerSocketId;
          
          if (otherSocketId) {
            io?.to(otherSocketId).emit('call:ended', { callId, reason: 'participant_disconnected' });
          }

          activeCalls.delete(callId);
        }
      }
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => {
  return io;
};


