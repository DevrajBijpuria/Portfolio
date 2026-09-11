import type { Metadata } from "next";
import { SignalDeskCaseStudy } from "@/components/projects/SignalDeskCaseStudy";

// The Product-Management case study for Signal Desk. It sits under /projects so it
// inherits the same shell as the technical page (/projects/signal-desk) — same
// width, same "back to the board" chrome — and reads as one portfolio. The board's
// "Case study" button and the technical page's onward link both land here.
export const metadata: Metadata = {
  title: "Signal Desk — Product Case Study — Devraj Bijpuria",
  description:
    "The product thinking behind Signal Desk: the problem, the user, the decisions and trade-offs, proposed success metrics, and the working system underneath.",
};

export default function SignalDeskCaseStudyPage() {
  return <SignalDeskCaseStudy />;
}
