import { env } from "@/env.mjs";
import { S3Client } from "@aws-sdk/client-s3";

const R2 = new S3Client({
  region: "auto",
  endpoint:
    env.R2_ACCESS_KEY_ID === "minioadmin"
      ? "http://minio:9000"
      : `https://${env.R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_KEY_ID,
  },
  forcePathStyle: env.R2_ACCESS_KEY_ID === "minioadmin" ? true : false,
});

export default R2;
