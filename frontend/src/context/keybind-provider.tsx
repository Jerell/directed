"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ShortcutString = string; // e.g. "Mod+J", "Mod+Shift+P", "Alt+S", "Escape"

export type KeybindHandler = (event: KeyboardEvent) => void;

export type KeybindOptions = {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  enabled?: boolean | (() => boolean);
  /** Higher numbers run first. Default 0. */
  priority?: number;
};

export type RegisteredKeybind = {
  shortcut: ShortcutString;
  handler: KeybindHandler;
  options: Required<Omit<KeybindOptions, "enabled">> & {
    enabled?: KeybindOptions["enabled"];
  };
};

export type CommandItem = {
  id: string;
  label: string;
  run: () => void | Promise<void>;
  shortcut?: ShortcutString;
  group?: string;
  icon?: React.ReactNode;
};

export type KeybindContextValue = {
  // keybinds
  bind: (
    shortcut: ShortcutString,
    handler: KeybindHandler,
    options?: KeybindOptions
  ) => () => void;
  // commands
  registerCommand: (command: CommandItem) => () => void;
  commands: CommandItem[];
  // command palette state
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
};

function isMacPlatform() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
}

export function normalizeShortcut(shortcut: ShortcutString): {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
} {
  const tokens = shortcut
    .split("+")
    .map((t) => t.trim())
    .filter(Boolean);

  let ctrlKey = false;
  let metaKey = false;
  let altKey = false;
  let shiftKey = false;
  let keyToken = "";

  for (const tokenRaw of tokens) {
    const token = tokenRaw.toLowerCase();
    if (token === "mod") {
      if (isMacPlatform()) metaKey = true;
      else ctrlKey = true;
    } else if (token === "cmd" || token === "meta" || token === "⌘") {
      metaKey = true;
    } else if (token === "ctrl" || token === "control") {
      ctrlKey = true;
    } else if (token === "alt" || token === "option") {
      altKey = true;
    } else if (token === "shift") {
      shiftKey = true;
    } else {
      keyToken = tokenRaw; // preserve original case for named keys like Escape
    }
  }

  return { key: keyToken, ctrlKey, metaKey, altKey, shiftKey };
}

function eventMatchesShortcut(e: KeyboardEvent, shortcut: ShortcutString) {
  const s = normalizeShortcut(shortcut);
  const eventKey = e.key.length === 1 ? e.key.toLowerCase() : e.key; // normalize letters
  const shortcutKey = s.key.length === 1 ? s.key.toLowerCase() : s.key;
  return (
    !!s.ctrlKey === !!e.ctrlKey &&
    !!s.metaKey === !!e.metaKey &&
    !!s.altKey === !!e.altKey &&
    !!s.shiftKey === !!e.shiftKey &&
    (shortcutKey === "" || eventKey === shortcutKey)
  );
}

const KeybindContext = createContext<KeybindContextValue | null>(null);

export function useKeybindContext() {
  const ctx = useContext(KeybindContext);
  if (!ctx)
    throw new Error("useKeybindContext must be used within a KeybindProvider");
  return ctx;
}

export function useKeybind(
  shortcut: ShortcutString,
  handler: KeybindHandler,
  options?: KeybindOptions
) {
  const { bind } = useKeybindContext();
  useEffect(
    () => bind(shortcut, handler, options),
    [bind, shortcut, handler, options]
  );
}

export default function KeybindProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const toggleCommandPalette = useCallback(
    () => setCommandPaletteOpen((v) => !v),
    []
  );

  const keybindsRef = useRef<RegisteredKeybind[]>([]);
  const [commands, setCommands] = useState<CommandItem[]>([]);

  const bind = useCallback<KeybindContextValue["bind"]>(
    (shortcut, handler, options) => {
      const reg: RegisteredKeybind = {
        shortcut,
        handler,
        options: {
          preventDefault: options?.preventDefault ?? true,
          stopPropagation: options?.stopPropagation ?? false,
          priority: options?.priority ?? 0,
          enabled: options?.enabled,
        },
      };

      keybindsRef.current = [...keybindsRef.current, reg].sort(
        (a, b) => b.options.priority - a.options.priority
      );

      return () => {
        keybindsRef.current = keybindsRef.current.filter((r) => r !== reg);
      };
    },
    []
  );

  const registerCommand = useCallback<KeybindContextValue["registerCommand"]>(
    (command) => {
      setCommands((prev) => {
        if (prev.some((c) => c.id === command.id)) return prev;
        return [...prev, command];
      });

      let unbind: (() => void) | undefined;
      if (command.shortcut) {
        unbind = bind(command.shortcut, (_e) => {
          void _e; // mark used to satisfy linter without side effects
          command.run();
        });
      }

      return () => {
        setCommands((prev) => prev.filter((c) => c.id !== command.id));
        if (unbind) unbind();
      };
    },
    [bind]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Run from highest priority to lowest, newest first (already sorted)
      for (let i = 0; i < keybindsRef.current.length; i++) {
        const reg = keybindsRef.current[i];
        const enabled =
          typeof reg.options.enabled === "function"
            ? reg.options.enabled()
            : reg.options.enabled ?? true;
        if (!enabled) continue;
        if (eventMatchesShortcut(e, reg.shortcut)) {
          if (reg.options.preventDefault) e.preventDefault();
          if (reg.options.stopPropagation) e.stopPropagation();
          reg.handler(e);
          break; // first match wins
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Default: toggle command palette with Mod+J
  useEffect(() => {
    const unbind = bind(
      "Mod+J",
      () => {
        toggleCommandPalette();
      },
      { preventDefault: true, priority: 10 }
    );
    return () => unbind();
  }, [bind, toggleCommandPalette]);

  const value = useMemo<KeybindContextValue>(
    () => ({
      bind,
      registerCommand,
      commands,
      isCommandPaletteOpen,
      setCommandPaletteOpen,
      toggleCommandPalette,
    }),
    [
      bind,
      registerCommand,
      commands,
      isCommandPaletteOpen,
      toggleCommandPalette,
    ]
  );

  return (
    <KeybindContext.Provider value={value}>{children}</KeybindContext.Provider>
  );
}
