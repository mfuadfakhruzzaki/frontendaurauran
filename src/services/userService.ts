import apiClient from "./apiClient";
import { User } from "@/types/apiTypes";

const userService = {
  getUserProfile: async (): Promise<User> => {
    const response = await apiClient.get("/users/profile");
    return response.data.data; // Pastikan API mengembalikan struktur data yang sesuai
  },
  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
  editProfile: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.put("/users/profile", data);
    return response.data.data; // Pastikan API mengembalikan struktur data yang sesuai
  },
};

export default userService;
