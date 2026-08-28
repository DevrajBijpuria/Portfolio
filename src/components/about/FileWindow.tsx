"use client";

import type { DesktopFile } from "@/data/desktop";
import { CrtWindow } from "./CrtWindow";
import { FileIcon } from "./desktop-icons";

// Plain text viewer. The body is printed verbatim in a <pre> so indentation in
// etl.py and schema.sql survives, and every line stays selectable.
export function FileWindow({
  file,
  onCloseWindow,
}: {
  file: DesktopFile;
  onCloseWindow: () => void;
}) {
  return (
    <CrtWindow
      title={file.name}
      icon={<FileIcon kind={file.kind} className="h-4 w-3" />}
      status={`${file.body.length} lines · read only`}
      onClose={onCloseWindow}
    >
      <pre className="crt-file-body">{file.body.join("\n")}</pre>
    </CrtWindow>
  );
}
