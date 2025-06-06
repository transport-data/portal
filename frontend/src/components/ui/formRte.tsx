import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { toast } from "@components/ui/use-toast";
import { cn } from "@lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Plugin, PluginKey } from "prosemirror-state";
import { useState } from "react";
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form";
import * as Icons from "./rteIcons";

import { Extension } from "@tiptap/core";

const PlainTextPaste = Extension.create({
  name: "plainTextPaste",

  addOptions() {
    return {
      enabled: true,
    };
  },

  addProseMirrorPlugins() {
    const { enabled } = this.options;

    return [
      new Plugin({
        key: new PluginKey("plainTextPaste"),
        props: {
          handlePaste: (view, event) => {
            if (!enabled) {
              return false;
            }

            event.preventDefault();
            const text = event?.clipboardData?.getData("text/plain");

            if (text) {
              const { tr } = view.state;
              view.dispatch(tr.insertText(text));
            }

            return true;
          },
        },
      }),
    ];
  },
});

export const RTEMenuBar = ({ disabled }: any) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const handleOpenLinkDialog = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setUrl(previousUrl);
    setOpen(true);
  };

  const applyLink = () => {
    if (!url) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setOpen(false);
      return;
    }

    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
      setOpen(false);
    } catch (e: any) {
      toast({
        title: "Failed to add the link",
        description: e.message,
        variant: "danger",
      });
    }
  };

  const isURLValid =
    !url ||
    new RegExp(
      "^(https?)://(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,}(?::d{1,5})?(?:/[^s]*)?$"
    ).test(url);

  return (
    <>
      <div className="control-group">
        <div className="Button-group flex h-[40px] items-center gap-3.5 rounded-t-lg border-[1.5px] border-b-0 border-[#E5E7EB] bg-[#F9FAFB] px-5">
          <button
            disabled={disabled}
            aria-label="Code"
            type="button"
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
            aria-label="Link"
            onClick={handleOpenLinkDialog}
            className={cn(
              disabled && "cursor-not-allowed",
              "rounded-md p-1 hover:text-accent",
              editor.isActive("link") ? "bg-gray-400 text-white" : ""
            )}
          >
            <Icons.Link />
          </button>
          <button
            disabled={disabled}
            aria-label="Code"
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
            <Icons.ListItem color="currentColor" width={14} height={14} />
          </button>
        </div>
      </div>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/50" />
          <Dialog.Content className="fixed left-[50%] top-[30%] z-[100] w-[90vw] max-w-md -translate-x-1/2 rounded bg-white p-6 shadow-lg">
            <Dialog.Title className="mb-2 text-xl font-semibold">
              Insert a link
            </Dialog.Title>
            <Input
              disabled={disabled}
              className={cn(disabled && "cursor-not-allowed")}
              type="url"
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              value={url}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-500"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!isURLValid}
                onClick={applyLink}
                className={cn(
                  !isURLValid ? "cursor-not-allowed opacity-70" : ""
                )}
              >
                Apply
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

interface ControlleRTEEditorProps<T extends FieldValues> {
  formObj: UseFormReturn<T>;
  name: Path<T>;
  defaultValue?: PathValue<T, Path<T>>;
  className?: string;
  placeholder?: string;
}

export const extensions = [
  PlainTextPaste,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as any),
  Document,
  Paragraph,
  Text,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    protocols: ["http", "https"],
    validate: (url) =>
      !url ||
      new RegExp(
        "^(https?)://(?:[a-zA-Z0-9-]+.)+[a-zA-Z]{2,}(?::d{1,5})?(?:/[^s]*)?$"
      ).test(url),
  }),
  Bold,
  Underline,
  Italic,
  Strike,
  Code,
  StarterKit.configure({
    heading: false,
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  BulletList,
  Placeholder.configure({
    placeholder: "Rejection message to the dataset's creator...",
  }),
  ListItem.configure({
    HTMLAttributes: {
      class: "list-disc",
    },
  }),
];

export function RTEForm<T extends FieldValues>({
  formObj,
  name,
  defaultValue,
  disabled,
  placeholder,
  className,
}: ControlleRTEEditorProps<T> & { disabled?: boolean }) {
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
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
