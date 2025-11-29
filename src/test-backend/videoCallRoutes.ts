import { Router } from 'express';
import { protect } from '../middleware';
import {
  initiateVideoCall,
  getVideoCalls,
  getVideoCallById,
  updateVideoCallStatus,
  endVideoCall
} from '../controllers/videoCallController';

const router = Router();

// All routes require authentication
router.use(protect);

// Create/Initiate a video call
router.post('/', initiateVideoCall);

// Get all video calls for the authenticated user
router.get('/', getVideoCalls);

// Get a specific video call by ID
router.get('/:id', getVideoCallById);

// Update video call status (accept, reject, etc.)
router.patch('/:id/status', updateVideoCallStatus);

// End a video call
router.patch('/:id/end', endVideoCall);

export default router;


