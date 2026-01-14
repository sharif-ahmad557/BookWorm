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
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Book Base (Blue) */}
          <rect x="2" y="2" width="28" height="28" rx="6" fill="#3B82F6" />

          <rect
            x="6"
            y="2"
            width="20"
            height="28"
            fill="white"
            fillOpacity="0.2"
          />

          {/* Center Line */}
          <path
            d="M16 2L16 30"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.5"
          />

          {/* Bookmark (Yellow) - The "Worm" element */}
          <path d="M20 0V10L22 8L24 10V0H20Z" fill="#FBBF24" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
