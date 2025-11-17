import { env } from "@env.mjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const secret = req.headers.authorization;
  if (secret !== env.SYS_ADMIN_API_KEY) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const path = req.query.path;
  if (!path || typeof path !== "string") {
    return res.status(400).json({ message: "Missing path parameter" });
  }

  try {
    await res.revalidate(path);
    return res.json({ revalidated: true, now: new Date().toISOString() });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error revalidating", error: err.message });
  }
}
