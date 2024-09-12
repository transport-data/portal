import { api } from "@utils/api";
import { useLayoutEffect, useRef, useState } from "react";
import type { Organization, User } from "@portaljs/ckan";
import Modal from "@components/_shared/Modal";
import { EditMemberForm } from "@components/organization/EditMemberForm";
import notify from "@utils/notify";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";

interface OrganizationsUsersTableProps {
  name: string;
}

type Member = User & { capacity: "admin" | "editor" | "member" };

export const OrganizationUsersTable: React.FC<OrganizationsUsersTableProps> = ({
  name,
}: OrganizationsUsersTableProps) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [editingUser, setEditingMember] = useState<Member | null>(null);
  const { data: organization } = api.organization.get.useQuery({
    name,
    includeUsers: true,
  });

  const users: Member[] = (organization?.users as Member[]) ?? [];

  const utils = api.useContext();
  const removeMembers = api.organization.removeMembers.useMutation({
    onSuccess: async () => {
      await utils.organization.get.invalidate();
      setSelectedUsers([]);
    },
    onError: (e) => {
      notify(e.message, "error");
    },
  });

  useLayoutEffect(() => {
    if (users) {
      const isIndeterminate =
        selectedUsers.length > 0 && selectedUsers.length < users.length;
      setChecked(selectedUsers.length === users.length);
      setIndeterminate(isIndeterminate);
      if (checkbox.current) checkbox.current.indeterminate = isIndeterminate;
    }
  }, [selectedUsers, users]);

  function toggleAll() {
    if (users) {
      setSelectedUsers(checked || indeterminate ? [] : users);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  return (
    <>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="relative">
            {selectedUsers.length > 0 && (
              <div className="absolute left-14 top-0 flex h-12 items-center space-x-3 sm:left-12">
                {!removeMembers.isLoading ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeMembers.mutate({
                        usernames: selectedUsers.map((u) => u.name) as string[],
                        id: organization!.id,
                      });
                    }}
                    className="inline-flex items-center rounded z-10 bg-background px-2 py-1 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white dark:bg-background-dark dark:ring-slate-600"
                  >
                    Remove from organization
                  </button>
                ) : (
                  <div className="loader mb-4 h-4 w-4 rounded-full border-4 border-t-4 border-gray-200 ease-linear"></div>
                )}
              </div>
            )}
            <div className="ring-1 ring-gray-300 dark:ring-slate-600 sm:mx-0 sm:rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" className="relative px-7 sm:w-12 sm:px-6">
                      <input
                        type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        ref={checkbox}
                        checked={checked}
                        onChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Name
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Capacity
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      State
                    </TableHead>
                    <TableHead
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold"
                    >
                      Edit
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organization && (
                    <>
                      {users.map((user) => (
                        <TableRow
                          key={user.name}
                          className={
                            selectedUsers.includes(user)
                              ? "bg-gray-50 dark:bg-slate-700"
                              : undefined
                          }
                        >
                          <TableCell className="relative px-7 sm:w-12 sm:px-6">
                            {selectedUsers.includes(user) && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-stone-900" />
                            )}
                            <input
                              type="checkbox"
                              className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-accent text-accent"
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
                          </TableCell>
                          <TableCell>
                            {user.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="success" className="text-sm capitalize">{user.capacity}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-sm capitalize">{user.state}</Badge>
                          </TableCell>
                          <TableCell className="whitespace-nowrap px-3 py-4 text-sm font-medium">
                            <Button
                              onClick={() => setEditingMember(user)}
                              variant="secondary"
                              className="opacity-75 hover:opacity-100"
                            >
                              Edit
                              <span className="sr-only">, {user.name}</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Edit member"
        show={!!editingUser}
        setShow={() => setEditingMember(null)}
      >
        {editingUser && organization && (
          <EditMemberForm user={editingUser} organization={organization} />
        )}
      </Modal>
    </>
  );
};

export default OrganizationUsersTable;
