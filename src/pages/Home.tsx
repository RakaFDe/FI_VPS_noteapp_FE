import { useState } from "react";
import Navbar from "@/components/Navbar";
import { NoteCard } from "@/components/note-card";
import { NoteModal } from "@/components/note-modal";
import { useNotes } from "@/hooks/use-notes";
import type { Note, CreateNotePayload } from "@/types/note";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Loader2, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const { user } = useAuth();
  const { notes, isLoading, createNote, updateNote, deleteNote } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  /* ================= FILTER & SORT ================= */
  const filteredNotes = notes.filter((note) => {
    const q = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    }
    return a.isPinned ? -1 : 1;
  });

  /* ================= HANDLERS ================= */
  const handleCreate = (data: CreateNotePayload) => {
    createNote(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleUpdate = (data: CreateNotePayload) => {
    if (!editingNote) return;

    updateNote(
      { ...editingNote, ...data },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteId === null) return;

    deleteNote(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
              <StickyNote className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">
              Capture your thoughts,
              <br />
              <span className="text-primary">beautifully.</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Login to start creating and organizing your notes.
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sortedNotes.length === 0 && searchQuery ? (
          /* SEARCH EMPTY STATE */
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground">
              No notes found for “{searchQuery}”
            </p>
          </div>
        ) : sortedNotes.length === 0 ? (
          /* FIRST NOTE EMPTY STATE */
          <div className="flex flex-col items-center py-20 space-y-6">
            <p className="text-muted-foreground">No notes yet</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first note
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={(n) => {
                  setEditingNote(n);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => setDeleteId(id)}
                onTogglePin={(n) =>
                  updateNote({ ...n, isPinned: !n.isPinned })
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Button */}
      {user && (
        <div className="fixed bottom-8 right-8">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={() => {
              setEditingNote(undefined);
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(undefined);
        }}
        onSubmit={editingNote ? handleUpdate : handleCreate}
        initialData={editingNote}
      />

      {/* Delete Confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
