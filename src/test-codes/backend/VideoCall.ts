import mongoose, { Schema, Model } from 'mongoose';
import { IVideoCallDocument, VideoCallStatus } from '../types/videoCall.types';

const videoCallSchema = new Schema<IVideoCallDocument>(
  {
    caller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Caller is required']
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required']
    },
    status: {
      type: String,
      enum: Object.values(VideoCallStatus),
      default: VideoCallStatus.INITIATED,
      required: true
    },
    startedAt: {
      type: Date,
      default: null
    },
    endedAt: {
      type: Date,
      default: null
    },
    duration: {
      type: Number,
      default: 0 // Duration in seconds
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes for efficient queries
videoCallSchema.index({ caller: 1, createdAt: -1 });
videoCallSchema.index({ receiver: 1, createdAt: -1 });
videoCallSchema.index({ status: 1 });
videoCallSchema.index({ appointmentId: 1 });

const VideoCall: Model<IVideoCallDocument> = mongoose.model<IVideoCallDocument>(
  'VideoCall',
  videoCallSchema
);

export default VideoCall;


