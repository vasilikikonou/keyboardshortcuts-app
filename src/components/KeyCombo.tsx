import { Fragment } from "react";
import { getKeys, type Platform, type Shortcut } from "@/lib/shortcuts";
const symbols: Record<string, string> = {
  Cmd: "⌘",
  Command: "⌘",
  Option: "⌥",
  Win: "⊞",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Up: "↑",
  Down: "↓",
  Left: "←",
  Right: "→",
  Escape: "Esc",
};
function chordParts(key: string) {
  if (
    !/^(Ctrl|Control|Cmd|Command|Alt|Option|Shift|Win|Super|Meta|Fn)\+/.test(
      key
    )
  )
    return [key];
  const parts = key.split("+");
  if (parts[parts.length - 1] === "") {
    while (parts[parts.length - 1] === "") parts.pop();
    parts.push("+");
  }
  return parts.filter(Boolean);
}
export default function KeyCombo({
  shortcut,
  platform,
  large = false,
}: {
  shortcut: Shortcut;
  platform: Platform;
  large?: boolean;
}) {
  const keys = getKeys(shortcut, platform);
  return (
    <div
      className={`key-combo ${large ? "large" : ""}`}
      aria-label={keys.join(shortcut.sequence ? " then " : " plus ")}
    >
      {keys.map((key, index) => (
        <Fragment key={`${key}-${index}`}>
          {index > 0 && (
            <span className="key-plus" aria-hidden="true">
              {shortcut.sequence ? "›" : "+"}
            </span>
          )}
          {chordParts(key).map((part, partIndex, parts) => (
            <Fragment key={`${part}-${partIndex}`}>
              {partIndex > 0 && (
                <span className="key-plus" aria-hidden="true">
                  +
                </span>
              )}
              <kbd
                title={part}
                className={
                  index === keys.length - 1 && partIndex === parts.length - 1
                    ? "key-accent"
                    : ""
                }
              >
                {symbols[part] ?? part}
              </kbd>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </div>
  );
}
