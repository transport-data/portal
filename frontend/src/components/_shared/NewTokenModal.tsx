import { Button } from "@components/ui/button";

export const NewTokenModal = ({
  value,
  setValue,
  onClose,
  onSubmit,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-96 rounded-lg bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-2 top-2">
          ✖️
        </button>
        <h2 className="mb-4 text-xl font-bold">Create a new API Token</h2>
        <input
          type="text"
          placeholder="api_token"
          className="mb-4 w-full border p-2"
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          required
        />
        <Button
          type="button"
          onClick={onSubmit}
          className={"w-full " + (value === "" ? "disabled:opacity-50" : "")}
          disabled={value === ""}
        >
          Create Token
        </Button>
      </div>
    </div>
  );
};
