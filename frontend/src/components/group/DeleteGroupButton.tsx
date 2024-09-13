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

export function DeleteGroupButton({
  groupId,
  children,
  onSuccess,
}: {
  groupId: string;
  onSuccess: () => void;
  children?: React.ReactNode;
}) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);
  const deleteGroups = api.group.delete.useMutation({
    onSuccess: async () => {
      onSuccess();
      await utils.group.list.invalidate();
      setOpen(false)
    },
    onError: (e) => {
      setOpen(false)
      toast({
        title: "Failed to delete topic",
        description: e.message,
        variant: "danger",
      })
    }
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || <Button variant="danger">Delete Topic</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove the topic.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoaderButton
              loading={deleteGroups.isLoading}
              onClick={() => deleteGroups.mutate({ ids: [groupId] })}
              className="bg-red-600 hover:bg-red-400 text-white"
              variant="danger"
              id="confirmDelete"
            >
              Delete
            </LoaderButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
