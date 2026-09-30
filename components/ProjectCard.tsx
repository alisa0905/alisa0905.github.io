import Link from "next/link";
import { CardMedia } from "./CardMedia";
import { categoryColor, type Project } from "@/lib/projects";
import { Flower } from "./Flower";

type Props = {
  project: Project;
  /** Taller image for big bento tiles */
  size?: "xl" | "lg" | "md";
  sizes?: string;
  priority?: boolean;
};

/** Project tile: image or website recording on the project's colour, then title, type and year. */
export function ProjectCard({ project, size = "md", sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", priority }: Props) {
  return (
    <Link href={`/work/${project.slug}`} className="group block focus-visible:outline-none" data-cursor="zoom">
      <div
        className={`relative overflow-hidden rounded-[28px] ring-offset-4 ring-offset-paper transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-25px_rgb(0_0_0/0.45)] group-focus-visible:ring-2 group-focus-visible:ring-ink ${
          size === "xl" ? "aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]" : size === "lg" ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]"
        }`}
        style={{ backgroundColor: project.cover.bg ?? project.color }}
      >
        <CardMedia project={project} sizes={sizes} priority={priority} />

        {/* hover badge */}
        <span className="absolute right-4 top-4 flex h-14 w-14 scale-50 items-center justify-center opacity-0 transition-all duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:scale-100 group-hover:opacity-100">
          <Flower color={categoryColor(project.category)} filled className="absolute inset-0 h-full w-full" />
          <span className="relative text-lg font-bold text-ink">↗</span>
        </span>

        <span
          className="absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink"
          style={{ backgroundColor: categoryColor(project.category) }}
        >
          {project.category}
        </span>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div>
          <h3 className="font-display text-3xl leading-none text-ink transition-colors sm:text-4xl">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_3px]">
              {project.title}
            </span>
          </h3>
          <p className="mt-2 text-[15px] font-medium text-ink/55">{project.type}</p>
        </div>
        <span className="shrink-0 pt-1 text-sm font-semibold text-ink/45">{project.year}</span>
      </div>
    </Link>
  );
}
