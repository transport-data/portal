import { Dispatch, SetStateAction, useState } from 'react';
import getConfig from 'next/config';
import useSWR from 'swr';
import { PackageSearchOptions, CKAN } from '@portaljs/ckan';
import DatasetCard from './DatasetCard';
import Pagination from './Pagination';
import { env } from '@env.mjs';

const backend_url = env.NEXT_PUBLIC_CKAN_URL

export default function ListOfDatasets({
  options,
  setOptions,
  urlPrefix = '', // TODO: deprecate this
  urlFormat,
  showOrg,
}: {
  options: PackageSearchOptions;
  setOptions: Dispatch<SetStateAction<PackageSearchOptions>>;
  urlPrefix?: string;
  urlFormat?: string;
  showOrg?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 homepage-padding">
      <ListItems
        setOptions={setOptions}
        options={options}
        urlPrefix={urlPrefix}
        urlFormat={urlFormat}
        showOrg={showOrg}
      />
      <div style={{ display: 'none' }}>
        <ListItems
          setOptions={setOptions}
          options={{ ...options, offset: options.offset + 5 }}
        />
      </div>
    </div>
  );
}

function ListItems({
  options,
  setOptions,
  urlPrefix = '',
  urlFormat,
  showOrg,
}: {
  options: PackageSearchOptions;
  setOptions: Dispatch<SetStateAction<PackageSearchOptions>>;
  urlPrefix?: string;
  urlFormat?: string;
  showOrg?: boolean;
}) {
  const { data } = useSWR(['package_search', options], async () => {
    const ckan = new CKAN(backend_url)
    return ckan.packageSearch({ ...options })
  }
  );
  //Define which page buttons are going to be displayed in the pagination list
  const [subsetOfPages, setSubsetOfPages] = useState(0);

  return (
    <>
      <h2 className="text-4xl capitalize font-bold text-zinc-900">
        {data?.count} Datasets
      </h2>
      {data?.datasets?.map((dataset) => (
        <DatasetCard
          key={dataset.id}
          dataset={dataset}
          showOrg={showOrg ?? false}
          urlPrefix={urlPrefix}
          urlFormat={urlFormat}
        />
      ))}
      {data?.count && (
        <Pagination
          options={options}
          subsetOfPages={subsetOfPages}
          setSubsetOfPages={setSubsetOfPages}
          setOptions={setOptions}
          count={data.count}
        />
      )}
    </>
  );
}
