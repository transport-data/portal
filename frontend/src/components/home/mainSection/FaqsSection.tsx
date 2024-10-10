import Heading from "@components/_shared/Heading";
import { Button } from "@components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { MddbFile } from "mddb/dist/src/lib/schema";
import { Faq } from "@interfaces/faq.interface";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";
import Link from "next/link";

export default function FaqsSection({ faqs }: { faqs: Faq[] }) {
  const [openItem, setOpenItem] = useState<string>("item-0");
  return (
    <div className="container py-[96px]">
      <div className="mx-auto text-center lg:max-w-[640px]">
        <Heading>Frequently asked questions</Heading>
      </div>
      <Accordion
        type="single"
        collapsible
        className="mx-auto  mt-16 w-full border-0 lg:w-[695px]"
        onValueChange={(item) => setOpenItem(item)}
        value={openItem}
      >
        {faqs?.map((faq, i) => {
          const isActive = openItem === `item-${i}`;
          return (
            <AccordionItem value={`item-${i}`} key={`item-${i}`}>
              <AccordionTrigger
                className={`py-[24px] text-left text-lg font-medium leading-none hover:no-underline ${
                  i >= faqs.length - 1
                    ? "border-0"
                    : "border-b border-b-gray-200"
                }  ${isActive ? "text-gray-900" : "text-gray-500"}`}
              >
                <span>{faq.title}</span>
              </AccordionTrigger>
              <AccordionContent
                className={`${
                  i >= faqs.length - 1 ? "border-t" : "border-b "
                } border-gray-200 py-[20px] text-base font-normal text-gray-500`}
              >
                <Markdown remarkPlugins={[remarkFrontmatter]}>
                  {faq.source}
                </Markdown>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <div className="mt-[10px]">
        <Button
          asChild
          variant="ghost"
          className="mx-auto flex w-fit border border-[#E5E7EB] hover:bg-slate-50"
        >
          <Link href="/faq">Show more...</Link>
        </Button>
      </div>
    </div>
  );
}
