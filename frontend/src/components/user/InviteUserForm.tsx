import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import { UserInviteFormType, UserInviteSchema } from "@schema/user.schema";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import { inputStyle, selectStyle } from "@styles/formStyles";
import { ErrorMessage } from "@hookform/error-message";
import notify from "@utils/notify";

interface InviteUserFormProps {
  groupId?: string;
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  groupId,
}: InviteUserFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userInvited, setUserCreated] = useState("");

  const { data: organizations, isLoading: isLoadingOrganizations } =
    api.organization.listForUser.useQuery();

  const organizationOptions =
    organizations?.map((org) => ({
      value: org.id,
      label: org.title,
    })) ?? [];

  const { data: users, isLoading: isLoadingUsers } =
    api.user.list.useQuery();

  const userOptions =
    users?.map((org) => ({
      value: org.name,
      label: org.name,
    })) ?? [];

  userOptions.unshift({ value: "", label: "" });

  const roleOptions = [
    { label: "Member", value: "member" },
    { label: "Editor", value: "editor" },
    { label: "Admin", value: "admin" },
  ];

  const defaultValues = { group_id: "" };
  if (groupId) {
    defaultValues.group_id = groupId;
  }

  const formObj = useForm<UserInviteFormType>({
    resolver: zodResolver(UserInviteSchema),
    defaultValues,
  });

  const utils = api.useContext();
  const inviteUser = api.user.inviteUser.useMutation({
    onSuccess: async () => {
      notify(`Successfully invited the ${userInvited} user`);
      formObj.reset();
      setErrorMessage(null);
      await utils.organization.get.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  //  NOTE: this loading is necessary so that
  //  default values for orgs can work
  if (isLoadingOrganizations || isLoadingUsers) {
    return <Spinner className="mx-auto my-2 dark:text-primary-dark" />;
  }

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit(
          (data) => {
            setUserCreated(data.email ?? data.name ?? "");
            inviteUser.mutate(data);
          },
          (e) => {
            console.log(e);
          }
        )}
      >
        <p className="my-5 text-sm opacity-75">
          If you wish to invite a new user, enter their email address.{" "}
        </p>

        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2 sm:items-center">
          <div>
            <label
              htmlFor="name"
              className="block w-fit text-sm font-medium opacity-75"
            >
              Email
            </label>
            <div className="mt-1 w-full">
              <input
                type="text"
                className={inputStyle}
                {...formObj.register("email")}
              />
              <ErrorMessage
                errors={formObj.formState.errors}
                name="email"
                render={({ message }) => (
                  <p className="text-justify text-xs text-red-600">{message}</p>
                )}
              />
            </div>
          </div>
          {!groupId && (
            <div className="col-span-full">
              <label
                htmlFor="title"
                className="block w-fit text-sm font-medium opacity-75"
              >
                Organization
              </label>
              <select {...formObj.register("group_id")} className={selectStyle}>
                {organizationOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}
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
          {match(inviteUser.isLoading)
            .with(false, () => (
              <Button type="submit" color="stone" className="mt-8 w-full py-4">
                Invite user
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
                Invite user
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
