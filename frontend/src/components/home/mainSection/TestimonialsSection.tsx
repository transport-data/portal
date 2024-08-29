import { Button } from "@components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface FaqsProps {
  title: string;
  content: string;
  name: string;
  organization: string;
  image?: string;
}

export default function TestimonialsSection() {
  const testimonials: Array<FaqsProps> = [
    {
      title:
        "Improved data is essential to support better informed decisions and deliver improved transport systems and operations",
      content:
        "We are looking for years for a high quality database delivering transport data for Southern countries, we regularly work with. Data quality is hindering a lot our work on quantifying the impact of transport on climate change and local pollution levels. Finding solution starts with having quality data. We are therefore thrilled to be part of this incredible initiative.",
      name: "Marie Colson",
      organization: "Institute for Energy and Environment (IFEU)",
      image: "",
    },
    {
      title:
        "Aliquip proident in ea sit sunt fugiat aliquip proident aliqua commodo proident",
      content:
        "Cupidatat Lorem eiusmod anim sint labore dolore voluptate amet cillum occaecat magna. Cillum proident fugiat sunt excepteur enim exercitation fugiat ea ipsum nostrud ut esse dolor. Cillum dolore adipisicing ex occaecat proident dolore magna. Et irure ullamco ipsum exercitation est dolore officia aliqua. Et quis est ullamco eiusmod aliqua elit exercitation duis. Consectetur labore in veniam quis nulla commodo in in eu culpa consequat velit irure. Occaecat labore culpa mollit laborum quis et eu.",
      name: "Wenxin Qiao",
      organization: "World Bank",
    },
    {
      title:
        "Voluptate laboris sunt fugiat aliquip sunt voluptate tempor do commodo proident.",
      content:
        "Aliqua exercitation consequat consequat cillum nostrud aliquip. Exercitation officia cillum incididunt proident aliqua commodo proident laboris duis elit Lorem. Officia do eu eu tempor qui esse voluptate quis consectetur elit aliquip ex ipsum pariatur. Officia pariatur nulla laboris in et ex labore dolor quis adipisicing excepteur. Id deserunt labore sint enim ex fugiat dolore sunt ex duis enim. Dolore voluptate amet in magna ad reprehenderit voluptate eiusmod tempor laborum. Ea anim sunt qui ea eu veniam amet culpa occaecat.",
      name: "Jacopo Tattini",
      organization: "Joint Research Centre (JRC) of the European Commission",
    },
  ];
  const [openItem, setOpenItem] = useState<string>("testimonial-0");

  return (
    <div className="container py-[96px]">
      <Tabs
        defaultValue="account"
        className="full flex flex-col md:flex-row md:gap-x-[96px]"
        value={openItem}
        onValueChange={(item) => setOpenItem(item)}
      >
        <TabsList className="h-auto justify-normal items-center rounded-md p-1 flex w-full flex-row overflow-x-auto md:max-w-[384px] md:flex-col ">
          {testimonials.map((item, i) => {
            return (
              <TabsTrigger
                key={`testimonial-${i}`}
                value={`testimonial-${i}`}
                className="whitespace-normal items-center px-3 py-1.5 text-sm font-medium transition-all duration-150 focus-visible:outline-normal disabled:pointer-events-none disabled:opacity-50 flex w-fit max-w-[300px] flex-none cursor-pointer gap-[10px] rounded-[8px] p-4 data-[state=active]:bg-gray-100 md:w-full md:max-w-none md:justify-start"
                asChild
              >
                <div>
                  <Avatar className="h-[48px] w-[48px]">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="bg-gray-300">
                      {item.name
                        .trim()
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
                    <span className="flex flex-wrap  text-sm font-normal leading-tight text-gray-500">
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
              <p className="text-lg font-normal leading-relaxed text-gray-500">
                {item.content}
              </p>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
