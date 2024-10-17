import { useRef, useEffect } from "react";
import Link from "next/link";

interface UserMenuDropdownProps {
  userName?: string;
  userEmail?: string;
  isSysAdmin: boolean;
  handleSignOut: () => void;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserMenuDropdown({
  userName,
  userEmail,
  isSysAdmin,
  handleSignOut,
  setShowDropdown,
}: UserMenuDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="absolute left-3 top-10 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div
        className="py-1"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div className="px-4 py-2 text-sm font-bold text-gray-900">
          {userName}
        </div>
        <div className="px-4 py-2 text-sm text-gray-500">{userEmail}</div>
        {isSysAdmin && (
          <div
            className="block px-4 py-2 text-sm font-bold text-gray-900"
            role="menuitem"
          >
            System Admin
          </div>
        )}
        <hr className="my-1" />
        <Link
          href="/dashboard"
          className="block px-4 py-2 text-sm text-gray-700"
          role="menuitem"
        >
          Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 text-left text-sm text-gray-700"
          role="menuitem"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
