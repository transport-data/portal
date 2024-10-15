import Heading from "@components/_shared/Heading";
import Subheading from "@components/_shared/SubHeading";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CommunitySection({}: {}) {
  return (
    <section className="container flex flex-col pb-[96px]">
      <div className="mx-auto block lg:max-w-[672px]">
        <Heading>Our Community</Heading>
        <Subheading className="mt-4">
          Unlocking the Potential of Transportation Data: Insights, Innovations,
          and Best Practices for a Sustainable Future.
        </Subheading>
        <div className="flex justify-center">
          <Button asChild className="mx-auto mt-[32px] inline-block">
            <Link
              href="https://github.com/orgs/transport-data/discussions/categories/user-feedback"
              target="_blank"
            >
              🔗 TDC Discussions Board
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
