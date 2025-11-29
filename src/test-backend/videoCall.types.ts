import { Document, Types } from 'mongoose';

export enum VideoCallStatus {
  INITIATED = 'initiated',
  RINGING = 'ringing',
  ACTIVE = 'active',
  ENDED = 'ended',
  MISSED = 'missed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface IVideoCall {
  caller: Types.ObjectId;
  receiver: Types.ObjectId;
  status: VideoCallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number; // in seconds
  appointmentId?: Types.ObjectId; // Optional link to appointment
}

export interface IVideoCallDocument extends IVideoCall, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoCallCreate {
  receiverId: string;
  appointmentId?: string;
}

export interface IVideoCallUpdate {
  status?: VideoCallStatus;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}


