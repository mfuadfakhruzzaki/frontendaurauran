import apiClient from "./apiClient";
import { Note } from "../types/apiTypes";

const noteService = {
  getAllNotes: async (projectId: string): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>(
      `/projects/${projectId}/notes`
    );
    return response.data;
  },
  getNoteById: async (projectId: string, noteId: string): Promise<Note> => {
    const response = await apiClient.get<Note>(
      `/projects/${projectId}/notes/${noteId}`
    );
    return response.data;
  },
  createNote: async (
    projectId: string,
    data: Omit<Note, "id">
  ): Promise<Note> => {
    const response = await apiClient.post<Note>(
      `/projects/${projectId}/notes`,
      data
    );
    return response.data;
  },
  updateNote: async (
    projectId: string,
    noteId: string,
    data: Partial<Note>
  ): Promise<Note> => {
    const response = await apiClient.put<Note>(
      `/projects/${projectId}/notes/${noteId}`,
      data
    );
    return response.data;
  },
  deleteNote: async (projectId: string, noteId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/notes/${noteId}`);
  },
};

export default noteService;
