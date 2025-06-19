'use client';

import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Underline,
  Quote,
  Undo,
  Redo,
  Code
} from 'lucide-react';

type ToolbarProps = {
  editor: Editor | null;
};

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border rounded-t-lg p-1 bg-gray-50">
      {/* Bold */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        aria-label="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>

      {/* Italic */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        aria-label="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>

      {/* Underline */}
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        aria-label="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>

      {/* Strike */}
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        aria-label="Strikethrough"
      >
        <Strikethrough className="w-4 h-4" />
      </button>

      {/* Heading */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        aria-label="Heading"
      >
        <Heading2 className="w-4 h-4" />
      </button>

      {/* Bullet List */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        aria-label="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>

      {/* Ordered List */}
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        aria-label="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        aria-label="Blockquote"
      >
        <Quote className="w-4 h-4" />
      </button>

      {/* Code */}
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
        aria-label="Code"
      >
        <Code className="w-4 h-4" />
      </button>

      {/* Undo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Undo"
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </button>

      {/* Redo */}
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200"
        aria-label="Redo"
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
}