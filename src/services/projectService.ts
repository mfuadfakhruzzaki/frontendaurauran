import apiClient from "./apiClient";
import { Project } from "../types/apiTypes";

const projectService = {
  getAllProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>("/projects");
    return response.data;
  },
  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${projectId}`);
    return response.data;
  },
  createProject: async (data: Omit<Project, "id">): Promise<Project> => {
    const response = await apiClient.post<Project>("/projects", data);
    return response.data;
  },
  updateProject: async (
    projectId: string,
    data: Partial<Project>
  ): Promise<Project> => {
    const response = await apiClient.put<Project>(
      `/projects/${projectId}`,
      data
    );
    return response.data;
  },
  deleteProject: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },
};

export default projectService;
