import { api } from "@utils/api";
import { useState } from "react";
import AddSysadminModal from "@components/_shared/AddSysadminModal";
import { Button } from "@components/ui/button";
import { useRef } from "react";
import { User } from "@interfaces/ckan/user.interface";

export default ({
  adminUsers,
  nonAdminUsers,
  setErrorMessage,
  setSuccessMessage,
  setShowTokenPopup,
}: {
  adminUsers?: User[];
  nonAdminUsers?: User[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowTokenPopup: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const [isAddSysadminModalOpen, setIsAddSysadminModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUserSelected, setIsNewUserSelected] = useState(false);

  const utils = api.useContext();
  const patchUser = api.user.patch.useMutation({
    onSuccess: async () => {
      if (isNewUserSelected) {
        setSuccessMessage(
          `${selectedUser?.display_name} is successfully promoted to Sysadmin`
        );
        setIsNewUserSelected(false);
        setSelectedUser(null);
      } else {
        setSuccessMessage("User demoted successfully");
      }
      setShowTokenPopup(false);
      setIsAddSysadminModalOpen(false);
      await utils.user.list.invalidate();
    },
    onError: () => {
      setShowTokenPopup(false);
      setErrorMessage("Error occurred");
      setIsAddSysadminModalOpen(false);
    },
  });
  const removeSysadminUsers = api.user.removeSysadminUsers.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Successfully removed Sysadmins");
      await utils.user.list.invalidate();
      setSelectedUsers([]);
    },
    onError: () => {
      setErrorMessage("Error occurred");
    },
  });
  function toggleAll() {
    if (adminUsers) {
      setSelectedUsers(checked || indeterminate ? [] : adminUsers);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }
  return (
    <div>
      <div className="mb-2 flex">
        <Button
          onClick={() => setIsAddSysadminModalOpen(true)}
          className="ml-auto px-4 py-2 font-bold"
        >
          New Sysadmin
        </Button>
      </div>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedUsers.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                {!removeSysadminUsers.isLoading ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeSysadminUsers.mutate({
                        ids: selectedUsers.map((user) => user.id ?? ""),
                      });
                    }}
                    className="dark:bg-background-dark inline-flex items-center rounded bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white dark:ring-slate-600"
                  >
                    Remove all
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
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
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
                      State
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                  {adminUsers && (
                    <>
                      {adminUsers.map((user: any) => (
                        <tr
                          key={user.name}
                          className={
                            selectedUsers.includes(user)
                              ? "bg-gray-50 dark:bg-slate-700"
                              : undefined
                          }
                        >
                          <td className="relative px-7 sm:w-12 sm:px-6">
                            {selectedUsers.includes(user) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-900" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-accent"
                              value={user.name}
                              checked={selectedUsers.includes(user)}
                              onChange={(e) =>
                                setSelectedUsers(
                                  e.target.checked
                                    ? [...selectedUsers, user]
                                    : selectedUsers.filter((p) => p !== user)
                                )
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm opacity-75">
                            {user.name}
                          </td>
                          <td className="px-3 py-4 text-sm opacity-75">
                            {user.state}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <button
                              onClick={() =>
                                patchUser.mutate({
                                  id: user.id,
                                  name: user.name,
                                  email: user.email,
                                  sysadmin: false,
                                })
                              }
                              className="text-red-400 opacity-75 hover:opacity-100"
                            >
                              Remove
                              <span className="sr-only">, {user.name}</span>
                            </button>
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
      {isAddSysadminModalOpen && (
        <AddSysadminModal
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          options={nonAdminUsers}
          onClose={() => setIsAddSysadminModalOpen(false)}
          onSubmit={() => {
            setIsNewUserSelected(true);
            patchUser.mutate({
              id: selectedUser?.id || "",
              name: selectedUser?.name || "",
              email: selectedUser?.email || "",
              sysadmin: true,
            });
          }}
        />
      )}
    </div>
  );
};
