import { child, remove } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";
import notesRef from "./clientSideCode";


const deleteNote = async (noteId) => {
    const noteRef = child(notesRef, noteId);
    await remove(noteRef);
    console.log("Note deleted");
  };

  export {deleteNote};