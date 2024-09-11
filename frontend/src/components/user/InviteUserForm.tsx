import { ErrorAlert } from "@components/_shared/Alerts";
import Spinner from "@components/_shared/Spinner";
import { Button } from "@components/ui/button";
import { DefaultTooltip } from "@components/ui/tooltip";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@portaljs/ckan";
import { UserInviteFormType, UserInviteSchema } from "@schema/user.schema";
import { inputStyle, selectStyle } from "@styles/formStyles";
import { api } from "@utils/api";
import notify from "@utils/notify";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@lib/utils";
import { Check } from "lucide-react";

interface InviteUserFormProps {
  groupId: string;
  orgUsers: User[];
}

export const InviteUserForm: React.FC<InviteUserFormProps> = ({
  groupId,
  orgUsers,
}: InviteUserFormProps) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchedUser, setSearchedUser] = useState("");
  const { data: users, isLoading: isAllUsersLoading } =
    api.user.list.useQuery();

  const usersOptions =
    users
      ?.filter(
        (x) =>
          !x.sysadmin && !orgUsers?.some((a) => !a.sysadmin && a.id === x.id)
      )
      .map((user) => ({
        value: user.id,
        label: `${user.display_name} - ${user.email}`,
      })) || [];

  const roleOptions = [
    { label: "Member", value: "member" },
    { label: "Editor", value: "editor" },
    { label: "Admin", value: "admin" },
  ];

  function userAlreadyExists(email: string) {
    if (!users) return true;
    return users?.some((u) => u.email === email);
  }

  const defaultValues = { group_id: "" };
  if (groupId) {
    defaultValues.group_id = groupId;
  }

  const formObj = useForm<UserInviteFormType>({
    resolver: zodResolver(UserInviteSchema),
    defaultValues: {
      ...defaultValues,
      role: "member",
      existingUser: false,
    },
  });

  const utils = api.useContext();
  const inviteUser = api.user.inviteUser.useMutation({
    onSuccess: async (response) => {
      notify(
        `Successfully ${
          typeof response === "string" ? "added" : "invited"
        } the ${
          typeof response === "string" ? response : response?.display_name
        } user`
      );
      formObj.reset();
      setErrorMessage(null);
      await utils.organization.get.invalidate();
    },
    onError: (error) => setErrorMessage(error.message),
  });

  //  NOTE: this loading is necessary so that
  //  default values for orgs can work
  if (isAllUsersLoading) {
    return <Spinner className="dark:text-primary-dark mx-auto my-2" />;
  }

  return (
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit(
          (data) => inviteUser.mutate(data),
          (e) => {
            console.log(e);
          }
        )}
      >
        <div className="grid grid-cols-1 items-start sm:items-center">
          <FormField
            control={formObj.control}
            name="user"
            render={({ field }) => (
              <FormItem className="flex flex-col py-4">
                <FormLabel id="userLabel">User</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                          !field.value && "text-gray-400"
                        )}
                      >
                        {usersOptions.find((u) => u.value === field.value)
                          ?.label
                          ? usersOptions.find((u) => u.value === field.value)
                              ?.label
                          : field.value && field.value.length > 0
                          ? `Invite "${field.value}"`
                          : "Select user"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-full p-0"
                    style={{ width: "var(--radix-popover-trigger-width)" }}
                  >
                    <Command>
                      <CommandInput
                        value={searchedUser}
                        onValueChange={setSearchedUser}
                        placeholder="Search users..."
                      />
                      <CommandList>
                        <CommandEmpty></CommandEmpty>
                        <CommandGroup>
                          {(searchedUser.length > 2 && !userAlreadyExists(searchedUser)) && 
                          <CommandItem
                            value={searchedUser}
                            className={cn(
                              field.value === searchedUser
                                ? "bg-accent text-accent-foreground"
                                : ""
                            )}
                            onSelect={() => {
                              formObj.setValue("user", searchedUser ?? "");
                              formObj.setValue("existingUser", false);
                            }}
                          >
                            Invite {searchedUser}
                          </CommandItem>
                          }
                          {usersOptions.map((u) => (
                            <CommandItem
                              value={u.value}
                              keywords={[u.label]}
                              key={u.value}
                              className={cn(
                                field.value === u.value
                                  ? "bg-accent text-accent-foreground"
                                  : ""
                              )}
                              onSelect={() => {
                                formObj.setValue("user", u.value ?? "");
                                formObj.setValue("existingUser", true);
                              }}
                            >
                              {u.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formObj.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent for org" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
    </Form>
  );
};
