import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationForm } from "./OrganizationForm";
import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";
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
import { Form } from "@components/ui/form";
import { slugify } from "@lib/utils";
import { toast } from "@/components/ui/use-toast";

export const CreateOrganizationForm: React.FC = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [organizationCreated, setOrganizationCreated] = useState("");
  const formObj = useForm<OrganizationFormType>({
    resolver: zodResolver(OrganizationSchema),
    defaultValues: {
      description: "",
      name: "",
      title: "",
    },
  });

  const utils = api.useContext();
  const createOrganization = api.organization.create.useMutation({
    onSuccess: async () => {
      toast({
        description: `Successfully created the ${organizationCreated} organisation`,
      });
      formObj.reset();
      setErrorMessage(null);
      await utils.organization.list.invalidate();
      await utils.organization.listForUser.invalidate();
      await router.push("/dashboard/organizations");
    },
    onError: (error) => setErrorMessage(error.message),
  });

  const {
    setValue,
    watch,
    formState: { dirtyFields },
  } = formObj;

  useEffect(() => {
    if (!dirtyFields["name"]) setValue("name", slugify(watch("title")));
  }, [watch("title")]);

  return (
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setOrganizationCreated(data.title ?? data.name);
          createOrganization.mutate(data);
        })}
      >
        <OrganizationForm formObj={formObj} />
        <div className="col-span-full">
          {match(createOrganization.isLoading)
            .with(false, () => (
              <Button type="submit" color="stone" className="mt-8 w-full py-4">
                Create organisation
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
                Create organisation
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
