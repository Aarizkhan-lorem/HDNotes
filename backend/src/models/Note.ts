import mongoose, { Schema } from "mongoose";
import { INote } from "../types";

const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
      trim: true,
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Note must belong to a user"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
NoteSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<INote>("Note", NoteSchema);
