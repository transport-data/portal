import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, LoaderButton } from "@components/ui/button";
import { RTEMenuBar } from "@components/ui/formRte";
import { toast } from "@components/ui/use-toast";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { SearchDatasetType } from "@schema/dataset.schema";
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
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "@utils/api";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function ({
  dataset: { title, id },
  onSuccess,
  children,
}: {
  children?: ReactNode;
  dataset: Dataset;
  onSuccess: () => void;
}) {
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
      placeholder: "Rejection message to the dataset's creator...",
    }),
    ListItem.configure({
      HTMLAttributes: {
        class: "list-disc",
      },
    }),
  ];
  const [reason, setRejectReason] = useState<string | undefined>();
  const utils = api.useContext();
  const { data: session } = useSession();
  const options: SearchDatasetType = {
    offset: 0,
    limit: 20,
    includePrivate: true,
    includeDrafts: true,
    advancedQueries: [
      { key: "creator_user_id", values: [`${session?.user.id}`] },
    ],
  };
  const [open, setOpen] = useState(false);
  const { mutate, isLoading } = api.dataset.reject.useMutation({
    onSuccess: async () => {
      toast({
        description: "Succesfully rejected dataset",
      });
      onSuccess();
      await utils.dataset.search.invalidate(options);
      setOpen(false);
    },
    onError: (e) => {
      setOpen(false);
      toast({
        title: "Failed to reject dataset",
        description: e.message,
        variant: "danger",
      });
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || (
          <Button
            id="rejectButton"
            variant="default"
            className="bg-yellow-400 hover:bg-yellow-300"
          >
            Reject Dataset
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Why do you reject the creation of the{" "}
            <span className="font-bold">"{title}"</span> dataset?
            <div className="mt-4">
              <EditorProvider
                slotBefore={<RTEMenuBar />}
                extensions={extensions}
                onUpdate={({ editor }) => setRejectReason(editor.getHTML())}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading} className="hover:bg-gray-500">
            Cancel
          </AlertDialogCancel>
          <LoaderButton
            loading={isLoading}
            disabled={
              reason ? reason.length > 0 && reason.trim() !== "<p></p>" : false
            }
            onClick={() => mutate({ datasetId: id, reason: reason! })}
            className="bg-yellow-400 hover:bg-yellow-300"
            id="confirmReject"
            variant="default"
          >
            Reject
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
