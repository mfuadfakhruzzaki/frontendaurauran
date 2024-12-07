import apiClient from "./apiClient";
import { Task } from "../types/apiTypes";

const taskService = {
  getAllTasks: async (projectId: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(
      `/projects/${projectId}/tasks`
    );
    return response.data;
  },
  getTaskById: async (projectId: string, taskId: string): Promise<Task> => {
    const response = await apiClient.get<Task>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return response.data;
  },
  createTask: async (
    projectId: string,
    data: Omit<Task, "id">
  ): Promise<Task> => {
    const response = await apiClient.post<Task>(
      `/projects/${projectId}/tasks`,
      data
    );
    return response.data;
  },
  updateTask: async (
    projectId: string,
    taskId: string,
    data: Partial<Task>
  ): Promise<Task> => {
    const response = await apiClient.put<Task>(
      `/projects/${projectId}/tasks/${taskId}`,
      data
    );
    return response.data;
  },
  deleteTask: async (projectId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};

export default taskService;
