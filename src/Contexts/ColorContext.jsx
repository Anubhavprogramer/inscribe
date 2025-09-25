import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

// Create the context
export const ColorContext = createContext();

// Create the provider
export const ColorProvider = ({ children }) => {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [Cardnotes, setCardnotes] = useState([])

  const [selectedNote, setSelectedNote] = useState({
    _id: "",
    title: "",
    note: "",
    time: new Date().toISOString(),
  }); // State to track the selected note
  
  const [allNotes, setAllNotes] = useState([]); // State to store all notes
  return (
    <ColorContext.Provider value={{ title, setTitle, note, setNote, Cardnotes, setCardnotes ,selectedNote,setSelectedNote,allNotes, setAllNotes }}>
      {children}
    </ColorContext.Provider>
  );
};

ColorProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
