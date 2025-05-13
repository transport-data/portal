import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@lib/utils";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import * as Icons from "./rteIcons";

export const RTEMenuBar = ({ disabled }: any) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="Button-group flex h-[40px] items-center gap-3.5 rounded-t-lg border-[1.5px] border-b-0 border-[#E5E7EB] bg-[#F9FAFB] px-5">
        <button
          disabled={disabled}
          aria-label="Code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={cn(
            disabled && "cursor-not-allowed",
            "rounded-md p-1 hover:text-accent",
            editor.isActive("code") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleCode().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.Code />
        </button>
        <button
          disabled={disabled}
          aria-label="Code"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            disabled && "cursor-not-allowed",

            "rounded-md p-1 hover:text-accent",
            editor.isActive("bold") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleBold().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.Bold />
        </button>
        <button
          disabled={disabled}
          aria-label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            disabled && "cursor-not-allowed",

            "rounded-md p-1 hover:text-accent",
            editor.isActive("underline") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleUnderline().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.Underline />
        </button>
        <button
          disabled={disabled}
          aria-label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            disabled && "cursor-not-allowed",

            "rounded-md p-1 hover:text-accent",
            editor.isActive("italic") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleItalic().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.Italic />
        </button>
        <button
          disabled={disabled}
          aria-label="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn(
            disabled && "cursor-not-allowed",

            "rounded-md p-1 hover:text-accent",
            editor.isActive("strike") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleStrike().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.Strikethrough />
        </button>
        <button
          disabled={disabled}
          aria-label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            disabled && "cursor-not-allowed",
            "rounded-md p-1 hover:text-accent",
            editor.isActive("bulletList") ? "bg-gray-400 text-white" : "",
            !editor.can().chain().focus().toggleBulletList().run()
              ? "cursor-not-allowed"
              : ""
          )}
        >
          <Icons.ListItem />
        </button>
      </div>
    </div>
  );
};

interface ControlleRTEEditorProps<T extends FieldValues> {
  formObj: UseFormReturn<T>;
  name: Path<T>;
  defaultValue?: PathValue<T, Path<T>>;
  className?: string;
  placeholder?: string;
}

export function RTEForm<T extends FieldValues>({
  formObj,
  name,
  defaultValue,
  disabled,
  placeholder,
  className,
}: ControlleRTEEditorProps<T> & { disabled?: boolean }) {
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] } as any),
    Document,
    Paragraph,
    Text,
    Bold,
    Underline,
    Italic,
    Strike,
    Code,
    StarterKit.configure({
      heading: false,
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
    BulletList,
    Placeholder.configure({
      placeholder,
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: "list-disc",
      },
    }),
  ];
  return (
    <div>
      <FormField
        control={formObj.control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <EditorProvider
                editable={!disabled}
                editorContainerProps={{
                  className: cn(disabled && "cursor-not-allowed opacity-60"),
                }}
                slotBefore={<RTEMenuBar disabled={disabled} />}
                extensions={extensions}
                onUpdate={({ editor }) => field.onChange(editor.getHTML())}
                content={field.value}
              ></EditorProvider>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
