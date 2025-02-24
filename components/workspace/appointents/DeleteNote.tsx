import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { useAppointmentContext } from "@/context/AppointmentContext";
import { deleteRow } from "@/lib/server";
import { BookingNote } from "@/types/appointments";
import { toast } from "react-toastify";
import React, { Dispatch, SetStateAction, useState } from "react";

const DeleteNote = ({
  setIsAddNote,
  setBookingNotes,
}: {
  setIsAddNote: Dispatch<SetStateAction<"" | "create" | "edit" | "preview" | "delete">>;
  setBookingNotes: Dispatch<SetStateAction<BookingNote[]>>;
}) => {
  const { selectedItem } = useAppointmentContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!selectedItem?.id) {
      toast.error("No note selected for deletion.");
      return;
    }

    try {
      setLoading(true);
      const { data, error, status, statusText } = await deleteRow("bookingNote", "id", selectedItem.id);

      if (error) {
        console.error(`Delete failed [${status} - ${statusText}]:`, error);
        toast.error(`Failed to delete note: ${error}`);
        return;
      }

      toast.success("Note was successfully deleted.");

      // Remove deleted note from state
      setBookingNotes((prev) => prev.filter((note) => note.id !== selectedItem.id));

      // Close the delete modal
      setIsAddNote("");
    } catch (err) {
      console.error("Unexpected delete error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pb-6">
      <DialogTitle className="w-full text-center bg-baseLight py-6 px-4 flex justify-between items-center">
        Delete Note
      </DialogTitle>

      <div className="py-6 mx-auto max-w-sm space-y-4 text-center bg-white rounded-md">
        <h4 className="font-semibold">You are about to delete "{selectedItem?.title}"</h4>

        <div className="flex gap-3">
          <Button
            disabled={loading}
            onClick={handleDelete}
            variant="destructive"
            className="text-white rounded-md h-10 w-full flex justify-center items-center"
          >
            {loading ? "Deleting ..." : "Confirm Delete"}
          </Button>
          <Button
            disabled={loading}
            onClick={() => setIsAddNote("")}
            variant="outline"
            className="rounded-md h-10 w-full flex justify-center items-center text-gray-600"
          >
            Cancel Delete
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DeleteNote;
