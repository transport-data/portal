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
import { Button } from "@components/ui/button";

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
  const deleteOrganizations = api.organization.delete.useMutation({
    onSuccess: async () => {
      onSuccess();
      await utils.organization.list.invalidate();
    },
  });
  return (
    <AlertDialog>
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
            <Button
              onClick={() => deleteOrganizations.mutate({ ids: [groupId] })}
              className="bg-red-600 hover:bg-red-400 text-white"
              id="confirmDelete"
              variant="danger"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
