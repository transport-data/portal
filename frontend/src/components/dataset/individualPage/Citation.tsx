import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dataset } from "@portaljs/ckan";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCopy } from "lucide-react";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

export interface Option {
  label: string;
  content: React.ReactNode;
}

export function Citation({
  dataset,
  options,
}: {
  dataset: Dataset;
  options: Option[];
}) {
  const citationCode = `
            @software{schlottke_lakemper_michael_2023_7911779,
  author = {Schlottke-Lakemper, Michael and
             Gassner, Gregor J. and
             Ranocha, Hendrik and
             Winters, Andrew R. and
             Chan, Jesse},
   title = {TDC Global Vehicle Registration},
   month = march,
   year = 2023,
   publisher = {TDC},
   version = {v0.5.22},
   doi = {10.5281/TDC.7911779},
   url = {https://doi.org/10.5281/TDC.7911779}
}
`;
  return (
    <Tabs defaultValue={options[0]?.label ?? ""} className="max-w-[80vw]">
      <TabsList className="w-full justify-start overflow-hidden p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {options.map((option, index) => (
              <CarouselItem
                className={cn(
                  "w-fit min-w-0 max-w-full basis-auto border-0",
                  index === 0 && "pl-4 pr-0",
                  index !== 0 && "p-0"
                )}
              >
                <TabsTrigger asChild value={option.label}>
                  <Button
                    variant="secondary"
                    className={cn(
                      "border-1 w-fit min-w-0 max-w-full rounded-none border border-b-0 bg-transparent underline-offset-4 shadow-none outline-none ring-0 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground",
                      index === 0 ? "rounded-bl-none rounded-tr-md" : "",
                      index !== options.length - 1 ? "border-r-0" : "",
                      index === options.length - 1 ? "rounded-tr-md" : ""
                    )}
                  >
                    {option.label}
                  </Button>
                </TabsTrigger>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-auto"></CarouselPrevious>
          <CarouselNext className="right-0"></CarouselNext>
        </Carousel>
      </TabsList>
      {options.map((option) => (
        <TabsContent
          value={option.label}
          className="mt-0 rounded-b-md border border-gray-300 p-6 "
        >
          <div className="flex items-start gap-x-4 pb-4">
            <div>
              <CodeBracketIcon className="h-8 w-8 text-black" />
            </div>
            <pre className="text-sm font-normal leading-tight text-gray-500">{citationCode}</pre>
          </div>
          <Button variant="secondary" className="bg-gray-400">
            <ClipboardCopy className="h-4 w-4" />
            Copy to clipboard
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}
