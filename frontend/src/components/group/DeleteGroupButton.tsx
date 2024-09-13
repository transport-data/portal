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
  const deleteGroups = api.group.delete.useMutation({
    onSuccess: async () => {
      onSuccess();
      await utils.group.list.invalidate();
    },
  });
  return (
    <AlertDialog>
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
            <Button
              onClick={() => deleteGroups.mutate({ ids: [groupId] })}
              className="bg-red-600 hover:bg-red-400 text-white"
              variant="danger"
              id="confirmDelete"
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
