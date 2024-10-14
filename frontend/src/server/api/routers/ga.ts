import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { env } from "@/env.mjs";
import { getDataset } from "@utils/dataset";
import { z } from "zod";

export const googleAnalyticsRouter = createTRPCRouter({
  getVisitorStats: publicProcedure.query(async ({ input }) => {
    try {
      const propertyId = env.GA_PROPERTY_ID;
      const privateKey = Buffer.from(env.GA_PRIVATE_KEY, "base64")
        .toString("utf-8")
        .split(String.raw`\n`)
        .join("\n");
      const analyticsDataClient = new BetaAnalyticsDataClient({
        project_id: "tdc-dev-1728224495980",
        credentials: {
          type: "service_account",
          private_key_id: env.GA_PRIVATE_KEY_ID,
          private_key: privateKey,
          client_email:
            "starting-account-x105yps2064f@tdc-dev-1728224495980.iam.gserviceaccount.com",
          client_id: "100150882059654082063",
          universe_domain: "googleapis.com",
        },
      });
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
          {
            startDate: "2024-10-01",
            endDate: "today",
          },
        ],
        dimensions: [
          {
            name: "pagePath",
          },
        ],
        metrics: [
          {
            name: "activeUsers",
          },
        ],
      });

      const datasetRows = response.rows?.filter((row) =>
        isDataset(
          row &&
            row.dimensionValues &&
            row.dimensionValues[0] &&
            row.dimensionValues[0].value
            ? row.dimensionValues[0].value
            : ""
        )
      );
      let rowsProcessed =
        datasetRows
          ?.map((row) => {
            if (
              !row.dimensionValues ||
              !row.metricValues ||
              !row.dimensionValues[0] ||
              !row.metricValues[0]
            )
              return null;
            return {
              datasetId: (getDatasetId(row.dimensionValues[0].value ?? "") ??
                "") as string,
              activeUsers: parseInt(row.metricValues[0].value ?? "0"),
            };
          })
          .filter((x): x is NonNullable<typeof x> => x !== null) ?? [];
      rowsProcessed = rowsProcessed.sort(
        (a, b) => b.activeUsers - a.activeUsers
      );
      let mostViewedDatasets = await Promise.all(
        rowsProcessed.map(async (row) => {
          try {
            const d = await getDataset({ id: row.datasetId, apiKey: "" });
            return d.result;
          } catch (e) {
            console.error(e);
            return null;
          }
        })
      );
      //remove duplicate dataset.name
      mostViewedDatasets = mostViewedDatasets.filter(
        (dataset, index, self) =>
          index ===
          self.findIndex((t) => t && dataset && t.name === dataset.name)
      );
      return mostViewedDatasets
        .filter((x): x is NonNullable<typeof x> => x !== null)
        .slice(0, 5);
    } catch (e) {
      console.error(e);
      return [];
    }
  }),
  getDownloadStats: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const propertyId = env.GA_PROPERTY_ID;
        const privateKey = Buffer.from(env.GA_PRIVATE_KEY, "base64")
          .toString("utf-8")
          .split(String.raw`\n`)
          .join("\n");
        const analyticsDataClient = new BetaAnalyticsDataClient({
          project_id: "tdc-dev-1728224495980",
          credentials: {
            type: "service_account",
            private_key_id: env.GA_PRIVATE_KEY_ID,
            private_key: privateKey,
            client_email:
              "starting-account-x105yps2064f@tdc-dev-1728224495980.iam.gserviceaccount.com",
            client_id: "100150882059654082063",
            universe_domain: "googleapis.com",
          },
        });
        const [response] = await analyticsDataClient.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [
            {
              startDate: "2024-10-01",
              endDate: "today",
            },
            {
              startDate: "180daysAgo",
              endDate: "today",
            },
          ],
          metrics: [
            {
              name: "eventCount",
            },
          ],
          dimensions: [
            {
              name: "customEvent:event_label",
            },
            {
              name: "eventName",
            },
          ],
          dimensionFilter: {
            andGroup: {
              expressions: [
                {
                  filter: {
                    fieldName: "eventName",
                    stringFilter: {
                      value: "dataset_download",
                      matchType: "EXACT",
                    },
                  },
                },
                {
                  filter: {
                    fieldName: "customEvent:event_label",
                    stringFilter: {
                      value: input.id,
                      matchType: "BEGINS_WITH",
                    },
                  },
                },
              ],
            },
          },
        });
        const lastSixMonths =
          response.rows?.find((r) => {
            return r.dimensionValues?.find((d) => d.value === "date_range_1");
          })?.metricValues?.[0]?.value ?? null;
        const total =
          response.rows?.find((r) => {
            return r.dimensionValues?.find((d) => d.value === "date_range_0");
          })?.metricValues?.[0]?.value ?? null;
        return { lastSixMonths, total };
      } catch (e) {
        console.error(e);
        return {
          lastSixMonths: null,
          total: null,
        };
      }
    }),
});

function getDatasetId(path: string) {
  const pathSections = path.split("/");
  if (pathSections.length !== 3) {
    return "";
  }
  return pathSections[2];
}

function isDataset(url: string) {
  const pathSections = url.split("/");
  if (pathSections[0] === "dashboard") return false;
  if (pathSections.length === 3) {
    return true;
  }
  return false;
}
