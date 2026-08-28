"use client";

import { CrtContent } from "./CrtContent";
import { CrtWindow } from "./CrtWindow";
import { FileIcon } from "./desktop-icons";

// ABOUT.TXT opens the real About writeup rather than a text body — the whole
// reason the machine exists. Same window chrome as every other file, wider,
// because it is the one document you are meant to actually read.
export function AboutWindow({ onCloseWindow }: { onCloseWindow: () => void }) {
  return (
    <CrtWindow
      title="ABOUT.TXT"
      icon={<FileIcon kind="txt" className="h-4 w-3" />}
      status="devraj bijpuria · data engineering"
      wide
      onClose={onCloseWindow}
    >
      <CrtContent />
    </CrtWindow>
  );
}
