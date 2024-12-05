import apiClient from "./apiClient";
import { FileData } from "../types/apiTypes";

const fileService = {
  getAllFiles: async (projectId: string): Promise<FileData[]> => {
    const response = await apiClient.get<FileData[]>(
      `/projects/${projectId}/files`
    );
    return response.data;
  },
  getFileById: async (projectId: string, fileId: string): Promise<FileData> => {
    const response = await apiClient.get<FileData>(
      `/projects/${projectId}/files/${fileId}`
    );
    return response.data;
  },
  uploadFile: async (projectId: string, file: File): Promise<FileData> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post<FileData>(
      `/projects/${projectId}/files`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },
  deleteFile: async (projectId: string, fileId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/files/${fileId}`);
  },
};

export default fileService;
