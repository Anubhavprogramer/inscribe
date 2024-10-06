import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./db"; // Firebase initialization

// Save a note to the Firestore
const saveNote = async(noteContent, user) => {
    // console.log(user.id,noteContent);
    if(user){
        try{
            await addDoc(collection(db, "notes"), {
                userId: user.id,
                title: noteContent.title,  // Save the note title
                content: noteContent.content,  // Save the note content
                createdAt: new Date().toISOString()  // Timestamp for creation
            });
            console.log("Note added successfully");
        }
        catch(e){
            console.error("Error adding note:",e);
        }
    }
};

// Fetch notes for the authenticated user
const fetchNotes = async(user) => { 
    if(user){
        const q = query(collection(db, "notes"), where("userId", "==", user.id));
        const querySnapshot = await getDocs(q);
        const notes = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return notes;
    }
};

export { saveNote, fetchNotes };
