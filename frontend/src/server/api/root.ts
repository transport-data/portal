import { createTRPCRouter } from "@/server/api/trpc";
import { datasetRouter } from "./routers/dataset";
import { groupRouter } from "./routers/group";
import { organizationRouter } from "./routers/organization";
import { resourceRouter } from "./routers/resource";
import { userRouter } from "./routers/user";
import { datapackageRouter } from "./routers/datapackage";
import { uploadsRouter } from "./routers/uploads";
import { matomoRouter } from "./routers/matomo";
import { tagsRouter } from "./routers/tags";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dataset: datasetRouter,
  group: groupRouter,
  resource: resourceRouter,
  user: userRouter,
  organization: organizationRouter,
  uploads: uploadsRouter,
  datapackage: datapackageRouter,
  matomo: matomoRouter,
  tags: tagsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
