import { signOut, useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  CircleStackIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, useState } from "react";
import classNames from "@/utils/classnames";
import Loading from "./Loading";
import {
  BuildingLibraryIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
} from "@heroicons/react/20/solid";
import { ThemeSelector } from "./ThemeSelector";
import PublicPortalButton from "@components/frontend/PublicPortalButton";

export const Dashboard: React.FC<{
  children?: React.ReactNode;
  current?: string;
}> = ({ children, current }) => {
  const navigation = [
    {
      id: "dashboard",
      name: "Dashboard",
      href: "/",
      icon: ChartBarIcon,
    },
    {
      id: "datasets",
      name: "Datasets",
      href: "/datasets",
      icon: CircleStackIcon,
    },
    {
      id: "groups",
      name: "Groups",
      href: "/groups",
      icon: FolderIcon,
    },
    {
      id: "organizations",
      name: "Organizations",
      href: "/organizations",
      icon: BuildingLibraryIcon,
    },
    {
      id: "users",
      name: "Users",
      href: "/users",
      icon: UsersIcon,
    },
  ];

  const { data: sessionData } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  if (!sessionData) return <Loading />;
  return (
    <div className="text-primary dark:text-primary-dark">
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-2 dark:bg-background-dark">
                    <div className="flex h-16 shrink-0 items-center justify-between">
                      <Link
                        aria-label="Home page"
                        className="flex justify-center text-xl font-extrabold"
                        href="/"
                      >
                        <span>🌀 PortalJS</span>
                      </Link>
                      <ThemeSelector />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <PublicPortalButton />
                          <ul role="list" className="-mx-2 space-y-1">
                            <li className="mb-5 border-b border-b-slate-700 pb-5"></li>
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    item.id === current
                                      ? "bg-background-dark text-primary-dark opacity-100 dark:bg-background dark:text-primary"
                                      : "opacity-75 hover:bg-background-dark hover:text-primary-dark hover:opacity-100 dark:hover:bg-background dark:hover:text-primary",
                                    "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.id === current
                                        ? "opacity-100"
                                        : "opacity-75 group-hover:opacity-100",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 dark:bg-background-dark">
            <div className="flex h-16 shrink-0 items-center justify-between">
              <Link
                aria-label="Home page"
                className="flex justify-center text-xl font-extrabold"
                href="/"
              >
                <span>🌀 PortalJS</span>
              </Link>
              <ThemeSelector />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    <li className="b-5 mb-5 border-b border-b-slate-200 dark:border-b-slate-700">
                      <PublicPortalButton />
                    </li>
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            item.id === current
                              ? "bg-background-dark text-primary-dark opacity-100 dark:bg-background dark:text-primary"
                              : "opacity-75 hover:bg-background-dark hover:text-primary-dark hover:opacity-100 dark:hover:bg-background dark:hover:text-primary",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.id === current
                                ? "opacity-100"
                                : "opacity-75 group-hover:opacity-100",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <Link
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-primary hover:bg-background-dark hover:text-primary-dark dark:text-primary-dark dark:hover:bg-background dark:hover:text-primary"
                  >
                    {sessionData.user.image && (
                      <img
                        className="h-8 w-8 rounded-full bg-slate-900"
                        src={sessionData.user.image}
                        alt=""
                      />
                    )}
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">{sessionData.user.name}</span>
                  </Link>
                  <button
                    className="flex w-full items-center gap-x-4 px-6 py-2 text-sm font-semibold leading-6 text-primary hover:bg-background-dark hover:text-primary-dark dark:text-primary-dark dark:hover:bg-background dark:hover:text-primary"
                    onClick={() =>
                      void signOut({
                        callbackUrl: "/auth/signin",
                      })
                    }
                  >
                    Sign out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm dark:bg-background-dark sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-primary dark:text-primary-dark lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            {sessionData.user.image && (
              <img
                className="h-8 w-8 rounded-full bg-slate-900"
                src={sessionData.user.image}
                alt=""
              />
            )}
          </a>
        </div>

        <main className="min-h-screen bg-slate-50 py-10 dark:bg-slate-800 lg:pl-72">
          {children}
        </main>
      </div>
    </div>
  );
};
