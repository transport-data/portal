import { CheckCircleIcon as CheckIconSolid } from "@heroicons/react/20/solid";
import { CheckCircleIcon as CheckIconOutline } from "@heroicons/react/24/outline";
import { cn } from "@lib/utils";
import { match } from "ts-pattern";

const steps = [
  { title: "General" },
  { title: "Metadata" },
  { title: "Upload Files" },
];

export function Steps({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex w-full items-center text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
      {steps.map((step, index) => (
        <li
          key={index}
          className={cn(
            "after:border-1 flex items-center after:hidden before:h-1 before:w-full before:border-b before:border-gray-200 after:h-1 after:w-full after:border-b after:border-gray-200 dark:text-blue-500 dark:after:border-gray-700 sm:before:inline-block sm:before:content-[''] sm:after:inline-block sm:after:content-[''] md:w-full",
            index <= currentStep ? "text-accent" : "text-gray-500",
            index !== 0 ? "justify-center before:mr-2 after:ml-2" : "",
            index === 0 ? "sm:before:hidden after:ml-2" : "",
            index === steps.length - 1 ? "justify-end sm:after:hidden" : ""
          )}
        >
          <span className={cn("flex items-center whitespace-nowrap after:mx-2 after:text-gray-200 after:content-['/'] dark:after:text-gray-500 sm:after:hidden")}>
          {index > currentStep && <></>}
          {index === currentStep && (
            <CheckIconSolid className="mr-2 h-5 w-5 text-accent" />
          )}
          {index < currentStep && (
            <CheckIconOutline className="mr-2 h-5 w-5 text-accent" />
          )}
            {step.title}
          </span>
        </li>
      ))}
    </ol>
  );
}
