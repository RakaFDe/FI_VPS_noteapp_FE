import { useState } from "react";
import { useNotes } from "@/hooks/use-notes";
import type { Note, CreateNotePayload } from "@/types/note";
import { NoteCard } from "@/components/note-card";
import { NoteModal } from "@/components/note-modal";
import { Button } from "@/components/ui/button";

export default function NotesView() {
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Note | undefined>();

  if (isLoading) {
    return <div className="p-6">Loading notes...</div>;
  }

  const handleSubmit = (data: CreateNotePayload) => {
    if (editing) {
      updateNote(
        { ...editing, ...data },
        {
          onSuccess: () => {
            setOpen(false);
            setEditing(undefined);
          },
        }
      );
    } else {
      createNote(data, {
        onSuccess: () => {
          setOpen(false);
        },
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Button onClick={() => setOpen(true)}>New Note</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={(n) => {
              setEditing(n);
              setOpen(true);
            }}
            onDelete={(id) =>
              deleteNote(id, {
                onSuccess: () => {
                  setEditing(undefined);
                },
              })
            }
            onTogglePin={(n) =>
              updateNote({ ...n, isPinned: !n.isPinned })
            }
          />
        ))}
      </div>

      <NoteModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditing(undefined);
        }}
        initialData={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
