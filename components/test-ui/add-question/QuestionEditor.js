"use client";

import React, { useEffect } from "react";
import { ImageIcon, BoldIcon, ItalicIcon, UnderlineIcon } from "../../Icons";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";

const QuestionEditor = ({ initialContent, onUpdate, orderNumber }) => {
  const editor = useEditor({
    extensions: [
      Underline,
      StarterKit.configure({
        table: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: "h-[150px] object-cover rounded transition-all",
          "data-selected": "false",
        },
        selectable: true,
        draggable: false,
      }),
    ],
    content: initialContent || "Энд дарж асуултын текстийг өөрчилнө үү.",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[100px] p-4",
      },
      handleClick: (view, pos, event) => {
        const images = document.querySelectorAll(".ProseMirror img");
        images.forEach((img) => img.setAttribute("data-selected", "false"));

        if (event.target.tagName === "IMG") {
          event.target.setAttribute("data-selected", "true");
        } else {
          const node = view.state.doc.nodeAt(pos);
          if (node && node.isText) {
            const parentOffset = view.posAtDOM(event.target);
            const from = parentOffset;
            const to = parentOffset + node.nodeSize;
            const transaction = view.state.tr.setSelection(
              view.state.selection.constructor.create(view.state.doc, from, to)
            );
            view.dispatch(transaction);
          }
        }
      },
    },
  });

  const FloatingMenu = () => {
    if (!editor) return null;

    const handleFormat = (e, type) => {
      e.preventDefault();
      e.stopPropagation();

      switch (type) {
        case "bold":
          editor.commands.toggleBold();
          break;
        case "italic":
          editor.commands.toggleItalic();
          break;
        case "underline":
          editor.commands.toggleUnderline();
          break;
      }
    };

    return (
      <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border text-gray-400">
        <button
          type="button"
          onMouseDown={(e) => handleFormat(e, "bold")}
          className={`p-1 rounded hover:text-gray-600 ${
            editor.isActive("bold") ? "text-main" : ""
          }`}
        >
          <BoldIcon />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleFormat(e, "italic")}
          className={`p-1 rounded hover:text-gray-600 ${
            editor.isActive("italic") ? "text-main" : ""
          }`}
        >
          <ItalicIcon />
        </button>
        <button
          type="button"
          onMouseDown={(e) => handleFormat(e, "underline")}
          className={`p-1 rounded hover:text-gray-600 ${
            editor.isActive("underline") ? "text-main" : ""
          }`}
        >
          <UnderlineIcon />
        </button>
      </div>
    );
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ProseMirror img[data-selected="true"] {
        outline: 2px solid #2563eb;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        editor?.chain().focus().setImage({ src: imageUrl }).run();
      }
    };

    input.click();
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col items-center">
        <div className="text-gray-500">A{orderNumber}</div>
        <button
          onClick={handleImageUpload}
          className="px-1 hover:bg-gray-100 rounded mt-2"
        >
          <ImageIcon width={16} />
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden relative ml-8 w-full">
        {editor && (
          <BubbleMenu
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: "top",
              interactive: true,
            }}
            shouldShow={({ state }) => {
              const { selection } = state;
              return !selection.empty;
            }}
            className="bg-white z-50"
          >
            <FloatingMenu />
          </BubbleMenu>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default QuestionEditor;
