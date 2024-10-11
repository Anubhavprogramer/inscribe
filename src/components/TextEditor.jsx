import React, { useContext, useEffect } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
import { addNote } from '../../convex/Notes';

function TextEditor() {
  const { color, textColor, title, setTitle, note, setNote, setCardnotes ,selectedNote } = useContext(ColorContext); // Access color context
  const { user } = useUser(); // Get the authenticated user

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Handlers for title and note text changes
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setNote(e.target.value);
  };

  // Save note function
  const handleSave = async () => {
    try {
      await addNote({
        content: note,
        title: title,
        user: user.emailAddress, // Save user email for identification
        time: new Date().toISOString(), // Record the time the note was saved
        color: color, // Save the note's background color
        textColor: textColor // Save the note's text color
      });

      // Optionally reset the note and title after saving
      setNote('');
      setTitle('');
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  };

  return (
    <div style={{ backgroundColor: color, color: textColor }} className='h-screen flex flex-col p-5'>
      {/* Title Input */}
      <input
        type="text"
        value={setCardnotes.title}
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
        value={setCardnotes.note}
        onChange={handleTextChange}
        className="flex-grow p-5 resize-none outline-none"
        style={{
          backgroundColor: color,
          color: textColor,
        }}
        placeholder="Start writing your notes..."
      />

      {/* Save Button */}
      <button onClick={handleSave} className="mt-4 p-2 bg-blue-500 text-white">
        Save Note
      </button>
    </div>
  );
}

export default TextEditor;
