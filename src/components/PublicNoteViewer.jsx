import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Loading, { LoadingSpinner } from "./Loading";
import { useContext } from "react";
import { ColorContext } from "../Contexts/ColorContext";
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

function PublicNoteViewer() {
  const { noteId } = useParams();
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isDarkMode } = useContext(ColorContext);

  // Fetch public note data (no auth required)
  const note = useQuery(api.Notes.getPublicNoteById, { _id: noteId });
  const noteContent = useQuery(
    api.Notes.getPublicNoteContent,
    note ? { _id: note._id } : "skip"
  );

  // Initialize read-only editor
  useEffect(() => {
    if (note && noteContent && !isInitialized && !editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        readOnly: true, // Make editor read-only
        data: noteContent,
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Enter a header",
              levels: [2, 3, 4],
              defaultLevel: 3,
            },
          },
          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          image: SimpleImage,
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+O",
            config: {
              quotePlaceholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+W",
            config: {
              titlePlaceholder: "Title",
              messagePlaceholder: "Message",
            },
          },
          alert: {
            class: Alert,
            inlineToolbar: true,
            shortcut: "CMD+SHIFT+A",
            config: {
              defaultType: "primary",
              messagePlaceholder: "Enter something",
            },
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          code: {
            class: AceCodeEditorJS,
            config: {
              enableLiveAutocompletion: true,
              enableSnippets: true,
              enableBasicAutocompletion: true,
            },
          },
        },
      });

      editorRef.current = editor;
      setIsInitialized(true);
    }
  }, [note, noteContent, isInitialized]);

  // Cleanup editor
  useEffect(() => {
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Loading states
  if (note === undefined || noteContent === undefined) {
    return (
      <Loading 
        text="Loading shared note..." 
        size="lg" 
        fullScreen={true}
      />
    );
  }

  // Note not found or not public
  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-gray-700">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Note Not Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  This note doesn't exist or is not publicly shared.
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Want to create your own notes?
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col mx-10">
                <span className="text-3xl font-extrabold tracking-tight cursor-pointer select-none text-purple-600 hover:text-purple-800 transition" onClick={() => navigate("/")}>inscribe</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shared Note</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Want to create your own?</p>
                <Link
                  to="/"
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Sign up free →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Note Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {note.title || "Untitled Note"}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Shared publicly</span>
                    <span>•</span>
                    <span>Last updated {formatDate(note.time)}</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Read-only
                  </div>
                </div>
              </div>
            </div>

            {/* Editor */}
            <div className="p-6">
              <div 
                id="editorjs" 
                className="prose prose-lg dark:prose-invert max-w-none"
                style={{ minHeight: '300px' }}
              />
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Create Your Own Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Join thousands of users who trust Inscribe for their note-taking needs
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicNoteViewer;