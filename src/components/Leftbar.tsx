import { Bell, Home, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

export function Leftbar() {
  return (
    <div className="w-64 flex-col border-r">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full" />
        <span className="font-semibold">Awur-awuran</span>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        <Link to="/" className="w-full">
          <Button variant="secondary" className="w-full justify-start gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
        <Link to="/activities" className="w-full">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Bell className="w-4 h-4" />
            Activity
          </Button>
        </Link>
        <Link to="/projects" className="w-full">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LayoutGrid className="w-4 h-4" />
            Projects
          </Button>
        </Link>
      </nav>
      <Separator />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            PROJECTS
          </h2>
          <Button variant="ghost" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2">
            <ProjectItem title="Flower Shop" count="23" />
            <ProjectItem title="Cloth" count="345" isDark />
            <ProjectItem title="Gamer Boy" count="568" isGold />
            <ProjectItem title="Flower Shop" count="23" />
            <ProjectItem title="Cloth" count="345" isDark />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function ProjectItem({
  title,
  count,
  isDark,
  isGold,
}: {
  title: string;
  count: string;
  isDark?: boolean;
  isGold?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isDark
            ? "bg-gray-900 text-white"
            : isGold
            ? "bg-yellow-500 text-white"
            : "bg-yellow-500 text-white"
        }`}
      >
        {title[0]}
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
      </div>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}
