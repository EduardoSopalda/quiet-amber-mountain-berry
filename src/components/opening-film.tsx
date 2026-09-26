import { useRef } from "react";

export function OpeningFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <main className="grid min-h-dvh place-items-center bg-paper">
      <video
        ref={ref}
        className="h-dvh w-full object-contain"
        src="/talk/opening.mp4"
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
