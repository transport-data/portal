import { GetServerSideProps } from "next";
import { getDataset } from "@utils/dataset";
import { Dataset } from "@interfaces/ckan/dataset.interface";
import { getServerAuthSession } from "@server/auth";
import IndexDatasetPage from "@components/dataset/individualPage/Index";
import { groupTree } from "@utils/group";
import { GroupTree } from "@schema/group.schema";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const datasetName = context.params?.dataset;
    const session = await getServerAuthSession(context);
    //if session is not there redirect to unauthorized page
    if (!session) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }
    if (!datasetName) {
      return {
        notFound: true,
      };
    }
    let dataset = await getDataset({
      id: datasetName as string,
      apiKey: session?.user.apikey,
      include_extras: true,
    });

    if (!dataset.result) {
      return {
        notFound: true,
      };
    }
    const locationsGroup = await groupTree({
      type: "geography",
    });
    return {
      props: {
        dataset: dataset.result,
        locationsGroup,
      },
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
  locationsGroup,
}: {
  dataset: Dataset;
  locationsGroup: GroupTree[];
}): JSX.Element {
  return <IndexDatasetPage dataset={dataset} locationsGroup={locationsGroup} />;
}
