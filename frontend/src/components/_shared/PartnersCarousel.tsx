import { chunkArray } from "@lib/utils";
import { useEffect, useState } from "react";

const images = [
  "/images/logos/partners/giz-colored.svg",
  "/images/logos/partners/ifeu-colored.svg",
  "/images/logos/partners/oxford-colored.svg",
  "/images/logos/partners/ricardo-colored.svg",
  "/images/logos/partners/kfw-colored.svg",
  "/images/logos/partners/unece-colored.svg",
  "/images/logos/partners/caf-colored.svg",
  "/images/logos/partners/adb-colored.svg",
  "/images/logos/partners/ebrd-colored.svg",
  "/images/logos/partners/solcat-colored.svg",
  "/images/logos/partners/fia-colored.svg",
  "/images/logos/partners/irf-colored.svg",
  "/images/logos/partners/chalmers-colored.svg",
  "/images/logos/partners/fdm-colored.svg",
  "/images/logos/partners/iiasa-colored.svg",
  "/images/logos/partners/sei-colored.svg",
  "/images/logos/partners/joint-colored.svg",
  "/images/logos/partners/uc-davis-colored.svg",
  "/images/logos/partners/wri-colored.svg",
  "/images/logos/partners/itdp-colored.svg",
  "/images/logos/partners/mobilise-colored.svg",
  "/images/logos/partners/ccg-colored.svg",
  "/images/logos/partners/sumc-colored.svg",
  "/images/logos/partners/gnpt-colored.svg",
  "/images/logos/partners/tumi-colored.svg",
  "/images/logos/partners/loughbrough-colored.svg",
  "/images/logos/partners/itf-colored.svg",
  "/images/logos/partners/icct-colored.svg",
  "/images/logos/partners/the-world-bank-colored.svg",
  "/images/logos/partners/cgep-colored.svg",
  "/images/sponsors/hvt.png",
  "/images/sponsors/uk-international-development.png",
];

const Carousel = () => {
  const [currentGroup, setCurrentGroup] = useState(0);
  const [chunkSize, setChunkSize] = useState(2);

  const groups = chunkArray(images, chunkSize);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroup((prevGroup) => (prevGroup + 1) % groups.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [groups.length]);

  useEffect(() => {
    const updateChunkSize = () => {
      if (window.innerWidth >= 1024) {
        setChunkSize(6);
      } else if (window.innerWidth >= 768) {
        setChunkSize(3);
      } else {
        setChunkSize(1);
      }
    };
    updateChunkSize();
    window.addEventListener("resize", updateChunkSize);
    return () => window.removeEventListener("resize", updateChunkSize);
  }, []);

  return (
    <div className="container relative h-[100px] w-full md:h-[56px]">
      {groups.map((group: any, index: number) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentGroup
              ? "z-10 opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="flex h-full w-full items-center justify-center gap-8 overflow-hidden opacity-[0.75] md:justify-between lg:gap-0">
            {group.map((image: any, imgIndex: number) => (
              <img
                key={imgIndex}
                src={image}
                alt={`Partner logo ${imgIndex}`}
                className="max-h-full max-w-full object-contain grayscale"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;
