import { useState, Fragment } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Button } from "@components/ui/button";
import { Skeleton } from "@components/ui/skeleton";
import UserMenuDropdown from "./UserMenuDropDown";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { BellIcon } from "@lib/icons";
import { Bell, BellDotIcon, LogOutIcon } from "lucide-react";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

/* For mobile layout */
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
    name: "Data Providers",
  },
  {
    href: "/showroom",
    name: "Showroom",
  },
  { 
    href: "/knowledge-hub",
    name: "Knowledge Hub", 
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

const navGroups = [
  {
    title: "Datasets",
    href: "/datasets",
    items: [
      { name: "Topics", href: "/datasets" },
      { name: "Geography", href: "/geography" },
    ],
  },
  {
    title: "Contributors",
    href: "/data-provider",
    items: [
      { name: "Data Providers", href: "/data-provider" },
      { name: "Partners", href: "/partners" },
    ],
  },
  {
    title: "Insights",
    href: "/showroom",
    items: [
      { name: "Showroom", href: "/showroom" },
      { name: "Knowledge Hub", href: "/knowledge-hub" },
    ],
  },
  {
    title: "More",
    href: "/about-us",
    items: [
      { name: "About Us", href: "/about-us" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
    ],
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
            <div className="ml-6 hidden items-center gap-6 lg:flex xl:ml-8 xl:gap-8">
              {navGroups.map((group) => (
                <Menu as="div" key={group.title} className="relative">
                  <Menu.Button className="inline-flex items-center gap-2 font-medium text-gray-900">
                    <span>{group.title}</span>
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 top-full z-20 mt-3 w-44 origin-top-left rounded-md bg-white p-2 shadow-lg focus:outline-none">
                      {group.items.map((item) => (
                        <Menu.Item key={item.href}>
                          {({ active }) => (
                            <Link
                              href={item.href}
                              className={
                                "block rounded px-3 py-2 text-sm " +
                                (active ? "bg-gray-50 text-gray-900" : "text-gray-700")
                              }
                            >
                              {item.name}
                            </Link>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
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
                <button
                  onClick={() =>
                    window.open(
                      "https://civicrm.changing-transport.org/form/tdci-newsletter",
                      "newsletter",
                      "width=600,height=700,scrollbars=yes,resizable=yes"
                    )
                  }
                >
                  <BellIcon width={22} className="text-gray-500" />
                </button>

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
