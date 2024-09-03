export default function SearchDropdownHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full shrink-0 items-center gap-2  text-gray-900">
      <span className="w-fit text-sm font-semibold">{title}</span>
      <span className="ml-auto mr-auto h-[1px] grow bg-gray-200"></span>
      {children}
    </div>
  );
}
