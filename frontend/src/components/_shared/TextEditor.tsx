import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Dispatch, SetStateAction } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Paperclip,
  Image,
  Code,
  Smile,
  Menu,
  Settings,
  ArrowDownToLine,
  Calendar,
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="Button-group flex h-[40px] items-center gap-3.5 rounded-t-lg border-[1.5px] border-b-0 border-[#E5E7EB] bg-[#F9FAFB] px-5">
        <input type="image" className="hidden" />
        <Paperclip size={14} />
        <input type="file" className="hidden" />
        <Image size={14} />
        <Code size={14} />
        <Smile size={14} />
        <svg
          className="mx-2.5"
          xmlns="http://www.w3.org/2000/svg"
          width="1"
          height="17"
          viewBox="0 0 1 17"
          fill="none"
        >
          <line x1="0.5" y1="0.5" x2="0.5" y2="16.5" stroke="#D1D5DB" />
        </svg>
        <Menu size={14} />
        <Settings size={14} />
        <Calendar size={14} />
        <ArrowDownToLine size={14} />
      </div>
    </div>
  );
};

export default ({
  setText,
  placeholder,
  id,
}: {
  setText: (text: string) => void;
  placeholder?: string;
  id?: string;
}) => {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] } as any),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
    Placeholder.configure({
      placeholder,
    }),
  ];
  return (
    <div>
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        editorProps={{ attributes: { id: id || "" } }}
        onUpdate={({ editor }) => setText(editor.getHTML())}
      ></EditorProvider>
    </div>
  );
};
