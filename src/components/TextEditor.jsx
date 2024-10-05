import React, { useContext, useState } from 'react';
import { ColorContext } from '../Contexts/ColorContext';

function TextEditor() {
  const { color, textColor } = useContext(ColorContext); // Access color and textColor from context
  const [text, setText] = useState(''); // State to store the text
  const [title, setTitle] = useState(''); // State to store the title

  // Handle changes to the title input
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle changes to the text area
  const handleTextChange = (e) => {
    setText(e.target.value);
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
          backgroundColor: color, // Dynamic background color from context
          color: textColor, // Dynamic text color from context
        }}
      />

      {/* Text Area */}
      <textarea
        value={text}
        onChange={handleTextChange}
        className="flex-grow p-5 resize-none outline-none"
        style={{
          backgroundColor: color, // Dynamic background color from context
          color: textColor, // Dynamic text color from context
        }}
        placeholder="Start writing your notes..."
      />
    </div>
  );
}

export default TextEditor;
