import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react'; // Import useMutation
import { api } from '../../convex/_generated/api'; // Import your API functions
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoSave, IoDownloadOutline, IoStar, IoStarOutline, IoColorPalette, IoText, IoTrash, IoBrush, IoClose, IoAdd } from 'react-icons/io5';
import { MdUndo, MdRedo } from 'react-icons/md';
import { HexColorPicker } from 'react-colorful';

const COLORS = [
  { bg: '#fffbe6', text: '#222' },
  { bg: '#e0f7fa', text: '#222' },
  { bg: '#fce4ec', text: '#222' },
  { bg: '#f3e8ff', text: '#222' },
  { bg: '#f1f8e9', text: '#222' },
  { bg: '#212121', text: '#fff' },
];

const FONT_SIZES = [18, 22, 28, 36];
const HANDWRITING_FONT = `'Indie Flower', cursive`;

function TextEditor() {
  const { color, setColor, settextColor, textColor, selectedNote, setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const [debounceTimer, setDebounceTimer] = useState(null);
  const createTask = useMutation(api.Notes.createTask); // Initialize the createTask mutation
  const updateNote = useMutation(api.Notes.updateNote); // Initialize the updateNote mutation
  const deleteNote = useMutation(api.Notes.deleteNote);
  const [isSaving, setIsSaving] = useState(false);  // Loading state for saving
  const [saveStatus, setSaveStatus] = useState(''); // Save status indicator
  const [fontSize, setFontSize] = useState(22);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [isPinned, setIsPinned] = useState(selectedNote.pinned || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [handwriting, setHandwriting] = useState(false);
  const emailAddress = user.emailAddresses[0]?.emailAddress || "";
  const navigate = useNavigate();
  const debounceRef = useRef();
  const [showPanel, setShowPanel] = useState(false);
  

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  // Update pin state if selectedNote changes
  useEffect(() => {
    setIsPinned(selectedNote.pinned || false);
  }, [selectedNote.pinned]);

  // Helper: get only allowed fields for Convex
  function getConvexFields(note, isUpdate = false) {
    const base = {
      title: note.title,
      note: note.note,
      time: new Date().toISOString(),
      color: note.color,
      textColor: note.textColor,
      email: emailAddress,
      pinned: note.pinned || false,
    };
    if (isUpdate) {
      return { _id: note._id, ...base };
    }
    return base;
  }

  // Autosave logic
  const saveNote = useCallback(async (noteToSave) => {
    // Prevent saving if both title and note are empty or whitespace
    if (!noteToSave.title?.trim() && !noteToSave.note?.trim()) {
      setSaveStatus(''); // Optionally clear status
      setIsSaving(false);
      return;
    }
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      if (noteToSave._id) {
        await updateNote(getConvexFields(noteToSave, true));
        setSaveStatus('Saved');
      } else {
        const newNoteId = await createTask(getConvexFields(noteToSave, false));
        setSelectedNote((prevSelectedNote) => ({
          ...prevSelectedNote,
          _id: newNoteId._id
        }));
        setSaveStatus('Saved');
      }
    } catch (error) {
      setSaveStatus('Error saving note');
      // Log the error for debugging
      console.error('Error saving note:', error?.message || error);
    } finally {
      setIsSaving(false);
    }
  }, [createTask, updateNote, emailAddress, setSelectedNote]);

  // Debounced autosave on note changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveNote({ ...selectedNote, color, textColor, pinned: isPinned });
    }, 1000);
    return () => clearTimeout(debounceRef.current);
  }, [selectedNote.title, selectedNote.note, color, textColor, isPinned]);

  const handleTitleChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      title: e.target.value,
    }));
    // handleAutoSave();
  };

  const handleTextChange = (e) => {
    setSelectedNote((prevNote) => ({
      ...prevNote,
      note: e.target.value,
    }));
    // handleAutoSave();
  };

  // Download note as .txt
  const handleDownload = () => {
    const blob = new Blob([
      (selectedNote.title || "Untitled") + "\n\n" + (selectedNote.note || "")
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (selectedNote.title || 'note') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Undo/Redo (browser default)
  const handleUndo = () => document.execCommand('undo');
  const handleRedo = () => document.execCommand('redo');

  // Word/character count
  const wordCount = (selectedNote.note || '').trim().split(/\s+/).filter(Boolean).length;
  const charCount = (selectedNote.note || '').length;

  // Page number (simulate 500 chars per page)
  const charsPerPage = 500;
  const pageCount = Math.max(1, Math.ceil(charCount / charsPerPage));
  const currentPage = 1; // Always 1 for now, unless you want to paginate the textarea

  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleDelete = async () => {
    if (!selectedNote._id) return;
    try {
      await deleteNote({ _id: selectedNote._id });
      setShowDeleteConfirm(false);
      setTimeout(() => {
        navigate('/');
      }, 500);
    } catch (error) {
      setSaveStatus('Error deleting note');
    }
  };

  return (
    <div className="w-full h-screen flex relative overflow-hidden">
      {/* Quick Access Panel for all screen sizes */}
      <div className="fixed inset-0 z-40 pointer-events-none">
        {/* Overlay */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${showPanel ? 'opacity-50 pointer-events-auto' : 'opacity-0'}`} 
          onClick={() => setShowPanel(false)}
        ></div>
        
        {/* FAB */}
        <div className="fixed bottom-8 right-8 z-50 pointer-events-auto">
          <button 
            onClick={() => setShowPanel(prev => !prev)} 
            className={`text-white rounded-2xl shadow-lg flex items-center justify-center w-16 h-16 transition-all duration-300 ${showPanel ? 'bg-amber-400 hover:bg-amber-500' : 'bg-amber-500 hover:bg-amber-600'}`}
          >
            {showPanel ? <IoClose size={32} /> : <IoAdd size={32} />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className={`absolute bottom-28 right-8 flex flex-col items-end gap-3 transition-all duration-300 ${showPanel ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}>
            <button onClick={() => navigate('/')} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoArrowBack size={24} />
                <span className="font-semibold">Go Back</span>
            </button>
            {selectedNote._id && (
                <button onClick={() => {setShowDeleteConfirm(true); setShowPanel(false);}} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                    <IoTrash size={24} />
                    <span className="font-semibold">Delete</span>
                </button>
            )}
            <button onClick={() => setIsPinned(p => !p)} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoStar size={24} />
                <span className="font-semibold">Pin</span>
            </button>
            <button onClick={() => {setShowBgPicker(p => !p); setShowPanel(false);}} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoColorPalette size={24} />
                <span className="font-semibold">Background</span>
            </button>
            <button onClick={() => {setShowTextPicker(p => !p); setShowPanel(false);}} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoText size={24} />
                <span className="font-semibold">Text Color</span>
            </button>
            <button onClick={() => setFontSize(f => FONT_SIZES[(FONT_SIZES.indexOf(f) + 1) % FONT_SIZES.length])} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <span style={{fontWeight: 'bold', fontSize: 20}}>A</span>
                <span className="font-semibold">Font Size</span>
            </button>
            <button onClick={() => setHandwriting(h => !h)} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoBrush size={24} />
                <span className="font-semibold">Handwriting</span>
            </button>
            <button onClick={handleUndo} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <MdUndo size={24} />
                <span className="font-semibold">Undo</span>
            </button>
            <button onClick={handleRedo} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <MdRedo size={24} />
                <span className="font-semibold">Redo</span>
            </button>
            <button onClick={handleDownload} className="flex items-center gap-4 pl-4 pr-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition">
                <IoDownloadOutline size={24} />
                <span className="font-semibold">Download</span>
            </button>
        </div>
      </div>
      
      {/* Main Editor Area */}
      <main className="flex-1 h-full w-full flex flex-col items-center justify-start" style={{ background: `repeating-linear-gradient(to bottom, transparent, transparent 38px, rgba(255,255,255,0.08) 39px, transparent 40px)`}}>
        <div className="w-full max-w-4xl px-4 md:px-8 pt-8 md:pt-12 pb-16">
          <input
            type="text"
            value={selectedNote.title}
            onChange={handleTitleChange}
            placeholder="Enter note title..."
            className={`bg-transparent font-extrabold outline-none w-full mb-2 ${handwriting ? 'font-handwriting' : ''} text-xl md:text-4xl placeholder-gray-400`}
            style={{ color: selectedNote.textColor, border: 'none', outline: 'none', boxShadow: 'none' }}
          />
          <textarea
            value={selectedNote.note}
            onChange={handleTextChange}
            placeholder="Start writing your notes..."
            className="bg-transparent outline-none w-full h-full p-2 text-base md:text-lg placeholder-gray-400"
            style={{ minHeight: '70vh', color: selectedNote.textColor, border: 'none', outline: 'none', boxShadow: 'none' }}
          />
          <div className="flex justify-between items-center min-h-[24px] text-gray-500 text-xs md:text-sm">
            <span>{wordCount} words, {charCount} chars</span>
            <span>Page {currentPage} of {pageCount}</span>
            <span className={`text-xs md:text-sm ${saveStatus === 'Error saving note' ? 'text-red-500' : isSaving ? 'text-yellow-500' : 'text-green-500'}`}>{saveStatus}</span>
          </div>
        </div>
        
        {/* Modals and other absolute elements */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4 text-red-600">Delete Note?</h2>
              <p className="mb-6 text-gray-700 text-center">Are you sure you want to delete <span className="font-semibold">{selectedNote.title || "Untitled"}</span>? This action cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold">Cancel</button>
                <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white font-semibold">Delete</button>
              </div>
            </div>
          </div>
        )}
        {showBgPicker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center bg-white rounded-xl shadow-lg px-6 py-4 border border-gray-200">
            <span className="mb-2 font-semibold text-gray-700">Background Color</span>
            <HexColorPicker color={selectedNote.color} onChange={val => { setColor(val); setSelectedNote(prev => ({ ...prev, color: val })); }} />
          </div>
        )}
        {showTextPicker && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center bg-white rounded-xl shadow-lg px-6 py-4 border border-gray-200">
            <span className="mb-2 font-semibold text-gray-700">Text Color</span>
            <HexColorPicker color={selectedNote.textColor} onChange={val => { settextColor(val); setSelectedNote(prev => ({ ...prev, textColor: val })); }} />
          </div>
        )}
        
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
          .font-handwriting { font-family: 'Indie Flower', cursive !important; }
        `}</style>
      </main>
    </div>
  );
}

export default TextEditor;