import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import SimpleImage from "@editorjs/simple-image";
import Quote from "@editorjs/quote";
import Warning from "@editorjs/warning";
import Alert from "editorjs-alert";
import Paragraph from '@editorjs/paragraph';
import AceCodeEditorJS from "ace-code-editorjs";
import ace from "ace-builds";
import "ace-builds/esm-resolver";

import modeHTMLWorker from "ace-builds/src-noconflict/worker-html?url";
import modeJSWorker from "ace-builds/src-noconflict/worker-javascript?url";
import modeCSSWorker from "ace-builds/src-noconflict/worker-css?url";

ace.config.setModuleUrl("ace/mode/html_worker", modeHTMLWorker);
ace.config.setModuleUrl("ace/mode/javascript_worker", modeJSWorker);
ace.config.setModuleUrl("ace/mode/css_worker", modeCSSWorker);

function TextEditor() {
  const editorRef = useRef(null);

  //Code initialization
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
    fontSize: 16,             // change font size
    minLines: 6,              // min height in lines
    maxLines: 20,             // max height
    theme: "ace/theme/twilight", // change theme
    showGutter: true,         // show line numbers
    showLineNumbers: true,
    showPrintMargin: false,   // remove vertical margin line
    highlightActiveLine: true,
    wrap: true,               // line wrap
    readOnly: false,
  },
};


  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: "editorjs",
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3],
              defaultLevel: 1,
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
          quote: Quote,
          warning: Warning,
          alert: Alert,

          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: "Type your text here...",
            },
          },

          code: {
            class: AceCodeEditorJS,
            config: aceConfig,
          },
        },
      });
    }

    // Cleanup when component unmounts
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div className="text-editor h-screen  p-5">
      <div id="editorjs" className="h-full w-full "></div>
    </div>
  );
}

export default TextEditor;
