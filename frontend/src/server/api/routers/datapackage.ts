/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/await-thenable */
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { DataPackage, Resource } from "@interfaces/datapackage.interface";
import { Table } from "tableschema";
import { open } from "frictionless.js";
import { z } from "zod";
import type { Dataset } from "@portaljs/ckan";
import type { CkanResponse } from "@schema/ckan.schema";
import CkanRequest from "@datopian/ckan-api-client-js";

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
  getDatapackages: protectedProcedure
    .input(z.array(z.string().url()))
    .query(async ({ input }) => {
      const normalizingRegex = /[^a-zA-Z0-9]/g;
      if (input.length === 0) return null;
      try {
        const resources: Resource[] = (await Promise.all(
          input.map(async (file) => {
            const descriptor = await open(file).descriptor;
            descriptor.name = descriptor.name.replace(normalizingRegex, "_");
            if (descriptor.format !== "csv") {
              return {
                ...descriptor,
                url: descriptor.path,
              };
            }
            const table = await Table.load(file);
            await table.read({ keyed: true, limit: 500 });
            await table.infer(500);
            return {
              ...descriptor,
              url: descriptor.path,
              schema: table.schema.descriptor,
            };
          })
        )) as Resource[];
        if (resources.length === 0) return null;
        const datapackage: DataPackage = {
          title: resources[0]?.name,
          description: "",
          private: false,
          name: resources[0]?.name.replace(normalizingRegex, "_") ?? "",
          resources: resources,
        };
        return datapackage;
      } catch (e) {
        if (e instanceof Error) throw e;
        throw new Error("Could not load datapackage from files");
      }
    }),
});
