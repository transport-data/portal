import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useSession } from "next-auth/react";
import Loading from "@components/_shared/Loading";
import { NextSeo } from "next-seo";
import DashboardLayout from "@components/_shared/DashboardLayout";
import MyOrganizationTabContent from "@components/dashboard/MyOrganizationTabContent";
import { listGroups } from "@utils/group";
import { Facet } from "@components/_shared/DatasetsFilter";

export async function getServerSideProps({ session }: any) {
  const regions: Facet[] = [];
  const countries: Facet[] = [];

  const geographies = await listGroups({
    type: "geography",
    apiKey: session?.user.apikey ?? "",
  });

  geographies.forEach((x: any) =>
    x.geography_type === "country"
      ? countries.push({ count: 0, display_name: x.title, name: x.name })
      : regions.push({ count: 0, display_name: x.title, name: x.name })
  );

  return {
    props: { countries, regions },
  };
}

const DatasetsDashboard: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
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
