import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env.mjs";
import r2 from "@/server/r2";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "@/lib/utils";

function makeid(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { filePath, filename, fileHash, contentType } = JSON.parse(
    req.body as string
  );
  let _filePath = filePath;
  const resourceId = uuidv4();
  if (!filePath) {
    _filePath = `resources/${resourceId}`;
  }
  //done just for local development
  //if (env.R2_ACCESS_KEY_ID === "minioadmin") {
  //  _filePath = _filePath.replace("ckan/", "");
  //}
  const extension = filename.split(".").pop();
  const _filename = filename.split(".")[0];
  const key = slugify(`${_filename}-${makeid(6)}`);
  const signedUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: `${_filePath}/${key}.${extension}`,
      ContentType: contentType as string,
      ACL: "public-read",
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
