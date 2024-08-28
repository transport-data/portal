import React, { useState, useEffect, useRef } from "react";

const PartnersCarousel: React.FC = () => {
  const images = [
    "/images/logos/partners/giz.png",
    "/images/logos/partners/ifeu.png",
    "/images/logos/partners/oxford.png",
    "/images/logos/partners/kfw.png",
    "/images/logos/partners/ricardo.png",
    "/images/logos/partners/unece.png",
  ];

  const imagesPerSlide = 6;
  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  return (
    <div className="container relative mt-[72px] w-full overflow-hidden">
      <div className="flex w-full gap-8 overflow-auto">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className="grid w-full flex-shrink-0 grid-cols-2 flex-nowrap gap-[90px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          >
            {images
              .slice(index * imagesPerSlide, (index + 1) * imagesPerSlide)
              .map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Slide ${index * imagesPerSlide + idx}`}
                  className="h-[48px] object-contain"
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnersCarousel;
