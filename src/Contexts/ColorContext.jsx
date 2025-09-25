import { useState, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Create the context
export const ColorContext = createContext();

// Create the provider
export const ColorProvider = ({ children }) => {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [Cardnotes, setCardnotes] = useState([])

  // Theme state - check localStorage or default to light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [selectedNote, setSelectedNote] = useState({
    _id: "",
    title: "",
    note: "",
    time: new Date().toISOString(),
  }); // State to track the selected note
  
  const [allNotes, setAllNotes] = useState([]); // State to store all notes

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ColorContext.Provider value={{ 
      title, setTitle, 
      note, setNote, 
      Cardnotes, setCardnotes,
      selectedNote, setSelectedNote,
      allNotes, setAllNotes,
      isDarkMode, toggleTheme
    }}>
      {children}
    </ColorContext.Provider>
  );
};

ColorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
