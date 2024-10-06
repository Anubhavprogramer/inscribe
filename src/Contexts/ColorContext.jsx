import React, { useState, createContext } from 'react';

// Create the context
export const ColorContext = createContext();

// Create the provider
export const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("#fffff"); // Initialize with default color
  const [textColor, settextColor] = useState("#000000"); // Initialize with default color
  
  const [title, setTitle] = useState("second")
  const [note, setNote] = useState("second")

  return (
    <ColorContext.Provider value={{ color, setColor,  textColor, settextColor, title, setTitle, note, setNote }}>
      {children}
    </ColorContext.Provider>
  );
};
