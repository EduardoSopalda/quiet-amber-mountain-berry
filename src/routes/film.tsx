import { createFileRoute } from "@tanstack/react-router";
import { OpeningFilm } from "@/components/opening-film";

export const Route = createFileRoute("/film")({ component: OpeningFilm });
