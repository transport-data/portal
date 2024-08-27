import { Button } from "@components/ui/button";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  {
    href: "#",
    name: "Datasets",
  },
  {
    href: "#",
    name: "Geography",
  },
  {
    href: "#",
    name: "Data Provider",
  },
  {
    href: "#",
    name: "About Us",
  },
  {
    href: "#",
    name: "FAQ",
  },
];

export default function Header() {
  return (
    <Disclosure as="nav" className="sticky top-0 bg-white">
      <div className="container py-[24px]">
        <div className="flex justify-between py-[4.5px]">
          <div className="flex items-center">
            <Link href="/" className="flex flex-shrink-0 items-center">
              <Image
                alt="Transport Data Commons"
                src="/images/logos/tdc-logo.svg"
                width={300}
                height={32}
              />
            </Link>
            <div className="ml-6 hidden space-x-6 lg:flex xl:ml-8 xl:space-x-8">
              {navigation.map((nav, i) => (
                <a
                  key={i}
                  className="font-medium text-gray-900"
                  href={nav.href}
                >
                  {nav.name}
                </a>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:items-center lg:flex">
            <Button variant="ghost" className="relative">
              Log In
            </Button>
            <Button variant="tdc-primary">Sign up</Button>
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
              as="a"
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
