import { get } from "https://inscribe-95090-default-rtdb.asia-southeast1.firebasedatabase.app/";
import notesRef from "./clientSideCode";

const getNotes = async () => {
    await get(notesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const notes = snapshot.val();
        console.log(notes);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  export { getNotes };