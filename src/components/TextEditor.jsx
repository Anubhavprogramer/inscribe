import React, { useContext, useEffect, useState } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';

function TextEditor() {
  const { color, textColor, selectedNote, setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Watch for changes in color and textColor and update selectedNote
  useEffect(() => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      color: color === "" ? prevNote.color : color,
      textColor: textColor === "" ? prevNote.textColor : textColor,
    }));
    handleAutoSave();
  }, [color, textColor, setSelectedNote]);

  const handleTitleChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      title: e.target.value,
    }));
    handleAutoSave();
  };

  const handleTextChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      note: e.target.value,
    }));
    handleAutoSave();
  };

  const handleAutoSave = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    setDebounceTimer(setTimeout(() => handleSave(), 1000));
  };

  const handleSave = async () => {
    console.log('Saving note...');
    // console.log('Note saved successfully:', selectedNote);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div style={{
      backgroundColor: selectedNote.color,
      color: selectedNote.textColor,
    }}
    className='h-screen flex flex-col p-5'>
      <input
        type="text"
        value={selectedNote.title}
        onChange={handleTitleChange}
        placeholder="Enter note title..."
        className="mb-4 p-2 text-3xl font-bold outline-none w-full"
        style={{
          backgroundColor: selectedNote.color,
          color: selectedNote.textColor,
        }}
      />
      <hr />
      <textarea
        value={selectedNote.note}
        onChange={handleTextChange}
        className="flex-grow p-5 resize-none outline-none"
        style={{
          backgroundColor: selectedNote.color,
          color: selectedNote.textColor,
        }}
        placeholder="Start writing your notes..."
      />
    </div>
  );
}

export default TextEditor;
