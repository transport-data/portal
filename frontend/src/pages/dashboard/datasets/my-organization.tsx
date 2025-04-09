import DashboardLayout from "@components/_shared/DashboardLayout";
import { Facet } from "@components/_shared/DatasetsFilter";
import Loading from "@components/_shared/Loading";
import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";
import { listGroups } from "@utils/group";
import type { InferGetStaticPropsType, NextPage } from "next";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";

export async function getStaticProps() {
  const regions: Facet[] = [];
  const countries: Facet[] = [];

  const geographies = await listGroups({
    type: "geography",
  });

  geographies.forEach((x: any) =>
    x.geography_type === "country"
      ? countries.push({ count: 0, display_name: x.title, name: x.name })
      : regions.push({ count: 0, display_name: x.title, name: x.name })
  );

  return {
    props: { countries, regions },
    revalidate: 120,
  };
}

const DatasetsDashboard: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = ({ regions, countries }) => {
  const { data: sessionData } = useSession();
  if (!sessionData) return <Loading />;

  return (
    <>
      <NextSeo title="My Organisation" />
      <DashboardLayout active="my-organization">
        <MyOrganizationTabContent regions={regions} countries={countries} />
      </DashboardLayout>
    </>
  );
};

export default DatasetsDashboard;
