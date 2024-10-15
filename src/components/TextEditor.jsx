import React, { useContext, useEffect, useState } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react'; // Import useMutation
import { api } from '../../convex/_generated/api'; // Import your API functions

function TextEditor() {
  const { color, textColor, selectedNote, setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const [debounceTimer, setDebounceTimer] = useState(null);
  const createTask = useMutation(api.Notes.createTask); // Initialize the createTask mutation
  const updateNote = useMutation(api.Notes.updateNote); // Initialize the updateNote mutation
  const [isSaving, setIsSaving] = useState(false);  // Loading state for saving
  const [saveStatus, setSaveStatus] = useState(''); // Save status indicator

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
    setIsSaving(true);
    setSaveStatus('Saving...');  // Display saving status
    console.log('Saving note...');
    console.log(selectedNote._id);
    try {
      if (selectedNote._id) {
        // If note has an _id, update it
        await updateNote({
          id: selectedNote._id,
          title: selectedNote.title,
          note: selectedNote.note,
          time: new Date().toISOString(),
          color: selectedNote.color,
          textColor: selectedNote.textColor,
          email: user?.email || "",
        });
        setSaveStatus('Note updated successfully!');
      } else {
        // Otherwise, create a new note
        const newNoteId = await createTask({
          title: selectedNote.title,
          note: selectedNote.note,
          time: new Date().toISOString(),
          color: selectedNote.color,
          textColor: selectedNote.textColor,
          email: user?.email || "",
        });
        setSelectedNote((prevNote) => ({ ...prevNote, _id: newNoteId }));
        setSaveStatus('Note created successfully!');
      }
      console.log('Note saved successfully:', selectedNote);
    } catch (error) {
      setSaveStatus('Error saving note');  // Error message
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false); // Reset loading state
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div
      style={{
        backgroundColor: selectedNote.color,
        color: selectedNote.textColor,
      }}
      className='h-screen flex flex-col p-5'
    >
      <div className="flex justify-between items-center">
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
        {isSaving && <span className="ml-2 text-sm text-gray-500">Saving...</span>}
      </div>
      
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

      {/* Save Status Indicator */}
      <div className="mt-2">
        <span className={`text-sm ${saveStatus === 'Error saving note' ? 'text-red-500' : 'text-green-500'}`}>
          {saveStatus}
        </span>
      </div>
    </div>
  );
}

export default TextEditor;
