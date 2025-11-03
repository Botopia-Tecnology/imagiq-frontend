"use client";

import Image from "next/image";
import { useState } from "react";

const carouselImages = [
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123052/v2_desk_y9clfu.webp",
    alt: "Carousel image 1",
  },
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123185/PreBooking-pc_dnf0hn.webp",
    alt: "Carousel image 2",
  },
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123189/Servicioenlinea-pc_peeiiq.webp",
    alt: "Carousel image 3",
  },
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123201/Banner-Remoto_ad5geb.webp",
    alt: "Carousel image 4",
  },
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123212/Banner-Samsung-Members_nw9dvh.webp",
    alt: "Carousel image 5",
  },
  {
    src: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1762123220/Banner-Whatsapp_ru66qs.webp",
    alt: "Carousel image 6",
  },
];

export function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-white -mt-16 md:-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative max-w-5xl mx-auto">
          {/* Carousel Container */}
          <div className="relative w-full h-[200px] md:h-[250px] lg:h-[300px] overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselImages.map((image, index) => (
                <div key={index} className="min-w-full h-full relative flex items-center justify-center">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2 pb-4">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                  currentSlide === index ? "bg-black" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

