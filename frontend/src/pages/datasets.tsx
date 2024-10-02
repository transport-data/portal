import type { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { unstable_serialize } from "swr";
import Layout from "../components/_shared/Layout";
import { PackageSearchOptions } from "@portaljs/ckan";
import { CKAN } from "@portaljs/ckan";
import { env } from "@env.mjs";
import Heading from "@components/_shared/Heading";
import SearchBar from "@components/search/SearchBar";
import Image from "next/image";
import Link from "next/link";
import { listGroups } from "@utils/group";
import { listOrganizations } from "@utils/organization";
import React from "react";

export async function getServerSideProps(ctx: any) {
  const backend_url = env.NEXT_PUBLIC_CKAN_URL;
  const ckan = new CKAN(backend_url);
  const search_result = await ckan.packageSearch({
    offset: 0,
    limit: 5,
    tags: [],
    groups: [],
    orgs: [],
  });
  const groups = await listGroups({
    type: 'topic',
    apiKey: ctx.session?.apiKey || ""
  });
  const tags = await ckan.getAllTags();
  const orgs = await listOrganizations({
    input: {
      includeUsers: false,
      detailed: true
    }
  })
  return {
    props: {
      fallback: {
        [unstable_serialize([
          "package_search",
          { offset: 0, limit: 5, tags: [], groups: [], orgs: [] },
        ])]: search_result,
      },
      groups,
      tags,
      orgs,
    },
  };
}

export default function DatasetsPage({
  fallback,
  groups,
  tags,
  orgs,
}: InferGetServerSidePropsType<typeof getServerSideProps>): JSX.Element {
  const router = useRouter();
  const { q } = router.query;
  const [options, setOptions] = useState<PackageSearchOptions>({
    offset: 0,
    limit: 5,
    tags: [],
    groups: [],
    orgs: [],
    query: q as string,
  });

  const _groups = [
    {
      title: "Most viewed",
      iconUrl: "/images/icons/group-mostviewd.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },

    {
      title: "TDC Harmonised",
      iconUrl: "/images/icons/group-hamornised.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "Aviation",
      iconUrl: "/images/icons/group-aviation.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "Most viewed",
      iconUrl: "/images/icons/group-default.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "TDC Harmonised",
      iconUrl: "/images/icons/group-default.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "Aviation",
      iconUrl: "/images/icons/group-aviation.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "Most viewed",
      iconUrl: "/images/icons/group-default.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "TDC Harmonised",
      iconUrl: "/images/icons/group-default.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
    {
      title: "Aviation",
      iconUrl: "/images/icons/group-aviation.png",
      datasets: [
        {
          title: "Vehicle Registration Data",
          url: "/#",
        },
        {
          title: "Urban Mobility",
          url: "/#",
        },
        {
          title: "Road Safety Data",
          url: "/#",
        },
        {
          title: "Fuel Economy Data",
          url: "/#",
        },
        {
          title: "Road Network Data",
          url: "/#",
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Datasets</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect={true}>
        <div className="container">
          <div className="mx-auto flex flex-col pt-[96px] lg:max-w-[672px]">
            <Heading>Transport Data Commons</Heading>
            <p className="mt-4 text-center text-xl font-normal text-gray-500">
              Transport and mobility insights and facts across 32 institutions
              and 120+ countries.
            </p>
            <div className="mt-8 ">
              <SearchBar />
            </div>
            <p className="mt-[20px] text-center text-sm font-normal text-gray-500">
              You can also browse the topics below to find what you are looking
              for.
            </p>
          </div>
          <div className="pb-[96px] pt-[80px]">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {_groups.map((group, i) => (
                <div
                  key={`group-${i}`}
                  className="flex flex-col gap-[20px] rounded-[8px] bg-white p-5 shadow-[0px_1px_3px_0px_#0000001A]"
                >
                  <Image
                    src={group.iconUrl}
                    width={48}
                    height={48}
                    alt={group.title}
                  />
                  <div className="flex flex-col gap-4">
                    <span className="block text-lg font-semibold leading-tight text-gray-900">
                      {group.title}
                    </span>
                    <ul className="flex flex-col gap-[12px]">
                      {group.datasets.map((item, x) => (
                        <Link
                          href={item.url}
                          key={`group-${i}-${x}`}
                          className="text-sm font-medium text-gray-500"
                        >
                          {item.title}
                        </Link>
                      ))}
                    </ul>
                    <Link className="text-sm font-medium text-accent" href="#">
                      Show all
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
