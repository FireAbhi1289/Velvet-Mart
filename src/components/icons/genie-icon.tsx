
import type { SVGProps } from 'react';

export function GenieIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Simple sparkle/genie representation */}
      <path d="M12 2 L13.5 6 L18 7.5 L13.5 9 L12 13 L10.5 9 L6 7.5 L10.5 6 L12 2 Z" />
      <path d="M18 12 L19.5 16 L24 17.5 L19.5 19 L18 23 L16.5 19 L12 17.5 L16.5 16 L18 12 Z" />
      <path d="M6 12 L7.5 16 L12 17.5 L7.5 19 L6 23 L4.5 19 L0 17.5 L4.5 16 L6 12 Z" />
    </svg>
  );
}
