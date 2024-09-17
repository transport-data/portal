import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type OrganizationFormType,
  OrganizationSchema,
} from "@schema/organization.schema";
import { OrganizationForm } from "./OrganizationForm";
import { Button, LoaderButton } from "@components/ui/button";
import { useState } from "react";
import NotificationSuccess from "@components/_shared/Notifications";
import { api } from "@utils/api";
import { ErrorAlert } from "@components/_shared/Alerts";
import type { Organization } from "@portaljs/ckan";
import { match } from "ts-pattern";
import Spinner from "@components/_shared/Spinner";
import { useRouter } from "next/router";
import notify from "@utils/notify";
import { toast } from "@/components/ui/use-toast";
import { Form } from "@components/ui/form";

export const EditOrganizationForm: React.FC<{
  initialValues: Organization & { groups: Array<{name: string }>};
}> = ({ initialValues }) => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [organizationEdited, setOrganizationEdited] = useState("");
  const formObj = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: { ...initialValues, parent: initialValues.groups[0]?.name ?? '' },
  });

  const utils = api.useContext();
  const editOrganization = api.organization.patch.useMutation({
    onSuccess: async () => {
      toast({
        description: `Successfully edited the ${organizationEdited} organization`,
      });
      setErrorMessage(null);
      await utils.organization.list.invalidate();
      await utils.organization.listForUser.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  return (
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setOrganizationEdited(data.name);
          editOrganization.mutate(data);
        })}
      >
        <OrganizationForm formObj={formObj} />
        <div className="col-span-full">
          <LoaderButton
            loading={editOrganization.isLoading}
            type="submit"
            variant="secondary"
            className="mt-8 w-full py-4"
          >
            Edit Organization
          </LoaderButton>
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
