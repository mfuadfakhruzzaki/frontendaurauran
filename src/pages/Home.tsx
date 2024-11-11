import { Navbar } from "../components/Navbar";
import { Leftbar } from "../components/Leftbar";
import { Rightbar } from "../components/Rightbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { MoreVertical } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Leftbar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64">
        <Leftbar />
      </div>

      {/* Fixed Rightbar (if applicable) */}
      <div className="hidden xl:block fixed top-0 right-0 h-full w-64">
        <Rightbar />
      </div>

      {/* Main Content Area */}
      <div
        className="
          flex flex-col 
          min-h-screen 
          lg:ml-64 
          xl:mr-64 
          transition-all 
          duration-300
        "
      >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="p-6">
          {/* Baru Saja Dibuka Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Baru Saja Dibuka</h2>
              <Button variant="link">Selengkapnya</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ProjectCard key={i} />
              ))}
            </div>
          </div>

          {/* Status Seluruh Project Anda Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Status Seluruh Project Anda
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <StatusCard
                count={4}
                label="Assigned"
                subLabel="Belum dikerjakan"
                color="bg-blue-100"
              />
              <StatusCard
                count={2}
                label="On Progress"
                subLabel="Sedang dikerjakan"
                color="bg-yellow-100"
              />
              <StatusCard
                count={10}
                label="Completed"
                subLabel="Selesai"
                color="bg-green-100"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProjectCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div>
            <CardTitle className="text-base">Website Development</CardTitle>
            <p className="text-sm text-muted-foreground">PBO Kelas D</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-lg mb-3" />
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Project Website Tugas Besar Kelompok Info Dosen : Pak Delphi
          </p>
          <Button variant="ghost" size="icon">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button variant="secondary" size="sm">
            Detail
          </Button>
          <Badge>High</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  count,
  label,
  subLabel,
  color,
}: {
  count: number;
  label: string;
  subLabel: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
          >
            {count}
          </div>
          <div>
            <h3 className="font-semibold">{label}</h3>
            <p className="text-sm text-muted-foreground">{subLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
