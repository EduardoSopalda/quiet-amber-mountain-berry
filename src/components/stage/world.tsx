import { CostaPlan } from "@/components/stage/costa-plan";
import type { SceneAge } from "@/lib/scenes";
import { cn } from "@/lib/utils";

type Props = {
  age: SceneAge;
  cityOn: boolean;
  drawn: boolean;
};

export function World({ age, cityOn, drawn }: Props) {
  const showPlant = age === "plant" || age === "carbon" || age === "road";
  const showCity = cityOn || age === "city" || age === "return" || age === "ink";
  const planGhost = age !== "void" && age !== "docs";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-paper">
      <div
        className={cn(
          "absolute inset-0 bg-cover bg-center transition-opacity duration-700",
          showPlant ? "opacity-35" : "opacity-0",
        )}
        style={{ backgroundImage: "url('/talk/plant.jpg')" }}
      />

      <div
        className={cn(
          "absolute inset-0 bg-contain bg-center bg-no-repeat transition-opacity duration-[1600ms] mix-blend-multiply",
          showCity ? "opacity-[0.38]" : "opacity-0",
        )}
        style={{
          backgroundImage: "url('/talk/plan-ppb.webp')",
          filter: "sepia(0.55) saturate(0.85) hue-rotate(-8deg) contrast(1.05)",
        }}
      />

      <div
        className={cn(
          "absolute inset-[-2%] flex items-center justify-center transition-opacity duration-700",
          planGhost ? "opacity-100" : "opacity-20",
        )}
      >
        <div className="h-[94%] w-[94%]">
          <CostaPlan drawn={drawn} />
        </div>
      </div>

      <div className="absolute inset-0 bg-paper/25" />
    </div>
  );
}
