import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TitleDialog({ open, onOpenChange }) {
  const [title, setTitle] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();

  const createTask = useMutation(api.Notes.createTask);

  const handleSave = async () => {
    if (!title.trim() || !user) return;

    try {
      // Create the note without storageId initially
      const newNote = await createTask({
        title: title.trim(),
        time: new Date().toISOString(),
        color: "#ffffff",
        textColor: "#000000",
        email: user.primaryEmailAddress.emailAddress,
      });

      setTitle("");
      onOpenChange(false);
      
      // Navigate to the editor for the new note
      navigate(`/editor/${newNote._id}`);

    } catch (error) {
      console.error("Failed to create new note:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new note</DialogTitle>
          <DialogDescription>
            Please enter a title for your new note.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave();
                }
              }}
              placeholder="My Awesome Note"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>
            Create Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
