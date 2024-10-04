import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { DefaultTooltip } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Textarea } from "@components/ui/textarea";
import { Checkbox } from "@components/ui/checkbox";

const contactSchema = z.object({
  email: z.string().email(),
  topic: z.string({ description: "Please select a topic" }),
  subject: z.string({ description: "Please enter a subject" }),
  message: z.string({ description: "Please enter a message" }),
  privacyPolicy: z.boolean().refine((value) => value === true, {
    message: "Please confirm that you have read and agree with the terms",
  }),
});

type ContactFormType = z.infer<typeof contactSchema>;

export function ContactForm() {
  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactSchema),
  });
  function onSubmit(data: ContactFormType) {
    toast({
      title: "You sent the following message",
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </div>
      ),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Your email address{" "}
                <span className="text-xs text-gray-500">
                  (So we can reply to you)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-50"
                  placeholder="name@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-x-2">
                Select a topic{" "}
                <DefaultTooltip content="Select a topic">
                  <InformationCircleIcon className="h-4 w-4 text-gray-500" />
                </DefaultTooltip>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="topic_1">Topic 1</SelectItem>
                  <SelectItem value="topic_2">Topic 2</SelectItem>
                  <SelectItem value="topic_3">Topic 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  className="bg-gray-50"
                  placeholder="What can we help you with"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your message</FormLabel>
              <FormControl>
                <Textarea
                  className="h-52 bg-gray-50"
                  placeholder="What can we help you with"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="privacyPolicy"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <p className="text-xs font-normal text-gray-500">
                    By submitting this form, you confirm that you have read and
                    agree to{" "}
                    <a className="mr-1 text-xs font-medium text-primary underline">
                      Flowbite’s Terms of Service
                    </a>
                    and
                    <a className="ml-1 text-xs font-medium text-primary underline">
                      Privacy Statement
                    </a>
                  </p>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit">Send Message</Button>
      </form>
    </Form>
  );
}


