import { get, child } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";
import notesRef from "./clientSideCode";

const getNoteById = async (noteId) => {
  const noteRef = child(notesRef, noteId);
  await get(noteRef).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No such note exists");
    }
  }).catch((error) => {
    console.error(error);
  });
};

export { getNoteById };