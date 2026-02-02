import * as React from "react";
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
      render={({ field }) => {
        const isCurrentlyChecked = !!(field.value && field.value.length > 0);

        return (
          <FormItem className="mb-5 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={isCurrentlyChecked}
                onCheckedChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  const newCheckedState = target.checked;

                  let untrackedUserIds: Array<string> = [];
                  if (newCheckedState) {
                    untrackedUserIds = [user?.id as string];
                  }

                  field.onChange(untrackedUserIds);
                }}
                />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                <span className="text-primary">
                  Select this option if you don't want to be listed as contributor to this dataset.
                </span>
              </FormLabel>
            </div>
          </FormItem>
        );
      }}
    />
  );
}
