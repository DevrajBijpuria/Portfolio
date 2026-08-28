import type { MDXComponents } from "mdx/types";

// Styling for MDX-rendered case-study prose. Case-study pages import
// PipelineDiagram / MetricsChart directly, so only base HTML is mapped here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props) => (
      <h1 className="mt-2 mb-4 text-3xl font-semibold tracking-tight" {...props} />
    ),
    h2: (props) => (
      <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight" {...props} />
    ),
    h3: (props) => (
      <h3 className="mt-6 mb-2 text-lg font-medium" {...props} />
    ),
    p: (props) => <p className="my-4 leading-7 text-muted-foreground" {...props} />,
    ul: (props) => <ul className="my-4 ml-6 list-disc space-y-1 text-muted-foreground" {...props} />,
    ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-1 text-muted-foreground" {...props} />,
    a: (props) => <a className="font-medium text-primary underline underline-offset-4" {...props} />,
    code: (props) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props} />
    ),
    ...components,
  };
}
