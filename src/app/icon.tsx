import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer hexagon — stroke only */}
        <polygon
          points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
          fill="none"
          stroke="#6366f1"
          strokeWidth="5"
          strokeLinejoin="round"
          opacity="0.8"
        />
        {/* Mid hexagon — translucent fill */}
        <polygon
          points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
          fill="#6366f1"
          opacity="0.25"
        />
        {/* Inner hexagon — solid accent */}
        <polygon
          points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
          fill="#6366f1"
        />
      </svg>
    ),
    { ...size }
  );
}
