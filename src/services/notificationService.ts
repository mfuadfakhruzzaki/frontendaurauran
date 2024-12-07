import apiClient from "./apiClient";
import { Notification } from "../types/apiTypes";

const notificationService = {
  getAllNotifications: async (projectId: string): Promise<Notification[]> => {
    const response = await apiClient.get<Notification[]>(
      `/projects/${projectId}/notifications`
    );
    return response.data;
  },
  getNotificationById: async (
    projectId: string,
    notificationId: string
  ): Promise<Notification> => {
    const response = await apiClient.get<Notification>(
      `/projects/${projectId}/notifications/${notificationId}`
    );
    return response.data;
  },
  createNotification: async (
    projectId: string,
    data: Omit<Notification, "id">
  ): Promise<Notification> => {
    const response = await apiClient.post<Notification>(
      `/projects/${projectId}/notifications`,
      data
    );
    return response.data;
  },
  updateNotification: async (
    projectId: string,
    notificationId: string,
    data: Partial<Notification>
  ): Promise<Notification> => {
    const response = await apiClient.put<Notification>(
      `/projects/${projectId}/notifications/${notificationId}`,
      data
    );
    return response.data;
  },
  deleteNotification: async (
    projectId: string,
    notificationId: string
  ): Promise<void> => {
    await apiClient.delete(
      `/projects/${projectId}/notifications/${notificationId}`
    );
  },
};

export default notificationService;
