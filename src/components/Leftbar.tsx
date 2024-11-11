/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useContext } from "react";
import axios, { AxiosError } from "axios";
import {
  Home,
  Activity,
  LayoutGrid,
  Plus,
  Settings2,
  LogOut,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";

interface Project {
  id: number;
  name: string;
  count: number;
  icon: "yellow" | "dark" | "gold";
}

interface UserData {
  username: string;
  email: string;
  // Tambahkan properti lain jika diperlukan
}

export function Leftbar() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Pastikan AuthContext tidak null
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout, token } = authContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://api.zacht.tech/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    let isMounted = true; // Untuk menghindari setState pada komponen yang sudah unmounted
    const fetchProjects = async () => {
      if (!token) {
        console.warn("No auth token available");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Projects API response:", response.data); // Logging tambahan

        // Sesuaikan akses data berdasarkan struktur respons aktual
        const projectData = response.data.data || response.data.projects || [];

        if (!Array.isArray(projectData)) {
          throw new Error("Struktur data proyek tidak sesuai yang diharapkan.");
        }

        const fetchedProjects: Project[] = projectData.map((project: any) => ({
          id: project.id,
          name: project.name,
          count: 0, // Nilai default karena API tidak menyediakan count
          icon: assignIconColor(project.id), // Menetapkan warna ikon secara dinamis
        }));

        if (isMounted) {
          setProjects(fetchedProjects);
        }
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            setError(
              `Error ${axiosError.response.status}
              }`
            );
          } else if (axiosError.request) {
            setError(
              "Tidak ada respons dari server. Periksa koneksi jaringan Anda."
            );
          } else {
            setError(`Error: ${axiosError.message}`);
          }
        } else {
          setError("Gagal memuat proyek.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Mengambil proyek pertama kali saat komponen dipasang
    fetchProjects();

    // Menetapkan interval untuk mengambil proyek secara berkala (misalnya setiap 30 detik)
    const intervalId = setInterval(fetchProjects, 30000); // 30000 ms = 30 detik

    // Membersihkan interval saat komponen di-unmount
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [token]);

  // Fungsi untuk menetapkan warna ikon secara dinamis berdasarkan ID proyek
  const assignIconColor = (projectId: number): "yellow" | "dark" | "gold" => {
    const colors: Array<"yellow" | "dark" | "gold"> = [
      "yellow",
      "dark",
      "gold",
    ];
    return colors[projectId % colors.length];
  };

  // Menangani klik di luar menu pengaturan untuk menutupnya
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  // Fungsi logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="fixed flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex items-center gap-2 p-4">
        <div className="h-8 w-8 rounded-full bg-blue-600" />
        <span className="font-semibold">Awur-awuran</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-none p-2">
        <div className="space-y-1">
          <Button
            variant="secondary"
            className="w-full justify-start gap-2"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Home
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => navigate("/activities")}
          >
            <Activity className="h-4 w-4" />
            Activity
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => navigate("/projects")}
          >
            <LayoutGrid className="h-4 w-4" />
            Projects
          </Button>
        </div>
      </nav>

      <Separator className="my-2" />

      {/* Projects Section */}
      <div className="flex-1 px-4">
        <div className="flex items-center justify-between py-2">
          <h2 className="text-xs font-semibold text-muted-foreground">
            PROJECTS
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => navigate("/projects/create")}
            aria-label="Tambah Proyek"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1">
            {isLoading && (
              <p className="text-sm text-center text-muted-foreground">
                Memuat proyek...
              </p>
            )}
            {error && (
              <div className="text-sm text-center text-red-500">
                <p>{error}</p>
                {/* Uncomment baris berikut untuk debugging lebih lanjut */}
                {/* <pre>{JSON.stringify(error, null, 2)}</pre> */}
              </div>
            )}
            {!isLoading && !error && projects.length === 0 && (
              <p className="text-sm text-center text-muted-foreground">
                Tidak ada proyek.
              </p>
            )}
            {!isLoading &&
              !error &&
              projects.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
          </div>
        </ScrollArea>
      </div>

      {/* User Profile */}
      <div className="flex-none p-4" ref={settingsRef}>
        <Separator className="mb-4" />
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
            aria-label="Pengaturan"
          >
            <Settings2 className="h-4 w-4" />
          </Button>

          {/* Dropdown Menu */}
          {isSettingsOpen && (
            <div className="absolute bottom-12 right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => navigate("/edit-profile")}
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
    </div>
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
      onClick={() => navigate(`/projects/${project.id}`)} // Navigasi ke detail proyek
    >
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full",
          iconColors[project.icon]
        )}
      >
        {project.name[0].toUpperCase()}
      </div>
      <span className="flex-1 truncate text-left font-medium">
        {project.name}
      </span>
      <Badge variant="secondary">{project.count}</Badge>
    </button>
  );
}
