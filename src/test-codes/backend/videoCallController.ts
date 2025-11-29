import { Request, Response } from 'express';
import mongoose from 'mongoose';
import VideoCall from '../models/VideoCall';
import { IVideoCallCreate, IVideoCallUpdate, VideoCallStatus } from '../types/videoCall.types';
import { IUserDocument } from '../types';

interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

// Create/Initiate a video call
export const initiateVideoCall = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { receiverId, appointmentId } = req.body as IVideoCallCreate;

    if (!receiverId) {
      res.status(400).json({ success: false, message: 'Receiver ID is required' });
      return;
    }

    // Validate receiver ID
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      res.status(400).json({ success: false, message: 'Invalid receiver ID format' });
      return;
    }

    // Check if receiver is the same as caller
    if (req.user._id.toString() === receiverId) {
      res.status(400).json({ success: false, message: 'Cannot call yourself' });
      return;
    }

    // Validate appointment ID if provided
    if (appointmentId && !mongoose.Types.ObjectId.isValid(appointmentId)) {
      res.status(400).json({ success: false, message: 'Invalid appointment ID format' });
      return;
    }

    // Create video call record
    const videoCall = await VideoCall.create({
      caller: req.user._id,
      receiver: receiverId,
      status: VideoCallStatus.INITIATED,
      appointmentId: appointmentId || undefined
    });

    const populatedCall = await VideoCall.findById(videoCall._id)
      .populate('caller', 'username firstName lastName profilePicture role')
      .populate('receiver', 'username firstName lastName profilePicture role')
      .populate('appointmentId')
      .lean();

    res.status(201).json({
      success: true,
      message: 'Video call initiated',
      data: populatedCall
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((e) => e.message);
      res.status(400).json({ success: false, message: 'Validation error: ' + messages.join(', ') });
      return;
    }
    console.error('Error initiating video call:', error);
    res.status(500).json({ success: false, message: 'Server error initiating video call' });
  }
};

// Get all video calls for the authenticated user
export const getVideoCalls = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { status, limit = '50', page = '1' } = req.query;
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = {
      $or: [
        { caller: req.user._id },
        { receiver: req.user._id }
      ]
    };

    if (status) {
      filter.status = status;
    }

    const [videoCalls, total] = await Promise.all([
      VideoCall.find(filter)
        .populate('caller', 'username firstName lastName profilePicture role')
        .populate('receiver', 'username firstName lastName profilePicture role')
        .populate('appointmentId')
        .sort({ createdAt: -1 })
        .limit(limitNum)
        .skip(skip)
        .lean(),
      VideoCall.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: videoCalls.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: videoCalls
    });
  } catch (error) {
    console.error('Error fetching video calls:', error);
    res.status(500).json({ success: false, message: 'Server error fetching video calls' });
  }
};

// Get a specific video call by ID
export const getVideoCallById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const videoCall = await VideoCall.findById(req.params.id)
      .populate('caller', 'username firstName lastName profilePicture role')
      .populate('receiver', 'username firstName lastName profilePicture role')
      .populate('appointmentId')
      .lean();

    if (!videoCall) {
      res.status(404).json({ success: false, message: 'Video call not found' });
      return;
    }

    // Check if user is part of this call
    const callerId = videoCall.caller._id?.toString() || (videoCall.caller as any).toString();
    const receiverId = videoCall.receiver._id?.toString() || (videoCall.receiver as any).toString();
    const userId = req.user._id.toString();

    if (callerId !== userId && receiverId !== userId) {
      res.status(403).json({ success: false, message: 'Access denied. You are not part of this call.' });
      return;
    }

    res.status(200).json({ success: true, data: videoCall });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ success: false, message: 'Invalid video call ID format' });
      return;
    }
    console.error('Error fetching video call:', error);
    res.status(500).json({ success: false, message: 'Server error fetching video call' });
  }
};

// Update video call status (accept, reject, end call)
export const updateVideoCallStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { status, duration } = req.body as { status: VideoCallStatus; duration?: number };

    if (!status || !Object.values(VideoCallStatus).includes(status)) {
      res.status(400).json({ success: false, message: 'Valid status is required' });
      return;
    }

    const videoCall = await VideoCall.findById(req.params.id);

    if (!videoCall) {
      res.status(404).json({ success: false, message: 'Video call not found' });
      return;
    }

    // Check if user is part of this call
    const callerId = videoCall.caller.toString();
    const receiverId = videoCall.receiver.toString();
    const userId = req.user._id.toString();

    if (callerId !== userId && receiverId !== userId) {
      res.status(403).json({ success: false, message: 'Access denied. You are not part of this call.' });
      return;
    }

    // Update status and related fields
    const updates: IVideoCallUpdate = { status };

    if (status === VideoCallStatus.ACTIVE && !videoCall.startedAt) {
      updates.startedAt = new Date();
    }

    if ([VideoCallStatus.ENDED, VideoCallStatus.MISSED, VideoCallStatus.REJECTED, VideoCallStatus.CANCELLED].includes(status)) {
      updates.endedAt = new Date();
      if (duration !== undefined) {
        updates.duration = duration;
      } else if (videoCall.startedAt) {
        // Calculate duration if not provided
        updates.duration = Math.floor((new Date().getTime() - videoCall.startedAt.getTime()) / 1000);
      }
    }

    const updatedCall = await VideoCall.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('caller', 'username firstName lastName profilePicture role')
      .populate('receiver', 'username firstName lastName profilePicture role')
      .populate('appointmentId')
      .lean();

    res.status(200).json({
      success: true,
      message: 'Video call status updated',
      data: updatedCall
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ success: false, message: 'Invalid video call ID format' });
      return;
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((e) => e.message);
      res.status(400).json({ success: false, message: 'Validation error: ' + messages.join(', ') });
      return;
    }
    console.error('Error updating video call status:', error);
    res.status(500).json({ success: false, message: 'Server error updating video call status' });
  }
};

// End a video call
export const endVideoCall = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { duration } = req.body as { duration?: number };

    const videoCall = await VideoCall.findById(req.params.id);

    if (!videoCall) {
      res.status(404).json({ success: false, message: 'Video call not found' });
      return;
    }

    // Check if user is part of this call
    const callerId = videoCall.caller.toString();
    const receiverId = videoCall.receiver.toString();
    const userId = req.user._id.toString();

    if (callerId !== userId && receiverId !== userId) {
      res.status(403).json({ success: false, message: 'Access denied. You are not part of this call.' });
      return;
    }

    // Calculate duration
    let callDuration = duration;
    if (callDuration === undefined && videoCall.startedAt) {
      callDuration = Math.floor((new Date().getTime() - videoCall.startedAt.getTime()) / 1000);
    }

    const updatedCall = await VideoCall.findByIdAndUpdate(
      req.params.id,
      {
        status: VideoCallStatus.ENDED,
        endedAt: new Date(),
        duration: callDuration || 0
      },
      { new: true, runValidators: true }
    )
      .populate('caller', 'username firstName lastName profilePicture role')
      .populate('receiver', 'username firstName lastName profilePicture role')
      .populate('appointmentId')
      .lean();

    res.status(200).json({
      success: true,
      message: 'Video call ended',
      data: updatedCall
    });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(400).json({ success: false, message: 'Invalid video call ID format' });
      return;
    }
    console.error('Error ending video call:', error);
    res.status(500).json({ success: false, message: 'Server error ending video call' });
  }
};


