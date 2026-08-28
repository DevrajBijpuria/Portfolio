import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CaseStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/#work"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All work
      </Link>
      {children}
    </article>
  );
}
