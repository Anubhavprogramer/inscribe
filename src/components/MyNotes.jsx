import React, { useEffect, useState } from 'react';
// import { fetchNotes } from '../DataBase/StoreData'; // Import the fetchNotes function
import { useAuth } from '@clerk/clerk-react';

function MyNotes() {
  const [notes, setNotes] = useState([]);
  const { user } = useAuth(); // Get the authenticated user

  // Fetch notes from a data source
  useEffect(() => {
    const getNotes = async () => {
      if (user) {
        // const userNotes = await fetchNotes(user); // Pass user to fetchNotes function
        // setNotes(userNotes);
      }
    };

    getNotes();
  }, [user]);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">My Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map(note => (
            <li key={note.id} className="border-b border-gray-200 py-2">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p>{note.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyNotes;
