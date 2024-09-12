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
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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
    <Form {...formObj}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={formObj.handleSubmit((data) => {
          setMemberEdited(data.username);
          editMember.mutate(data);
        })}
      >
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-2">
          <FormField
            control={formObj.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={true} placeholder="Username..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={formObj.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent</FormLabel>
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
    </Form>
  );
};
