// Everything sitting on the CRT desktop, kept out of the components so the
// machine's "contents" can be edited without touching layout. The folders read
// from src/data/skills.ts and src/data/board-projects.ts — this file adds the
// loose files and the system readout.

// The two folders on the desk. skill_stack holds src/data/skills.ts; projects
// holds the board registry, so a project added there appears here too.
export const STACK_FOLDER = { label: "skill_stack", name: "skill_stack" };
export const PROJECTS_FOLDER = { label: "projects", name: "projects" };

// "prj" has no loose file on the desk — it is the tint the project rows inside
// the projects folder are drawn with.
export type FileKind = "txt" | "csv" | "py" | "sql" | "yaml" | "prj";

export type DesktopFile = {
  id: string;
  name: string;
  kind: FileKind;
  // Rendered verbatim in a file window, one line per entry. `about` is the
  // exception: it opens the real About component instead of a text body.
  body: string[];
};

// The .TXT column — the human-readable side of the machine.
export const docFiles: DesktopFile[] = [
  {
    id: "readme",
    name: "README.TXT",
    kind: "txt",
    body: [
      "DEVRAJ BIJPURIA — WORKSTATION 01",
      "================================",
      "data / ml engineering",
      "",
      "skill_stack/  skill sets, one folder per area",
      "projects/     one file per project",
      "*.TXT         about, contact",
      "*.py .sql     working files from the pipelines",
      "",
      "start with ABOUT.TXT.",
    ],
  },
  {
    id: "about",
    name: "ABOUT.TXT",
    kind: "txt",
    body: [], // opens the About component — see AboutWindow
  },
  {
    id: "contact",
    // Opens the contact window rather than the plain text viewer — see
    // ContactWindow. The body is kept as the accessible/inert fallback.
    name: "CONTACT.TXT",
    kind: "txt",
    body: [],
  },
];

// The working files — atmosphere, but real enough to read.
export const dataFiles: DesktopFile[] = [
  {
    id: "pipeline",
    name: "pipeline.csv",
    kind: "csv",
    body: [
      "run_id,stage,rows_in,rows_out,ms",
      "1841,extract,182940,182940,412",
      "1841,stage,182940,181002,286",
      "1841,merge,181002,176221,272",
      "1842,extract,164118,164118,398",
      "1842,stage,164118,162550,271",
      "1842,merge,162550,158904,264",
    ],
  },
  {
    id: "etl",
    name: "etl.py",
    kind: "py",
    body: [
      "from airflow.decorators import dag, task",
      "",
      '@dag(schedule="@hourly", catchup=False)',
      "def cdc_to_warehouse():",
      "    @task",
      "    def extract(since: str) -> str:",
      "        # read the WAL, never poll the tables",
      '        return replicate(slot="cdc_main", since=since)',
      "",
      "    @task",
      "    def merge(staged: str) -> int:",
      '        return scd2_merge(staged, key="id")',
      "",
      '    merge(extract("{{ prev_data_interval_end }}"))',
    ],
  },
  {
    id: "schema",
    name: "schema.sql",
    kind: "sql",
    body: [
      "create table dim_customer (",
      "  customer_key bigint generated always as identity,",
      "  customer_id  text        not null,",
      "  valid_from   timestamptz not null,",
      "  valid_to     timestamptz,",
      "  is_current   boolean     not null default true,",
      "  primary key (customer_key)",
      ");",
      "",
      "-- one live row per business key",
      "create unique index on dim_customer (customer_id)",
      "  where is_current;",
    ],
  },
  {
    id: "config",
    name: "config.yaml",
    kind: "yaml",
    body: [
      "pipeline: cdc_to_warehouse",
      "source:",
      "  kind: postgres",
      "  slot: cdc_main",
      "  publication: pub_main",
      "sink:",
      "  kind: duckdb",
      "  path: warehouse/main.duckdb",
      "  strategy: scd2",
      'schedule: "@hourly"',
      "retries: 3",
    ],
  },
];

export const allFiles = [...docFiles, ...dataFiles];

// The three ways to reach me, in the order the contact window lists them.
// `mark` picks the brand glyph: simple-icons carries GitHub and Gmail, but not
// LinkedIn — its owner does not permit redistribution, so that row falls back to
// a neutral link mark rather than a drawn-from-memory lookalike.
export type ContactLink = {
  id: string;
  label: string;
  value: string;
  href: string;
  mark: "github" | "gmail" | "link";
};

export const contactLinks: ContactLink[] = [
  {
    id: "github",
    label: "GitHub",
    value: "github.com/DevrajBijpuria",
    href: "https://github.com/DevrajBijpuria",
    mark: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/devraj-bijpuria",
    href: "https://www.linkedin.com/in/devraj-bijpuria",
    mark: "link",
  },
  {
    id: "mail",
    label: "Mail",
    value: "dbijpuria@gmail.com",
    href: "mailto:dbijpuria@gmail.com",
    mark: "gmail",
  },
];

// The readout in the top-right. Uptime is measured live from power-on; the rest
// is fixed — a machine whose CPU load never settles would be noisier than it is
// worth, and nobody reads these numbers twice.
export const systemStatus = {
  state: "ONLINE",
  rows: [
    { label: "CPU", value: "12%" },
    { label: "MEM", value: "64K" },
  ],
};
