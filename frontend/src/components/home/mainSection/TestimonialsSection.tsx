import { Button } from "@components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Testimonial } from "@interfaces/testimonial.interface";
import Markdown from "react-markdown";
import remarkFrontmatter from "remark-frontmatter";

interface FaqsProps {
  title: string;
  content: string;
  name: string;
  organization: string;
  image?: string;
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [openItem, setOpenItem] = useState<string>("testimonial-0");

  return (
    <div className="container py-[96px]">
      <Tabs
        defaultValue="account"
        className="full flex flex-col md:flex-row md:gap-x-[96px]"
        value={openItem}
        onValueChange={(item) => setOpenItem(item)}
      >
        <TabsList className="flex h-auto w-full flex-row items-center justify-normal gap-4 overflow-x-auto rounded-md bg-transparent  md:max-w-[384px] md:flex-col ">
          {testimonials.map((item, i) => {
            return (
              <TabsTrigger
                key={`testimonial-${i}`}
                value={`testimonial-${i}`}
                className="focus-visible:outline-normal flex w-fit max-w-[300px] flex-none cursor-pointer items-center gap-[10px] whitespace-normal rounded-[8px] bg-transparent p-4 px-3 py-1.5 py-4 text-sm font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-gray-100 md:w-full md:max-w-none md:justify-start"
                asChild
              >
                <div>
                  <Avatar className="h-[48px] w-[48px]">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="bg-gray-300">
                      {item.name
                        ?.trim()
                        .split(" ")
                        .map((word) => word[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-semibold leading-tight text-gray-900">
                      {item.name}
                    </span>
                    <span className="flex flex-wrap  text-sm font-normal leading-tight text-gray-500 ">
                      {item.organization}
                    </span>
                  </div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
        <div className="mt-8 w-full md:mt-0">
          {testimonials.map((item, i) => (
            <TabsContent key={`testimonial-${i}`} value={`testimonial-${i}`}>
              <svg
                width="24"
                height="18"
                viewBox="0 0 24 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.017 18L14.017 10.609C14.017 4.905 17.748 1.039 23 0L23.995 2.151C21.563 3.068 20 5.789 20 8H24V18H14.017ZM0 18V10.609C0 4.905 3.748 1.038 9 0L9.996 2.151C7.563 3.068 6 5.789 6 8H9.983L9.983 18L0 18Z"
                  fill="#9CA3AF"
                />
              </svg>

              <h5 className="mb-[12px] mt-4 text-2xl font-bold leading-tight text-gray-900">
                {item.title}
              </h5>
              <div className="text-lg font-normal leading-relaxed text-gray-500">
                <Markdown remarkPlugins={[remarkFrontmatter]}>
                  {item.source}
                </Markdown>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
