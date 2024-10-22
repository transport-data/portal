import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "@utils/api";
import ApiTokensTab from "./ApiTokensTab";
import SysadminMangementTab from "./SysadminMangementTab";
import {
  SuccessAlert,
  ErrorAlert,
  TokenCreatedSuccessAlert,
} from "@components/_shared/Alerts";
import { SelectableItemsList } from "@components/ui/selectable-items-list";
import { KeyRound, User } from "lucide-react";

export default () => {
  const { data: sessionData } = useSession();
  const isSysAdmin = sessionData?.user?.sysadmin == true;

  const [selectedTab, setSelectedTab] = useState("API Keys");

  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createdToken, setCreatedToken] = useState("");
  const { data: tokens } = api.user.listApiTokens.useQuery();
  const sortedTokens = tokens
    ?.slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.created_at || 0).getTime() -
        new Date(a.created_at || 0).getTime()
    );
  const { data: allUsers } = api.user.list.useQuery();
  const adminUsers = allUsers?.filter((user) => user.sysadmin === true);
  const nonAdminUsers = allUsers?.filter((user) => user.sysadmin === false);
  return (
    <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:gap-8">
      <div className="mt-5 text-sm">
        <SelectableItemsList
          items={[
            {
              icon: <KeyRound size={14} />,
              isSelected: true,
              value: "API Keys",
            },
            ...(isSysAdmin
              ? [
                  {
                    icon: <User size={14} />,
                    isSelected: false,
                    value: "Sysadmins",
                  },
                ]
              : []),
          ]}
          onSelectedItem={(option) => setSelectedTab(option)}
          selected={selectedTab}
          title=""
        />
      </div>

      <div className="w-full">
        {showTokenPopup && (
          <TokenCreatedSuccessAlert
            token={createdToken}
            onClose={() => setShowTokenPopup(false)}
          />
        )}

        {successMessage && (
          <SuccessAlert
            text={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}
        {errorMessage && <ErrorAlert text={errorMessage} />}

        {selectedTab === "API Keys" ? (
          <ApiTokensTab
            tokens={sortedTokens}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            setShowTokenPopup={setShowTokenPopup}
            setCreatedToken={setCreatedToken}
          />
        ) : selectedTab === "Sysadmins" ? (
          <SysadminMangementTab
            adminUsers={adminUsers}
            nonAdminUsers={nonAdminUsers}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            setShowTokenPopup={setShowTokenPopup}
          />
        ) : (
          <div>Invalid Tab</div>
        )}
      </div>
    </div>
  );
};
