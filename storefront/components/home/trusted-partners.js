"use client";

import { motion } from "framer-motion";

const PARTNERS = [
  {
    name: "Steam",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png",
  },
  {
    name: "PlayStation",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
  },
  {
    name: "Xbox",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
  },
  {
    name: "Spotify",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
];

export function TrustedPartners() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-bold text-gray-400 mb-8">
          عرضه کننده محصولات برندهای معتبر
        </p>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-8 items-center opacity-60">
          {PARTNERS.map((brand, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, opacity: 1, filter: "grayscale(0%)" }}
              className="flex justify-center transition-all duration-300 filter grayscale"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 w-auto object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
