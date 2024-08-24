import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import { MemberEditFormType, MemberEditSchema } from "@schema/user.schema";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import { inputStyle, selectStyle } from "@styles/formStyles";
import { ErrorMessage } from "@hookform/error-message";
import { Organization, User } from "@portaljs/ckan";
import notify from "@utils/notify";

interface EditMemberFormProps {
  user: User & { capacity: "admin" | "editor" | "member" };
  organization: Organization;
}

export const EditMemberForm: React.FC<EditMemberFormProps> = ({
  user,
  organization,
}: EditMemberFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [memberEdited, setMemberEdited] = useState("");

  const roleOptions = [
    { label: "Member", value: "member" },
    { label: "Editor", value: "editor" },
    { label: "Admin", value: "admin" },
  ];

  const formObj = useForm<MemberEditFormType>({
    resolver: zodResolver(MemberEditSchema),
    defaultValues: {
      id: organization.id,
      username: user.name,
      role: user.capacity,
    },
  });

  const utils = api.useContext();
  const editMember = api.organization.patchMemberRole.useMutation({
    onSuccess: async () => {
      notify(`Successfully edited the ${memberEdited} member`);
      // formObj.reset();
      setErrorMessage(null);
      await utils.organization.get.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setMemberEdited(data.username);
          editMember.mutate(data);
        })}
      >
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block w-fit text-sm font-medium opacity-75"
            >
              Name
            </label>
            <div className="mt-1 w-full">
              <input
                type="text"
                className={inputStyle}
                {...formObj.register("username")}
                disabled
              />
              <ErrorMessage
                errors={formObj.formState.errors}
                name="username"
                render={({ message }) => (
                  <p className="text-justify text-xs text-red-600">{message}</p>
                )}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="title"
              className="block w-fit text-sm font-medium opacity-75"
            >
              Role
            </label>
            <select {...formObj.register("role")} className={selectStyle}>
              {roleOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-span-full">
          {match(editMember.isLoading)
            .with(false, () => (
              <Button type="submit" color="stone" className="mt-8 w-full py-4">
                Edit member
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
                Edit member
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
