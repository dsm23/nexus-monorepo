import { useState } from "react";
import type { FunctionComponent } from "react";
import { ArrowRight, Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
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
import { Textarea } from "~/components/ui/textarea";
import { currentUser, kudos as initialKudos } from "~/data/mockData";
import { useWaveAnimation } from "~/hooks/useWaveAnimation";
import { formatRelativeTime, generateId } from "~/lib/utils";
import type { Kudo } from "~/data/mockData";

export const KudosFeed: FunctionComponent = () => {
  const [kudosList, setKudosList] = useState<Kudo[]>(initialKudos);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newKudoTo, setNewKudoTo] = useState("");
  const [newKudoMessage, setNewKudoMessage] = useState("");
  const { containerRef, getItemStyle, getItemClassName } = useWaveAnimation();

  // Show only first 3 kudos on dashboard
  const displayKudos = kudosList.slice(0, 3);

  const addKudo = () => {
    if (!newKudoTo.trim() || !newKudoMessage.trim()) return;

    const newKudo: Kudo = {
      id: generateId(),
      from: currentUser.name,
      to: newKudoTo.trim(),
      message: newKudoMessage.trim(),
      timestamp: new Date(),
    };

    setKudosList((prev) => [newKudo, ...prev]);

    // Reset form
    setNewKudoTo("");
    setNewKudoMessage("");
    setIsAddDialogOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col space-y-2 pb-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5" />
            Kudos & Shout-Outs
          </CardTitle>
          <CardDescription>
            Recognize and celebrate your colleagues
          </CardDescription>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Give Kudos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Give Kudos</DialogTitle>
                <DialogDescription>
                  Recognize a colleague for their great work or help.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="to" className="text-right">
                    To
                  </Label>
                  <Input
                    id="to"
                    value={newKudoTo}
                    onChange={(e) => setNewKudoTo(e.target.value)}
                    placeholder="Colleague's name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="message" className="pt-2 text-right">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    value={newKudoMessage}
                    onChange={(e) => setNewKudoMessage(e.target.value)}
                    placeholder="What would you like to recognize them for?"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={addKudo}
                  disabled={!newKudoTo.trim() || !newKudoMessage.trim()}
                >
                  Send Kudos
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link to="/kudos">
            <Button variant="outline" size="sm" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent ref={containerRef}>
        {displayKudos.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <Heart className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p className="text-sm">No kudos yet.</p>
            <p className="mt-1 text-xs">
              Be the first to recognize a colleague!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayKudos.map((kudo, index) => (
              <div
                key={kudo.id}
                className={getItemClassName(
                  "rounded-lg border border-rose-500/20 bg-gradient-to-r from-rose-500/5 to-pink-500/5 p-4",
                )}
                style={getItemStyle(index)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-red-600 dark:text-red-400">
                    <Heart className="h-4 w-4 fill-current" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          <span className="text-red-600 dark:text-red-400">
                            {kudo.from}
                          </span>
                          {" → "}
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            {kudo.to}
                          </span>
                        </p>
                        <p className="text-foreground text-sm leading-relaxed">
                          {kudo.message}
                        </p>
                      </div>
                      <span className="text-muted-foreground ml-2 text-xs whitespace-nowrap">
                        {formatRelativeTime(kudo.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Show remaining count if there are more kudos */}
            {kudosList.length > 3 && (
              <div className="border-t pt-2">
                <Link to="/kudos">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground w-full gap-2"
                  >
                    <span>View {kudosList.length - 3} more kudos</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
