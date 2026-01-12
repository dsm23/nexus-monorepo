import { useEffect, useState } from "react";
import type { DragEvent, FunctionComponent } from "react";
import {
  FileText,
  Globe,
  GripVertical,
  Home,
  Link,
  Mail,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { defaultQuickLinks } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";
import { generateId, storage } from "~/lib/utils";
import type { QuickLink } from "~/data/mockData";

export const QuickLinks: FunctionComponent = () => {
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Function to get appropriate icon for a link based on its name or URL
  const getLinkIcon = (name: string, url: string) => {
    const lowerName = name.toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (
      lowerName.includes("mail") ||
      lowerName.includes("email") ||
      lowerUrl.includes("mail")
    ) {
      return <Mail className="h-4 w-4" />;
    }
    if (
      lowerName.includes("doc") ||
      lowerName.includes("wiki") ||
      lowerName.includes("confluence") ||
      lowerUrl.includes("doc")
    ) {
      return <FileText className="h-4 w-4" />;
    }
    if (
      lowerName.includes("setting") ||
      lowerName.includes("admin") ||
      lowerName.includes("config")
    ) {
      return <Settings className="h-4 w-4" />;
    }
    if (
      lowerName.includes("home") ||
      lowerName.includes("dashboard") ||
      lowerName.includes("main")
    ) {
      return <Home className="h-4 w-4" />;
    }
    // Default to globe icon for external links
    return <Globe className="h-4 w-4" />;
  };

  // Load links from localStorage on mount
  useEffect(() => {
    const savedLinks = storage.getQuickLinks();
    if (savedLinks.length === 0) {
      // First time user, use default links
      setLinks(defaultQuickLinks);
      storage.setQuickLinks(defaultQuickLinks);
    } else {
      setLinks(savedLinks);
    }
  }, []);

  const addLink = () => {
    if (!newLinkName.trim() || !newLinkUrl.trim()) return;

    const newLink: QuickLink = {
      id: generateId(),
      name: newLinkName.trim(),
      url: newLinkUrl.trim(),
    };

    const updatedLinks = [...links, newLink];
    setLinks(updatedLinks);
    storage.setQuickLinks(updatedLinks);

    // Reset form
    setNewLinkName("");
    setNewLinkUrl("");
    setIsAddDialogOpen(false);
  };

  const removeLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id);
    setLinks(updatedLinks);
    storage.setQuickLinks(updatedLinks);
  };

  const handleLinkClick = (url: string) => {
    // Ensure URL has protocol
    const finalUrl = url.startsWith("http") ? url : `https://${url}`;
    window.open(finalUrl, "_blank", "noopener,noreferrer");
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLElement>, linkId: string) => {
    setDraggedItem(linkId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLElement>, linkId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(linkId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: DragEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = links.findIndex((link) => link.id === draggedItem);
    const targetIndex = links.findIndex((link) => link.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newLinks = [...links];
    const [draggedLink] = newLinks.splice(draggedIndex, 1);
    newLinks.splice(targetIndex, 0, draggedLink);

    setLinks(newLinks);
    storage.setQuickLinks(newLinks);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link className="h-5 w-5" />
            My Quick Links
          </CardTitle>
          <CardDescription>Your most-used tools and resources</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[95vw] sm:w-full sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Quick Link</DialogTitle>
              <DialogDescription>
                Add a new link to your quick access list.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                <Label htmlFor="name" className="sm:text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newLinkName}
                  onChange={(e) => setNewLinkName(e.target.value)}
                  placeholder="e.g., Company Wiki"
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4 sm:gap-4">
                <Label htmlFor="url" className="sm:text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="e.g., wiki.company.com"
                  className="sm:col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={addLink}
                disabled={!newLinkName.trim() || !newLinkUrl.trim()}
                className="w-full sm:w-auto"
              >
                Add Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent ref={containerRef}>
        {links.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <p className="text-sm">No quick links yet.</p>
            <p className="mt-1 text-xs">
              Add your most-used tools and resources.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link, index) => (
              <div
                key={link.id}
                onDragOver={(e) => handleDragOver(e, link.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, link.id)}
                className={getItemClassName(
                  `hover:bg-muted/50 flex items-center justify-between rounded-lg border p-2 ${
                    dragOverItem === link.id
                      ? "border-primary bg-primary/10"
                      : ""
                  } ${draggedItem === link.id ? "opacity-50" : ""}`,
                )}
                style={getItemStyle(index)}
              >
                <div className="flex flex-1 items-center gap-2">
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, link.id)}
                    onDragEnd={handleDragEnd}
                    className="hover:bg-muted cursor-move rounded p-1"
                  >
                    <GripVertical className="text-muted-foreground h-4 w-4" />
                  </div>
                  <button
                    onClick={() => handleLinkClick(link.url)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    {getLinkIcon(link.name, link.url)}
                    <span className="text-sm font-medium">{link.name}</span>
                  </button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(link.id)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
