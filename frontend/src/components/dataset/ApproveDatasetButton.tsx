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
import { toast } from "@components/ui/use-toast";
import { SearchDatasetType } from "@schema/dataset.schema";
import { api } from "@utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ({
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
  const approveDataset = api.dataset.approve.useMutation({
    onSuccess: async () => {
      toast({
        description: "Succesfully approved dataset",
      });
      onSuccess();
      await utils.dataset.search.invalidate(options);
      setOpen(false);
    },
    onError: (e) => {
      setOpen(false);
      toast({
        title: "Failed to approve dataset",
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
            id="approveDatasetButton"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border-transparent bg-accent px-[20px] py-[10px] text-sm font-medium text-white ring-offset-background transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            variant="success"
          >
            Approve Dataset
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will make the dataset public.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-gray-500">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoaderButton
              loading={approveDataset.isLoading}
              onClick={() => approveDataset.mutate(datasetId)}
              id="confirmApproval"
              variant="success"
            >
              Approve
            </LoaderButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
