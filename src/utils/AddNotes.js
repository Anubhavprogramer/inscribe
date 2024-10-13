import { push, set } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";
import notesRef from "./clientSideCode";

const addNote = async (title, content,userId, color, textColor, time) => {
    const newRef = push(notesRef);
    await set(newRef, {
      title,
      content,
      userId,
      color,
      textColor,
      time
    });
    console.log("Document written with ID: ", newRef.id);
};

export { addNote };