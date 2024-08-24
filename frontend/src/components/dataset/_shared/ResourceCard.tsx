import { Resource } from "@portaljs/ckan";

export default function ResourceCard({
  resource,
  small,
}: {
  resource?: Resource;
  small?: boolean;
}) {
  const resourceTextColors = {
    PDF: "text-cyan-300",
    CSV: "text-emerald-300",
    JSON: "text-yellow-300",
    XLS: "text-orange-300",
    ODS: "text-amber-400",
    DOC: "text-red-300",
    SHP: "text-purple-400",
    HTML: "text-pink-300",
  };

  const textColor = resourceTextColors[
    resource?.format as keyof typeof resourceTextColors
  ]
    ? resourceTextColors[resource?.format as keyof typeof resourceTextColors]
    : "text-gray-200";

  let textSize: string;
  const charCountBreakpoint = 5;
  if (small) {
    if (resource?.format && resource?.format.length < charCountBreakpoint) {
      textSize = "text-lg";
    } else {
      textSize = "text-xs";
    }
  } else {
    if (resource?.format && resource?.format.length < charCountBreakpoint) {
      textSize = "text-2xl";
    } else {
      textSize = "text-lg";
    }
  }

  return (
    <div className="col-span-1 place-content-center md:place-content-start">
      <div
        className="bg-slate-900 rounded-lg max-w-[100px] min-w-[75px] mx-auto md:mx-0 flex place-content-center my-auto"
        style={{ minHeight: small ? "75px" : "100px" }}
      >
        {(resource && resource.format && (
          <span className={`${textColor} font-bold ${textSize} my-auto`}>
            {resource.format}
          </span>
        )) || (
          <span className="font-bold text-2xl text-gray-200 my-auto">NONE</span>
        )}
      </div>
    </div>
  );
}
