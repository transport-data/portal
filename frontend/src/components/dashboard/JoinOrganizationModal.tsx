import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { ChevronDown, Building, BuildingIcon } from "lucide-react";
import Modal from "@components/_shared/Modal";
import { DefaultTooltip } from "@components/ui/tooltip";
import { Button } from "@components/ui/button";
import { api } from "@utils/api";
import Spinner from "@components/_shared/Spinner";
import { ErrorAlert } from "@components/_shared/Alerts";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizationFormType,
  OrganizationSchema,
} from "@schema/organization.schema";
import { Form, FormField } from "@components/ui/form";
import { useForm, UseFormReturn } from "react-hook-form";
import TextDivisor from "@components/_shared/TextDivisor";
import TextEditor from "@components/_shared/TextEditor";
import { OnboardingFormType } from "@schema/onboarding.schema";
import { toast } from "@components/ui/use-toast";

export default function JoinOrganizationModalButton({
  render,
}: {
  render?: (setIsShow: Dispatch<SetStateAction<boolean>>) => React.ReactNode;
}) {
  const [isShow, setIsShow] = useState<boolean>(false);

  if (render) {
    return (
      <>
        {render(setIsShow)}
        <JoinOrganizationModal isShow={isShow} setIsShow={setIsShow} />
      </>
    );
  }

  return (
    <>
      <DefaultTooltip content="Request to join an organisation or the creation of a new one">
        <Button
          variant="secondary"
          className="justify-between gap-2"
          onClick={() => setIsShow(true)}
        >
          <BuildingIcon className="h-4 w-4" />
          Join Organisation
        </Button>
      </DefaultTooltip>
      <JoinOrganizationModal isShow={isShow} setIsShow={setIsShow} />
    </>
  );
}

const joinOrganizationSchema = z
  .object({
    isCreation: z.literal(false),
    org: OrganizationSchema,
    message: z.string().min(1),
    confirmMembership: z.literal(true),
  })
  .or(
    z.object({
      isCreation: z.literal(true),
      name: z.string().min(1),
      description: z.string().min(1),
      whatDataMessage: z.string(),
      creationConfirmMembership: z.literal(true),
    }),
  );

type JoinOrganizationFormType = z.infer<typeof joinOrganizationSchema>;

function JoinOrganizationModal({
  isShow,
  setIsShow,
}: {
  isShow: boolean;
  setIsShow: Dispatch<SetStateAction<boolean>>;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const form = useForm<JoinOrganizationFormType>({
    mode: "onChange",
    resolver: zodResolver(joinOrganizationSchema),
    defaultValues: {
      isCreation: false,
      message: "",
    },
  });

  const onboardMutation = api.user.onboard.useMutation({
    // TODO: reset is not working
    // TODO: toast is hiding too fast
    onSuccess() {
      form.reset();
      toast({ description: "Request submitted" });
      setErrorMessage("");
      setIsShow(false);
    },
    onError(e) {
      setErrorMessage("Failed to submit request: " + e.message);
    },
  });

  const onSubmit = (data: JoinOrganizationFormType) => {
    let input: Partial<OnboardingFormType> = {
      onBoardingStep: 1,
      isNewOrganizationSelected: data.isCreation,
    };

    if (data.isCreation) {
      input.confirmThatItParticipatesOfTheOrg = data.creationConfirmMembership;
      input.newOrganizationName = data.name;
      input.newOrganizationDescription = data.description;
      input.newOrganizationDataDescription = data.whatDataMessage;
    } else {
      input.confirmThatItParticipatesOfTheOrg = data.confirmMembership;
      input.orgInWhichItParticipates = data.org;
      input.messageToParticipateOfTheOrg = data.message;
    }

    onboardMutation.mutate(input);
  };

  return (
    <Modal
      show={isShow}
      title={
        form.watch("isCreation")
          ? "Request the creation of a new organisation"
          : "Request to join an organisation"
      }
      setShow={setIsShow}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {form.watch("isCreation") ? (
            <RequestOrganizationForm form={form} />
          ) : (
            <JoinOrganizationForm form={form} />
          )}

          {errorMessage && <ErrorAlert text={errorMessage} />}

          <div className="flex justify-end gap-x-2">
            {form.watch("isCreation") && (
              <Button
                type="button"
                variant="secondary"
                className="mt-5"
                onClick={() => {
                  form.setValue("isCreation", false, { shouldValidate: true });
                }}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                !form.formState.isDirty ||
                onboardMutation.isLoading
              }
              className="mt-5"
            >
              {!onboardMutation.isLoading ? (
                "Submit"
              ) : (
                <Spinner className="text-slate-900" />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}

function JoinOrganizationForm({
  form,
}: {
  form: UseFormReturn<JoinOrganizationFormType>;
}) {
  const {
    data: orgs,
    isLoading: isLoadingOrgs,
    error: errorOrgs,
  } = api.organization.list.useQuery();

  const {
    data: userOrgs,
    isLoading: isLoadingUserOrgs,
    error: userOrgsError,
  } = api.organization.listForUser.useQuery();

  const userOrganizationsIds = userOrgs?.map((o) => o.id);

  const isLoading = isLoadingOrgs || isLoadingUserOrgs;
  const error = errorOrgs ?? userOrgsError;

  const [query, setQuery] = useState("");

  let filteredOrgs = !query
    ? orgs
    : orgs?.filter((org: any) => {
        return org.display_name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <div className="space-y-5">
      <>
        <div>
          <p className="text-gray-500">
            Please note that that your account must be associated with an
            organisation to submit data.
          </p>
        </div>
        <TextDivisor text="Select organisation*" />
        <div className="space-y-1">
          <FormField
            name="org"
            control={form.control}
            render={({ field }) => {
              return (
                <Combobox
                  as="div"
                  onChange={(org: OrganizationFormType) => {
                    setQuery("");
                    field.onChange(org);
                  }}
                  defaultValue={form.watch("org")}
                  onClose={() => setQuery("")}
                >
                  <div className="relative mt-2">
                    <ComboboxInput
                      placeholder="Select an organization"
                      className="icon-at-left w-full rounded-md border-0 bg-white py-1.5 pl-11 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                      onChange={(event) => {
                        setQuery(event.target.value);
                      }}
                      onBlur={() => {
                        setQuery("");
                      }}
                      displayValue={(org: any) => org?.display_name}
                    />
                    <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none data-[open]:rotate-180">
                      <ChevronDown size={14} />
                    </ComboboxButton>

                    {isLoading && <Spinner />}
                    {error?.message && <ErrorAlert text={error.message} />}

                    {!isLoading &&
                      !error &&
                      filteredOrgs &&
                      filteredOrgs?.length > 0 && (
                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {filteredOrgs?.map((org: any) => {
                            const isUserMember = userOrganizationsIds?.includes(
                              org.id,
                            );
                            return (
                              <ComboboxOption
                                disabled={isUserMember}
                                key={org.id}
                                value={org}
                                className="group relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-500 hover:bg-[#E5E7EB]"
                              >
                                <div className="flex items-center gap-3.5">
                                  <Building size={14} />
                                  <span className="block truncate group-data-[selected]:font-semibold">
                                    {org.display_name}{" "}
                                    {isUserMember && (
                                      <span className="opacity-75">
                                        (Already a member of this organisation)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </ComboboxOption>
                            );
                          })}
                        </ComboboxOptions>
                      )}
                  </div>
                </Combobox>
              );
            }}
          ></FormField>
          <p className="text-sm text-gray-500">
            Don’t see your organisation?{" "}
            <Button
              variant="ghost"
              onClick={() =>
                form.setValue("isCreation", true, {
                  shouldValidate: true,
                })
              }
              className="p-0 text-[#00ACC1] hover:text-[#008E9D]"
            >
              Request a new organisation
            </Button>
          </p>
        </div>
        <TextDivisor text="Message for organisation owner*" />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => {
            return (
              <TextEditor
                placeholder="Message for organisation admin..."
                setText={field.onChange}
                initialValue={field.value}
              />
            );
          }}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
            {...form.register("confirmMembership")}
            id="confirmThatItParticipatesOfTheOrg"
          />
          <div className="pb-1 text-sm text-[#6B7280]">
            <label htmlFor="confirmationWorkingForTheOrg">
              I confirm that I work for this organisation
            </label>
          </div>
        </div>
      </>
    </div>
  );
}

function RequestOrganizationForm({
  form,
}: {
  form: UseFormReturn<JoinOrganizationFormType>;
}) {
  return (
    <div className="space-y-5">
      <p className="text-gray-500">
        Please tell us more about your organization. We will review your request
        and get back to you within 2 working days to discuss the data you would
        like to share.
      </p>
      <TextDivisor text="About your organization*" />
      <FormField
        name="name"
        control={form.control}
        render={({ field }) => {
          return (
            <div className="space-y-1">
              <Combobox as="div" value={field.value}>
                <div className="relative mt-2">
                  <ComboboxInput
                    placeholder="Name of the organization..."
                    className="icon-at-left w-full rounded-md border-0 bg-white py-1.5 pl-11 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[#006064] sm:text-sm sm:leading-6"
                    onChange={field.onChange}
                  />
                </div>
              </Combobox>
            </div>
          );
        }}
      />
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => {
          return (
            <TextEditor
              placeholder="Write a short description of your organization..."
              setText={field.onChange}
              initialValue={field.value}
            />
          );
        }}
      />
      <TextDivisor text="What data would you like to share?" />
      <FormField
        name="whatDataMessage"
        control={form.control}
        render={({ field }) => {
          return (
            <TextEditor
              placeholder="What data would you like to share via TDC?"
              setText={field.onChange}
              initialValue={field.value}
            />
          );
        }}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-[#006064] focus:ring-[#006064]"
          {...form.register("creationConfirmMembership")}
          id="confirmThatItParticipatesOfTheOrg"
        />
        <div className="pb-1 text-sm text-[#6B7280]">
          <label htmlFor="confirmationWorkingForTheOrg">
            I confirm that I work for this organisation
          </label>
        </div>
      </div>
    </div>
  );
}
