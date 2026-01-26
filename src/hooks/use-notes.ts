import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/endpoints";
import type { Note, CreateNotePayload } from "@/types/note";

export function useNotes() {
  const queryClient = useQueryClient();

  /* ================= FETCH NOTES ================= */
  const notesQuery = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => apiFetch(API_ENDPOINTS.notes.list),
  });

  /* ================= CREATE ================= */
  const createNote = useMutation({
    mutationFn: (data: CreateNotePayload) =>
      apiFetch(API_ENDPOINTS.notes.create, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  /* ================= UPDATE ================= */
  const updateNote = useMutation({
    mutationFn: (note: Note) =>
      apiFetch(API_ENDPOINTS.notes.update(note.id), {
        method: "PUT",
        body: JSON.stringify({
          title: note.title,
          content: note.content,
          color: note.color,
          isPinned: note.isPinned,
          tags: note.tags,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  /* ================= DELETE ================= */
  const deleteNote = useMutation({
  mutationFn: (id: number) =>
    apiFetch(API_ENDPOINTS.notes.delete(id), {
      method: "DELETE",
    }),

  // 🔥 OPTIMISTIC UPDATE
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["notes"] });

    const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);

    queryClient.setQueryData<Note[]>(["notes"], (old) =>
      old ? old.filter((n) => n.id !== id) : []
    );
    return { previousNotes };
  },

  // rollback kalau gagal
  onError: (_err, _id, context) => {
    if (context?.previousNotes) {
      queryClient.setQueryData(["notes"], context.previousNotes);
    }
  },

  // sync ulang (opsional tapi rapi)
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  },
});

  return {
    notes: notesQuery.data ?? [],
    isLoading: notesQuery.isLoading,
    createNote: createNote.mutate,
    updateNote: updateNote.mutate,
    deleteNote: deleteNote.mutate,
  };
}
