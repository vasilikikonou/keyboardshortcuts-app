export type Platform = "windows" | "macos" | "linux"

export interface Shortcut {
  id: string
  /** Default key combo, written with "+" separators, e.g. "Ctrl + C". */
  keys: string
  /** Optional platform-specific overrides. If absent, `keys` is used. */
  macos?: string
  windows?: string
  linux?: string
  description: string
  /** Short note on where/when it's used. */
  context: string
  /** Whether this is a widely-known / "easy" shortcut. */
  popular?: boolean
  tags?: string[]
}

export interface Group {
  id: string
  title: string
  shortcuts: Shortcut[]
}

export interface Category {
  id: string
  name: string
  /** Short tagline shown in the sidebar / header. */
  description: string
  groups: Group[]
}

export const categories: Category[] = [
  {
    id: "universal",
    name: "Universal Basics",
    description: "The everyday shortcuts that work in almost every app.",
    groups: [
      {
        id: "editing",
        title: "Text & Editing",
        shortcuts: [
          {
            id: "u-copy",
            keys: "Ctrl + C",
            macos: "⌘ + C",
            description: "Copy",
            context: "Copies the selected text, file, or object to the clipboard.",
            popular: true,
            tags: ["clipboard", "copy"],
          },
          {
            id: "u-cut",
            keys: "Ctrl + X",
            macos: "⌘ + X",
            description: "Cut",
            context: "Removes the selection and places it on the clipboard.",
            popular: true,
            tags: ["clipboard", "cut"],
          },
          {
            id: "u-paste",
            keys: "Ctrl + V",
            macos: "⌘ + V",
            description: "Paste",
            context: "Inserts clipboard contents at the cursor.",
            popular: true,
            tags: ["clipboard", "paste"],
          },
          {
            id: "u-paste-plain",
            keys: "Ctrl + Shift + V",
            macos: "⌘ + Shift + V",
            description: "Paste without formatting",
            context: "Pastes plain text, stripping fonts and styles. Great for docs and email.",
            tags: ["clipboard", "plain text"],
          },
          {
            id: "u-undo",
            keys: "Ctrl + Z",
            macos: "⌘ + Z",
            description: "Undo",
            context: "Reverts your last action. Works in editors, browsers, and file managers.",
            popular: true,
            tags: ["history"],
          },
          {
            id: "u-redo",
            keys: "Ctrl + Y",
            macos: "⌘ + Shift + Z",
            windows: "Ctrl + Y",
            description: "Redo",
            context: "Re-applies an action you just undid.",
            popular: true,
            tags: ["history"],
          },
          {
            id: "u-select-all",
            keys: "Ctrl + A",
            macos: "⌘ + A",
            description: "Select all",
            context: "Selects every item, all text, or all files in the current view.",
            popular: true,
          },
          {
            id: "u-bold",
            keys: "Ctrl + B",
            macos: "⌘ + B",
            description: "Bold",
            context: "Toggles bold on the selected text in editors and documents.",
            tags: ["formatting"],
          },
          {
            id: "u-italic",
            keys: "Ctrl + I",
            macos: "⌘ + I",
            description: "Italic",
            context: "Toggles italics on the selected text.",
            tags: ["formatting"],
          },
        ],
      },
      {
        id: "files-windows",
        title: "Files & Windows",
        shortcuts: [
          {
            id: "u-save",
            keys: "Ctrl + S",
            macos: "⌘ + S",
            description: "Save",
            context: "Saves the current document or file. Save early, save often.",
            popular: true,
          },
          {
            id: "u-print",
            keys: "Ctrl + P",
            macos: "⌘ + P",
            description: "Print",
            context: "Opens the print dialog for the current page or document.",
          },
          {
            id: "u-find",
            keys: "Ctrl + F",
            macos: "⌘ + F",
            description: "Find",
            context: "Opens search within the current page, document, or list.",
            popular: true,
          },
          {
            id: "u-new",
            keys: "Ctrl + N",
            macos: "⌘ + N",
            description: "New",
            context: "Creates a new document, window, or item.",
          },
          {
            id: "u-close",
            keys: "Ctrl + W",
            macos: "⌘ + W",
            description: "Close window / tab",
            context: "Closes the active tab or window.",
            popular: true,
          },
          {
            id: "u-quit",
            keys: "Alt + F4",
            macos: "⌘ + Q",
            windows: "Alt + F4",
            description: "Quit application",
            context: "Closes the entire app, not just the current window.",
          },
        ],
      },
    ],
  },
  {
    id: "windows",
    name: "Windows",
    description: "System-wide shortcuts for Microsoft Windows 10 & 11.",
    groups: [
      {
        id: "win-system",
        title: "System & Navigation",
        shortcuts: [
          {
            id: "w-start",
            keys: "Win",
            description: "Open Start menu",
            context: "Opens the Start menu; start typing to search apps and files.",
            popular: true,
          },
          {
            id: "w-lock",
            keys: "Win + L",
            description: "Lock the PC",
            context: "Instantly locks your computer and returns to the sign-in screen.",
            popular: true,
          },
          {
            id: "w-settings",
            keys: "Win + I",
            description: "Open Settings",
            context: "Jumps straight to the Windows Settings app.",
          },
          {
            id: "w-explorer",
            keys: "Win + E",
            description: "Open File Explorer",
            context: "Launches a new File Explorer window.",
            popular: true,
          },
          {
            id: "w-run",
            keys: "Win + R",
            description: "Run dialog",
            context: "Opens Run to launch programs or commands by name.",
          },
          {
            id: "w-task",
            keys: "Ctrl + Shift + Esc",
            description: "Task Manager",
            context: "Opens Task Manager directly to manage apps and processes.",
            popular: true,
          },
          {
            id: "w-emoji",
            keys: "Win + .",
            description: "Emoji picker",
            context: "Opens the emoji and symbol panel in any text field.",
          },
          {
            id: "w-clipboard",
            keys: "Win + V",
            description: "Clipboard history",
            context: "Shows previously copied items so you can paste older entries.",
          },
        ],
      },
      {
        id: "win-windows",
        title: "Window Management",
        shortcuts: [
          {
            id: "w-snap-left",
            keys: "Win + ←",
            description: "Snap window left",
            context: "Docks the active window to the left half of the screen.",
            popular: true,
          },
          {
            id: "w-snap-right",
            keys: "Win + →",
            description: "Snap window right",
            context: "Docks the active window to the right half of the screen.",
            popular: true,
          },
          {
            id: "w-maximize",
            keys: "Win + ↑",
            description: "Maximize window",
            context: "Maximizes the current window to fill the screen.",
          },
          {
            id: "w-minimize",
            keys: "Win + ↓",
            description: "Minimize / restore",
            context: "Minimizes or restores the active window.",
          },
          {
            id: "w-desktop",
            keys: "Win + D",
            description: "Show desktop",
            context: "Minimizes all windows to reveal the desktop, then restores them.",
            popular: true,
          },
          {
            id: "w-task-view",
            keys: "Win + Tab",
            description: "Task view",
            context: "Shows all open windows and virtual desktops.",
          },
          {
            id: "w-switch",
            keys: "Alt + Tab",
            description: "Switch apps",
            context: "Cycles through open applications. Hold Alt and tap Tab to choose.",
            popular: true,
          },
          {
            id: "w-new-desktop",
            keys: "Win + Ctrl + D",
            description: "New virtual desktop",
            context: "Creates a new virtual desktop for organizing your workspace.",
          },
        ],
      },
      {
        id: "win-capture",
        title: "Screenshots",
        shortcuts: [
          {
            id: "w-snip",
            keys: "Win + Shift + S",
            description: "Snip & sketch",
            context: "Opens the snipping toolbar to capture a region of the screen.",
            popular: true,
          },
          {
            id: "w-printscreen",
            keys: "PrtScn",
            description: "Full screenshot",
            context: "Copies the whole screen to the clipboard.",
          },
        ],
      },
    ],
  },
  {
    id: "macos",
    name: "macOS",
    description: "System-wide shortcuts for Apple macOS.",
    groups: [
      {
        id: "mac-system",
        title: "System & Navigation",
        shortcuts: [
          {
            id: "m-spotlight",
            keys: "⌘ + Space",
            description: "Spotlight search",
            context: "Opens Spotlight to search apps, files, and run quick calculations.",
            popular: true,
          },
          {
            id: "m-switch",
            keys: "⌘ + Tab",
            description: "Switch apps",
            context: "Cycles through open applications.",
            popular: true,
          },
          {
            id: "m-quit",
            keys: "⌘ + Q",
            description: "Quit app",
            context: "Fully quits the active application.",
            popular: true,
          },
          {
            id: "m-close",
            keys: "⌘ + W",
            description: "Close window",
            context: "Closes the front window or tab without quitting the app.",
          },
          {
            id: "m-hide",
            keys: "⌘ + H",
            description: "Hide app",
            context: "Hides the front app's windows from view.",
          },
          {
            id: "m-force-quit",
            keys: "⌘ + Option + Esc",
            description: "Force quit",
            context: "Opens the Force Quit menu for unresponsive apps.",
            popular: true,
          },
          {
            id: "m-lock",
            keys: "⌘ + Ctrl + Q",
            description: "Lock screen",
            context: "Immediately locks your Mac.",
          },
          {
            id: "m-emoji",
            keys: "⌘ + Ctrl + Space",
            description: "Emoji picker",
            context: "Opens the Character Viewer to insert emoji and symbols.",
          },
        ],
      },
      {
        id: "mac-windows",
        title: "Windows & Mission Control",
        shortcuts: [
          {
            id: "m-mission",
            keys: "Ctrl + ↑",
            description: "Mission Control",
            context: "Shows all open windows and spaces.",
          },
          {
            id: "m-app-windows",
            keys: "Ctrl + ↓",
            description: "App Exposé",
            context: "Shows all windows of the current app.",
          },
          {
            id: "m-space-left",
            keys: "Ctrl + ←",
            description: "Move one space left",
            context: "Switches to the desktop space on the left.",
          },
          {
            id: "m-space-right",
            keys: "Ctrl + →",
            description: "Move one space right",
            context: "Switches to the desktop space on the right.",
          },
          {
            id: "m-tab-app",
            keys: "⌘ + `",
            description: "Cycle app windows",
            context: "Switches between windows of the same application.",
          },
        ],
      },
      {
        id: "mac-capture",
        title: "Screenshots",
        shortcuts: [
          {
            id: "m-screen-full",
            keys: "⌘ + Shift + 3",
            description: "Full screenshot",
            context: "Captures the entire screen to a file on the desktop.",
            popular: true,
          },
          {
            id: "m-screen-area",
            keys: "⌘ + Shift + 4",
            description: "Capture selection",
            context: "Drag to capture a portion of the screen.",
            popular: true,
          },
          {
            id: "m-screen-tools",
            keys: "⌘ + Shift + 5",
            description: "Screenshot toolbar",
            context: "Opens capture and screen-recording options.",
          },
        ],
      },
    ],
  },
  {
    id: "linux",
    name: "Linux",
    description: "Common shortcuts for GNOME-based Linux desktops & the terminal.",
    groups: [
      {
        id: "linux-desktop",
        title: "Desktop (GNOME)",
        shortcuts: [
          {
            id: "l-activities",
            keys: "Super",
            description: "Activities overview",
            context: "Opens the overview to search apps and switch windows.",
            popular: true,
          },
          {
            id: "l-switch",
            keys: "Alt + Tab",
            description: "Switch apps",
            context: "Cycles through open applications.",
            popular: true,
          },
          {
            id: "l-close",
            keys: "Alt + F4",
            description: "Close window",
            context: "Closes the active window.",
          },
          {
            id: "l-terminal",
            keys: "Ctrl + Alt + T",
            description: "Open terminal",
            context: "Launches a new terminal window on most distributions.",
            popular: true,
          },
          {
            id: "l-workspace-up",
            keys: "Ctrl + Alt + ↑",
            description: "Workspace above",
            context: "Switches to the workspace above the current one.",
          },
          {
            id: "l-lock",
            keys: "Super + L",
            description: "Lock screen",
            context: "Locks the session.",
          },
        ],
      },
      {
        id: "linux-terminal",
        title: "Terminal / Bash",
        shortcuts: [
          {
            id: "l-sigint",
            keys: "Ctrl + C",
            description: "Cancel command",
            context: "Sends SIGINT to stop the running process in the terminal.",
            popular: true,
          },
          {
            id: "l-clear",
            keys: "Ctrl + L",
            description: "Clear screen",
            context: "Clears the terminal screen, keeping history.",
          },
          {
            id: "l-search-history",
            keys: "Ctrl + R",
            description: "Search history",
            context: "Reverse-search through previously run commands.",
            popular: true,
          },
          {
            id: "l-start-line",
            keys: "Ctrl + A",
            description: "Jump to line start",
            context: "Moves the cursor to the beginning of the line.",
          },
          {
            id: "l-end-line",
            keys: "Ctrl + E",
            description: "Jump to line end",
            context: "Moves the cursor to the end of the line.",
          },
          {
            id: "l-kill-line",
            keys: "Ctrl + U",
            description: "Delete to line start",
            context: "Cuts everything from the cursor back to the start of the line.",
          },
        ],
      },
    ],
  },
  {
    id: "browsers",
    name: "Browsers",
    description: "Tab, navigation, and address-bar shortcuts for Chrome, Edge & Firefox.",
    groups: [
      {
        id: "browser-tabs",
        title: "Tabs & Windows",
        shortcuts: [
          {
            id: "b-new-tab",
            keys: "Ctrl + T",
            macos: "⌘ + T",
            description: "New tab",
            context: "Opens a fresh tab in the current window.",
            popular: true,
          },
          {
            id: "b-close-tab",
            keys: "Ctrl + W",
            macos: "⌘ + W",
            description: "Close tab",
            context: "Closes the active tab.",
            popular: true,
          },
          {
            id: "b-reopen-tab",
            keys: "Ctrl + Shift + T",
            macos: "⌘ + Shift + T",
            description: "Reopen closed tab",
            context: "Restores the most recently closed tab. Lifesaver.",
            popular: true,
          },
          {
            id: "b-next-tab",
            keys: "Ctrl + Tab",
            macos: "⌃ + Tab",
            description: "Next tab",
            context: "Switches to the tab on the right.",
          },
          {
            id: "b-tab-number",
            keys: "Ctrl + 1-8",
            macos: "⌘ + 1-8",
            description: "Jump to tab",
            context: "Switches to a specific tab by position number.",
          },
          {
            id: "b-incognito",
            keys: "Ctrl + Shift + N",
            macos: "⌘ + Shift + N",
            description: "Incognito / Private window",
            context: "Opens a private browsing window (Firefox uses Shift + P).",
          },
        ],
      },
      {
        id: "browser-nav",
        title: "Navigation & Page",
        shortcuts: [
          {
            id: "b-address",
            keys: "Ctrl + L",
            macos: "⌘ + L",
            description: "Focus address bar",
            context: "Highlights the URL bar so you can type a new address or search.",
            popular: true,
          },
          {
            id: "b-reload",
            keys: "Ctrl + R",
            macos: "⌘ + R",
            description: "Reload page",
            context: "Refreshes the current page.",
            popular: true,
          },
          {
            id: "b-hard-reload",
            keys: "Ctrl + Shift + R",
            macos: "⌘ + Shift + R",
            description: "Hard reload",
            context: "Reloads ignoring the cache to fetch fresh assets.",
          },
          {
            id: "b-back",
            keys: "Alt + ←",
            macos: "⌘ + [",
            description: "Go back",
            context: "Navigates to the previous page in history.",
          },
          {
            id: "b-find",
            keys: "Ctrl + F",
            macos: "⌘ + F",
            description: "Find on page",
            context: "Searches for text within the current page.",
            popular: true,
          },
          {
            id: "b-devtools",
            keys: "F12",
            macos: "⌘ + Option + I",
            windows: "F12",
            description: "Developer tools",
            context: "Opens the browser DevTools for inspecting and debugging.",
            popular: true,
          },
          {
            id: "b-zoom-in",
            keys: "Ctrl + +",
            macos: "⌘ + +",
            description: "Zoom in",
            context: "Increases the page zoom level.",
          },
          {
            id: "b-zoom-reset",
            keys: "Ctrl + 0",
            macos: "⌘ + 0",
            description: "Reset zoom",
            context: "Returns the page to 100% zoom.",
          },
        ],
      },
    ],
  },
  {
    id: "vscode",
    name: "VS Code",
    description: "Editing, navigation, and command shortcuts for Visual Studio Code.",
    groups: [
      {
        id: "vscode-general",
        title: "General",
        shortcuts: [
          {
            id: "vs-command",
            keys: "Ctrl + Shift + P",
            macos: "⌘ + Shift + P",
            description: "Command palette",
            context: "Run any command, including ones without a default shortcut.",
            popular: true,
          },
          {
            id: "vs-quick-open",
            keys: "Ctrl + P",
            macos: "⌘ + P",
            description: "Quick open file",
            context: "Fuzzy-search and jump to any file in the workspace.",
            popular: true,
          },
          {
            id: "vs-settings",
            keys: "Ctrl + ,",
            macos: "⌘ + ,",
            description: "Open settings",
            context: "Opens the settings UI.",
          },
          {
            id: "vs-terminal",
            keys: "Ctrl + `",
            macos: "⌘ + `",
            description: "Toggle terminal",
            context: "Shows or hides the integrated terminal.",
            popular: true,
          },
          {
            id: "vs-sidebar",
            keys: "Ctrl + B",
            macos: "⌘ + B",
            description: "Toggle sidebar",
            context: "Shows or hides the Explorer sidebar.",
          },
        ],
      },
      {
        id: "vscode-editing",
        title: "Editing",
        shortcuts: [
          {
            id: "vs-comment",
            keys: "Ctrl + /",
            macos: "⌘ + /",
            description: "Toggle line comment",
            context: "Comments or uncomments the current line or selection.",
            popular: true,
          },
          {
            id: "vs-multi-cursor",
            keys: "Ctrl + D",
            macos: "⌘ + D",
            description: "Select next occurrence",
            context: "Adds the next matching word to a multi-cursor selection.",
            popular: true,
          },
          {
            id: "vs-move-line",
            keys: "Alt + ↑ / ↓",
            macos: "Option + ↑ / ↓",
            description: "Move line up / down",
            context: "Moves the current line or selection without cut & paste.",
            popular: true,
          },
          {
            id: "vs-copy-line",
            keys: "Shift + Alt + ↓",
            macos: "Shift + Option + ↓",
            description: "Duplicate line",
            context: "Copies the current line below.",
          },
          {
            id: "vs-format",
            keys: "Shift + Alt + F",
            macos: "Shift + Option + F",
            description: "Format document",
            context: "Reformats the file with the configured formatter.",
            popular: true,
          },
          {
            id: "vs-rename",
            keys: "F2",
            description: "Rename symbol",
            context: "Renames a variable or function across the project.",
          },
        ],
      },
      {
        id: "vscode-nav",
        title: "Navigation",
        shortcuts: [
          {
            id: "vs-goto-line",
            keys: "Ctrl + G",
            macos: "⌃ + G",
            description: "Go to line",
            context: "Jumps to a specific line number.",
          },
          {
            id: "vs-goto-symbol",
            keys: "Ctrl + Shift + O",
            macos: "⌘ + Shift + O",
            description: "Go to symbol",
            context: "Lists symbols in the file so you can jump to one.",
          },
          {
            id: "vs-search-files",
            keys: "Ctrl + Shift + F",
            macos: "⌘ + Shift + F",
            description: "Search across files",
            context: "Full-text search through the entire workspace.",
            popular: true,
          },
        ],
      },
    ],
  },
  {
    id: "microsoft365",
    name: "Microsoft 365",
    description: "Word, Excel, PowerPoint & Outlook productivity shortcuts.",
    groups: [
      {
        id: "m365-word",
        title: "Word",
        shortcuts: [
          {
            id: "ms-word-save",
            keys: "Ctrl + S",
            macos: "⌘ + S",
            description: "Save document",
            context: "Saves the current Word document.",
            popular: true,
          },
          {
            id: "ms-word-center",
            keys: "Ctrl + E",
            macos: "⌘ + E",
            description: "Center align",
            context: "Centers the current paragraph.",
          },
          {
            id: "ms-word-hyperlink",
            keys: "Ctrl + K",
            macos: "⌘ + K",
            description: "Insert hyperlink",
            context: "Adds a link to the selected text.",
            popular: true,
          },
          {
            id: "ms-word-track",
            keys: "Ctrl + Shift + E",
            macos: "⌘ + Shift + E",
            description: "Track changes",
            context: "Toggles revision tracking for collaborative editing.",
          },
        ],
      },
      {
        id: "m365-excel",
        title: "Excel",
        shortcuts: [
          {
            id: "ms-excel-sum",
            keys: "Alt + =",
            macos: "⌘ + Shift + T",
            description: "AutoSum",
            context: "Inserts a SUM formula for the adjacent range.",
            popular: true,
          },
          {
            id: "ms-excel-edit",
            keys: "F2",
            macos: "⌃ + U",
            windows: "F2",
            description: "Edit cell",
            context: "Enters edit mode for the active cell.",
            popular: true,
          },
          {
            id: "ms-excel-fill",
            keys: "Ctrl + D",
            macos: "⌘ + D",
            description: "Fill down",
            context: "Copies the cell above into the selected cells.",
          },
          {
            id: "ms-excel-format",
            keys: "Ctrl + 1",
            macos: "⌘ + 1",
            description: "Format cells",
            context: "Opens the Format Cells dialog.",
          },
          {
            id: "ms-excel-filter",
            keys: "Ctrl + Shift + L",
            macos: "⌘ + Shift + F",
            description: "Toggle filters",
            context: "Adds or removes filter dropdowns on the header row.",
          },
        ],
      },
      {
        id: "m365-outlook",
        title: "Outlook & PowerPoint",
        shortcuts: [
          {
            id: "ms-outlook-send",
            keys: "Ctrl + Enter",
            macos: "⌘ + Enter",
            description: "Send email",
            context: "Sends the message you're composing in Outlook.",
            popular: true,
          },
          {
            id: "ms-outlook-new",
            keys: "Ctrl + Shift + M",
            macos: "⌘ + N",
            description: "New email",
            context: "Starts composing a new message.",
          },
          {
            id: "ms-ppt-present",
            keys: "F5",
            macos: "⌘ + Shift + Enter",
            windows: "F5",
            description: "Start presentation",
            context: "Begins the PowerPoint slideshow from the first slide.",
            popular: true,
          },
        ],
      },
    ],
  },
  {
    id: "productivity",
    name: "Productivity Apps",
    description: "Slack, Figma, Gmail, Notion & other everyday tools.",
    groups: [
      {
        id: "prod-slack",
        title: "Slack",
        shortcuts: [
          {
            id: "p-slack-jump",
            keys: "Ctrl + K",
            macos: "⌘ + K",
            description: "Jump to / search",
            context: "Quickly switch to any channel or direct message.",
            popular: true,
          },
          {
            id: "p-slack-unread",
            keys: "Ctrl + Shift + A",
            macos: "⌘ + Shift + A",
            description: "All unreads",
            context: "Opens the view of all unread messages.",
          },
          {
            id: "p-slack-edit",
            keys: "↑",
            description: "Edit last message",
            context: "Press up arrow in an empty message box to edit your last message.",
          },
        ],
      },
      {
        id: "prod-figma",
        title: "Figma",
        shortcuts: [
          {
            id: "p-figma-frame",
            keys: "F",
            description: "Frame tool",
            context: "Selects the Frame tool to create artboards.",
          },
          {
            id: "p-figma-component",
            keys: "Ctrl + Alt + K",
            macos: "⌘ + Option + K",
            description: "Create component",
            context: "Turns the selection into a reusable component.",
            popular: true,
          },
          {
            id: "p-figma-group",
            keys: "Ctrl + G",
            macos: "⌘ + G",
            description: "Group selection",
            context: "Groups the selected layers together.",
          },
        ],
      },
      {
        id: "prod-gmail",
        title: "Gmail",
        shortcuts: [
          {
            id: "p-gmail-compose",
            keys: "C",
            description: "Compose",
            context: "Starts a new email (keyboard shortcuts must be enabled in settings).",
            popular: true,
          },
          {
            id: "p-gmail-send",
            keys: "Ctrl + Enter",
            macos: "⌘ + Enter",
            description: "Send",
            context: "Sends the email you're composing.",
          },
          {
            id: "p-gmail-search",
            keys: "/",
            description: "Search mail",
            context: "Focuses the search box.",
          },
          {
            id: "p-gmail-archive",
            keys: "E",
            description: "Archive",
            context: "Archives the open or selected conversation.",
          },
        ],
      },
    ],
  },
]

export function totalShortcutCount(): number {
  return categories.reduce(
    (sum, cat) => sum + cat.groups.reduce((g, grp) => g + grp.shortcuts.length, 0),
    0,
  )
}

export function keysForPlatform(shortcut: Shortcut, platform: Platform): string {
  if (platform === "macos" && shortcut.macos) return shortcut.macos
  if (platform === "windows" && shortcut.windows) return shortcut.windows
  if (platform === "linux" && shortcut.linux) return shortcut.linux
  return shortcut.keys
}
