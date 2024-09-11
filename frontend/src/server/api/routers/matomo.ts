import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env.mjs";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2 from "@/server/r2";

export const matomoRouter = createTRPCRouter({
  getVisitorStats: publicProcedure.query(async ({ input }) => {
    const matomoApiUrl = `${env.MATOMO_URL}/index.php`;
    const params = {
      module: "API",
      method: "Actions.getPageUrls",
      idSite: env.MATOMO_SITE_ID,
      period: "day",
      date: "today",
      format: "JSON",
      token_auth: env.MATOMO_AUTH_KEY,
    };
    const urlParams = new URLSearchParams(params).toString();
    const response = await fetch(`${matomoApiUrl}?${urlParams}`);
    const data = await response.json();
    return data;
  }),
});
