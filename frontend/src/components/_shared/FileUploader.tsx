import React from "react";
import Uppy, { type UploadResult, type UppyFile } from "@uppy/core";
import { Dashboard } from "@uppy/react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import AwsS3 from "@uppy/aws-s3";
import { getUploadParameters } from "@utils/uppyFunctions";

export function FileUploader({
  onUploadSuccess,
  onUploadStart,
  height = 550,
}: {
  onUploadSuccess: (result: UploadResult) => void;
  onUploadStart?: () => void;
  height?: number;
}) {
  const uppy = React.useMemo(() => {
    const uppy = new Uppy({
      autoProceed: true,
      restrictions: {
        maxNumberOfFiles: 10,
      },
    }).use(AwsS3, {
      id: "AwsS3",
      getUploadParameters: (file: UppyFile) => getUploadParameters(file),
    });
    return uppy;
  }, []);
  uppy.on("complete", (result) => {
    onUploadSuccess(result);
  });
  uppy.on("upload", (_result) => {
    if (onUploadStart) onUploadStart();
  });
  return <Dashboard height={height} uppy={uppy} />;
}
