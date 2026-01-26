import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Note, CreateNotePayload } from "@/types/note";
import { cn } from "@/lib/utils";
import { Pin, Check, X } from "lucide-react";


interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: CreateNotePayload) => void;
  initialData?: Note;
  isLoading?: boolean;
}

const COLORS = [
  "default",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "purple",
  "pink",
  "brown",
  "gray",
];

export function NoteModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");
  const [isPinned, setIsPinned] = useState(false);

  const [titleError, setTitleError] = useState<string | null>(null);

useEffect(() => {
  if (!isOpen) return;

  if (initialData) {
    setTitle(initialData.title);
    setContent(initialData.content);
    setColor(initialData.color ?? "default");
    setIsPinned(initialData.isPinned ?? false);
  } else {
    setTitle("");
    setContent("");
    setColor("default");
    setIsPinned(false);
  }
}, [isOpen, initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title.length > 30) {
      setTitleError("Title maksimal 30 karakter");
      return;
    }

    setTitleError(null);

    onSubmit({
      title,
      content,
      color,
      isPinned,
      tags: [],
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl overflow-hidden p-0 gap-0 border-0 [&>button]:hidden">
        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex flex-col h-full bg-card transition-colors",
            color !== "default" && `bg-[hsl(var(--note-${color}))]`
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-end gap-2 p-4 pb-0">
            {/* PIN */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsPinned((v) => !v)}
              className={cn(
                "rounded-full",
                isPinned
                  ? "bg-black/10 text-foreground"
                  : "text-muted-foreground hover:bg-black/5"
              )}
            >
              <Pin className={cn("h-5 w-5", isPinned && "fill-current")} />
            </Button>

            {/* CLOSE */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full text-muted-foreground hover:bg-black/5"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 pt-2 space-y-4">
            <Input
              value={title}
              onChange={(e) => {
                const val = e.target.value.slice(0, 30);
                setTitle(val);

                if (val.length <= 30) {
                  setTitleError(null);
                }
              }}
              maxLength={30}
              placeholder="Title (max 30 chars)"
              required
              className="text-2xl font-bold border-0 px-0 shadow-none focus-visible:ring-0 bg-transparent"
            />


            <div className="text-xs text-muted-foreground text-right">
              {title.length}/30
            </div>

            {titleError && (
              <p className="text-sm text-red-500 mt-1">
                {titleError}
              </p>
            )}


            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take a note..."
              required
              className="min-h-[200px] border-0 px-0 shadow-none focus-visible:ring-0 bg-transparent resize-none"
            />
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 bg-black/5 flex sm:justify-between gap-4">
            <div className="flex gap-1.5 overflow-x-auto max-w-[70%]">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "h-8 w-8 rounded-full border",
                    c === "default"
                      ? "bg-white dark:bg-zinc-800"
                      : `bg-[hsl(var(--note-${c}))]`,
                    color === c && "ring-2 ring-primary"
                  )}
                >
                  {color === c && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
