import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="13.5" y="3" width="3" height="26" rx="1.5" fill="#B45309" />
        <path
          d="M4 27C6 23 9 17 12 13L15 9"
          stroke="#141414"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="15"
          y1="9"
          x2="27"
          y2="4"
          stroke="#B45309"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <circle cx="4" cy="27" r="2" fill="#141414" />
      </svg>
    ),
    { ...size }
  );
}
