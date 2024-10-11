import React, { useState, createContext } from 'react';

// Create the context
export const ColorContext = createContext();

// Create the provider
export const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("#fffff"); // Initialize with default color
  const [textColor, settextColor] = useState("#000000"); // Initialize with default color
  
  const [title, setTitle] = useState("second")
  const [note, setNote] = useState("second")
  const [Cardnotes, setCardnotes] = useState([{
    title: "asdkjhfalsd",
    note: "sakjdlfhfjds",
    time:"adsjfakj"
  }])

  const [selectedNote, setSelectedNote] = useState({
    title: title,
    note: note,
    time: Date.now()
  }); // State to track the selected note
  return (
    <ColorContext.Provider value={{ color, setColor,  textColor, settextColor, title, setTitle, note, setNote, Cardnotes, setCardnotes ,selectedNote }}>
      {children}
    </ColorContext.Provider>
  );
};
