import { cn } from "@/lib/utils";

type Props = {
  drawn: boolean;
  className?: string;
};

/** Simplified Plano Piloto gesture — fuselage + two wings + lake. Stroke only. */
export function CostaPlan({ drawn, className }: Props) {
  return (
    <svg
      className={cn("pointer-events-none h-full w-full", className)}
      viewBox="0 0 1600 900"
      fill="none"
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-copper"
      >
        <path
          className={cn("costa-draw", drawn && "is-drawn")}
          d="M180 452 H1420"
          strokeWidth="4.2"
          pathLength={1}
        />
        <path
          className={cn("costa-draw delay-1", drawn && "is-drawn")}
          d="M720 452 C 620 452, 520 300, 430 168 C 400 118, 360 92, 310 88"
          strokeWidth="2.6"
          pathLength={1}
        />
        <path
          className={cn("costa-draw delay-2", drawn && "is-drawn")}
          d="M720 452 C 620 452, 520 604, 430 732 C 400 782, 360 808, 310 812"
          strokeWidth="2.6"
          pathLength={1}
        />
        <path
          className={cn("costa-draw delay-3", drawn && "is-drawn")}
          d="M560 452 C 620 430, 690 422, 760 422 C 860 422, 980 438, 1120 452 C 980 466, 860 478, 760 478 C 690 478, 620 474, 560 452 Z"
          strokeWidth="1.8"
          pathLength={1}
        />
        <ellipse
          className={cn("costa-draw delay-4", drawn && "is-drawn")}
          cx="1288"
          cy="452"
          rx="168"
          ry="210"
          strokeWidth="1.4"
          pathLength={1}
        />
        <circle cx="720" cy="452" r="5.5" fill="currentColor" className="text-copper" />
      </g>
      <style>{`
        .costa-draw {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
        }
        .costa-draw.is-drawn {
          animation: draw-line 2.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .costa-draw.delay-1.is-drawn { animation-delay: 0.35s; }
        .costa-draw.delay-2.is-drawn { animation-delay: 0.55s; }
        .costa-draw.delay-3.is-drawn { animation-delay: 1.1s; }
        .costa-draw.delay-4.is-drawn { animation-delay: 1.7s; }
      `}</style>
    </svg>
  );
}
