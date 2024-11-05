import { Trash2 } from "lucide-react";
import { api } from "@utils/api";
import { useState } from "react";
import { NewTokenModal } from "@components/_shared/NewTokenModal";
import { Calendar } from "lucide-react";
import { Button } from "@components/ui/button";
import { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/ui/pagination";

export interface Token {
  id: string;
  name: string;
  user_id: string;
  last_access?: string;
  created_at: string;
}
export default ({
  tokens,
  setErrorMessage,
  setSuccessMessage,
  setShowTokenPopup,
  setCreatedToken,
}: {
  tokens: Token[];
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  setShowTokenPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatedToken: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [tokenSelected, setTokenSelected] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const utils = api.useContext();
  const revokeApiKey = api.user.revokeApiToken.useMutation({
    onSuccess: async () => {
      setSuccessMessage("Token revoked successfully!");
      setShowTokenPopup(false);
      await utils.user.listApiTokens.invalidate();
    },
    onError: () => {
      setErrorMessage("Error occurred while revoking the token.");
      setShowTokenPopup(false);
    },
  });

  const createApiKey = api.user.createApiToken.useMutation({
    onSuccess: async (response) => {
      setCreatedToken(response.result.token);
      setShowTokenPopup(true);
      setIsNewTokenModalOpen(false);
      setTokenName("");
      await utils.user.listApiTokens.invalidate();
    },
    onError: () => {
      setIsNewTokenModalOpen(false);
      setErrorMessage("Error occurred while creating the token.");
      setShowTokenPopup(false);
    },
  });

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tokens?.slice(startIndex, endIndex);
  }, [tokens, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((tokens?.length || 0) / itemsPerPage);

  return (
    <div>
      <div className="mb-2 flex">
        <Button
          onClick={() => setIsNewTokenModalOpen(true)}
          className="ml-auto px-4 py-2 font-bold"
        >
          New Token
        </Button>
      </div>
      <div>
        {paginatedData && paginatedData.length > 0 ? (
          paginatedData.map((token: any, index: number) => (
            <div
              key={token.id}
              className={`cursor-pointer p-4 text-sm 
              ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              hover:bg-gray-200
            `}
            >
              <div className="mb-2 flex justify-between">
                <div className="flex flex-col gap-1">
                  <div>
                    <span className="font-bold">Name:</span> {token.name}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span className="font-bold">Created at:</span>{" "}
                    {new Date(token.created_at)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, ".")}
                  </div>
                  {token.last_access && (
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span className="font-bold">Last Access: </span>{" "}
                      {new Date(token.last_access)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, ".")}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <Trash2
                    onClick={() => {
                      setTokenSelected(token.id);
                      setIsConfirmationModalOpen(true);
                    }}
                    className="cursor-pointer"
                    size={24}
                    color="red"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center">
            <h2 className="text-lg">No Api Keys Found</h2>
          </div>
        )}
      </div>
      {isNewTokenModalOpen && (
        <NewTokenModal
          value={tokenName}
          setValue={setTokenName}
          onClose={() => setIsNewTokenModalOpen(false)}
          onSubmit={() => {
            if (tokenName.toLowerCase().includes("frontend")) {
              setIsNewTokenModalOpen(false);
              setErrorMessage(
                "Your token name should not include 'frontend' in it."
              );
            } else {
              createApiKey.mutate({ name: tokenName });
            }
          }}
        />
      )}
      {isConfirmationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsConfirmationModalOpen(false)}
              className="absolute right-2 top-2"
            >
              ✖️ {/* TODO REMOVE THIS CHARACTER FROM HERE AND USE A ICON COMPONENT */}
            </button>
            <h3 className="mb-4">Are you sure you want to revoke the token</h3>
            <Button
              type="button"
              onClick={() => {
                setIsConfirmationModalOpen(false);
                setTokenSelected("");
              }}
              className="mr-3 border-2 bg-white px-12 text-black hover:text-white"
            >
              No
            </Button>
            <Button
              type="button"
              onClick={() => {
                revokeApiKey.mutate({ id: tokenSelected });
                setTokenSelected("");
                setIsConfirmationModalOpen(false);
              }}
              className="px-16"
            >
              Yes
            </Button>
          </div>
        </div>
      )}
      {paginatedData && paginatedData.length > 0 && (
        <Pagination className="mt-2">
          <PaginationContent>
            <PaginationPrevious
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationNext
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
