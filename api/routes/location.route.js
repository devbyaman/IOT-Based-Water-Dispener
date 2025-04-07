import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import { getLocations, getLocation, updateLocation, deleteLocation } from '../controllers/location.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', getLocations);
router.get('/:id', getLocation);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

export default router;
