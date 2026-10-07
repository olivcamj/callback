import { cn } from "@/lib/utils";

// Curved edges for colored bands. The viewBox is 1280 wide, but
// preserveAspectRatio="none" stretches the curve to any screen width.
// Color comes from `currentColor`, so set it with a text-* class
// (e.g. className="text-butter").
const PATHS = {
  top: "M0 56 L0 34 C 160 0, 380 0, 600 24 S 1040 56, 1280 10 L1280 56 Z",
  bottom: "M0 0 L1280 0 L1280 22 C 1080 56, 820 52, 600 26 S 180 6, 0 40 Z",
} as const;

export type WaveEdge = keyof typeof PATHS;

type WaveProps = {
  edge: WaveEdge;
  className?: string;
};

export function Wave({ edge, className }: WaveProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1280 56"
      preserveAspectRatio="none"
      className={cn("block h-8 w-full md:h-14", className)}
    >
      <path fill="currentColor" d={PATHS[edge]} />
    </svg>
  );
}
