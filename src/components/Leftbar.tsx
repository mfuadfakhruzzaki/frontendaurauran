/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useContext } from "react";
import { Home, Activity, Plus, Settings2, LogOut, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/DatePicker";
import projectService from "@/services/projectService";
import taskService from "@/services/taskService";
import fileService from "@/services/fileService";
import userService from "@/services/userService";

import { Project, Task, User } from "@/types/apiTypes";

export function Leftbar() {
  const [userData, setUserData] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectPriority, setProjectPriority] = useState("Medium");
  const [projectDeadline, setProjectDeadline] = useState<Date | null>(
    new Date()
  );
  const [projectStatus, setProjectStatus] = useState<
    "Pending" | "In Progress" | "Completed"
  >("Pending");
  const [projectTeamIds, setProjectTeamIds] = useState<string>("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"Medium" | "Low" | "High">(
    "Medium"
  );
  const [taskStatus, setTaskStatus] = useState("Pending");
  const [taskDeadline, setTaskDeadline] = useState<Date | null>(null);
  const [taskAssignedTo, setTaskAssignedTo] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout, token } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await userService.getUserProfile();
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const projectList = await projectService.getAllProjects();
      setProjects(projectList);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const assignIconColor = (projectId: number): "yellow" | "dark" | "gold" => {
    const colors: Array<"yellow" | "dark" | "gold"> = [
      "yellow",
      "dark",
      "gold",
    ];
    return colors[projectId % colors.length];
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !projectName ||
      !projectPriority ||
      !projectStatus ||
      !projectDeadline
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const teamIdsArray = projectTeamIds
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));

      const newProject: Omit<Project, "id"> = {
        title: projectName,
        description: projectDescription,
        priority: projectPriority as "Medium" | "Low" | "High",
        deadline: projectDeadline.toISOString(),
        status: projectStatus,
        team_ids: teamIdsArray,
        icon: assignIconColor(projects.length), // Assign an icon color
      };

      const project = await projectService.createProject(newProject);

      if (thumbnailFile) {
        await fileService.uploadFile(project.id, thumbnailFile);
      }

      if (taskTitle) {
        const newTask: Omit<Task, "id"> = {
          title: taskTitle,
          description: taskDescription,
          priority: taskPriority,
          status: taskStatus as "Pending" | "In Progress" | "Completed",
          deadline: taskDeadline ? taskDeadline.toISOString() : "",
          assigned_to_id: taskAssignedTo
            ? parseInt(taskAssignedTo).toString()
            : "",
        };
        await taskService.createTask(project.id, newTask);
      }

      fetchProjects();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
      logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <>
      <div className="fixed flex h-screen w-64 flex-col border-r bg-background">
        <div className="flex items-center gap-2 p-4">
          <div className="h-8 w-8 rounded-full bg-blue-600" />
          <span className="font-semibold">Projects</span>
        </div>

        <nav className="flex-none p-2">
          <div className="space-y-1">
            <Button
              variant={currentPath === "/" ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2")}
              onClick={() => navigate("/")}
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button
              variant={currentPath === "/activities" ? "secondary" : "ghost"}
              className={cn("w-full justify-start gap-2")}
              onClick={() => navigate("/activities")}
            >
              <Activity className="h-4 w-4" />
              Activities
            </Button>
          </div>
        </nav>

        <Separator className="my-2" />

        <div className="flex-1 px-4">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-xs font-semibold text-muted-foreground">
              PROJECTS
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={() => setIsModalOpen(true)}
              aria-label="Add Project"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {isLoading && (
                <p className="text-sm text-center text-muted-foreground">
                  Loading projects...
                </p>
              )}
              {error && (
                <p className="text-sm text-center text-red-500">{error}</p>
              )}
              {!isLoading &&
                !error &&
                projects.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
            </div>
          </ScrollArea>
        </div>

        <Separator className="mb-4" />
        <div className="p-4" ref={settingsRef}>
          <div className="relative flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {userData?.username ? userData.username[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <h3 className="truncate text-sm font-medium">
                {userData?.username || "Loading..."}
              </h3>
              <p className="truncate text-xs text-muted-foreground">
                {userData?.email || "Loading..."}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              aria-label="Settings"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>

          {isSettingsOpen && (
            <div className="absolute bottom-12 right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleEditProfile}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Fill out the form to create a new project.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateProject}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={projectPriority}
                  onChange={(e) => setProjectPriority(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                  required
                >
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <DatePicker
                  selectedDate={projectDeadline}
                  onChange={setProjectDeadline}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={projectStatus}
                  onChange={(e) =>
                    setProjectStatus(
                      e.target.value as "Pending" | "In Progress" | "Completed"
                    )
                  }
                  className="w-full rounded-md border px-3 py-2"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <Label htmlFor="teamIds">Team IDs (comma-separated)</Label>
                <Input
                  id="teamIds"
                  value={projectTeamIds}
                  onChange={(e) => setProjectTeamIds(e.target.value)}
                  placeholder="1,2,3"
                />
              </div>
              <div>
                <Label htmlFor="thumbnail">Project Thumbnail</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setThumbnailFile(e.target.files[0]);
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="text-md font-medium mb-2">
                  Task Details (Optional)
                </h3>
                <Label htmlFor="taskTitle">Task Title</Label>
                <Input
                  id="taskTitle"
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <Label htmlFor="taskDescription">Task Description</Label>
                <Textarea
                  id="taskDescription"
                  placeholder="Enter task description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <Label htmlFor="taskPriority">Task Priority</Label>
                <select
                  id="taskPriority"
                  value={taskPriority}
                  onChange={(e) =>
                    setTaskPriority(e.target.value as "Medium" | "Low" | "High")
                  }
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
                <Label htmlFor="taskStatus">Task Status</Label>
                <select
                  id="taskStatus"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <Label htmlFor="taskDeadline">Task Deadline</Label>
                <DatePicker
                  selectedDate={taskDeadline}
                  onChange={setTaskDeadline}
                />
                <Label htmlFor="taskAssignedTo">Assigned To (User ID)</Label>
                <Input
                  id="taskAssignedTo"
                  placeholder="User ID"
                  value={taskAssignedTo}
                  onChange={(e) => setTaskAssignedTo(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProjectItem({ project }: { project: Project }) {
  const navigate = useNavigate();

  const iconColors = {
    yellow: "bg-yellow-500 text-white",
    dark: "bg-gray-900 text-white",
    gold: "bg-yellow-500 text-white",
  };

  return (
    <button
      className="flex w-full items-center gap-2 rounded-lg p-2 text-sm hover:bg-accent"
      onClick={() => navigate(`/project-detail/${project.id}`)}
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          iconColors[project.icon]
        )}
      >
        {project.title[0].toUpperCase()}
      </div>
      <span className="flex-1 truncate text-left font-medium">
        {project.title}
      </span>
      <Badge variant="secondary">{project.team_ids.length}</Badge>
    </button>
  );
}
