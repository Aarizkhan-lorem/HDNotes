import express from "express";
import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats,
} from "../controllers/noteController";
import { protect } from "../middleware/auth";

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes
router.route("/").get(getNotes).post(createNote);

router.get("/stats", getNotesStats);

router.route("/:id").get(getNote).put(updateNote).delete(deleteNote);

export default router;
