import React, { useContext, useEffect, useState } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
// import { addNote } from '../../convex/Notes';
import { useMutation } from 'convex/react';

function TextEditor() {
  const { color, textColor, selectedNote, setSelectedNote } = useContext(ColorContext); // Access color context
  const { user } = useUser(); // Get the authenticated user
  const [debounceTimer, setDebounceTimer] = useState(null); // State for debounce timer

  // const addNoteMutation = useMutation(addNote); // Convex mutation to add a note

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Update title and note in real-time as the user types
  const handleTitleChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      title: e.target.value
    }));
    handleAutoSave(); // Auto-save after title change
  };

  const handleTextChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      note: e.target.value
    }));
    handleAutoSave(); // Auto-save after text change
  };

  // Auto-save function with debounce to avoid too frequent saves
  const handleAutoSave = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(setTimeout(() => handleSave(), 1000)); // Save after 1 second of inactivity
  };

  // Save note function
  const handleSave = async () => {
    try {
      await addNoteMutation({
        userId: user.id,
        title: selectedNote.title,
        content: selectedNote.note,
        color, // Include note's background color
        textColor, // Include note's text color
        time: new Date().toISOString(), // Record the time the note was saved
      });
      console.log('Note saved:', selectedNote);
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  };

  return (
    <div style={{ backgroundColor: color, color: textColor }} className='h-screen flex flex-col p-5'>
      {/* Title Input */}
      <input
        type="text"
        value={selectedNote.title}
        onChange={handleTitleChange}
        placeholder="Enter note title..."
        className="mb-4 p-2 text-3xl font-bold outline-none w-full"
        style={{
          backgroundColor: color,
          color: textColor
        }}
      />
      <hr />
      {/* Note Text Area */}
      <textarea
        value={selectedNote.note}
        onChange={handleTextChange}
        className="flex-grow p-5 resize-none outline-none"
        style={{
          backgroundColor: color,
          color: textColor,
        }}
        placeholder="Start writing your notes..."
      />

      
    </div>
  );
}

export default TextEditor;
