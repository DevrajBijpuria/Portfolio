// Content for the NNNIDS case study at /projects/nnnids.
//
// CONTENT RULE: everything here comes from the repository — its README and, where
// the two disagree, its source. No accuracy figures, no throughput, no latency,
// no detection counts, no uptime: the project publishes none. The only numbers on
// the page are structural ones set in the code (seven pipeline stages, four
// detection layers, the 0–100 risk range, the risk component weights, the
// signature thresholds and the default monitoring window).
//
// Where the README's prose and the code differ, the code wins:
//   • feature fields come from feature_engineering.py, not the README's list
//   • the decision table comes from decision_engine.py, which is keyed by
//     (attack_type, severity) and has four actions, not the README's four-row
//     severity summary

import type { FlowEdgeSpec, FlowNodeSpec } from "@/components/projects/ArchitectureFlow";
import type { Shot } from "@/components/projects/CodeShots";

export const overview = [
  "NNNIDS monitors network traffic, extracts per-IP behavioural features, detects suspicious activity through multiple detection layers, and can automatically mitigate threats through the operating system firewall.",
  "The part that makes it more than a detector is what happens after the block. The system compares traffic before and after each mitigation, scores whether the intervention actually changed the behaviour it was aimed at, and feeds that score back into a composite network risk number.",
];

// Structural, not benchmarked — each of these is a property of the code.
export const cards = [
  { label: "7 stages", value: "Detection pipeline" },
  { label: "4 layers", value: "Hybrid detection" },
  { label: "0–100", value: "Dynamic risk score" },
];

// The pipeline as a serpentine: capture across the top, the decision half back
// along the middle, then out to the dashboard.
export const flowNodes: FlowNodeSpec[] = [
  {
    id: "capture",
    name: "Network sniffer",
    category: "Capture",
    symbol: "◎",
    purpose: "Live packets or replay",
    detail:
      "Scapy wraps the capture, on a named interface or one auto-detected from the adapters that have a real address. Windows goes through Npcap; a replay mode processes pre-recorded data instead, which is what runs where live capture is not available. Each packet is reduced to a small record — timestamp, addresses, ports, protocol, flags, payload size.",
    col: 0,
    row: 0,
  },
  {
    id: "features",
    name: "Feature engineering",
    category: "Features",
    symbol: "▤",
    purpose: "Per-source-IP telemetry",
    detail:
      "Packets are grouped by source IP and reduced to one row each: counts and rates, SYN ratio, how many distinct destination ports were touched, average payload size, a port-scan score, and the entropy of the destination-port distribution. This DataFrame is the only thing the detectors ever see.",
    col: 1,
    row: 0,
  },
  {
    id: "training",
    name: "Isolation Forest",
    category: "Training",
    symbol: "≋",
    purpose: "Self-trains on window one",
    detail:
      "On the first window with enough rows, an Isolation Forest is fitted over six of the features through a standard scaler. It is unsupervised — nothing is labelled, so the baseline is whatever that window happened to look like, and everything afterwards is measured against it.",
    col: 2,
    row: 0,
  },
  {
    id: "detection",
    name: "Detection engine",
    category: "Detection",
    symbol: "◈",
    purpose: "Four layers, one verdict",
    detail:
      "Signature rules, threat-intel lookup, the Isolation Forest and the behavioural engine all run over the same feature rows. Local addresses and trusted CDN/cloud ranges are skipped before any of it, so the machine's own traffic and the obvious infrastructure never generate alerts.",
    col: 3,
    row: 0,
  },
  {
    id: "diagnosis",
    name: "Diagnosis engine",
    category: "Diagnosis",
    symbol: "▥",
    purpose: "Detections become alerts",
    detail:
      "A raw detection is a rule name and a severity. Diagnosis turns it into a record a person can read: attack name and description, indicators, likely impact, a confidence figure, and one plain-English sentence saying why this IP was flagged.",
    col: 3,
    row: 1,
  },
  {
    id: "decision",
    name: "Decision engine",
    category: "Decision",
    symbol: "◷",
    purpose: "Deterministic action table",
    detail:
      "A lookup keyed by attack type and severity returns one of BLOCK_IP, THROTTLE, QUARANTINE or MONITOR, with the reason attached. Nothing is inferred at this step — the table is fixed, and anything not in it falls through to MONITOR.",
    col: 2,
    row: 1,
  },
  {
    id: "response",
    name: "Response engine",
    category: "Response",
    symbol: "⏻",
    purpose: "Firewall, or a dry run",
    detail:
      "In live mode the action becomes a real firewall rule — netsh advfirewall on Windows, an iptables INPUT DROP on Linux — and needs Administrator or root to succeed. In simulate mode the same path runs and logs what it would have done, changing nothing.",
    col: 1,
    row: 1,
  },
  {
    id: "verify",
    name: "Verification engine",
    category: "Verify",
    symbol: "⟳",
    purpose: "Did it actually work?",
    detail:
      "The window before the action and the window after it are compared for that IP across packet rate, SYN ratio and port-scan score. The per-metric reductions average into a mitigation_effectiveness between 0.0 and 1.0, and the record is filed as MITIGATED, PARTIALLY_MITIGATED or STILL_ACTIVE.",
    col: 0,
    row: 1,
  },
  {
    id: "risk",
    name: "Risk engine",
    category: "Risk",
    symbol: "◐",
    purpose: "Composite 0–100 score",
    detail:
      "Alert volume, worst severity, mitigation state and traffic level are summed into a 0–100 score, smoothed against the previous one so a single window cannot swing it. The last five scores give a trend, and a floor keeps the score at a small baseline when nothing is happening.",
    col: 0,
    row: 2,
  },
  {
    id: "dashboard",
    name: "Live dashboard",
    category: "Serving",
    symbol: "▦",
    purpose: "React over WebSocket",
    detail:
      "Every stage of the run is broadcast as it happens — progress, alerts, actions, verifications, risk — to a React dashboard that reads them over a WebSocket, with REST endpoints behind it for history and for manual block and unblock.",
    col: 1,
    row: 2,
  },
];

export const flowEdges: FlowEdgeSpec[] = [
  { from: "capture", to: "features", label: "packets" },
  { from: "features", to: "training", label: "fit" },
  { from: "training", to: "detection", label: "score" },
  { from: "detection", to: "diagnosis", label: "detections" },
  { from: "diagnosis", to: "decision", label: "alerts" },
  { from: "decision", to: "response", label: "action" },
  { from: "response", to: "verify", label: "before / after" },
  { from: "verify", to: "risk", label: "effectiveness" },
  { from: "risk", to: "dashboard", label: "broadcast" },
];

export const built = [
  {
    n: "01",
    title: "Live packet capture",
    body: "NNNIDS captures live network packets using Scapy, with support for interface-specific capture and a replay mode for when live capture is not an option. On Windows the capture goes through Npcap.",
    meta: "Tools",
    metaValue: "Scapy · Npcap",
  },
  {
    n: "02",
    title: "Feature engineering",
    body: "Raw packets are transformed into per-source-IP traffic features that can be evaluated by the detection system. Six of these fields are what the model is fitted on; the rest carry context into the alert.",
    meta: "Frame",
    metaValue: "one row per source IP",
  },
  {
    n: "03",
    title: "Hybrid detection",
    body: "The core of the system. Four independent layers read the same feature frame and contribute their own signals, rather than one detector deciding everything.",
    meta: "Layers",
    metaValue: "signatures · ML · behaviour · intel",
  },
  {
    n: "04",
    title: "Diagnosis",
    body: "Raw detections are converted into structured alerts containing attack taxonomy, indicators, impact information, confidence and a plain-English explanation — so an alert can be read without knowing which rule fired.",
  },
  {
    n: "05",
    title: "Decision engine",
    body: "Detected threats are mapped to recommended actions through a fixed table keyed by attack type and severity. Critical and high findings are marked for automatic execution; everything else is a recommendation.",
    meta: "Actions",
    metaValue: "BLOCK_IP · THROTTLE · QUARANTINE · MONITOR",
  },
  {
    n: "06",
    title: "Automated response",
    body: "NNNIDS can execute OS-level firewall mitigation, or run the same path as a dry run and change nothing. Live firewall actions require Administrator on Windows or root on Linux.",
    meta: "Modes",
    metaValue: "live · simulate",
  },
];

// From feature_engineering.py. The starred fields are the six the Isolation
// Forest is actually fitted on.
export const featureFields = [
  { name: "packet_count", ml: true },
  { name: "packet_rate", ml: true },
  { name: "syn_count", ml: false },
  { name: "syn_ratio", ml: true },
  { name: "unique_dst_ports", ml: true },
  { name: "avg_payload_size", ml: true },
  { name: "port_scan_score", ml: true },
  { name: "connection_diversity", ml: false },
];

export const detectionLayers = [
  {
    n: "L1",
    title: "Signature rules",
    body: "Rule-based thresholds over the feature row — port scan, SYN flood, DDoS and unusual traffic, each a fixed condition with a fixed severity.",
    example: "unique_dst_ports > 15 AND syn_ratio > 0.75",
  },
  {
    n: "L2",
    title: "ML anomaly detection",
    body: "An Isolation Forest, trained on the first window as an unsupervised baseline, flags rows that deviate from it. Severity comes from how far out the anomaly score sits.",
    example: "IsolationForest(contamination=0.1)",
  },
  {
    n: "L3",
    title: "Behavioural analysis",
    body: "Per-IP rolling baselines carried across scan windows identify addresses never seen before, rates well above an IP's own average, and activity outside the hours it usually appears.",
    example: "rate > 3× rolling average",
  },
  {
    n: "L4",
    title: "Threat intelligence",
    body: "An offline CIDR and IP table marks known malicious ranges and C2 addresses, and a trusted list of CDN and cloud ranges is excluded before detection runs at all.",
    example: "no external API calls",
  },
];

// decision_engine.py, rendered as it actually is: keyed by (attack type, severity).
export const decisionSeverities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

export const decisionTable: { type: string; by: Partial<Record<string, string>> }[] = [
  { type: "syn_flood", by: { CRITICAL: "BLOCK_IP", HIGH: "BLOCK_IP", MEDIUM: "THROTTLE" } },
  { type: "ddos", by: { CRITICAL: "BLOCK_IP", HIGH: "BLOCK_IP", MEDIUM: "QUARANTINE" } },
  { type: "known_c2", by: { CRITICAL: "BLOCK_IP", HIGH: "BLOCK_IP" } },
  { type: "port_scan", by: { HIGH: "BLOCK_IP", MEDIUM: "THROTTLE", LOW: "MONITOR" } },
  { type: "isolation_forest", by: { CRITICAL: "QUARANTINE", HIGH: "THROTTLE", MEDIUM: "MONITOR" } },
  { type: "baseline_spike", by: { CRITICAL: "QUARANTINE", HIGH: "THROTTLE", MEDIUM: "MONITOR" } },
  { type: "new_device", by: { HIGH: "QUARANTINE", MEDIUM: "MONITOR" } },
  { type: "unusual_traffic", by: { HIGH: "QUARANTINE", MEDIUM: "MONITOR", LOW: "MONITOR" } },
];

export const responsePlatforms = [
  { os: "Windows", command: "netsh advfirewall", note: "Inbound block rule per address. Requires Administrator." },
  { os: "Linux", command: "iptables INPUT DROP", note: "DROP rule on the INPUT chain. Requires root." },
];

export const responseModes = [
  { mode: "Live", body: "Real firewall changes. The command runs, and its output — success or failure — is what gets recorded." },
  { mode: "Simulate", body: "Dry-run logging. The same decisions are made and stored, no rule is written, nothing on the machine changes." },
];

export const verification = {
  lead: "Detection is only half of the system.",
  body: "After a mitigation action, NNNIDS compares traffic before and after the response to determine whether the intervention actually changed the observed behaviour.",
  chain: ["Before", "Mitigation", "After", "Effectiveness", "Risk update"],
  metrics: ["packet_rate", "syn_ratio", "port_scan_score"],
  close:
    "Each metric's reduction is scored between 0.0 and 1.0, the three are averaged into a mitigation_effectiveness figure, and the record is filed as MITIGATED, PARTIALLY_MITIGATED or STILL_ACTIVE. That figure is what the risk engine reads — an ineffective mitigation leaves the risk it was meant to reduce standing.",
};

export const risk = {
  body: "NNNIDS combines alert severity, mitigation state and traffic behaviour into a composite 0–100 risk score.",
  components: [
    { name: "Alert risk", range: "0–25", note: "How many alerts this window" },
    { name: "Severity risk", range: "0–40", note: "The worst severity seen" },
    { name: "Mitigation risk", range: "0–20", note: "Falls as effectiveness rises" },
    { name: "Traffic risk", range: "0–15", note: "Peak packet rate band" },
  ],
  trends: ["Increasing", "Stable", "Decreasing"],
  close:
    "The total is smoothed against the previous score rather than replacing it, so one loud window cannot swing the number on its own. The system tracks risk across recent monitoring windows and uses the resulting trend to communicate whether the network is becoming more or less concerning.",
};

export const dashboardPanels = [
  { name: "Live alert feed", body: "WebSocket-streamed detections, newest first." },
  { name: "Risk score", body: "Animated 0–100 gauge with its trend indicator." },
  { name: "Traffic graph", body: "Recharts packet-rate visualisation per source IP." },
  { name: "Attack timeline", body: "Chronological incident history." },
  { name: "Action panel", body: "Mitigation actions and their execution status." },
  { name: "Alerts page", body: "Filtering, detailed alert views, manual block and unblock, export." },
];

export const wsEvents = [
  { name: "connected", body: "Handshake with the current configuration" },
  { name: "pipeline", body: "Stage and progress out of seven" },
  { name: "alerts", body: "New detections, with a count" },
  { name: "action", body: "One mitigation action record" },
  { name: "verifications", body: "Before/after results for the window" },
  { name: "risk", body: "Score, level and trend" },
  { name: "monitor_tick", body: "Heartbeat per monitoring cycle" },
  { name: "error", body: "Message plus a recovery hint" },
];

export const whyInteresting = {
  lead: "Most intrusion-detection systems stop at detection.",
  emphasis: "NNNIDS explores the complete loop.",
  chain: ["observe", "detect", "decide", "respond", "verify", "reassess"],
  body: "The interesting part is the feedback loop. A threat isn't simply flagged and forgotten — the system can take an action, measure the traffic again, evaluate whether the mitigation worked, and incorporate that result into the network risk state.",
};

// The system as a stack of layers, read top to bottom.
export const architectureNotes = [
  { layer: "Network", tech: "Live packets / replay" },
  { layer: "Capture", tech: "Scapy" },
  { layer: "Features", tech: "pandas + NumPy" },
  { layer: "Detection", tech: "Signatures + Isolation Forest + Behaviour + Threat intel" },
  { layer: "Diagnosis", tech: "Structured alerts" },
  { layer: "Decision", tech: "Block / Throttle / Quarantine / Monitor" },
  { layer: "Response", tech: "Windows Firewall / iptables" },
  { layer: "Verification", tech: "Before / after comparison" },
  { layer: "Risk", tech: "0–100 composite score" },
  { layer: "Dashboard", tech: "React + WebSocket" },
];

export const engineeringDetails = [
  "FastAPI provides the REST API and the WebSocket server.",
  "Scapy handles packet capture and analysis.",
  "Isolation Forest provides unsupervised anomaly detection.",
  "Behavioural analysis maintains per-IP rolling baselines across scan windows.",
  "Threat intelligence is implemented locally using CIDR and IP data.",
  "Response actions can operate in live or simulation mode.",
  "Verification compares traffic before and after mitigation.",
  "SQLite stores alerts, actions, verifications and risk history.",
  "WebSockets stream real-time system events to the dashboard.",
  "Docker Compose supports containerised deployment of both services.",
];

export const worthKnowing = [
  {
    title: "Detection is layered",
    body: "Signatures, ML anomaly detection, behavioural heuristics and threat intelligence contribute different signals instead of relying on one detector.",
  },
  {
    title: "Response is configurable",
    body: "The system supports both real firewall changes and simulation — a dry run that decides and records everything but writes no rule.",
  },
  {
    title: "Verification closes the loop",
    body: "Mitigation is followed by a before/after traffic comparison, and the result feeds the risk score rather than sitting in a log.",
  },
  {
    title: "Offline threat intelligence",
    body: "The built-in threat intelligence layer does not require external API calls — the CIDR and C2 tables ship with the code.",
  },
];

export const stackGroups = [
  {
    group: "Backend",
    items: ["FastAPI", "Uvicorn", "Scapy", "scikit-learn", "pandas", "NumPy", "Pydantic", "SQLite"],
  },
  {
    group: "Frontend",
    items: ["React 19", "Vite", "React Router", "Recharts", "Axios", "TailwindCSS"],
  },
  { group: "Infrastructure", items: ["Docker", "Docker Compose"] },
  { group: "System", items: ["Windows Firewall", "iptables", "Npcap"] },
];

export const safetyNote =
  "NNNIDS is intended for home/office network monitoring, cybersecurity research and educational exploration. Live packet capture and firewall modification require appropriate system permissions.";

// The running dashboard, captured during a session in simulate mode. Nothing in
// these images is quoted as a figure anywhere on the page — they are here to show
// what the interface is, not to make a claim about how well it performs.
export const shots: Shot[] = [
  {
    src: "/projects/nnnids/overview.png",
    file: "Dashboard — overview",
    caption:
      "The monitoring view: risk gauge with its trend on the left, risk-over-time and per-source-IP packet rate in the middle, and the WebSocket alert feed on the right.",
  },
  {
    src: "/projects/nnnids/response-actions.png",
    file: "Dashboard — response actions",
    caption:
      "The action log, grouped by action type. This session is running in simulate mode, so each entry records what would have been done — the VLAN-isolation line is a dry run, not a firewall change.",
  },
  {
    src: "/projects/nnnids/alerts.png",
    file: "Alerts page",
    caption:
      "Full alert history with severity filters and IP search. Each row carries the attack type, the decided action, and the signature and ML confidences side by side — the two detection layers disagreeing is visible per alert.",
  },
];

// ---- added for the generic case-study template ----

export const problem = {
  body: [
    "An intrusion-detection system that only raises alerts hands the work back to a person. Something has to read the alert, decide whether it matters, and do something about it — and until that happens the traffic it flagged is still arriving.",
    "The harder question is the one after that. If the system does act, did the action work? A block that silently failed and a block that worked look identical from the alert log.",
  ],
  constraints: [
    "detect without labelled training data",
    "no external API calls for threat intel",
    "act on the host's own firewall",
    "a mode that changes nothing, for testing",
    "measure whether the action had an effect",
    "stream state to an operator view",
  ],
  note: "detection is only half of the system.",
};

export const decisions = [
  {
    title: "Why four detection layers",
    decision: "Run signatures, an Isolation Forest, behavioural baselines and threat intel over the same feature frame.",
    reason:
      "Each catches what the others cannot: fixed rules catch the known shapes, the model catches deviation from a learned baseline, the baselines catch what is unusual for one specific address, and the intel table catches addresses that are bad regardless of behaviour.",
    tradeoff:
      "Four sources of alerts over the same window means the same address can be flagged several times, which is why diagnosis and the decision table both key on attack type as well as severity.",
  },
  {
    title: "Why Isolation Forest",
    decision: "Use an unsupervised model that self-trains on the first window.",
    reason:
      "There is no labelled dataset of this network's traffic, and there never will be. An unsupervised model needs the baseline it can actually get — whatever the network was doing when monitoring started.",
    tradeoff:
      "The baseline is only as good as that first window. Start monitoring during an attack and the attack becomes normal.",
  },
  {
    title: "Why a simulate mode",
    decision: "Make the response engine able to run the full decision path and write no firewall rule.",
    reason:
      "The consequences of a false positive here are a blocked address, so there has to be a way to run the whole system — decisions, records, dashboard — without letting it touch the host.",
    tradeoff:
      "Simulated actions report EXECUTED, so verification cannot distinguish a real block from a dry run and records full effectiveness for both.",
  },
  {
    title: "Why verify after acting",
    decision: "Compare the traffic window before the action against the one after it.",
    reason:
      "It is the only evidence available that the mitigation did anything. Without it, an action that failed at the OS level is indistinguishable from one that worked.",
    tradeoff:
      "The comparison needs a previous window to exist, so the first action after startup has nothing to measure against.",
  },
  {
    title: "Why offline threat intelligence",
    decision: "Ship the CIDR and C2 tables with the code instead of calling a feed.",
    reason:
      "The detector runs in the packet path; a lookup that depends on a network call is a dependency on the network it is trying to watch. Offline also means it works on an isolated segment.",
    tradeoff: "The tables are only as current as the last commit.",
  },
];
