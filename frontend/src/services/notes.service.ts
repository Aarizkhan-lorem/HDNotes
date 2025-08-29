import { api } from "./api";
import type { CreateNoteData } from "../types/note.types";
import { API_ENDPOINTS } from "../utils/constants";

export const notesService = {
  getNotes: async (page = 1, limit = 10, search = ""): Promise<any> => {
    const response = await api.get(API_ENDPOINTS.NOTES.LIST, {
      params: { page, limit, search },
    });
    return response.data;
  },

  createNote: async (data: CreateNoteData): Promise<any> => {
    const response = await api.post(API_ENDPOINTS.NOTES.CREATE, data);
    return response.data;
  },

  updateNote: async (
    id: string,
    data: Partial<CreateNoteData>
  ): Promise<any> => {
    const response = await api.put(API_ENDPOINTS.NOTES.UPDATE(id), data);
    return response.data;
  },

  deleteNote: async (id: string): Promise<any> => {
    const response = await api.delete(API_ENDPOINTS.NOTES.DELETE(id));
    return response.data;
  },
};
