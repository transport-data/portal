import Uppy, { type UploadResult, type UppyFile } from "@uppy/core";
import { useMemo, useRef, useState } from "react";
import "@uppy/core/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import { getUploadParameters } from "@/utils/uppyFunctions";
import { Button } from "@components/ui/button";
import { SearchIcon } from "lucide-react";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";

export function FileUploader({
  onUploadSuccess,
  onUploadStart,
  id,
  children,
}: {
  id: string;
  onUploadSuccess: (result: UploadResult) => void;
  onUploadStart?: () => void;
  children: React.ReactNode;
}) {
  const [key, setKey] = useState<string | null>(null);
  const [uploading, setIsUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uppy = useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 1,
      },
    }).use(AwsS3, {
      id: "AwsS3",
      getUploadParameters: (file: UppyFile) => getUploadParameters(file),
    });
    return uppy;
  }, []);

  function upload() {
    uppy.upload().then((result) => {
      setIsUploading(false);
      if (result && result.successful[0]) {
        let paths = new URL(result.successful[0].uploadURL).pathname
          .substring(1)
          .split("/");
        const key = paths.slice(0, paths.length).join("/");
        uppy.setState({ ...uppy.getState(), files: [] });
        onUploadSuccess(result);
        setKey(key);
        if (uploadInputRef && uploadInputRef.current)
          uploadInputRef.current.value = "";
      }

      if (result.failed.length > 0) {
        result.failed.forEach((file) => {
          console.error(file.error);
        });
      }
    });
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || !files[0]) return;
    try {
      uppy.addFile({
        name: files[0].name,
        type: files[0].type,
        data: files[0],
      });
    } catch (e) {
      const firstFile = uppy.getFiles()[0];
      uppy.removeFile(firstFile?.id ?? "");
      uppy.addFile({
        name: files[0].name,
        type: files[0].type,
        data: files[0],
      });
    }
    setIsUploading(true);
    upload();
  }

  return (
    <>
      <div className="w-full">
        {children}
        {!children && (
          <div
            onClick={() => uploadInputRef && uploadInputRef.current?.click()}
            className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8 animate-spin text-accent"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </p>
                </div>
              ) : (
                <>
                  <svg
                    className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Max. File Size: 30 MB
                  </p>
                  <div className="py-6">
                    <span className="inline-flex items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-accent px-[20px] py-[10px] text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                      <SearchIcon className="h-4 w-4" /> Browse Files
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {children && (
          <Button
            variant="secondary"
            disabled={uploading}
            onClick={() => uploadInputRef && uploadInputRef.current?.click()}
            type="button"
            className="mt-2 items-center gap-x-2"
          >
            <label
              htmlFor={id}
              className="flex cursor-pointer items-center gap-x-2"
            >
              {uploading ? (
                <div className="loader mb-4 h-12 w-12 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
              ) : (
                <ArrowUpTrayIcon className="h-4 w-4" />
              )}
              Upload more files
            </label>
          </Button>
        )}
      </div>
      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        onChange={(e) => onInputChange(e)}
      />
    </>
  );
}
