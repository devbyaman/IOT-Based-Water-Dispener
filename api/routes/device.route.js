import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getDevices, getDevice, updateDevice, deleteDevice } from '../controllers/device.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', getDevices);
router.get('/:id', getDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
