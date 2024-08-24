import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupForm } from "./GroupForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import { useRouter } from "next/router";
import { GroupFormType, GroupSchema } from "@schema/group.schema";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import notify from "@utils/notify";

export const CreateGroupForm: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [groupCreated, setGroupCreated] = useState("");
  const formObj = useForm<GroupFormType>({
    resolver: zodResolver(GroupSchema),
  });

  const utils = api.useContext();
  const createGroup = api.group.create.useMutation({
    onSuccess: async () => {
      notify(`Successfully created the ${groupCreated} group`);
      formObj.reset();
      setErrorMessage(null);
      await utils.group.list.invalidate();
      await router.push("/dashboard/groups");
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setGroupCreated(data.name);
          createGroup.mutate(data);
        })}
      >
        <GroupForm formObj={formObj} />
        <div className="col-span-full">
          {match(createGroup.isLoading)
            .with(false, () => (
              <Button type="submit" color="stone" className="mt-8 w-full py-4">
                Create group
              </Button>
            ))
            .otherwise(() => (
              <Button
                type="submit"
                color="stone"
                disabled
                className="mt-8 flex w-full py-4"
              >
                <Spinner className="text-slate-900" />
                Create group
              </Button>
            ))}
        </div>
        {errorMessage && (
          <div className="py-4">
            <ErrorAlert text={errorMessage} />
          </div>
        )}
      </form>
    </>
  );
};
