import express from "express";
import { test, updateUser, deleteUser } from "../controllers/user.controllers.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/', test);
router.post('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

export default router;