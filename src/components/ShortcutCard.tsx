import { ArrowUpRight, Star } from "lucide-react";
import KeyCombo from "./KeyCombo";
import { CategoryIcon, categoryInfo } from "./CategoryIcon";
import { type Shortcut, type Platform, platformNames } from "@/lib/shortcuts";
export default function ShortcutCard({
  shortcut,
  platform,
  favorite,
  onFavorite,
  onSelect,
}: {
  shortcut: Shortcut;
  platform: Platform;
  favorite: boolean;
  onFavorite: () => void;
  onSelect: () => void;
}) {
  const color = categoryInfo(shortcut.category).color;
  const actualPlatform = shortcut.keys[platform]
    ? platform
    : (Object.keys(shortcut.keys)[0] as Platform);
  return (
    <article className={`shortcut-card tone-${color}`}>
      <div className="card-top">
        <span className={`app-tag ${color}`}>
          <CategoryIcon category={shortcut.category} size={13} />
          {shortcut.app}
        </span>
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
        <span className="card-platform">{platformNames[actualPlatform]}</span>
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
