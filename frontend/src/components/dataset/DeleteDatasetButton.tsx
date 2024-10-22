import { api } from "@utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, LoaderButton } from "@components/ui/button";
import { useState } from "react";
import { toast } from "@components/ui/use-toast";
import { SearchDatasetType } from "@schema/dataset.schema";
import { useSession } from "next-auth/react";

export function DeleteDatasetButton({
  datasetId,
  children,
  onSuccess,
}: {
  datasetId: string;
  onSuccess: () => void;
  children?: React.ReactNode;
}) {
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
  const deleteDataset = api.dataset.delete.useMutation({
    onSuccess: async () => {
      toast({
        description: "Succesfully deleted dataset",
      });
      onSuccess();
      await utils.dataset.search.invalidate(options);
      setOpen(false);
    },
    onError: (e) => {
      setOpen(false);
      toast({
        title: "Failed to delete dataset",
        description: e.message,
        variant: "danger",
      });
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || <Button variant="danger">Delete Dataset</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove the
            dataset.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-500">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoaderButton
              loading={deleteDataset.isLoading}
              onClick={() => deleteDataset.mutate({ ids: [datasetId] })}
              className="bg-red-600 text-white hover:bg-red-400"
              id="confirmDelete"
              variant="danger"
            >
              Delete
            </LoaderButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
