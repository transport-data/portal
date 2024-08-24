import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationForm } from "./OrganizationForm";
import { Button } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import {
  OrganizationFormType,
  OrganizationSchema,
} from "@schema/organization.schema";
import { useRouter } from "next/router";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import notify from "@utils/notify";

export const CreateOrganizationForm: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [organizationCreated, setOrganizationCreated] = useState("");
  const formObj = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationSchema),
  });

  const utils = api.useContext();
  const createOrganization = api.organization.create.useMutation({
    onSuccess: async () => {
      notify(`Successfully created the ${organizationCreated} organization`);
      formObj.reset();
      setErrorMessage(null);
      await utils.organization.list.invalidate();
      await utils.organization.listForUser.invalidate();
      await router.push("/dashboard/organizations");
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setOrganizationCreated(data.name);
          createOrganization.mutate(data);
        })}
      >
        <OrganizationForm formObj={formObj} />
        <div className="col-span-full">
          {match(createOrganization.isLoading)
            .with(false, () => (
              <Button type="submit" color="stone" className="mt-8 w-full py-4">
                Create organization
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
                Create organization
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
