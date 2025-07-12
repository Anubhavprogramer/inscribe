// TextEditorWithTiptap.jsx
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { ColorContext } from '../Contexts/ColorContext';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoDownloadOutline, IoStar, IoColorPalette, IoText, IoTrash, IoBrush, IoClose, IoAdd } from 'react-icons/io5';
import { MdUndo, MdRedo } from 'react-icons/md';
import { HexColorPicker } from 'react-colorful';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';

function TextEditor() {
  const { color, setColor, settextColor, textColor, selectedNote, setSelectedNote } = useContext(ColorContext);
  const { user } = useUser();
  const createTask = useMutation(api.Notes.createTask);
  const updateNote = useMutation(api.Notes.updateNote);
  const deleteNote = useMutation(api.Notes.deleteNote);
  const emailAddress = user.emailAddresses[0]?.emailAddress || "";
  const navigate = useNavigate();
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showTextPicker, setShowTextPicker] = useState(false);
  const [isPinned, setIsPinned] = useState(selectedNote.pinned || false);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight, TextStyle, Color],
    content: selectedNote.note || '',
    onUpdate: ({ editor }) => {
      setSelectedNote(prev => ({ ...prev, note: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (!user) window.location.href = '/login';
  }, [user]);

  useEffect(() => {
    setIsPinned(selectedNote.pinned || false);
  }, [selectedNote.pinned]);

  const getConvexFields = (note, isUpdate = false) => {
    const base = {
      title: note.title,
      note: note.note,
      time: new Date().toISOString(),
      color: note.color,
      textColor: note.textColor,
      email: emailAddress,
      pinned: note.pinned || false,
    };
    return isUpdate ? { _id: note._id, ...base } : base;
  };

  const saveNote = useCallback(async (noteToSave) => {
    if (!noteToSave.title?.trim() && !noteToSave.note?.trim()) return;
    setIsSaving(true);
    setSaveStatus('Saving...');
    try {
      if (noteToSave._id) {
        await updateNote(getConvexFields(noteToSave, true));
      } else {
        const newNoteId = await createTask(getConvexFields(noteToSave, false));
        setSelectedNote(prev => ({ ...prev, _id: newNoteId._id }));
      }
      setSaveStatus('Saved');
    } catch (e) {
      console.error(e);
      setSaveStatus('Error saving note');
    } finally {
      setIsSaving(false);
    }
  }, [createTask, updateNote, emailAddress, setSelectedNote]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      saveNote({ ...selectedNote, color, textColor, pinned: isPinned });
    }, 1000);
    return () => clearTimeout(timeout);
  }, [selectedNote.title, selectedNote.note, color, textColor, isPinned]);

  const handleTitleChange = (e) => setSelectedNote(prev => ({ ...prev, title: e.target.value }));

  const handleDownload = () => {
    const blob = new Blob([
      (selectedNote.title || "Untitled") + "\n\n" + (editor?.getText() || '')
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (selectedNote.title || 'note') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!selectedNote._id) return;
    try {
      await deleteNote({ _id: selectedNote._id });
      setShowDeleteConfirm(false);
      navigate('/');
    } catch (error) {
      setSaveStatus('Error deleting note');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <input
          type="text"
          value={selectedNote.title}
          onChange={handleTitleChange}
          placeholder="Enter title..."
          className="text-2xl font-bold w-full outline-none border-none bg-transparent"
        />
        <div className="flex gap-2">
          <button onClick={handleDownload}>Download</button>
          <button onClick={() => setShowDeleteConfirm(true)}>Delete</button>
        </div>
      </div>

      <div className="p-4 flex flex-wrap gap-2 border-b">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
        <button onClick={() => editor.chain().focus().setColor('#f00').run()}>Red</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button onClick={() => editor.chain().focus().setParagraph().run()}>P</button>
        <button onClick={() => editor.chain().focus().undo().run()}><MdUndo /></button>
        <button onClick={() => editor.chain().focus().redo().run()}><MdRedo /></button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <EditorContent editor={editor} className="prose prose-lg w-full max-w-none" />
      </div>

      <div className="p-2 text-sm text-right text-gray-500">
        {saveStatus}
      </div>
    </div>
  );
}

export default TextEditor;
