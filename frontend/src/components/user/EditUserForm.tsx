import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type OrganizationFormType,
  OrganizationSchema,
} from "@schema/organization.schema";
import { UserForm } from "./UserForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import type { Organization } from "@portaljs/ckan";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import {
  CKANUserFormType,
  CKANUserSchema,
  UserFormType,
  UserSchema,
} from "@schema/user.schema";
import notify from "@utils/notify";
import { User } from "@interfaces/ckan/user.interface";
import { Form } from "@components/ui/form";
import { toast } from "@/components/ui/use-toast";

export const EditUserForm: React.FC<{
  initialValues: User;
}> = ({ initialValues }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userEdited, setUserEdited] = useState("");
  const formObj = useForm<CKANUserFormType>({
    resolver: zodResolver(CKANUserSchema),
    defaultValues: initialValues,
  });

  const utils = api.useContext();
  const editUser = api.user.patch.useMutation({
    onSuccess: async () => {
      notify(`Successfully edited the ${userEdited} user`);
      setErrorMessage(null);
      await utils.user.list.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setUserEdited(data.name);
          editUser.mutate(data);
        })}
      >
        <UserForm formObj={formObj} />
        <div className="col-span-full">
          {match(editUser.isLoading)
            .with(false, () => (
              <Button
                type="submit"
                variant="secondary"
                className="mt-8 w-full py-4"
              >
                Edit user
              </Button>
            ))
            .otherwise(() => (
              <Button
                type="submit"
                variant="secondary"
                className="mt-8 flex w-full py-4"
              >
                <Spinner className="hover:text-slate-900" />
                Edit user
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
