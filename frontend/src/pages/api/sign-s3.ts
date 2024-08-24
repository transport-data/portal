//write a next.js api route that returns hello world
// in typescript
import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@env.mjs";
import R2 from "@server/r2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { filename, fileHash, contentType } = JSON.parse(req.body as string);
  const signedUrl = await getSignedUrl(
    R2,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `resources/${fileHash}/${filename}`,
      ContentType: contentType as string,
    }),
    { expiresIn: 3600 }
  );
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({
    url: signedUrl,
    method: "PUT",
  });
  res.end();
}
