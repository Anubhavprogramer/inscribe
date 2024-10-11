import React, { useContext, useState, useEffect } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import TextEditor from "./TextEditor";
import { useUser } from "@clerk/clerk-react";

function MyNotes() {
  const { Cardnotes } = useContext(ColorContext); // Destructure Cardnotes from context
  const [selectedNote, setSelectedNote] = useState(null); // State to track the selected note
  const { user } = useUser(); // Get the authenticated user

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);


  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {Cardnotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {Cardnotes.map((noteCard, index) => (
            <li
              key={noteCard.id || index} // Use noteCard.id if available, otherwise fallback to index
              className="border-b border-gray-200 cursor-pointer py-2 w-fit gap-4 flex flex-col p-7 h-60 rounded-lg bg-blue-600"
              // onClick={handleNoteClick(noteCard)} // Set selected note
            >
              <a href="/">
              <h2 className="text-xl font-semibold">{noteCard.title}</h2>
              <p>{noteCard.note}</p> {/* Assuming 'note' is the content */}

              </a>
            </li>
          ))}
        </ul>
      )}
      {selectedNote && (
        <TextEditor note={selectedNote} /> 
      )}
    </div>
  );
}

export default MyNotes;
