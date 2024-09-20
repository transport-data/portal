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

export function DeleteOrganizationButton({
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
  const deleteOrganizations = api.organization.delete.useMutation({
    onSuccess: async () => {
      toast({
        description: "Succesfully deleted organization",
      })
      onSuccess();
      await utils.organization.list.invalidate();
      setOpen(false)
    },
    onError: (e) => {
      setOpen(false)
      toast({
        title: "Failed to delete organization",
        description: e.message,
        variant: "danger",
      })
    }
  });
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children || <Button variant="danger">Delete Organization</Button>}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. It will permanently remove the organization.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoaderButton
              loading={deleteOrganizations.isLoading}
              onClick={() => deleteOrganizations.mutate({ ids: [groupId] })}
              className="bg-red-600 hover:bg-red-400 text-white"
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
