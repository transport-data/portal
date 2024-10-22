import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  CalendarIcon
} from "@heroicons/react/20/solid";
import { cn } from "@lib/utils";
import { DatasetFormType } from "@schema/dataset.schema";
import { format } from "date-fns";
import { useFieldArray, useFormContext } from "react-hook-form";

export function CommentsForm({ disabled }: any) {
  const { control, register } = useFormContext<DatasetFormType>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormProvider)
      name: "comments", // unique name for your Field Array
    }
  );
  return (
    <div className="py-4">
      <div className="flex items-center pb-4 text-sm font-semibold leading-tight text-primary after:ml-2 after:h-1 after:w-full after:border-b after:border-gray-200 after:content-['']">
        Comments
      </div>
      {fields.map((field, index) => (
        <>
          <div
            className="grid grid-cols-1 gap-4 pb-2 lg:grid-cols-2"
            key={field.id}
          >
            <FormField
              control={control}
              name={`comments.${index}.initials`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={disabled}
                      className={cn(disabled && "cursor-not-allowed")}
                      placeholder="Comments initials"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`comments.${index}.comment`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Comment" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={control}
              name={`comments.${index}.date`}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger disabled={disabled} asChild>
                      <FormControl>
                        <Button
                          disabled={disabled}
                          variant={"outline"}
                          className={cn(
                            disabled && "cursor-not-allowed",
                            "w-full justify-start gap-x-2 pl-3 font-normal hover:border-primary hover:bg-transparent hover:text-primary",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Date of comment...</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      ))}
      <Button
        disabled={disabled}
        className={cn(disabled && "cursor-not-allowed")}
        onClick={() =>
          append({
            initials: "",
            comment: "",
            date: new Date(),
          })
        }
        type="button"
        variant="secondary"
      >
        Add a comment
      </Button>
    </div>
  );
}
