import apiClient from "./apiClient";
import { Activity } from "../types/apiTypes";

const activityService = {
  getAllActivities: async (projectId: string): Promise<Activity[]> => {
    const response = await apiClient.get<Activity[]>(
      `/projects/${projectId}/activities`
    );
    return response.data;
  },
  getActivityById: async (
    projectId: string,
    activityId: string
  ): Promise<Activity> => {
    const response = await apiClient.get<Activity>(
      `/projects/${projectId}/activities/${activityId}`
    );
    return response.data;
  },
  createActivity: async (
    projectId: string,
    data: Omit<Activity, "id">
  ): Promise<Activity> => {
    const response = await apiClient.post<Activity>(
      `/projects/${projectId}/activities`,
      data
    );
    return response.data;
  },
  updateActivity: async (
    projectId: string,
    activityId: string,
    data: Partial<Activity>
  ): Promise<Activity> => {
    const response = await apiClient.put<Activity>(
      `/projects/${projectId}/activities/${activityId}`,
      data
    );
    return response.data;
  },
  deleteActivity: async (
    projectId: string,
    activityId: string
  ): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/activities/${activityId}`);
  },
};

export default activityService;
