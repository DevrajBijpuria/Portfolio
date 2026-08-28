import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProjectLayout({ children }: LayoutProps<"/projects">) {
  return (
    <article className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the board
      </Link>
      {children}
    </article>
  );
}
