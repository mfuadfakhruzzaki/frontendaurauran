import apiClient from "./apiClient";
import { Team } from "../types/apiTypes";

const teamService = {
  getAllTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>("/teams");
    return response.data;
  },
  getTeamById: async (teamId: string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${teamId}`);
    return response.data;
  },
  createTeam: async (data: Omit<Team, "id">): Promise<Team> => {
    const response = await apiClient.post<Team>("/teams", data);
    return response.data;
  },
  updateTeam: async (teamId: string, data: Partial<Team>): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${teamId}`, data);
    return response.data;
  },
  deleteTeam: async (teamId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}`);
  },
};

export default teamService;
