import { api } from "@utils/api";
import { useLayoutEffect, useRef, useState } from "react";
import type { Organization } from "@schema/organization.schema";
import Modal from "@components/_shared/Modal";
import { EditOrganizationForm } from "./EditOrganizationForm";
import Link from "next/link";

export const OrganizationsTable: React.FC<{ publicUrl: string }> = ({
  publicUrl,
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedOrganizations, setSelectedOrganizations] = useState<
    Organization[]
  >([]);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const { data: userOrganizations } =
    api.organization.listForUser.useQuery();
  const { data: organizations } =
    api.organization.list.useQuery();

  const utils = api.useContext();
  const deleteOrganizations = api.organization.delete.useMutation({
    onSuccess: async () => {
      await utils.organization.list.invalidate();
      await utils.organization.listForUser.invalidate();
    },
  });

  useLayoutEffect(() => {
    if (organizations) {
      const isIndeterminate =
        selectedOrganizations.length > 0 &&
        selectedOrganizations.length < organizations.length;
      setChecked(selectedOrganizations.length === organizations.length);
      setIndeterminate(isIndeterminate);
      if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedOrganizations, organizations]);

  function toggleAll() {
    if (organizations) {
      setSelectedOrganizations(checked || indeterminate ? [] : organizations);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedOrganizations.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                {!deleteOrganizations.isLoading ? (
                  <button
                    type="button"
                    onClick={() => {
                      deleteOrganizations.mutate({
                        ids: selectedOrganizations.map((dataset) => dataset.id),
                      });
                    }}
                    className="inline-flex items-center rounded bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white dark:bg-background-dark dark:ring-slate-600"
                  >
                    Delete all
                  </button>
                ) : (
                  <div className="loader mb-4 h-4 w-4 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
                )}
              </div>
            )}
            <div className="ring-1 ring-gray-300 dark:ring-slate-600 sm:mx-0 sm:rounded-lg">
              <table className="min-w-full table-fixed divide-y divide-gray-300 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-stone-900 focus:ring-stone-900"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Public link
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Edit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {organizations && userOrganizations && (
                    <>
                      {organizations.map((organization) => (
                        <tr
                          key={organization.name}
                          className={
                            selectedOrganizations.includes(organization)
                              ? "bg-gray-50 dark:bg-slate-700"
                              : undefined
                          }
                        >
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedOrganizations.includes(organization) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-900" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-stone-900"
                              value={organization.name}
                              checked={selectedOrganizations.includes(
                                organization
                              )}
                              onChange={(e) =>
                                setSelectedOrganizations(
                                  e.target.checked
                                    ? [...selectedOrganizations, organization]
                                    : selectedOrganizations.filter(
                                        (p) => p !== organization
                                      )
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                            {organization.name}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {organization.title}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {organization.description}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            <Link href={`${publicUrl}/${organization.name}`}>
                              Public link
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            {userOrganizations.find(
                              (org) => org.name === organization.name
                            ) && (
                              <a
                                href={`/dashboard/organizations/${organization.name}/edit`}
                                className="opacity-75 hover:opacity-100"
                              >
                                Edit
                                <span className="sr-only">
                                  , {organization.name}
                                </span>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit organization"
        show={!!editingOrganization}
        setShow={() => setEditingOrganization(null)}
      >
        {editingOrganization && (
          <EditOrganizationForm initialValues={editingOrganization} />
        )}
      </Modal>
    </>
  );
};

export default OrganizationsTable;
