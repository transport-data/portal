import { Checkbox } from "@components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@components/ui/form";
import { DatasetFormType } from "@schema/dataset.schema";
import { useSession } from "next-auth/react";
import { UseFormReturn } from "react-hook-form";

export default function UntrackedContributorCheckbox({
  form,
}: {
  form: UseFormReturn<DatasetFormType>;
}) {
  const session = useSession();
  const user = session.data?.user;
  return (
    <FormField
      control={form.control}
      name="untracked_contributors_ids"
      render={({ field }) => (
        <FormItem className="mb-5 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={!!(field.value && field.value?.length > 0)}
              onCheckedChange={(e) => {
                const isChecked = (e?.target as any).checked;
                let untrackedUserIds: Array<string> = [];
                if (isChecked) {
                  untrackedUserIds = [user?.id as string];
                }
                field.onChange(untrackedUserIds);
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              <span className="text-primary">
                Remove my user from the dataset contributors list
              </span>
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
