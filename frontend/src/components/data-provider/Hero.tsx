import { Button } from "@components/ui/button";
import Link from "next/link";
import { Building2 } from "lucide-react";

const openNewsletterForm = () =>
  window.open(
    "https://civicrm.changing-transport.org/form/tdci-newsletter",
    "newsletter",
    "width=600,height=700,scrollbars=yes,resizable=yes"
  );

const partnerLogos = [
  { src: "/images/logos/partners/giz-colored.svg", alt: "GIZ", href: "/@giz" },
  { src: "/images/logos/partners/unece-colored.svg", alt: "UNECE", href: "/@unece" },
  { src: "/images/logos/partners/caf-colored.svg", alt: "CAF", href: "/@caf-urban-mobility-observatory" },
  { src: "/images/logos/partners/adb-colored.svg", alt: "ADB", href: "/@ato" },
  { src: "/images/logos/partners/solcat-colored.svg", alt: "SLOCAT", href: "/@slocat" },
  { src: "/images/logos/partners/ifeu-colored.svg", alt: "IFEU", href: "/@ifeu" },
  { src: "/images/logos/partners/irf-colored.svg", alt: "IRF", href: "/@irf" },
  { src: "/images/logos/partners/iiasa-colored.svg", alt: "IIASA", href: "/@iiasa" },
  { src: "/images/logos/partners/joint-colored.svg", alt: "JRC", href: "/@jrc" },
  { src: "/images/logos/partners/ccg-colored.svg", alt: "CCG", href: "/@ccg" },
  { src: "/images/logos/partners/tumi_logo_rgb_brightbg.png", alt: "TUMI", href: "/@tumi" },
  { src: "/images/logos/partners/gfei-colored.jpg", alt: "GFEI", href: "/@gfei" },
  { src: "/images/logos/partners/oica-colored.jpg", alt: "OICA", href: "/@oica" },
  { src: "/images/logos/partners/TfC_Logo.png", alt: "TfC", href: "/@tfc" },
  { src: "/images/logos/partners/unep-2019-english.jpg", alt: "UNEP", href: "/@unep" },
  { src: "/images/logos/partners/the-world-bank-colored.svg", alt: "World Bank", href: "/@world-bank" },
  { src: "/images/logos/partners/ieconnect.png", alt: "IEConnect", href: "/@ieconnect" },
  { src: "/images/logos/partners/Our_World_in_Data_logo.png", alt: "Our World in Data", href: "/@our-world-in-data" },
  { src: "/images/logos/partners/climate-trace-colored.png", alt: "Climate TRACE", href: "/@climate-trace" },
  { src: "/images/logos/partners/mobilise-colored.svg", alt: "MYC", href: "/@myc" },
  { src: "/images/logos/partners/global_alliance_logo.png", alt: "Feminist Transport", href: "/@feminist-transport" },
  { src: "/images/logos/partners/agora-vw-logo-rgb-gross-w4t0ah.png", alt: "Agora Verkehrswende", href: "/@agora-verkehrswende" },
];

export default function Hero() {
  return (
    <section className="pb-6 pt-[64px] md:pb-[96px]">
      <div className="container">
        <div className="flex items-center gap-x-16 xl:items-start">
          <div className="flex w-full flex-col items-center">
            <h2 className="mb-[24px] mt-[20px] text-center text-[40px] font-extrabold leading-none text-gray-900 sm:text-[40px] lg:text-6xl">
              Contribute data to the <br />Transport Data Commons
            </h2>
            <p className="mb-8 text-center text-xl leading-[30px] text-gray-500">
              Help us build a more comprehensive and diverse transportation data
              repository 
              by contributing your own transportation-related
              datasets.
            </p>
            <Button asChild className="mb-16 bg-[#006064] px-6 py-3.5">
              <Link href="/dashboard/datasets/create">Start Contributing Data</Link>
            </Button>
            <p className="font-semibold text-gray-500">
              Join the organisations which already share their data via the TDC.
            </p>
          </div>
        </div>
        <div className="mt-[54px] grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {partnerLogos.map((logo) => (
            <Link
              key={logo.src}
              href={logo.href}
              className="flex h-24 items-center justify-center rounded-lg border border-gray-100 bg-white/70 p-4 shadow-sm transition hover:shadow-md"
              aria-label={logo.alt}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-12 w-full object-contain"
              />
            </Link>
          ))}
        </div>
        
        {/* Organisation CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-[#006064] to-[#00838f] px-8 py-8 shadow-lg sm:flex-row">
          <div className="flex items-center gap-5">
            <div className="hidden sm:inline-flex rounded-full bg-white/20 p-4 shrink-0">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">
                Don't see your organisation?
              </p>
              <p className="mt-1 text-sm text-white/80">
                Register your organisation and start contributing data to the Transport Data Commons.
              </p>
            </div>
          </div>
          <Button className="shrink-0 bg-white text-[#006064] hover:bg-white/90 px-6 py-3 font-semibold shadow-md hover:shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2">
             <Building2 className="h-4 w-4" />
             <Link href="/dashboard/organizations">Register my Organisation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
