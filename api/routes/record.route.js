// routes/recordRoutes.js
import express from 'express';
import { createRecord, getRecords, updateRecord, deleteRecord } from '../controllers/record.controllers.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

// Route to create a new record
router.get('/record', createRecord);

// Route to get all records
router.get('/', getRecords);

// Route to update a record by ID
router.put('/:id', updateRecord);

// Route to delete a record by ID
router.delete('/:id', deleteRecord);

export default router;
