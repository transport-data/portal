import Link from "next/link";

export default () => (
  <div className="text-xs sm:w-[256px]">
    <h3 className="mb-6 text-sm font-semibold">Guidelines</h3>
    <section className="mb-3 flex items-center border-y-2 border-[#D1D5DB] py-4">
      <p>
        Be sure to mark someone’s comment as an answer if it helps you resolve
        your question — they deserve the credit! 💕
      </p>
    </section>
    <Link className="flex items-center gap-1" href={"#"}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.99967 8H9.99967M5.99967 10.6667H9.99967M11.333 14H4.66634C4.31272 14 3.97358 13.8595 3.72353 13.6095C3.47348 13.3594 3.33301 13.0203 3.33301 12.6667V3.33333C3.33301 2.97971 3.47348 2.64057 3.72353 2.39052C3.97358 2.14048 4.31272 2 4.66634 2H8.39034C8.56714 2.00004 8.73668 2.0703 8.86167 2.19533L12.471 5.80467C12.596 5.92966 12.6663 6.0992 12.6663 6.276V12.6667C12.6663 13.0203 12.5259 13.3594 12.2758 13.6095C12.0258 13.8595 11.6866 14 11.333 14Z"
          stroke="#9CA3AF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Community guidelines
    </Link>
  </div>
);
