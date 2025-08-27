import { extensions, RTEMenuBar } from "@components/ui/formRte";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorProvider } from "@tiptap/react";

export default ({
  setText,
  placeholder,
  id,
  initialValue = "",
  editable = true,
}: {
  setText: (text: string) => void;
  placeholder?: string;
  id?: string;
  initialValue?: string;
  editable?: boolean;
}) => {
  const localExtenstions = [
    ...extensions,
    Placeholder.configure({
      placeholder: placeholder ? placeholder : 'Text...',
    }),
  ];

  return (
    <div>
      <EditorProvider
        slotBefore={<RTEMenuBar />}
        extensions={localExtenstions}
        editorProps={{ attributes: { id: id || "" } }}
        onUpdate={({ editor }) => setText(editor.getHTML())}
        content={initialValue}
        editable={editable}
      ></EditorProvider>
    </div>
  );
};
