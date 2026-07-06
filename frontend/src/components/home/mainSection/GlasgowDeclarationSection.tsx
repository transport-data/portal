import { Button } from "@components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function GlasgowDeclarationSection() {
  return (
    <section
      className="container py-[96px]"
      aria-labelledby="glasgow-declaration-heading"
    >
      <div className="grid gap-8 rounded-[32px] border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-stretch lg:gap-10 lg:p-10">
        <div className="flex flex-col justify-center">

          <h2
            id="glasgow-declaration-heading"
            className="text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl"
          >
            Glasgow Declaration on a Transport Data Commons
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-500">
            The Glasgow Declaration sets out a shared commitment to make
            transport data more open, accessible, and useful for climate
            action and sustainable development. Developed with partners from
            across the transport, data, and climate communities, it calls for
            stronger collaboration around data sharing, capacity building, and
            long-term support for the Transport Data Commons. Organisations and
            individuals are invited to read the Declaration and add their
            support.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild className="w-fit">
              <Link
                href="https://docs.google.com/document/d/1sFLG9mBvWYL4UZQ4eUQ3fqKqcXGJDut-ZxwwxJQV_w0/edit?tab=t.0#heading=h.b7yuhdbiv6y8"
                target="_blank"
                rel="noreferrer"
                aria-label="Read the Glasgow Declaration in a new tab"
              >
                Read the Declaration
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              className="w-fit border border-gray-200 hover:bg-slate-50"
            >
              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSc7H2hbROur5x3Jc5iVf6G6Yo-0eBRCHQyBip752D_yTvtBVg/viewform"
                target="_blank"
                rel="noreferrer"
                aria-label="Sign the Glasgow Declaration in a new tab"
              >
                Sign the Declaration
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex h-full min-h-[280px] items-stretch lg:min-h-[360px]">
          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50 shadow-sm">
            <Image
              src="/images/ACTION-COMMITMENT-1080x810.png"
              alt="UN Decade Support"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}