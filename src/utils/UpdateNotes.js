import { update } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";
import notesRef from "./clientSideCode";

const updateNote = async (noteId, newTitle, newContent) => {
    const noteRef = child(notesRef, noteId);
    await update(noteRef, {
      title: newTitle,
      content: newContent,
    });
    console.log("Note updated");
  };

  export { updateNote };