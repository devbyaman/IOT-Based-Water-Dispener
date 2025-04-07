// routes/reportRoutes.js
import express from 'express';
import { getReports, getReport, updateReport, deleteReport } from '../controllers/report.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', getReports);
router.get('/report', getReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;
