import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <main className="grid min-h-dvh place-items-center bg-[#ebd6bb]">
      <video
        ref={ref}
        className="h-dvh w-full object-contain"
        src="/talk/opening.mp4?v=open"
        autoPlay
        muted
        playsInline
        onClick={() => {
          const v = ref.current;
          if (!v) return;
          v.currentTime = 0;
          void v.play();
        }}
      />
    </main>
  );
}
