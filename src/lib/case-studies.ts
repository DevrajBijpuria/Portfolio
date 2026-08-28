// Manual registry of case studies. Add an entry here + a matching
// src/app/case-studies/<slug>/ folder (page.mdx, diagram.ts, metrics.json).
// ponytail: hand-maintained array of 2; switch to fs glob if this grows past ~10.

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  metric: string; // headline number for the card
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "cdc-connector",
    title: "CDC Connector",
    summary:
      "Change-data-capture pipeline with Airflow orchestration, DuckDB staging, and SCD Type 2 history tracking.",
    stack: ["Airflow", "DuckDB", "Python", "SCD Type 2"],
    metric: "4.2M rows/day captured",
  },
  {
    slug: "spotify-pipeline",
    title: "Spotify Data Pipeline",
    summary:
      "Serverless AWS pipeline extracting Spotify listening data through Lambda, S3, Glue, and Athena.",
    stack: ["AWS Lambda", "S3", "Glue", "Athena", "Python"],
    metric: "sub-2s Athena queries",
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
