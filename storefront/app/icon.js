import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 24,
        background: "#0a0a0a", // neutral-950
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "20%", // Rounded square (looks like an App icon)
        border: "1px solid #333",
      }}
    >
      {/* You can put text or an SVG here. I used a stylized 'N' */}
      <div
        style={{
          background: "linear-gradient(to bottom right, #60a5fa, #a855f7)", // Blue to Purple gradient
          backgroundClip: "text",
          color: "transparent",
          fontWeight: 800,
          lineHeight: 1,
          marginTop: -2, // Optical alignment
        }}
      >
        N
      </div>
    </div>,
    // ImageResponse options
    {
      ...size,
    },
  );
}
