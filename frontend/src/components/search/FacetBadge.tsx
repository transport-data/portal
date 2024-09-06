export default function FacetBadge({ name }: { name?: string }) {
  return (
    <span className="rounded border border-gray-200 bg-gray-100 px-[5px] py-[1px] text-xs font-medium text-gray-800">
      {name}
    </span>
  );
}
