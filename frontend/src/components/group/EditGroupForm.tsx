import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupForm } from "./GroupForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import type { Group } from "@portaljs/ckan";
import { GroupFormType, GroupSchema } from "@schema/group.schema";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import notify from "@utils/notify";
import { Form } from "@components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

export const EditGroupForm: React.FC<{
  initialValues: Group;
}> = ({ initialValues }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [groupEdited, setGroupEdited] = useState("");
  const formObj = useForm<GroupFormType>({
    resolver: zodResolver(GroupSchema),
    defaultValues: initialValues,
  });

  const utils = api.useContext();
  const editGroup = api.group.patch.useMutation({
    onSuccess: async () => {
      toast({
        description: `Successfully edited the ${groupEdited} topic`,
      });
      setErrorMessage(null);
      await utils.group.list.invalidate();
      await router.push("/dashboard/topics");
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setGroupEdited(data.name);
          editGroup.mutate(data);
        })}
      >
        <GroupForm formObj={formObj} />
        <div className="col-span-full">
          {match(editGroup.isLoading)
            .with(false, () => (
              <Button type="submit" className="mt-8 w-full py-4">
                Edit Topic
              </Button>
            ))
            .otherwise(() => (
              <Button type="submit" className="mt-8 flex w-full py-4">
                <Spinner className="hover:text-slate-900" />
                Edit Topic
              </Button>
            ))}
        </div>
        {errorMessage && (
          <div className="py-4">
            <ErrorAlert text={errorMessage} />
          </div>
        )}
      </form>
    </Form>
  );
};
