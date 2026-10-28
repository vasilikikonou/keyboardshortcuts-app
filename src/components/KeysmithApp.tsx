"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Grid2X2,
  LayoutList,
  Menu,
  Search,
  Shuffle,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
  Zap,
  Printer,
} from "lucide-react";
import { shortcuts } from "@/data";
import {
  categories,
  categoryMatches,
  CategoryIcon,
  BrandMark,
} from "@/components/CategoryIcon";
import ShortcutCard from "@/components/ShortcutCard";
import ShortcutDetail from "@/components/ShortcutDetail";
import PracticeQuiz from "@/components/PracticeQuiz";
import KeyCombo from "@/components/KeyCombo";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  comboText,
  matchesSearch,
  popularity,
  platformNames,
  type Platform,
  type Shortcut,
} from "@/lib/shortcuts";

type View = "discover" | "favorites" | "recent";
type Collection = "all" | "beginner" | "popular";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH;
const HERO = `${BASE_PATH}/images/keyboard-hero.webp`;
const PRACTICE = `${BASE_PATH}/images/practice-keys.webp`;

export default function Home() {
  const [view, setView] = useState<View>("discover");
  const [category, setCategory] = useState("all");
  const [collection, setCollection] = useState<Collection>("all");
  const [platform, setPlatform] = useLocalStorage<Platform>(
    "keysmith-platform",
    "windows"
  );
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "keysmith-favorites",
    []
  );
  const [recent, setRecent] = useLocalStorage<string[]>("keysmith-recent", []);
  const [query, setQuery] = useState("");
  const [task, setTask] = useState("all");
  const [app, setApp] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [limit, setLimit] = useState(12);
  const [selected, setSelected] = useState<Shortcut | null>(null);
  const [quiz, setQuiz] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mobileMenu)
      sidebarRef.current?.querySelector<HTMLButtonElement>(".brand")?.focus();
  }, [mobileMenu]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable &&
        !selected &&
        !quiz
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (
        event.key === "Escape" &&
        document.activeElement === searchRef.current
      ) {
        setQuery("");
        searchRef.current?.blur();
      }
      if (event.key === "Escape" && mobileMenu) {
        setMobileMenu(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, quiz, mobileMenu]);
  useEffect(() => {
    setLimit(12);
  }, [query, category, collection, view, task, app, platform, sort]);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const filtered = useMemo(() => {
    let result = shortcuts.filter(s => {
      if (view === "favorites" && !favoriteSet.has(s.id)) return false;
      if (view === "recent" && !recent.includes(s.id)) return false;
      if (!categoryMatches(category, s.category)) return false;
      // Saved and recent collections keep shortcuts from other platforms visible.
      if (view === "discover" && !s.keys[platform]) return false;
      if (collection === "beginner" && s.level !== "Beginner") return false;
      if (collection === "popular" && popularity(s) <= 10) return false;
      if (task !== "all" && s.task !== task) return false;
      if (app !== "all" && s.app !== app) return false;
      return matchesSearch(s, query, platform);
    });
    result = [...result].sort((a, b) => {
      if (view === "recent" && sort === "recommended")
        return recent.indexOf(a.id) - recent.indexOf(b.id);
      if (sort === "alphabetical") return a.title.localeCompare(b.title);
      if (sort === "app")
        return a.app.localeCompare(b.app) || a.title.localeCompare(b.title);
      return popularity(b) - popularity(a) || a.title.localeCompare(b.title);
    });
    return result;
  }, [
    view,
    favoriteSet,
    recent,
    category,
    platform,
    collection,
    task,
    app,
    query,
    sort,
  ]);

  const availableApps = useMemo(
    () =>
      [
        ...new Set(
          shortcuts
            .filter(
              s =>
                categoryMatches(category, s.category) &&
                (view !== "discover" || s.keys[platform])
            )
            .map(s => s.app)
        ),
      ].sort(),
    [category, platform, view]
  );
  const tasks = useMemo(
    () => [...new Set(shortcuts.map(s => s.task))].sort(),
    []
  );
  const platformShortcuts = useMemo(
    () => shortcuts.filter(s => s.keys[platform]),
    [platform]
  );
  const [utcDay, setUtcDay] = useState(0);
  useEffect(() => {
    setUtcDay(Math.floor(Date.now() / 86400000));
  }, []);
  const daily = useMemo(() => {
    const choices = platformShortcuts.filter(
      s => s.category !== "universal" && s.level !== "Advanced"
    );
    return choices.length
      ? choices[utcDay % choices.length]
      : platformShortcuts[0];
  }, [platformShortcuts, utcDay]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map(c => [
          c.id,
          shortcuts.filter(s => categoryMatches(c.id, s.category)).length,
        ])
      ),
    []
  );
  const activeFilters = (task !== "all" ? 1 : 0) + (app !== "all" ? 1 : 0);

  function toggleFavorite(id: string) {
    setFavorites(previous =>
      previous.includes(id)
        ? previous.filter(value => value !== id)
        : [...previous, id]
    );
  }
  function openShortcut(shortcut: Shortcut) {
    setSelected(shortcut);
    setRecent(previous =>
      [shortcut.id, ...previous.filter(id => id !== shortcut.id)].slice(0, 30)
    );
  }
  function randomShortcut() {
    const pool = filtered.length ? filtered : platformShortcuts;
    if (pool.length)
      openShortcut(pool[Math.floor(Math.random() * pool.length)]);
  }
  function selectCategory(id: string) {
    setCategory(id);
    setView("discover");
    setApp("all");
    setTask("all");
    setMobileMenu(false);
    if (id === "macos") setPlatform("mac");
    if (id === "windows") setPlatform("windows");
    if (id === "linux") setPlatform("linux");
  }
  function changeView(next: View) {
    setView(next);
    setCategory("all");
    setCollection("all");
    setQuery("");
    setApp("all");
    setTask("all");
    setMobileMenu(false);
  }
  function resetFilters() {
    setQuery("");
    setCategory("all");
    setCollection("all");
    setTask("all");
    setApp("all");
  }
  const sectionTitle =
    view === "favorites"
      ? "Your little time-savers"
      : view === "recent"
        ? "Pick up where you left off"
        : category === "all"
          ? "Find your next superpower"
          : `${categories.find(c => c.id === category)?.label ?? "All"} shortcuts`;

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="sidebar-scrim"
          aria-label="Close navigation"
          onClick={() => {
            setMobileMenu(false);
            menuButtonRef.current?.focus();
          }}
        />
      )}
      <aside
        id="shortcut-navigation"
        ref={sidebarRef}
        className={`sidebar ${mobileMenu ? "is-open" : ""}`}
      >
        <button
          className="icon-button mobile-sidebar-close"
          aria-label="Close navigation"
          onClick={() => {
            setMobileMenu(false);
            menuButtonRef.current?.focus();
          }}
        >
          <X size={18} />
        </button>
        <button
          className="brand"
          onClick={() => changeView("discover")}
          aria-label="Keysmith home"
        >
          <BrandMark />
          <span>
            keysmith<span className="brand-period">.</span>
          </span>
        </button>
        <span className="sidebar-caption">
          KEYMAP / {platformNames[platform]}
        </span>
        <nav className="main-nav" aria-label="Main navigation">
          <button
            className={view === "discover" ? "active" : ""}
            onClick={() => changeView("discover")}
          >
            <Compass size={18} />
            <span>Explore shortcuts</span>
            <span className="nav-active-dot" />
          </button>
          <button
            className={view === "favorites" ? "active" : ""}
            onClick={() => changeView("favorites")}
          >
            <Star size={18} />
            <span>My favorites</span>
            {favorites.length > 0 && (
              <span className="nav-count">{favorites.length}</span>
            )}
          </button>
          <button
            className={view === "recent" ? "active" : ""}
            onClick={() => changeView("recent")}
          >
            <Clock3 size={18} />
            <span>Recently viewed</span>
          </button>
        </nav>
        <div className="nav-divider" />
        <div className="sidebar-section-title">
          CATEGORIES <span>{categories.length}</span>
        </div>
        <nav className="category-nav" aria-label="Shortcut categories">
          {categories.map(c => (
            <button
              key={c.id}
              className={
                category === c.id && view === "discover" ? "selected" : ""
              }
              aria-pressed={category === c.id && view === "discover"}
              onClick={() => selectCategory(c.id)}
            >
              <span className={`sidebar-category-icon ${c.color}`}>
                <CategoryIcon category={c.id} size={16} />
              </span>
              <span>{c.label}</span>
              <span className="category-count">{counts[c.id] || ""}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="practice-promo">
            <Image
              src={PRACTICE}
              alt="Bold, brightly coloured keyboard keycaps"
              width={360}
              height={240}
            />
            <span className="tiny-label">
              <Zap size={12} /> BUILD A LITTLE MUSCLE MEMORY
            </span>
            <h3>Make it second nature.</h3>
            <p>Five quick questions. A faster you.</p>
            <button
              onClick={() => {
                setQuiz(true);
                setMobileMenu(false);
              }}
            >
              Try practice mode <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="sidebar-foot">
            <span className="online-dot" /> Made for your everyday flow{" "}
            <Sparkles size={13} />
          </div>
        </div>
      </aside>

      <div className="main-shell" inert={mobileMenu}>
        <header className="topbar">
          <div className="topbar-left">
            <button
              ref={menuButtonRef}
              className="icon-button mobile-menu-button"
              aria-label="Open navigation"
              aria-expanded={mobileMenu}
              aria-controls="shortcut-navigation"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={21} />
            </button>
            <span className="breadcrumb-home">Your workspace</span>
            <span className="breadcrumb-slash">/</span>
            <span>
              {view === "discover"
                ? "Explore"
                : view === "favorites"
                  ? "Favorites"
                  : "Recently viewed"}
            </span>
          </div>
          <div className="topbar-right">
            <span className="edition-stamp">
              <span>KEYSMITH / FIELD GUIDE</span>
              <strong>608 SHORTCUTS · V.01</strong>
            </span>
          </div>
        </header>
        <main className="workspace">
          {view === "discover" ? (
            <section className="hero">
              <div className="hero-copy">
                <span className="hero-eyebrow">
                  <span /> SMALL KEYS. BIG POSSIBILITIES.
                </span>
                <h1>
                  Less clicking.
                  <br />
                  <span>More doing.</span>
                  <span className="hero-sparkle" aria-hidden="true">
                    ✳
                  </span>
                </h1>
                <p>
                  Your favorite apps, at your fingertips. Discover the
                  <br className="desktop-break" /> shortcuts that make every day
                  a little easier.
                </p>
                <div className="hero-bottom">
                  <span>
                    <strong>{shortcuts.length.toLocaleString()}+</strong>{" "}
                    shortcuts to discover
                  </span>
                  <span className="hero-stat-separator" />
                  <span>
                    <span className="hero-mini-star">✦</span> One key combo at a
                    time.
                  </span>
                </div>
              </div>
              <div className="hero-art">
                <Image
                  src={HERO}
                  alt="Retro neo-brutalist illustration of floating keyboard keycaps"
                  width={760}
                  height={480}
                  priority
                />
                <span className="hero-art-caption">
                  <span className="mini-kbd">Ctrl</span>
                  <span>+</span>
                  <span className="mini-kbd coral">you</span>
                  <span>= a good combination</span>
                </span>
              </div>
            </section>
          ) : (
            <section className="collection-hero">
              <span className="collection-hero-icon">
                {view === "favorites" ? (
                  <Star size={30} />
                ) : (
                  <Clock3 size={30} />
                )}
              </span>
              <div>
                <span className="tiny-label">YOUR PERSONAL COLLECTION</span>
                <h1>
                  {view === "favorites"
                    ? "Keep the good ones close."
                    : "A shortcut down memory lane."}
                </h1>
                <p>
                  {view === "favorites"
                    ? "All your favorite shortcuts, in one happy place. Saved right here in this browser."
                    : "The last 30 shortcuts you explored. Ready for another look."}
                </p>
              </div>
            </section>
          )}

          <section className="search-section" aria-label="Search shortcuts">
            <div className="search-box">
              <Search size={21} />
              <input
                ref={searchRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Find a shortcut, an app, or something you want to do…"
                aria-label="Search keyboard shortcuts"
              />
              {query ? (
                <button
                  className="icon-button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                >
                  <X size={17} />
                </button>
              ) : (
                <span className="search-hint">
                  <kbd>/</kbd>
                  <span>to search</span>
                </span>
              )}
            </div>
            <button
              className="surprise-button"
              onClick={randomShortcut}
              disabled={!platformShortcuts.length}
            >
              <Shuffle size={17} />
              <span>Surprise me</span>
            </button>
          </section>
          {!query && view === "discover" && (
            <div className="search-suggestions">
              <span>A little inspiration:</span>
              {["Take a screenshot", "Switch tabs", "Find", "Undo"].map(
                text => (
                  <button
                    key={text}
                    onClick={() =>
                      setQuery(
                        text === "Take a screenshot" ? "screenshot" : text
                      )
                    }
                  >
                    {text}
                    <ArrowUpRight size={11} />
                  </button>
                )
              )}
            </div>
          )}

          <section className="library" aria-label="Shortcut results">
            <div className="library-heading">
              <div>
                <h2>
                  {query ? `Results for “${query}”` : sectionTitle}
                  <span className="heading-sparkle">
                    <Sparkles size={18} />
                  </span>
                </h2>
                <p>
                  {view === "discover" && !query
                    ? "A few seconds saved. A whole lot of possibilities."
                    : `${filtered.length} ${filtered.length === 1 ? "shortcut" : "shortcuts"} in this collection.`}
                </p>
              </div>
              <button
                className="text-button print-button"
                onClick={() => window.print()}
                disabled={!filtered.length}
              >
                <Printer size={15} />
                <span>Print cheatsheet</span>
              </button>
            </div>
            <div className="library-toolbar">
              <div
                className="collection-tabs"
                role="group"
                aria-label="Skill collections"
              >
                <button
                  onClick={() => setCollection("all")}
                  className={collection === "all" ? "active" : ""}
                >
                  All shortcuts <span>{filtered.length}</span>
                </button>
                <button
                  onClick={() => setCollection("beginner")}
                  className={collection === "beginner" ? "active" : ""}
                >
                  <BookOpen size={14} /> Beginner friendly
                </button>
                <button
                  onClick={() => setCollection("popular")}
                  className={collection === "popular" ? "active" : ""}
                >
                  <Zap size={14} /> Popular picks
                </button>
              </div>
              <div className="toolbar-controls">
                <button
                  className={`filter-button ${showFilters || activeFilters ? "active" : ""}`}
                  aria-expanded={showFilters}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={15} />
                  <span>
                    Filters{activeFilters ? ` (${activeFilters})` : ""}
                  </span>
                </button>
                <label className="sort-select">
                  <span className="sr-only">Sort shortcuts</span>
                  <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="recommended">Recommended</option>
                    <option value="alphabetical">A–Z</option>
                    <option value="app">By application</option>
                  </select>
                  <ChevronDown size={12} />
                </label>
                <div className="layout-toggle">
                  <button
                    aria-label="Grid view"
                    aria-pressed={layout === "grid"}
                    className={layout === "grid" ? "active" : ""}
                    onClick={() => setLayout("grid")}
                  >
                    <Grid2X2 size={15} />
                  </button>
                  <button
                    aria-label="List view"
                    aria-pressed={layout === "list"}
                    className={layout === "list" ? "active" : ""}
                    onClick={() => setLayout("list")}
                  >
                    <LayoutList size={16} />
                  </button>
                </div>
              </div>
            </div>
            {showFilters && (
              <div className="filter-panel">
                <label>
                  What are you doing?
                  <select value={task} onChange={e => setTask(e.target.value)}>
                    <option value="all">All tasks</option>
                    {tasks.map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Application
                  <select value={app} onChange={e => setApp(e.target.value)}>
                    <option value="all">All applications</option>
                    {availableApps.map(a => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <span className="filter-platform-note">
                  <Check size={14} /> Showing {platformNames[platform]} key
                  combinations
                </span>
                {activeFilters > 0 && (
                  <button
                    className="text-button"
                    onClick={() => {
                      setTask("all");
                      setApp("all");
                    }}
                  >
                    Reset filters <X size={13} />
                  </button>
                )}
              </div>
            )}
            <div className="results-accessibility sr-only" aria-live="polite">
              {filtered.length} shortcuts found
            </div>
            {filtered.length > 0 ? (
              <div
                className={`shortcut-grid ${layout === "list" ? "list-layout" : ""}`}
              >
                {filtered.slice(0, limit).map(shortcut => (
                  <ShortcutCard
                    key={shortcut.id}
                    shortcut={shortcut}
                    platform={platform}
                    favorite={favoriteSet.has(shortcut.id)}
                    onFavorite={() => toggleFavorite(shortcut.id)}
                    onSelect={() => openShortcut(shortcut)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon">
                  {view === "favorites" ? (
                    <Star size={32} />
                  ) : view === "recent" ? (
                    <Clock3 size={32} />
                  ) : (
                    <Search size={32} />
                  )}
                </span>
                <h3>
                  {view === "favorites" && !favorites.length
                    ? "Your favorites are waiting to happen."
                    : view === "recent" && !recent.length
                      ? "Every great flow starts somewhere."
                      : "No shortcuts found. Let’s try another key."}
                </h3>
                <p>
                  {view === "favorites" && !favorites.length
                    ? "Tap the star on a shortcut to give it a home here."
                    : view === "recent" && !recent.length
                      ? "Open a shortcut to see the details. We’ll remember it here."
                      : "Try an action like “copy”, an app like “Excel”, or a key combo like “Ctrl C”."}
                </p>
                <button
                  className="primary-button"
                  onClick={() => {
                    if (view !== "discover") changeView("discover");
                    else resetFilters();
                  }}
                >
                  Explore shortcuts <ArrowRight size={15} />
                </button>
              </div>
            )}
            {filtered.length > limit && (
              <div className="load-more">
                <button
                  className="secondary-button"
                  onClick={() => setLimit(previous => previous + 24)}
                >
                  Show more shortcuts <ChevronDown size={15} />
                </button>
                <span>
                  Showing {Math.min(limit, filtered.length)} of{" "}
                  {filtered.length}
                </span>
              </div>
            )}
          </section>

          {daily && view === "discover" && (
            <section className="daily-banner">
              <span className="daily-icon">
                <Sparkles size={22} />
              </span>
              <div className="daily-copy">
                <span className="tiny-label">YOUR SHORTCUT OF THE DAY</span>
                <h3>{daily.title}</h3>
                <p>{daily.app} · A small thing worth learning.</p>
              </div>
              <KeyCombo shortcut={daily} platform={platform} />
              <button
                className="text-button"
                onClick={() => openShortcut(daily)}
              >
                Meet your new shortcut <ArrowRight size={17} />
              </button>
            </section>
          )}
          <footer className="workspace-footer">
            <span>
              <BrandMark /> Little keys. Big difference.
            </span>
            <p>
              Default shortcuts · US keyboard layout · App versions and custom
              keymaps may vary.
            </p>
            <button onClick={() => setQuiz(true)}>
              <Zap size={13} /> A little practice goes a long way.
            </button>
          </footer>
        </main>
      </div>
      <ShortcutDetail
        shortcut={selected}
        platform={platform}
        shortcuts={shortcuts}
        favorite={!!selected && favoriteSet.has(selected.id)}
        onFavorite={() => selected && toggleFavorite(selected.id)}
        onClose={() => setSelected(null)}
        onSelect={openShortcut}
      />
      {quiz && (
        <PracticeQuiz
          shortcuts={filtered.length >= 5 ? filtered : platformShortcuts}
          platform={platform}
          onClose={() => setQuiz(false)}
        />
      )}
      <div className="print-sheet">
        <h1>Keysmith · Your shortcut cheatsheet</h1>
        <p>
          {platformNames[platform]} ·{" "}
          {category === "all" ? "All categories" : category} · {filtered.length}{" "}
          shortcuts
        </p>
        {filtered.map(s => (
          <div className="print-row" key={s.id}>
            <strong>{s.title}</strong>
            <span>{s.app}</span>
            <code>{comboText(s, platform)}</code>
            <p>
              {s.description}
              {s.mode ? ` (${s.mode})` : ""}
            </p>
          </div>
        ))}
        <p>
          Default shortcuts on a US keyboard. Visit Keysmith for official source
          links.
        </p>
      </div>
    </div>
  );
}
