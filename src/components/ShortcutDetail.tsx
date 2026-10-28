import { Copy, ExternalLink, Star, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import KeyCombo from "./KeyCombo";
import {
  getKeys,
  platformNames,
  type Platform,
  type Shortcut,
} from "@/lib/shortcuts";

type ShortcutDetailProps = {
  shortcut: Shortcut | null;
  platform: Platform;
  shortcuts: Shortcut[];
  favorite: boolean;
  onFavorite: () => void;
  onClose: () => void;
  onSelect: (shortcut: Shortcut) => void;
};

const platforms: Platform[] = ["windows", "mac", "linux"];

function comboFor(shortcut: Shortcut, platform: Platform) {
  return getKeys(shortcut, platform).join(shortcut.sequence ? " → " : " + ");
}

function fallbackCopy(text: string) {
  if (typeof document === "undefined") return false;

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  textarea.className = "clipboard-fallback";
  document.body.appendChild(textarea);
  textarea.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }

  textarea.remove();
  return copied;
}

export default function ShortcutDetail({
  shortcut,
  platform,
  shortcuts,
  favorite,
  onFavorite,
  onClose,
  onSelect,
}: ShortcutDetailProps) {
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    setCopyStatus("");
  }, [shortcut?.id, platform]);

  const availableMappings = useMemo(() => {
    if (!shortcut) return [];
    return platforms.filter(
      candidate => (shortcut.keys[candidate] ?? []).length > 0
    );
  }, [shortcut]);

  const related = useMemo(() => {
    if (!shortcut) return [];

    return shortcuts
      .filter(
        candidate =>
          candidate.id !== shortcut.id &&
          (candidate.app === shortcut.app || candidate.task === shortcut.task)
      )
      .sort((left, right) => {
        const leftPriority =
          Number(left.app === shortcut.app && left.task === shortcut.task) * 2 +
          Number(left.app === shortcut.app);
        const rightPriority =
          Number(right.app === shortcut.app && right.task === shortcut.task) *
            2 +
          Number(right.app === shortcut.app);
        return (
          rightPriority - leftPriority || left.title.localeCompare(right.title)
        );
      })
      .slice(0, 3);
  }, [shortcut, shortcuts]);

  if (!shortcut) return null;

  const currentCombo = comboFor(shortcut, platform);
  const displayPlatform = shortcut.keys[platform]
    ? platform
    : availableMappings[0];

  const copyKeys = async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentCombo);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) copied = fallbackCopy(currentCombo);
    setCopyStatus(
      copied
        ? "Keys copied to clipboard."
        : "Unable to copy keys. Select the keys manually."
    );
  };

  return (
    <Dialog.Root
      open={true}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className="modal-panel"
          aria-describedby="shortcut-detail-description"
        >
          <div className="modal-topline">
            <span>
              {shortcut.app} · {shortcut.category}
            </span>
            <Dialog.Close asChild>
              <button
                className="modal-close"
                type="button"
                aria-label="Close shortcut details"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title>{shortcut.title}</Dialog.Title>
          <Dialog.Description
            id="shortcut-detail-description"
            className="detail-description"
          >
            {shortcut.description}
          </Dialog.Description>

          {displayPlatform && displayPlatform !== platform && (
            <p className="detail-label">
              Showing the {platformNames[displayPlatform]} mapping · no{" "}
              {platformNames[platform]} equivalent listed
            </p>
          )}
          <KeyCombo shortcut={shortcut} platform={platform} large />

          <dl className="detail-meta">
            <div>
              <dt className="detail-label">Where</dt>
              <dd>{shortcut.app}</dd>
            </div>
            <div>
              <dt className="detail-label">When</dt>
              <dd>{shortcut.task}</dd>
            </div>
            {shortcut.mode && (
              <div>
                <dt className="detail-label">Mode</dt>
                <dd>{shortcut.mode}</dd>
              </div>
            )}
            {shortcut.sequence && (
              <div>
                <dt className="detail-label">Input</dt>
                <dd>Press keys in sequence</dd>
              </div>
            )}
          </dl>

          {availableMappings.length > 0 && (
            <section
              className="detail-platforms"
              aria-labelledby="platform-mappings-title"
            >
              <h2 id="platform-mappings-title" className="detail-label">
                Available mappings
              </h2>
              {availableMappings.map(candidate => (
                <div className="detail-mapping" key={candidate}>
                  <span>
                    {platformNames[candidate]}
                    {candidate === platform ? " (current)" : ""}
                  </span>
                  <KeyCombo shortcut={shortcut} platform={candidate} />
                </div>
              ))}
            </section>
          )}

          <div className="detail-actions">
            <button className="primary-button" type="button" onClick={copyKeys}>
              <Copy aria-hidden="true" size={17} />
              Copy keys
            </button>
            <button
              className="secondary-button"
              type="button"
              aria-label={`${favorite ? "Remove" : "Add"} ${shortcut.title} ${favorite ? "from" : "to"} favorites`}
              aria-pressed={favorite}
              onClick={onFavorite}
            >
              <Star
                aria-hidden="true"
                size={17}
                fill={favorite ? "currentColor" : "none"}
              />
              {favorite ? "Saved" : "Save shortcut"}
            </button>
            <a
              className="secondary-button"
              href={shortcut.source}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink aria-hidden="true" size={17} />
              Official source
            </a>
          </div>
          {copyStatus && (
            <p className="detail-actions" role="status">
              {copyStatus}
            </p>
          )}

          {related.length > 0 && (
            <section
              className="related-shortcuts"
              aria-labelledby="related-shortcuts-title"
            >
              <h2 id="related-shortcuts-title" className="detail-label">
                Related shortcuts
              </h2>
              {related.map(candidate => (
                <button
                  className="related-item"
                  type="button"
                  key={candidate.id}
                  onClick={() => onSelect(candidate)}
                  aria-label={`View ${candidate.title} shortcut details`}
                >
                  <span>{candidate.title}</span>
                  <KeyCombo shortcut={candidate} platform={platform} />
                </button>
              ))}
            </section>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
