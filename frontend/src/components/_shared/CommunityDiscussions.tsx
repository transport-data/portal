import Link from "next/link";

export default () => (
  <div className="text-xs sm:w-[256px]">
    <h3 className="mb-6 text-sm font-semibold">Discussions</h3>
    <section className="mb-3 flex items-center border-t-2 border-[#D1D5DB] py-4">
      <p>
        We want to hear from you. Kindly give us any Feedback or start a
        conversation in our
        <Link
          className="flex underline items-center gap-1"
          target="_blank"
          href={
            "https://github.com/orgs/transport-data/discussions/categories/user-feedback"
          }
        >
          GitHub Discussion Group
        </Link>
      </p>
    </section>
  </div>
);
