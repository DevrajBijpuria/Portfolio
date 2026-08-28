// Skill sets, shown as clickable folders inside the CRT (see CrtSkills).
// One folder per category; `items` are the files inside it. `label` is the
// snake_case name printed under the desktop icon, `name` the full title the
// folder window carries. Edit freely — the icon column and the window both
// size themselves from this array.
export type SkillFolder = {
  id: string;
  label: string;
  name: string;
  items: string[];
};

export const skillFolders: SkillFolder[] = [
  {
    id: "programming",
    label: "programming",
    name: "Programming",
    items: ["Python", "SQL", "C++"],
  },
  {
    id: "data-engineering",
    label: "data_engineering",
    name: "Data Engineering & ETL",
    items: [
      "ETL/ELT Pipeline Development",
      "dbt",
      "Data Warehousing",
      "Database Design",
      "Relational Databases",
      "Snowflake SQL",
      "Streamlined Data Ingestion with pandas",
    ],
  },
  {
    id: "cloud",
    label: "cloud_aws",
    name: "Cloud & AWS Data Analytics",
    items: ["AWS", "Oracle Cloud Infrastructure (OCI)", "Cloud Computing Fundamentals"],
  },
  {
    id: "sql",
    label: "sql_databases",
    name: "SQL & Databases",
    items: [
      "PostgreSQL",
      "Joins",
      "Window Functions",
      "Relational DB Design",
      "Data Manipulation in SQL",
    ],
  },
  {
    id: "analysis",
    label: "data_analysis",
    name: "Data Analysis",
    items: [
      "Data Manipulation",
      "Data Cleaning",
      "Data Visualization",
      "Exploratory Data Analysis",
      "Importing Data in Python",
      "APIs in Python",
      "Statistics",
    ],
  },
  {
    id: "ml",
    label: "machine_learning",
    name: "Machine Learning & AI",
    items: [
      "Supervised & Unsupervised Learning",
      "scikit-learn",
      "XGBoost",
      "Ensemble Methods",
      "Hyperparameter Tuning",
      "Tree-Based Models",
      "Linear Classifiers",
      "Isolation Forest",
    ],
  },
];
