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
          <p className="my-4 text-xl font-normal text-gray-500">
            Stay up-to-date on the latest sustainable transportation data
            insights by signing up for the Transport Data Commons newsletter
            today!
          </p>
          <Button asChild className="tdc-newsletter">
            <Link
              href="https://civicrm.changing-transport.org/form/tdci-newsletter"
              target="_blank"
            >
              Join Newsletter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
