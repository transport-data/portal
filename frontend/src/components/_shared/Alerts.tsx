import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Copy } from "lucide-react";

export function ErrorAlert({
  text,
  title = "There was an error",
  onClose,
}: {
  text: string;
  title?: string;
  onClose?: () => void;
}) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon
            className="h-5 w-5 text-red-400"
            aria-hidden="true"
            onClick={onClose}
          />
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

export function TokenCreatedSuccessAlert({
  token,
  title = "Token Created Successfully",
  onClose,
}: {
  token: string;
  title?: string;
  onClose: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setIsCopied(true);
    // Hide the popup after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="max-w-full">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="mt-2 text-sm text-green-700">
            make sure to copy it now, you won't be able to see it again.
            <p className="mt-1 break-words">
              <span className="border bg-white p-1">{token}</span>
            </p>
            <div className="mt-5">
              <span onClick={handleCopy}>
                <Copy size={18} />
              </span>
              {isCopied && (
                <div
                  className="absolute z-50 ml-8 -translate-y-1/2 transform rounded bg-gray-900 px-2 py-1 text-xs text-white"
                  style={{ zIndex: 999 }}
                >
                  Token Copied!
                </div>
              )}
            </div>
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
