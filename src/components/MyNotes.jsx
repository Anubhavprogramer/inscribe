import React, { useContext, useState, useEffect } from "react";
import { ColorContext } from "../Contexts/ColorContext";
import TextEditor from "./TextEditor";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function MyNotes() {
  const { Cardnotes, setSelectedNote } = useContext(ColorContext); // Destructure Cardnotes from context
  const { user } = useUser(); // Get the authenticated user
  const navigate = useNavigate();
  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {Cardnotes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {Cardnotes.map((card, index) => (
              <li
                onClick={()=>{
                  setSelectedNote({
                    title: card.title,
                    note: card.note,
                    time: Date.now()
                  });
                  navigate("/editor")
                }}
                key={card.id || index} // Use card.id if available, otherwise fallback to index
                className="border-b border-gray-200 cursor-pointer py-2 w-fit gap-4 flex flex-col p-7 h-60 rounded-lg bg-blue-600"
                // onClick={handleNoteClick(card)} // Set selected note
              >
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p>{card.note}</p> {/* Assuming 'note' is the content */}
              </li>
          ))}
        </ul>
      )}
      {/* {selectedNote && (
        <TextEditor note={selectedNote} /> 
      )} */}
    </div>
  );
}

export default MyNotes;
