import { notFound } from "next/navigation";
import { boardProjects, getProject } from "@/data/board-projects";
import { getCaseStudy } from "@/data/projects";
import { CaseStudy } from "@/components/projects/CaseStudy";

// One page per project, and one template behind all of them. The route's only
// jobs are resolving the slug, picking up the project's content, and working out
// which projects sit either side of it in the board order.
//
// Every board card lands here first; the links off-site live at the bottom, so
// nothing on the board jumps straight to GitHub.
export function generateStaticParams() {
  return boardProjects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Devraj Bijpuria`, description: project.summary };
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  // The board order is the notebook order — previous and next are its neighbours,
  // wrapping at both ends so the sequence never dead-ends.
  const i = boardProjects.indexOf(project);
  const count = boardProjects.length;
  const next = boardProjects[(i + 1) % count];
  const previous = boardProjects[(i - 1 + count) % count];

  return (
    <CaseStudy
      content={getCaseStudy(project)}
      project={project}
      next={next}
      previous={previous}
    />
  );
}
