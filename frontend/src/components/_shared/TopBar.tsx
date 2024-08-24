import { Button } from "@components/ui/button";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

function LoginButton() {
  const session = useSession();
  if (!session.data) {
    return (
      <Button asChild variant="secondary">
        <Link href="/auth/signin">Login</Link>
      </Button>
    );
  }
  return (
    <Button asChild variant="secondary">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-transparent">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <span className="sr-only">Datopian</span>
          <Link href="/">
            <img
              src="/images/logos/MainLogo.svg"
              width="60px"
              height="60px"
              alt="Portal"
            ></img>
          </Link>
          <div className="hidden lg:flex lg:gap-x-12">
            <li className="align-center flex justify-between gap-x-8">
              <Link href="/search" className="my-auto font-semibold text-white">
                DATASETS
              </Link>
              <Link
                href="/organizations"
                className="my-auto font-semibold text-white"
              >
                ORGANIZATIONS
              </Link>
              <Link href="/groups" className="my-auto font-semibold text-white">
                GROUPS
              </Link>
            </li>
          </div>
        </div>
        <li className="hidden lg:block">
          <LoginButton />
        </li>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md bg-white p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <span className="sr-only">Datopian</span>
            <Link href="/" className="-m-1.5 p-1.5">
              <img
                src="/images/logos/MainLogo.svg"
                width="60px"
                height="60px"
                alt="Portal"
              ></img>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="flex flex-col space-y-2 py-6">
                <LoginButton />
                <Link
                  href="/search"
                  className="my-auto font-semibold text-white"
                >
                  DATASETS
                </Link>
                <Link
                  href="/organizations"
                  className="my-auto font-semibold text-white"
                >
                  ORGANIZATIONS
                </Link>
                <Link
                  href="/groups"
                  className="my-auto font-semibold text-white"
                >
                  GROUPS
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
