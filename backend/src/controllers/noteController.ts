import { Request, Response } from "express";
import Note from "../models/Note";
import {
  AuthRequest,
  ApiResponse,
  CreateNoteBody,
  UpdateNoteBody,
} from "../types";

// @desc    Get all notes for logged in user
// @route   GET /api/notes
// @access  Private
export const getNotes = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Get query parameters for pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get search query
    const search = req.query.search as string;

    // Build search filter
    let searchFilter = {};
    if (search) {
      searchFilter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Get notes with pagination and search
    const notes = await Note.find({
      user: userId,
      ...searchFilter,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    // Get total count for pagination
    const total = await Note.countDocuments({
      user: userId,
      ...searchFilter,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: {
        notes,
        pagination: {
          currentPage: page,
          totalPages,
          totalNotes: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error: any) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notes",
      error: error.message || "Server error",
    });
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
export const getNote = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
        error: "Note does not exist or you do not have permission to access it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note retrieved successfully",
      data: {
        note,
      },
    });
  } catch (error: any) {
    console.error("Get note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve note",
      error: error.message || "Server error",
    });
  }
};

// @desc    Create new note
// @route   POST /api/notes
// @access  Private
export const createNote = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { title, content } = req.body;
    const userId = req.user!._id;

    // Validate input
    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: "Please provide both title and content",
        error: "Missing required fields",
      });
      return;
    }

    // Create note
    const note = await Note.create({
      title,
      content,
      user: userId,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        note,
      },
    });
  } catch (error: any) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      error: error.message || "Server error",
    });
  }
};

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
export const updateNote = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;
    const { title, content } = req.body;

    // Find the note
    const note = await Note.findOne({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
        error: "Note does not exist or you do not have permission to access it",
      });
      return;
    }

    // Update note fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: {
        note: updatedNote,
      },
    });
  } catch (error: any) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message || "Server error",
    });
  }
};

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    const note = await Note.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!note) {
      res.status(404).json({
        success: false,
        message: "Note not found",
        error: "Note does not exist or you do not have permission to access it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: {
        deletedNote: note,
      },
    });
  } catch (error: any) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message || "Server error",
    });
  }
};

// @desc    Get notes stats
// @route   GET /api/notes/stats
// @access  Private
export const getNotesStats = async (
  req: AuthRequest,
  res: Response<ApiResponse>
): Promise<void> => {
  try {
    const userId = req.user!._id;

    // Get total notes count
    const totalNotes = await Note.countDocuments({ user: userId });

    // Get notes created in the last 7 days
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const notesThisWeek = await Note.countDocuments({
      user: userId,
      createdAt: { $gte: lastWeek },
    });

    // Get notes created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const notesToday = await Note.countDocuments({
      user: userId,
      createdAt: { $gte: today },
    });

    // Get most recent notes (last 5)
    const recentNotes = await Note.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt")
      .exec();

    res.status(200).json({
      success: true,
      message: "Notes statistics retrieved successfully",
      data: {
        stats: {
          totalNotes,
          notesThisWeek,
          notesToday,
          recentNotes,
        },
      },
    });
  } catch (error: any) {
    console.error("Get notes stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve notes statistics",
      error: error.message || "Server error",
    });
  }
};
