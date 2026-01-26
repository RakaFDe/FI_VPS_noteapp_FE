import type { Note } from "@/types/note";
import { format } from "date-fns";
import { Pin, Trash2, Edit2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: number) => void;
  onTogglePin: (note: Note) => void;
}

// Map color strings to tailwind classes
const colorMap: Record<string, string> = {
  default: "bg-card border-border",
  red: "bg-[hsl(var(--note-red))] border-[hsl(var(--note-red))]",
  orange: "bg-[hsl(var(--note-orange))] border-[hsl(var(--note-orange))]",
  yellow: "bg-[hsl(var(--note-yellow))] border-[hsl(var(--note-yellow))]",
  green: "bg-[hsl(var(--note-green))] border-[hsl(var(--note-green))]",
  teal: "bg-[hsl(var(--note-teal))] border-[hsl(var(--note-teal))]",
  blue: "bg-[hsl(var(--note-blue))] border-[hsl(var(--note-blue))]",
  purple: "bg-[hsl(var(--note-purple))] border-[hsl(var(--note-purple))]",
  pink: "bg-[hsl(var(--note-pink))] border-[hsl(var(--note-pink))]",
  brown: "bg-[hsl(var(--note-brown))] border-[hsl(var(--note-brown))]",
  gray: "bg-[hsl(var(--note-gray))] border-[hsl(var(--note-gray))]",
};

export function NoteCard({ note, onEdit, onDelete, onTogglePin }: NoteCardProps) {
  const bgClass = colorMap[note.color || "default"] || colorMap.default;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 border",
        bgClass
      )}
    >
      {/* PIN */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(note);
        }}
        className={cn(
          "absolute top-4 right-4 p-2 rounded-full transition-all",
          note.isPinned
            ? "bg-black/10 text-foreground"
            : "opacity-0 group-hover:opacity-100 hover:bg-black/5 text-muted-foreground"
        )}
      >
        <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
      </button>

      <div onClick={() => onEdit(note)} className="cursor-pointer space-y-3">
        <h3 className="text-xl font-bold pr-8">{note.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">
          {note.content}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between pt-4 border-t border-black/5">
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          {format(new Date(note.createdAt ?? new Date()), "MMM d, yyyy")}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
          >
            <Edit2 className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}
