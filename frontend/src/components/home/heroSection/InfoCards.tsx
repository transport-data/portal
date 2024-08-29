import {
  CircleStackIcon,
  MagnifyingGlassCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/20/solid";

interface IconProps {
  className?: string;
}

const infoCards = [
  {
    icon: (props: IconProps) => <CircleStackIcon {...props} />,
    title: "Open Data",
    description:
      "TDC enables cross-sector collaboration by allowing organisations to share and access transportation-related data.",
  },
  {
    icon: (props: IconProps) => <ShieldCheckIcon {...props} />,
    title: "Data provision",
    description:
      "TDC supports data providers with technical knowledge and ensures data security.",
  },
  {
    icon: (props: IconProps) => <MagnifyingGlassCircleIcon {...props} />,
    title: "Open Data",
    description:
      "TDC provides SDMX standardised data sets for transport, including transparent metadata.",
  },
];

export default function InfoCards() {
  return (
    <div className="mt-[72px] grid grid-cols-1 gap-8 md:grid-cols-3">
      {infoCards.map((card, i) => (
        <div key={`info-card-${i}`} className="flex items-start gap-[10px]">
          <card.icon className="w-[20px] shrink-0 text-accent" />
          <div className="w-full">
            <h4 className="mb-[6px] text-xl font-bold leading-none">
              {card.title}
            </h4>
            <p className="text-gray-500">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
