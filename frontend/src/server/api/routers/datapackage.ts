/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/await-thenable */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import CkanRequest from "@lib/ckan-request";
import type { Dataset } from "@portaljs/ckan";
import type { CkanResponse } from "@schema/ckan.schema";
import { z } from "zod";

export const datapackageRouter = createTRPCRouter({
  createDatasetFromDatapackage: protectedProcedure
    .input(z.any())
    .mutation(async ({ input, ctx }) => {
      const user = ctx.session.user;
      const apiKey = user.apikey;
      const groups: string[] = input.groupsId;
      try {
        const dataset: CkanResponse<Dataset> = await CkanRequest.post(
          "package_create",
          {
            apiKey,
            json: {
              ...input,
              groups,
            },
          }
        );
        return dataset.result;
      } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Could not upload file");
      }
    }),
});
