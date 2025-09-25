import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAutosave } from "../hooks/useAutosave";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import SimpleImage from "@editorjs/simple-image";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Alert from "editorjs-alert";
import Paragraph from "@editorjs/paragraph";
import AceCodeEditorJS from "ace-code-editorjs";
import ace from "ace-builds";
import "ace-builds/esm-resolver";

// Ace workers
import modeHTMLWorker from "ace-builds/src-noconflict/worker-html?url";
import modeJSWorker from "ace-builds/src-noconflict/worker-javascript?url";
import modeCSSWorker from "ace-builds/src-noconflict/worker-css?url";

ace.config.setModuleUrl("ace/mode/html_worker", modeHTMLWorker);
ace.config.setModuleUrl("ace/mode/javascript_worker", modeJSWorker);
ace.config.setModuleUrl("ace/mode/css_worker", modeCSSWorker);

function TextEditor() {
  const { noteId } = useParams();
  const editorRef = useRef(null);
  const [content, setContent] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialContentLoaded, setInitialContentLoaded] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState(null);

  // Fetch note metadata
  const note = useQuery(api.Notes.getById, { _id: noteId });

  // Fetch note content - always call this, it will handle missing content
  const noteContent = useQuery(
    api.Notes.getNoteContent,
    note ? { _id: note._id } : "skip"
  );

  const updateNote = useMutation(api.Notes.updateNote);

  // Reset state when noteId changes
  useEffect(() => {
    setContent(null);
    setHasUnsavedChanges(false);
    setInitialContentLoaded(false);
    setLastSavedContent(null);
    if (editorRef.current?.destroy) {
      editorRef.current.destroy();
      editorRef.current = null;
    }
  }, [noteId]);

  // Set content after both note and noteContent are ready
  useEffect(() => {
    if (note && noteContent && !initialContentLoaded) {
      setContent(noteContent);
      setLastSavedContent(JSON.stringify(noteContent)); // Track saved content
      setInitialContentLoaded(true);
      setHasUnsavedChanges(false);
    }
  }, [note, noteContent, initialContentLoaded]);

  // Save function for autosave
  const saveNote = async () => {
    if (!note || !content || !hasUnsavedChanges) return;
    
    // Check if content actually changed
    const currentContentString = JSON.stringify(content);
    if (currentContentString === lastSavedContent) {
      setHasUnsavedChanges(false);
      return;
    }

    try {
      await updateNote({ 
        _id: note._id, 
        content: content,
        time: new Date().toISOString()
      });
      setLastSavedContent(currentContentString); // Update saved content reference
      setHasUnsavedChanges(false); // Mark as saved
      console.log("Note saved successfully");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  useAutosave(saveNote, 3000, [hasUnsavedChanges]); // Increased delay and only depend on hasUnsavedChanges

  // Ace editor config
  const aceConfig = {
    languages: {
      plain: { label: "Plain Text", mode: "ace/mode/plain_text" },
      html: { label: "HTML", mode: "ace/mode/html" },
      javascript: { label: "JavaScript", mode: "ace/mode/javascript" },
      css: { label: "CSS", mode: "ace/mode/css" },
      python: { label: "Python", mode: "ace/mode/python" },
      java: { label: "Java", mode: "ace/mode/java" },
      cpp: { label: "C++", mode: "ace/mode/c_cpp" },
      swift: { label: "Swift", mode: "ace/mode/swift" },
    },
    options: {
      fontSize: 16,
      minLines: 6,
      maxLines: 20,
      theme: "ace/theme/twilight",
      showGutter: true,
      showLineNumbers: true,
      showPrintMargin: false,
      highlightActiveLine: true,
      wrap: true,
      readOnly: false,
    },
  };

  // Initialize EditorJS once initial content is loaded
  useEffect(() => {
    if (!initialContentLoaded || !content) return;

    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          header: { class: Header, inlineToolbar: true, config: { placeholder: "Enter a header", levels: [1, 2, 3], defaultLevel: 1 } },
          list: { class: EditorjsList, inlineToolbar: true, config: { defaultStyle: "unordered" } },
          checklist: { class: Checklist, inlineToolbar: true },
          image: SimpleImage,
          quote: Quote,
          warning: Warning,
          alert: Alert,
          paragraph: { class: Paragraph, inlineToolbar: true, config: { placeholder: "Type your text here..." } },
          code: { class: AceCodeEditorJS, config: aceConfig },
        },
        data: content,
        onChange: async () => {
          try {
            const savedData = await editorRef.current.save();
            setContent(savedData);
            if (!hasUnsavedChanges) {
              setHasUnsavedChanges(true); // Mark as having unsaved changes
            }
          } catch (error) {
            console.error("Error saving editor data:", error);
          }
        },
      });
    }

    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialContentLoaded]); // Only depend on initialContentLoaded, not content

  // Loading state
  if (!note || !noteContent) {
    return <div>Loading...</div>;
  }

  if (note === null) {
    return <div>Note not found.</div>;
  }

  return (
    <div className="text-editor h-screen p-5">
      <div id="editorjs" className="h-full w-full"></div>
    </div>
  );
}

export default TextEditor;
