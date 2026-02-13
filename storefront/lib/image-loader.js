"use client";

export default function myImageLoader({ src, width, quality }) {
  // 1. Force the domain fix
  let cleanSrc = src;
  if (src.includes("http://localhost:9000")) {
    cleanSrc = src.replace("http://localhost:9000", "https://nextlicense.shop");
  }

  // 2. Return the clean URL directly (bypassing optimization)
  return `${cleanSrc}?w=${width}&q=${quality || 75}`;
}
