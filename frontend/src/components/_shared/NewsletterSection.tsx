import { EnvelopeIcon } from "@heroicons/react/20/solid";
import Heading from "./Heading";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function NewsLetterSection() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following email:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div className="bg-gray-50 py-[96px]">
      <div className="container ">
        <div className="mx-auto text-center lg:max-w-[672px]">
          <Heading>Sign up for our newsletter</Heading>
          <p className="mt-4 text-xl font-normal text-gray-500">
            Stay up-to-date on the latest sustainable transportation data
            insights by signing up for the Transport Data Commons newsletter
            today!
          </p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mt-8 max-w-[478px]"
            >
              <div className="flex w-full  items-start justify-center space-x-2">
                <div className="relative w-full">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative ">
                        <div className="pointer-events-none absolute inset-y-0 left-0 top-[15px] flex h-fit items-center pl-3">
                          <EnvelopeIcon
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-400"
                          />
                        </div>
                        <FormControl className="">
                          <Input
                            placeholder="Enter your email"
                            {...field}
                            className="pl-10 mt-0 w-full max-w-none h-12 focus-visible:border-0 focus-visible:outline-0 "
                          />
                        </FormControl>
                        <FormMessage className="text-left" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 mt-2 border border-accent"
                >
                  Subscribe
                </Button>
              </div>
              <FormDescription className="mt-2 text-start text-sm font-normal text-gray-500">
                We care about the protection of your data. Read our{" "}
                <Link href="#" className="underline">
                  Privacy Policy.
                </Link>
              </FormDescription>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
