"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";

export default function TextEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="border rounded p-4 min-h-[300px] prose max-w-none"
      />
    </div>
  );
}
