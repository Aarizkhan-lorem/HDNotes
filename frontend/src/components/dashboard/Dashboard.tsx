import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { CreateNoteModal } from "./CreateNoteModal";
import { notesService } from "../../services/notes.service";
import { useAuth } from "../../context/AuthContext";
import type { Note } from "../../types/note.types";
import { toast } from "sonner";

export const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [noteOpen, setNoteOpen] = useState<Note | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await notesService.getNotes();
      if (response.success) {
        setNotes(response.data.notes);
      }
    } catch (err) {
      console.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (noteData: {
    title: string;
    content: string;
  }) => {
    try {
      const response = await notesService.createNote(noteData);
      if (response.success) {
        setNotes([response.data.note, ...notes]);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error("Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesService.deleteNote(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (err) {
      console.error("Failed to delete note");
    }finally{
      toast.success("Note deleted successfully!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="icon" className="w-6 h-6 mt-0.5"/>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto p-4">
        {/* User Info Card */}
        <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Welcome, {user?.name} !
          </h2>
          <p className="text-gray-500 text-sm">Email: {user?.email}</p>
        </div>

        {/* Create Note Button */}
        <Button
          className="w-full mb-6 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
          onClick={() => setShowCreateModal(true)}
        >
          Create Note
        </Button>

        {/* Notes Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
          </div>

          {notes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No notes yet. Create your first note!
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex-1" onClick={() => setNoteOpen((prev) => prev === note ? null : note)}>
                    <h4 className="font-medium text-gray-900">{note.title}</h4>
                    {
                      noteOpen === note && (
                        <div className="mt-2">
                          <p className="text-gray-700">{note.content}</p>
                        </div>
                      )
                    }
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note._id)}
                    className="ml-3 cursor-pointer text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Note Modal */}
      {showCreateModal && (
        <CreateNoteModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateNote}
        />
      )}
    </div>
  );
};
