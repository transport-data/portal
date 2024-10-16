import { GetStaticProps } from "next";
import { Dataset as DatasetType } from "@portaljs/ckan";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import { getDataset } from "@utils/dataset";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import IndexDatasetPage from "@components/dataset/individualPage/Index";

const backend_url = env.NEXT_PUBLIC_CKAN_URL;

export async function getStaticPaths() {
  const ckan = new CKAN(backend_url);
  const paths = (
    await ckan.getDatasetsListWithDetails({ offset: 0, limit: 1000 })
  ).map((dataset: DatasetType) => ({
    params: {
      dataset: dataset.name,
      org: dataset.organization?.name ?? "no-org",
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const datasetName = context.params?.dataset;
    if (!datasetName) {
      return {
        notFound: true,
      };
    }
    let dataset = await getDataset({
      id: datasetName as string,
      apiKey: "",
      include_extras: true,
    });
    if (!dataset.result) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        dataset: dataset.result,
      },
      revalidate: 1800,
    };
  } catch (e) {
    const error = e as any;
    if (error && error.error && error.error.__type == "Authorization Error") {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }
    return {
      notFound: true,
    };
  }
};

export default function DatasetPage({
  dataset,
}: {
  dataset: Dataset;
}): JSX.Element {
  return <IndexDatasetPage dataset={dataset} />;
}
