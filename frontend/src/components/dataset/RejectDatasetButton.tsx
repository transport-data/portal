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
import { extensions, RTEMenuBar } from "@components/ui/formRte";
import { toast } from "@components/ui/use-toast";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { SearchDatasetType } from "@schema/dataset.schema";
import { EditorProvider } from "@tiptap/react";
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
