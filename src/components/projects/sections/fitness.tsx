import type { CaseStudyContent } from "../case-study";
import {
  artifacts,
  dataset,
  evaluation,
  featureSets,
  flowEdges,
  flowNodes,
  layout,
  models,
  nextSteps,
  reps,
} from "@/data/projects/fitness";
import { Annotation, Chain, InView, SectionLabel, Surface, Tag } from "../notebook";

// The fitness tracker's own sections. It is a sensor/ML project, so its visuals
// lean on measurement — sampling rates, feature families, interim artifacts —
// while the page around them stays the engineering notebook.

const PROSE = "max-w-2xl";

// What the sensor recorded, and where the labels came from.
function TheSignal() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="The signal" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Two streams at different rates, six exercises, five people — and a label that only exists
          because of how the files were named.
        </p>
      </div>

      <InView>
        <Surface className="px-5 py-6">
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {dataset.sensors.map((s) => (
              <div key={s.name} className="border-t border-border/50 pt-3">
                <div className="flex items-baseline justify-between gap-3">
                  <Tag>{s.name}</Tag>
                  <span className="font-mono text-[13px] text-primary">{s.rate}</span>
                </div>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{s.axes}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-border/70 pt-4">
            <Tag>Labels</Tag>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {dataset.labels.map((l) => (
                <span
                  key={l}
                  className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>

          <dl className="mt-5 grid gap-x-8 gap-y-3 border-t border-border/70 pt-4 sm:grid-cols-2">
            {dataset.facets.map((f) => (
              <div key={f.field} className="flex items-baseline gap-3">
                <dt className="w-[92px] shrink-0 font-mono text-[11px] text-primary">{f.field}</dt>
                <dd className="text-[12px] leading-5 text-muted-foreground">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>

      <div className={`${PROSE} mt-5`}>
        <p className="text-sm leading-6 text-muted-foreground">{dataset.note}</p>
        <Annotation className="mt-5" rotate={-1}>
          the filename is the label.
        </Annotation>
      </div>
    </section>
  );
}

// The three pickles that are the pipeline's real checkpoints.
function Artifacts() {
  return (
    <section className={PROSE}>
      <SectionLabel label="Three checkpoints" />
      <p className="-mt-2 mb-4 text-sm leading-6 text-muted-foreground">
        Each stage writes its result to disk, so the expensive part never has to be re-run to work
        on the cheap part.
      </p>
      <div className="space-y-0">
        {artifacts.map((a, i) => (
          <InView key={a.file} delay={i * 0.06}>
            <div className="border-t border-border py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="font-mono text-[13px] text-foreground">{a.file}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  {a.stage}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{a.body}</p>
            </div>
          </InView>
        ))}
      </div>
      <Annotation className="mt-6" rotate={1}>
        raw signal first.
      </Annotation>
    </section>
  );
}

// The heart of it: what the model is actually shown.
function Features() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="What the model sees" />
        <InView>
          <p className="text-lg leading-8 text-foreground">
            From raw signal to useful representation.
          </p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">
            Six raw axes describe one instant. A repetition is a shape over time, so most of the
            work is building features that can carry that shape — and then testing whether they
            earned their place.
          </p>
        </InView>
      </div>

      <InView delay={0.1}>
        <Surface grid={false} className="mt-6">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-2">
            <Tag>Feature sets</Tag>
            <Tag>each one contains the last</Tag>
          </div>
          <dl>
            {featureSets.map((f, i) => (
              <div
                key={f.set}
                className={`px-4 py-3 sm:grid sm:grid-cols-[110px_1fr] sm:gap-5 ${
                  i > 0 ? "border-t border-border/40" : ""
                }`}
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-primary">
                  {f.set}
                </dt>
                <dd className="mt-1 sm:mt-0">
                  <span className="block text-sm leading-6 text-muted-foreground">{f.body}</span>
                  <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground/70">
                    {f.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>

      <div className={`${PROSE} mt-5`}>
        <Annotation rotate={-1}>features decide what the model sees.</Annotation>
      </div>
    </section>
  );
}

// Models compared, then evaluated twice.
function Modelling() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Learning from movement" />
        <p className="-mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Five classifiers over five feature sets, grid-searched — then the winner tested twice, the
          second time on a person it had never seen.
        </p>
      </div>

      <InView>
        <Surface className="px-5 py-6">
          <Tag>Compared</Tag>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {models.map((m) => (
              <span
                key={m}
                className="rounded-[3px] border border-border/70 px-2 py-1 font-mono text-[11px] text-muted-foreground"
              >
                {m}
              </span>
            ))}
          </div>
          <div className="mt-5 border-t border-border/70 pt-4">
            <Chain steps={["Sensor", "Features", "Model", "Prediction"]} accent="text-primary" />
          </div>
        </Surface>
      </InView>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {evaluation.map((e, i) => (
          <InView key={e.kind} delay={i * 0.08}>
            <Surface className="h-full px-5 py-5">
              <Tag>{e.kind}</Tag>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{e.body}</p>
            </Surface>
          </InView>
        ))}
      </div>

      <div className={`${PROSE} mt-5`}>
        <p className="text-sm leading-6 text-muted-foreground">
          The scripts compute accuracy and draw the confusion matrices at runtime; no scores are
          committed to the repository, so none are quoted here.
        </p>
      </div>
    </section>
  );
}

// The other track, which deliberately is not machine learning.
function Repetitions() {
  return (
    <section>
      <div className={PROSE}>
        <SectionLabel label="Counting reps" />
        <InView>
          <p className="text-lg leading-8 text-foreground">{reps.lead}</p>
        </InView>
        <InView delay={0.06}>
          <p className="mt-4 leading-7 text-muted-foreground">{reps.body}</p>
        </InView>
      </div>
      <InView delay={0.1}>
        <Surface className="mt-6 px-5 py-6">
          <Chain steps={["Magnitude", "Low-pass", "Local extrema", "Count"]} accent="text-primary" />
          <p className="mt-5 border-t border-border/70 pt-4 text-sm leading-6 text-muted-foreground">
            {reps.detail}
          </p>
        </Surface>
      </InView>
      <div className={`${PROSE} mt-5`}>
        <Annotation rotate={1}>{reps.note}</Annotation>
      </div>
    </section>
  );
}

function Layout() {
  return (
    <section className={PROSE}>
      <SectionLabel label="How it is laid out" />
      <InView>
        <Surface className="px-5 py-6">
          <dl className="space-y-3">
            {layout.map((l) => (
              <div key={l.dir} className="border-t border-border/50 pt-3 first:border-0 first:pt-0">
                <dt className="font-mono text-[12px] text-primary">{l.dir}</dt>
                <dd className="mt-0.5 text-sm leading-6 text-muted-foreground">{l.body}</dd>
              </div>
            ))}
          </dl>
        </Surface>
      </InView>
    </section>
  );
}

function NextSteps() {
  return (
    <section className={PROSE}>
      <SectionLabel label="What comes next" />
      <p className="-mt-2 mb-4 text-sm leading-6 text-muted-foreground">
        None of this is built — it is where the next work would go.
      </p>
      <ul className="space-y-2">
        {nextSteps.map((n) => (
          <li key={n} className="flex gap-3 text-sm leading-6 text-muted-foreground">
            <span className="text-muted-foreground/50">—</span>
            <span>{n}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const fitness: CaseStudyContent = {
  category: "Machine learning / Sensor data",
  title: "Fitness Tracker",
  subtitle: "Sensor → Signal → Feature → Model → Insight",
  description: [
    "Data processing and machine learning for quantified self, working from motion data captured by MetaMotion wearable sensors during barbell training.",
    "A wrist accelerometer and gyroscope are merged onto a common clock, cleaned, turned into temporal and frequency features, and used to classify which exercise is being performed — with a second, separate track that counts repetitions without a model at all.",
  ],
  headerNote: "the interesting part is the transformation.",

  snapshot: [
    { label: "Type", value: "ML / data science" },
    { label: "Domain", value: "Quantified self" },
    { label: "Source", value: "MetaMotion sensors" },
    { label: "Signals", value: "Accelerometer + gyroscope" },
    { label: "Task", value: "Classification + rep counting" },
    { label: "Participants", value: "Five" },
  ],

  problem: {
    body: [
      "Turning movement into data is the easy half. A wearable will happily produce two continuous streams of numbers all afternoon.",
      "The hard half is that those numbers describe instants, and an exercise is a shape over time. Nothing in a single accelerometer reading distinguishes the bottom of a squat from the bottom of a deadlift — the difference lives in the rhythm and the frequency content around it.",
      "So the work is almost entirely in the middle: getting two sensors onto one clock, deciding which readings to distrust, and building representations that carry the shape a classifier needs.",
    ],
    constraints: [
      "two sensors logging at different rates",
      "labels available only from the capture filename",
      "improbable readings mixed in with genuine intensity",
      "an instant-level signal, an interval-level question",
      "few participants, so leakage flatters any score",
    ],
    note: "raw sensor data is not the same thing as information.",
  },

  architecture: {
    intro:
      "Ten stages from the wrist to the figures, following the interim artifacts the pipeline actually writes. Select any of them to read what it does — and why it is there.",
    nodes: flowNodes,
    edges: flowEdges,
    note: "signal → representation → model",
  },

  processIntro: "One pass through the workflow, in the order the scripts run.",
  process: [
    { title: "Collect", detail: "A MetaMotion wearable logs accelerometer and gyroscope streams while five participants work through barbell sets." },
    { title: "Organise", detail: "Raw exports, interim artifacts, source modules, figures and environment each get their own place in a standard data-science layout." },
    { title: "Process", detail: "Filenames are parsed for participant, exercise and category, the two sensor frames are merged, and everything is resampled onto a 200 ms grid — per day, so session gaps are not bridged." },
    { title: "Clean", detail: "Three outlier detectors are implemented and compared; Chauvenet's criterion is applied, replacing improbable readings with missing values rather than dropping rows." },
    { title: "Explore", detail: "Every exercise is plotted per participant, with both sensors' axes together, and those figures are committed alongside the code." },
    { title: "Engineer features", detail: "Low-pass filtering, magnitude columns, principal components, rolling statistics over a 1-second window, a Fourier abstraction over 2.8 seconds, and a k-means cluster label." },
    { title: "Select", detail: "Forward selection with a decision tree narrows the frame to ten features, which becomes a fifth candidate set alongside the four cumulative ones." },
    { title: "Model", detail: "A grid search runs five classifiers across all five feature sets, and the results are compared as one grouped plot." },
    { title: "Evaluate", detail: "The best combination is scored on the random split, then re-run with one participant held out entirely to see whether it transfers to a new person." },
    { title: "Count", detail: "Separately, repetitions are counted by filtering the magnitude signal hard and finding local extrema, scored against the known reps per set." },
  ],

  implementation: {
    intro: "Where each stage lives, and what it is responsible for.",
    note: "experiment before abstraction →",
    blocks: [
      {
        file: "src/data/make_dataset.py",
        body: "Reads the MetaMotion exports, parses participant, label and category out of each filename, merges the accelerometer and gyroscope frames, and resamples to a 200 ms grid.",
      },
      {
        file: "src/features/remove_outliers.py",
        body: "Implements interquartile-range, Chauvenet and local-outlier-factor detection with plots to compare them. Chauvenet's criterion is the one applied to the working set.",
      },
      {
        file: "src/features/DataTransformation.py",
        body: "The Butterworth low-pass filter and the principal component analysis used by the feature build.",
      },
      {
        file: "src/features/TemporalAbstraction.py",
        body: "Rolling-window statistics over the filtered signals — the mean and standard deviation columns the model reads as recent history.",
      },
      {
        file: "src/features/FrequencyAbstraction.py",
        body: "The Fourier abstraction: per-frequency amplitudes, the dominant frequency and the power spectral entropy for each window.",
      },
      {
        file: "src/features/build_features.py",
        body: "Runs the whole feature stage in order — filter, magnitudes, PCA, temporal, frequency, k-means — and writes the modelling frame.",
      },
      {
        file: "src/models/LearningAlgorithms.py",
        body: "The classifier wrappers and forward feature selection, each model exposing the same signature with an optional grid search.",
      },
      {
        file: "src/models/train_model.py",
        body: "The experiment itself: the splits, the five feature sets, the grid search across five models, the comparison plot, the confusion matrices and the participant holdout.",
      },
      {
        file: "src/features/count_repetitions.py",
        body: "The separate counting track — per-exercise low-pass tuning, peak detection, and the mean absolute error against known rep counts.",
      },
      {
        file: "src/visualization/visualize.py",
        body: "The plotting used throughout, and the source of the committed figures in reports/figures.",
      },
    ],
  },

  decisions: [
    {
      title: "Why resample to a fixed grid",
      decision: "Put both sensors on a shared 200 ms clock, averaging numeric columns and carrying labels forward.",
      reason:
        "The accelerometer and gyroscope log at different rates, so no row contains both until they share a grid. Resampling per day keeps the gaps between sessions from being interpolated across.",
      tradeoff:
        "Averaging into 200 ms bins throws away detail above that rate — fine for distinguishing exercises, and a real loss for anything about impact or fine technique.",
    },
    {
      title: "Why Chauvenet, and why replace rather than drop",
      decision: "Compare three outlier detectors, apply Chauvenet's criterion, and write missing values in place of the readings it flags.",
      reason:
        "The three were plotted against each other before one was chosen. Replacing rather than deleting keeps the set contiguous, which matters because everything downstream is a rolling window.",
      tradeoff:
        "It assumes a normal distribution per column, so a genuinely explosive rep can look like an error. A heavy set is exactly where that assumption is weakest.",
    },
    {
      title: "Why frequency features at all",
      decision: "Add a Fourier abstraction over a 2.8-second window on top of the rolling statistics.",
      reason:
        "A repetition is periodic. Amplitudes, dominant frequency and spectral entropy describe that periodicity directly, where raw axes and even rolling means only describe level and spread.",
      tradeoff:
        "The window has to be long enough to contain a repetition, which blurs the boundary between one exercise and the next and makes the feature frame far wider than the raw one.",
    },
    {
      title: "Why compare feature sets, not just models",
      decision: "Run every classifier against five progressively richer feature sets rather than tuning one model.",
      reason:
        "It separates two questions that usually get answered together: how much of the result came from the algorithm, and how much from the representation handed to it.",
      tradeoff: "Five models times five feature sets with grid search is a lot of fitting for one comparison plot.",
    },
    {
      title: "Why hold out a whole participant",
      decision: "Re-run the best model trained on four people and tested on the fifth.",
      reason:
        "With only five participants, a random split almost certainly puts the same person's sets on both sides, and the score it produces answers a question nobody asked. Holding out a person asks whether it transfers to a new body.",
      tradeoff:
        "One held-out participant is one draw. It is a much more honest number and still a noisy one.",
    },
  ],

  results: {
    intro:
      "The scripts compute accuracy and render confusion matrices when they run, but no scores are committed to the repository — so this describes what the workflow establishes rather than quoting a number it does not publish.",
    outcomes: [
      "An end-to-end workflow from raw sensor export to classified exercise, with each stage checkpointed to disk.",
      "Two sensors at different sampling rates merged onto one clock without interpolating across sessions.",
      "Outlier handling chosen by comparing three methods rather than reaching for one.",
      "A feature frame carrying time-domain and frequency-domain structure, plus principal components and a cluster label.",
      "Five classifiers compared across five feature sets in a single grid search, so representation and algorithm are assessed separately.",
      "Generalisation tested by holding out an entire participant, not just a random slice of rows.",
      "Repetition counting solved separately with signal processing, deliberately without a model.",
      "Exercise plots for every participant committed alongside the code.",
    ],
    limitations: [
      "No trained model is saved: models/ is empty and predict_model.py is a zero-byte stub, so scoring a new recording means re-running training.",
      "notebooks/ and docs/ exist in the layout but are empty — every stage is a script, not a notebook.",
      "environment.yml omits scikit-learn, SciPy and seaborn even though the code imports all three, and requirements.txt is empty.",
      "Five participants, one sensor placement, one recording period — enough to build the workflow, not enough to claim it generalises.",
      "The repetition-counting cutoffs are hand-tuned per exercise, so a new movement needs a new cutoff.",
    ],
  },

  learnings: {
    lead: "Sensor data looks simple until you try to turn it into something a model can understand.",
    body: [
      "Almost none of the work is the model. Two sensors logging at different rates do not agree on when anything happened; the labels only exist because someone named the files carefully; and a spike that looks like sensor noise might be the hardest rep of the set. All of that has to be settled before a classifier can be asked anything at all.",
      "The clearest lesson was about representation. Feeding six raw axes to a classifier asks it to recognise an exercise from a single instant, which is not a fair question. Once the frame carried rolling statistics and frequency content, the same algorithms were being asked something answerable. Comparing five feature sets rather than tuning one model is what made that visible instead of assumed.",
      "The evaluation split taught the most. A random split across five people leaks the same participant into both halves and returns a number that feels good and means little. Re-running it with one person held out entirely changes the question from can it recognise these recordings to can it recognise this movement, and only the second one is worth reporting.",
      "And not every part of the problem wanted machine learning. Counting repetitions turned out to be a filtering problem — push the cutoff low enough that only the rep rhythm survives, then count the peaks. Reaching for a classifier there would have been more work and a worse answer.",
    ],
    note: "experiment before abstraction.",
  },

  stack: [
    "Python",
    "pandas",
    "NumPy",
    "scikit-learn",
    "SciPy",
    "Matplotlib",
    "seaborn",
    "Jupyter / IPython",
    "conda",
    "MetaMotion / MetaWear sensors",
  ],

  slots: {
    afterProblem: <TheSignal />,
    afterProcess: (
      <>
        <Artifacts />
        <Features />
        <Modelling />
      </>
    ),
    afterImplementation: (
      <>
        <Repetitions />
        <Layout />
      </>
    ),
    afterResults: <NextSteps />,
  },
};
