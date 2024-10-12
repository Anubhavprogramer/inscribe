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
    title:"",
    note:"",
    time: Date.now()
  }); // State to track the selected note
  // console.log(selectedNote)
  const [allNotes, setAllNotes] = useState([]); // State to store all notes
  return (
    <ColorContext.Provider value={{ color, setColor,  textColor, settextColor, title, setTitle, note, setNote, Cardnotes, setCardnotes ,selectedNote,setSelectedNote,allNotes, setAllNotes }}>
      {children}
    </ColorContext.Provider>
  );
};
