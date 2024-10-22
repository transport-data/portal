import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { ClipboardCopy, QuoteIcon } from "lucide-react";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { Dataset } from "@interfaces/ckan/dataset.interface";

export interface Option {
  label: string;
  content: string;
  type: "code" | "quotation";
}

export function Citation({
  dataset,
  options,
}: {
  dataset: Dataset;
  options: Option[];
}) {
  return (
    <Tabs
      defaultValue={options[0]?.label ?? ""}
      className="max-w-[95vw] md:max-w-[80vw] lg:max-w-[80vw]"
    >
      <TabsList className="w-full justify-start overflow-hidden bg-transparent p-0">
        <Carousel className="w-full">
          <CarouselContent>
            {options.map((option, index) => (
              <CarouselItem
                className={cn(
                  "w-fit min-w-0 max-w-full basis-auto",
                  index === 0 && "pl-4 pr-0",
                  index !== 0 && "p-0"
                )}
              >
                <div className="border-t-2">
                  <TabsTrigger asChild value={option.label}>
                    <Button
                      variant="secondary"
                      className={cn(
                        "z-10 w-fit min-w-0 max-w-full rounded-none border bg-transparent shadow-none outline-none ring-0 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                      )}
                    >
                      {option.label}
                    </Button>
                  </TabsTrigger>
                </div>
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
            <div className="hidden lg:block">
              {option.type === "quotation" ? (
                <QuoteIcon className="h-8 w-8 text-black" />
              ) : (
                <CodeBracketIcon className="h-8 w-8 text-black" />
              )}
            </div>
            {option.type === "quotation" ? (
              <p
                className={cn(
                  "overflow-hidden text-sm font-normal leading-tight text-gray-500"
                )}
              >
                {option.content}
              </p>
            ) : (
              <pre
                className={cn(
                  "overflow-hidden text-sm font-normal leading-tight text-gray-500"
                )}
              >
                {option.content}
              </pre>
            )}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard.writeText(option.content);
              toast({
                title: "Copied to clipboard",
                description: option.content,
                duration: 5000,
              });
            }}
            className="gap-x-2 border-gray-200 bg-gray-200 outline-gray-200 ring-gray-200"
          >
            <ClipboardCopy className="h-4 w-4" />
            Copy to clipboard
          </Button>
        </TabsContent>
      ))}
    </Tabs>
  );
}
