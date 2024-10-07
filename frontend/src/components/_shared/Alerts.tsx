import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export function ErrorAlert({
  text,
  title = "There was an error",
}: {
  text: string;
  title?: string;
}) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SuccessAlert({
  text,
  title = "Success",
  onClose,
}: {
  text: string;
  title?: string;
  onClose: () => void;
}) {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{text}</p>
          </div>
        </div>
        <div className="ml-auto flex-shrink-0">
          <button
            onClick={onClose}
            className="text-green-400 hover:text-green-600"
          >
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
