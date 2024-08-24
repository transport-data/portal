import type { DataPackage } from "@interfaces/datapackage.interface";

export const MetadataPreview: React.FC<{ datapackage: DataPackage }> = ({
  datapackage,
}) => {
  return (
    <div>
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Dataset
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Resource
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Format
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white text-left">
            {datapackage.resources.length > 0 && (
              <tr>
                <td className="px-3 py-4 pl-4 text-sm text-gray-500">
                  <div className="text-gray-900">{datapackage.name}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="text-gray-900">
                    {datapackage.resources[0]?.name}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                    {datapackage.resources[0]?.format}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
