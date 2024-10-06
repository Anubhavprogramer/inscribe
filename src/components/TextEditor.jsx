import React, { useContext } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
import { saveNote } from '../DataBase/StoreData'; // Import the saveNote function

function TextEditor() {
  const { color, textColor, title, setTitle, note, setNote } = useContext(ColorContext); // Access color context
  const { user } = useUser(); // Get the authenticated user

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTextChange = (e) => {
    setNote(e.target.value);
  };

  const handleSave = async () => {
    // console.log("Saving note...",user.id);
    if (user && title && note) {
      await saveNote({ title, content: note }, user); // Pass user and note content
      // console.log("Note saved successfully");
    } else {
      console.error("User not authenticated or fields are empty");
    }
  };

  return (
    <div style={{ backgroundColor: color, color: textColor }} className='h-screen flex flex-col p-5'>
      {/* Title Section */}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Enter note title..."
        className="mb-4 p-2 text-3xl font-bold outline-none w-full"
        style={{
          backgroundColor: color, 
          color: textColor
        }}
      />
      <hr />
      {/* Text Area */}
      <textarea
        value={note}
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
