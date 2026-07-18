"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

const cards = [
  {
    id: 1,
    title: "Modern Apartment",
    description: "Beautiful apartment in the city center.",
    image: "https://picsum.photos/400/300?random=1&blur=2",
  },
  {
    id: 2,
    title: "Luxury Villa",
    description: "Spacious villa with modern facilities.",
    image: "https://picsum.photos/400/300?random=2&blur=2",
  },
  {
    id: 3,
    title: "Premium House",
    description: "Perfect home for your family.",
    image: "https://picsum.photos/400/300?random=3&blur=2",
  },
  {
    id: 3,
    title: "Premium House",
    description: "Perfect home for your family.",
    image: "https://picsum.photos/400/300?random=4&blur=2",
  },
  {
    id: 3,
    title: "Premium House",
    description: "Perfect home for your family.",
    image: "https://picsum.photos/400/300?random=6&blur=2",
  },
];

export default function CardCarousel() {
  return (
    <Swiper
      modules={[Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000 }}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 1,
        },
      }}
      className="pb-10"
    >
      {cards.map((card) => (
        <SwiperSlide key={card.id}>
          <div className=" overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
            <div className="relative aspect-[4/3] overflow-hidden bg-line">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover h-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
