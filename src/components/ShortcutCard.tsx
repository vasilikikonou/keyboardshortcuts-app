import { ArrowUpRight, Star } from "lucide-react";
import KeyCombo from "./KeyCombo";
import { CategoryIcon, categoryInfo } from "./CategoryIcon";
import {
  getShortcutApps,
  getSupportedPlatforms,
  type Shortcut,
  type Platform,
  type PlatformFilter,
  platformNames,
} from "@/lib/shortcuts";

const platformTone: Record<Platform, string> = {
  windows: "blue",
  mac: "purple",
  linux: "yellow",
};
function browserTone(app: string) {
  const name = app.toLowerCase();
  if (name.includes("chrome")) return "green";
  if (name.includes("firefox")) return "orange";
  if (name.includes("edge")) return "blue";
  if (name.includes("safari")) return "purple";
  return "mint";
}
function browserLabel(app: string) {
  return app
    .replace("Google Chrome", "Chrome")
    .replace("Mozilla Firefox", "Firefox")
    .replace("Microsoft Edge", "Edge");
}

export default function ShortcutCard({
  shortcut,
  platform,
  platformFilter,
  favorite,
  onFavorite,
  onSelect,
}: {
  shortcut: Shortcut;
  platform: Platform;
  platformFilter: PlatformFilter;
  favorite: boolean;
  onFavorite: () => void;
  onSelect: () => void;
}) {
  const color = categoryInfo(shortcut.category).color;
  const supportedPlatforms = getSupportedPlatforms(shortcut);
  const browserApps = shortcut.browserVariants?.length
    ? getShortcutApps(
        shortcut,
        platformFilter === "all" ? undefined : platformFilter
      )
    : [];
  return (
    <article className={`shortcut-card tone-${color}`}>
      <div className="card-top">
        <div className="card-taxonomy">
          <span className={`app-tag ${color}`}>
            <CategoryIcon category={shortcut.category} size={13} />
            {shortcut.app}
          </span>
          <div className="shortcut-badges" aria-label="Supported platforms">
            {supportedPlatforms.map(candidate => (
              <span
                key={candidate}
                className={`taxonomy-tag platform-tag ${platformTone[candidate]}`}
              >
                {platformNames[candidate]}
              </span>
            ))}
          </div>
          {browserApps.length > 0 && (
            <div
              className="shortcut-badges browser-badges"
              aria-label="Supported browsers"
            >
              {browserApps.map(browser => (
                <span
                  key={browser}
                  className={`taxonomy-tag ${browserTone(browser)}`}
                >
                  {browserLabel(browser)}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          className={`icon-button favorite-button ${favorite ? "is-favorite" : ""}`}
          aria-label={`${favorite ? "Remove" : "Save"} ${shortcut.title} ${favorite ? "from" : "to"} favorites`}
          aria-pressed={favorite}
          onClick={onFavorite}
        >
          <Star size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <button
        className="card-main"
        onClick={onSelect}
        aria-label={`View ${shortcut.title} shortcut details`}
      >
        <h3>{shortcut.title}</h3>
        <p>{shortcut.description}</p>
        <KeyCombo shortcut={shortcut} platform={platform} />
      </button>
      <div className="card-bottom">
        <span className={`level-dot ${shortcut.level.toLowerCase()}`} />
        <span>{shortcut.level}</span>
        <span className="card-platform">{platformNames[platform]} keys</span>
        <button
          className="card-open"
          aria-label={`Open details for ${shortcut.title}`}
          onClick={onSelect}
        >
          <ArrowUpRight size={16} />
        </button>
      </div>
    </article>
  );
}
