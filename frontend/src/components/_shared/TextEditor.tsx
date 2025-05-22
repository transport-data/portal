import { extensions, RTEMenuBar } from "@components/ui/formRte";
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
  return (
    <div>
      <EditorProvider
        slotBefore={<RTEMenuBar />}
        extensions={extensions}
        editorProps={{ attributes: { id: id || "" } }}
        onUpdate={({ editor }) => setText(editor.getHTML())}
        content={initialValue}
        editable={editable}
      ></EditorProvider>
    </div>
  );
};
