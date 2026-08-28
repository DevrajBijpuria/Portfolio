// Content for the Fitness Tracker case study at /projects/fitness.
//
// CONTENT RULE: the README is one line, so everything here was read out of the
// code and the committed artifacts. Where the brief assumed something the
// repository does not have, the repository won:
//   • notebooks/ is empty — every stage is a script under src/, not a notebook
//   • models/ is empty and predict_model.py is a 0-byte file — no trained
//     artifact is saved anywhere, so there is nothing to show from models/
//   • requirements.txt is empty; environment.yml is the real dependency list,
//     and it omits scikit-learn, SciPy and seaborn even though the code imports
//     all three
//   • generalisation across participants is already implemented (the A holdout),
//     so it belongs in results, not in "what comes next"
// The algorithms ARE verifiable and are named. No accuracy figure appears
// anywhere: the scripts compute accuracy at runtime and commit no scores.

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";

// The workflow as a serpentine, following the committed interim artifacts:
// raw CSV → 01_data_processed → 02_outliers_removed → 03_data_features → model.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "sensors",
    col: 0,
    row: 0,
    name: "MetaMotion sensor",
    category: "Source",
    symbol: "◎",
    purpose: "Accelerometer + gyroscope",
    detail:
      "A MetaWear wearable strapped to the wrist during barbell work, logging an accelerometer stream at 12.5 Hz and a gyroscope stream at 25 Hz. Five participants, recorded across sessions in January 2019.",
    why: "A wrist sensor sees the movement itself rather than what someone remembers doing. It also means the label has to come from somewhere else — here, from how the file was named at capture time.",
  },
  {
    id: "raw",
    col: 1,
    row: 0,
    name: "Raw CSVs",
    category: "Data",
    symbol: "▤",
    purpose: "One file per sensor per set",
    detail:
      "Each set produces two files, one per sensor, named with the participant, the exercise, the intensity category and the timestamp. The filename is the only label the dataset has.",
    why: "Keeping the raw export untouched means every later stage can be re-run from the beginning when a decision about it turns out to be wrong.",
  },
  {
    id: "dataset",
    col: 2,
    row: 0,
    name: "make_dataset",
    category: "Process",
    symbol: "⚡",
    purpose: "Merge and resample",
    detail:
      "Participant, exercise label and category are parsed out of each filename, the accelerometer and gyroscope frames are merged, and the result is resampled to a 200 ms grid — numeric columns averaged, categorical columns taking the last value. Resampling runs per day so the gaps between sessions are not interpolated across.",
    why: "The two sensors log at different rates, so nothing can be compared until they share a clock. 200 ms is the grid that puts both on the same rows without inventing readings.",
  },
  {
    id: "outliers",
    col: 3,
    row: 0,
    name: "Outlier removal",
    category: "Clean",
    symbol: "◈",
    purpose: "Chauvenet's criterion",
    detail:
      "Three detectors are implemented and compared — interquartile range, Chauvenet's criterion and local outlier factor. Chauvenet's is the one applied, marking improbable readings per column and replacing them with missing values rather than dropping the row.",
    why: "A spike from the sensor and a genuinely explosive rep look similar in the raw signal. Replacing rather than deleting keeps the set intact while removing the reading that cannot be trusted.",
  },
  {
    id: "explore",
    col: 3,
    row: 1,
    name: "Visualisation",
    category: "Explore",
    symbol: "◱",
    purpose: "Plot before deciding",
    detail:
      "A plotting module renders each exercise per participant and the accelerometer and gyroscope axes together, and those figures are committed to reports/figures — the exercise plots for every participant that took part.",
    why: "The filter cutoffs and window sizes chosen later are all judgement calls. Looking at the signal first is what makes them judgement rather than guesses.",
  },
  {
    id: "features",
    col: 2,
    row: 1,
    name: "build_features",
    category: "Features",
    symbol: "▥",
    purpose: "Signal → representation",
    detail:
      "A Butterworth low-pass filter, magnitude columns from the sum of squares of each triad, three principal components, rolling mean and standard deviation over a 1-second window, a Fourier abstraction over a 2.8-second window producing frequency amplitudes and spectral entropy, and a k-means cluster label with k = 5.",
    why: "A classifier reading six raw axes only sees one instant. Temporal and frequency windows are what let it see the shape of a repetition, which is the thing that actually distinguishes one exercise from another.",
  },
  {
    id: "train",
    col: 1,
    row: 1,
    name: "train_model",
    category: "Model",
    symbol: "≋",
    purpose: "Five models, five feature sets",
    detail:
      "A stratified 75/25 split, forward feature selection with a decision tree down to ten features, then a grid search running a neural network, random forest, k-nearest neighbours, decision tree and naive Bayes across each of five progressively richer feature sets.",
    why: "Comparing feature sets and models in one grid answers the more useful question: how much of the result came from the model, and how much from the representation fed to it.",
  },
  {
    id: "evaluate",
    col: 0,
    row: 1,
    name: "Evaluation",
    category: "Assess",
    symbol: "◷",
    purpose: "Random split, then by person",
    detail:
      "The best combination is evaluated with a confusion matrix over the random split, and then the whole thing is re-run with participant A held out entirely — trained on the other four, tested on someone the model has never seen.",
    why: "A random split can leak the same person's sets into both halves, so it flatters the score. Holding out a whole participant asks the question that actually matters: does this work on a new body.",
  },
  {
    id: "reps",
    col: 0,
    row: 2,
    name: "count_repetitions",
    category: "Counting",
    symbol: "◐",
    purpose: "Peaks, not classification",
    detail:
      "A separate track: a strong low-pass filter is applied to a magnitude column and repetitions are counted as local extrema, with the cutoff tuned per exercise. The count is scored against the known reps per set with mean absolute error.",
    why: "Counting reps is not a classification problem, so it does not get a classifier. Filtering hard enough that only the rep frequency survives turns it into peak counting.",
  },
  {
    id: "reports",
    col: 1,
    row: 2,
    name: "reports/figures",
    category: "Output",
    symbol: "▦",
    purpose: "What the analysis produced",
    detail:
      "The committed figures: exercise plots per participant, plus the comparison and confusion-matrix plots the training script renders. This is where the project's output lives — no model artifact is written.",
    why: "For an analysis project the argument is the figures. A saved model file would be the deliverable if there were something to serve it to; here there is not.",
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "sensors", to: "raw", label: "log" },
  { from: "raw", to: "dataset", label: "parse" },
  { from: "dataset", to: "outliers", label: "01_processed" },
  { from: "outliers", to: "explore", label: "02_cleaned" },
  { from: "explore", to: "features", label: "inspect" },
  { from: "features", to: "train", label: "03_features" },
  { from: "train", to: "evaluate", label: "score" },
  { from: "evaluate", to: "reps", label: "aside" },
  { from: "reps", to: "reports", label: "figures" },
];

// ---- what the sensor actually recorded ----

export const dataset = {
  sensors: [
    { name: "Accelerometer", rate: "12.5 Hz", axes: "acc_x · acc_y · acc_z" },
    { name: "Gyroscope", rate: "25 Hz", axes: "gyr_x · gyr_y · gyr_z" },
  ],
  labels: ["bench", "squat", "row", "ohp", "dead", "rest"],
  facets: [
    { field: "participant", value: "A – E" },
    { field: "label", value: "the exercise" },
    { field: "category", value: "heavy · medium · sitting · standing" },
    { field: "set", value: "one continuous recording" },
  ],
  note: "All four are parsed out of the capture filename — there is no separate label file anywhere in the repository.",
};

// The three committed interim artifacts, which are the pipeline's real stages.
export const artifacts = [
  {
    file: "01_data_processed.pkl",
    stage: "make_dataset.py",
    body: "Accelerometer and gyroscope merged onto a shared 200 ms grid, with participant, label, category and set attached from the filename.",
  },
  {
    file: "02_outliers_removed_chauvenets.pkl",
    stage: "remove_outliers.py",
    body: "Improbable readings marked by Chauvenet's criterion and replaced with missing values, column by column.",
  },
  {
    file: "03_data_features.pkl",
    stage: "build_features.py",
    body: "The modelling frame: filtered signals, magnitudes, principal components, temporal and frequency abstractions, and the cluster label.",
  },
];

// Every feature family the model is offered, and where it comes from.
export const featureSets = [
  { set: "Set 1", body: "The six raw axes.", detail: "acc_x/y/z · gyr_x/y/z" },
  { set: "Set 2", body: "Plus magnitudes and principal components.", detail: "acc_r · gyr_r · pca_1–3" },
  { set: "Set 3", body: "Plus rolling statistics over a 1-second window.", detail: "_temp_mean · _temp_std" },
  {
    set: "Set 4",
    body: "Plus the frequency abstraction and the cluster label.",
    detail: "_freq · _pse · max_freq · cluster",
  },
  {
    set: "Selected",
    body: "Ten features chosen by forward selection with a decision tree.",
    detail: "mostly frequency and temporal, plus pca_1 and cluster",
  },
];

export const models = ["Neural network (MLP)", "Random forest", "k-nearest neighbours", "Decision tree", "Naive Bayes"];

export const evaluation = [
  {
    kind: "Random split",
    body: "Stratified 75/25 across all participants, scored with a confusion matrix over the exercise labels.",
  },
  {
    kind: "Participant holdout",
    body: "Trained on four participants and tested on the fifth, so every test row comes from a person the model never saw.",
  },
];

// The second, entirely separate track.
export const reps = {
  lead: "Counting reps is a different problem.",
  body: "Classification says which exercise a window belongs to. It says nothing about how many times it happened. So repetition counting gets its own script and a completely different method: filter the magnitude signal hard enough that only the repetition rhythm survives, then count local extrema.",
  detail:
    "The cutoff is tuned per exercise — a row and a squat do not oscillate at the same rate — and one uses a gyroscope axis rather than acceleration. The predicted count is scored against the known reps per set with mean absolute error.",
  note: "no model needed — just the right filter.",
};

export const layout = [
  { dir: "data/", body: "raw/ holds the MetaMotion exports; interim/ holds the three pickled pipeline stages." },
  { dir: "src/", body: "Every stage as a script: data/, features/, models/, visualization/." },
  { dir: "reports/figures/", body: "The committed plots — exercise signals per participant." },
  { dir: "references/", body: "The folder-structure note the layout came from." },
  { dir: "env/ · environment.yml", body: "The conda environment for the project." },
  { dir: "models/ · notebooks/ · docs/", body: "Present in the layout but empty — placeholders the template creates." },
];

export const nextSteps = [
  "Save a trained model — models/ is empty and predict_model.py is a stub, so there is currently no way to score a new recording without re-running training.",
  "Complete the environment file: scikit-learn, SciPy and seaborn are imported by the code but missing from environment.yml, and requirements.txt is empty.",
  "Widen the dataset beyond five participants and one sensor placement.",
  "Extend repetition counting past the exercises whose cutoffs were tuned by hand.",
  "Replace the single held-out participant with a leave-one-participant-out loop, so the generalisation result is an average rather than one draw.",
];
