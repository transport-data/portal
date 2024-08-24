import { env } from "@env.mjs";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import classNames from "@utils/classnames";
import Link from "next/link";

export default function PublicPortalButton() {
  return (
    <Link
      href={env.NEXT_PUBLIC_PUBLIC_PORTAL_URL ?? '/'}
      target="_blank"
      className={classNames(
        "opacity-75 hover:bg-background-dark hover:text-primary-dark hover:opacity-100 dark:hover:bg-background dark:hover:text-primary",
        "group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
      )}
    >
      <ArrowTopRightOnSquareIcon
        className={classNames(
          "opacity-75 group-hover:opacity-100",
          "h-6 w-6 shrink-0"
        )}
        aria-hidden="true"
      />
      Public portal
    </Link>
  );
}
