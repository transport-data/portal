import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import UserMenuDropdown from "./UserMenuDropDown";
import { Disclosure } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BellIcon } from "@lib/icons";
import { Bell, BellDotIcon, LogOutIcon } from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  {
    href: "/datasets",
    name: "Datasets",
  },
  {
    href: "/geography",
    name: "Geography",
  },
  {
    href: "/data-provider",
    name: "Data Provider",
  },
  {
    href: "/about-us",
    name: "About Us",
  },
  {
    href: "/faq",
    name: "FAQ",
  },
];

export default function Header({
  backgroundColor = "bg-white",
}: {
  backgroundColor?: string;
}) {
  const { data: session, status } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };
  const isSysAdmin = session?.user?.sysadmin == true;

  return (
    <Disclosure
      as="nav"
      className="sticky top-0 z-20"
      style={{ background: backgroundColor }}
    >
      <div className="container py-[24px]">
        <div className="flex justify-between py-[4.5px]">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <svg
                className="sm:hidden"
                width="29"
                height="29"
                viewBox="0 0 29 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_1831_13231)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M28.4444 0.5H0V28.9444H28.4444V0.5ZM13.037 15.1964V24.2038H15.4074V14.2483L8.77035 7.61124H11.8518V5.24087H4.74072V12.352H7.11109V9.2705L13.037 15.1964Z"
                    fill="#006064"
                  />
                  <path
                    d="M19.6739 7.61134L15.8813 11.3447L17.5999 13.0632L21.3332 9.2706V12.3521H23.7036V5.24097H16.5925V7.61134H19.6739Z"
                    fill="#DFF64D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1831_13231">
                    <rect
                      width="28.4444"
                      height="28.4444"
                      fill="white"
                      transform="translate(0 0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <Image
                className="hidden sm:block"
                alt="Transport Data Commons"
                src="/images/logos/tdc-logo.svg"
                width={300}
                height={32}
              />
            </Link>
            <div className="ml-6 hidden space-x-6 lg:flex xl:ml-8 xl:space-x-8">
              {navigation.map((nav, i) => (
                <Link
                  key={i}
                  className="font-medium text-gray-900"
                  href={nav.href}
                >
                  {nav.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="ml-auto mr-[12px] flex sm:items-center">
            {status === "loading" ? (
              <div className="flex items-center gap-4">
                <Skeleton className="h-[20px] w-[20px]"></Skeleton>
                <Skeleton className="h-[32px] w-[32px] rounded-full"></Skeleton>
                <Skeleton className="h-[20px] w-[20px]"></Skeleton>
              </div>
            ) : session?.user ? (
              <div className="relative flex items-center gap-[12px]">
                <Link
                  target="_blank"
                  href="https://civicrm.changing-transport.org/form/tdci-newsletter"
                >
                  <BellIcon width={22} className="text-gray-500" />
                </Link>

                <button onClick={handleToggleDropdown}>
                  <Avatar className="h-[32px] w-[32px]">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback className="bg-gray-300">
                      {session.user.name
                        ?.trim()
                        .split(" ")
                        .map((word) => word[0])
                        .filter(Boolean)
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
                {showDropdown && (
                  <UserMenuDropdown
                    userName={session?.user?.name || ""}
                    userEmail={session.user.email}
                    isSysAdmin={isSysAdmin}
                    handleSignOut={handleSignOut}
                    fullName={(session?.user as any)?.fullName}
                    setShowDropdown={setShowDropdown}
                  />
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" className="relative" asChild>
                  <Link href="/auth/signin?callbackUrl=/dashboard">Log In</Link>
                </Button>
                <Button>
                  <Link href="/auth/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center lg:hidden">
            {/* Mobile menu button */}
            <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </Disclosure.Button>
          </div>
        </div>
      </div>

      <Disclosure.Panel className="lg:hidden">
        <div className="container space-y-1 px-0 pb-3 pt-2">
          {navigation.map((nav, i) => (
            <Disclosure.Button
              key={`nav-menu-${i}`}
              as={Link}
              href={nav.href}
              className="block  py-2 pl-3 pr-4 text-base font-medium text-gray-900"
            >
              {nav.name}
            </Disclosure.Button>
          ))}
        </div>
      </Disclosure.Panel>
    </Disclosure>
  );
}
