import React, { useState, createContext } from 'react';

// Create the context
export const ColorContext = createContext();

// Create the provider
export const ColorProvider = ({ children }) => {
  const [color, setColor] = useState("#fffff"); // Initialize with default color
  const [isPickerOpen, setIsPickerOpen] = useState(false); // Manage the color picker visibility
  const [textColor, settextColor] = useState("#000000"); // Initialize with default color

  // Function to toggle color picker visibility
  const toggleColorPicker = () => {
    setIsPickerOpen(!isPickerOpen);
  };

  return (
    <ColorContext.Provider value={{ color, setColor, isPickerOpen, toggleColorPicker, textColor, settextColor }}>
      {children}
    </ColorContext.Provider>
  );
};
