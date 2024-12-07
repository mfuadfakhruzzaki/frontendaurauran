// Authentication
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// User
export interface User {
  id: string;
  username: string;
  email: string;
}

// Project
export interface Project {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  deadline: string; // ISO date string
  status: "Pending" | "In Progress" | "Completed";
  team_ids: number[];
  icon: "yellow" | "dark" | "gold";
}

// Task
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  deadline: string;
  assigned_to_id: string;
}

// Team
export interface Team {
  id: string;
  name: string;
  description: string;
}

// Note
export interface Note {
  id: string;
  content: string;
}

// Activity
export interface Activity {
  id: string;
  description: string;
  type: string; // Example: "task", "event", etc.
}

// Notification
export interface Notification {
  id: string;
  content: string;
  type: "info" | "success" | "error";
  is_read: boolean;
}

// File
export interface FileData {
  id: string;
  name: string;
  url: string;
}
