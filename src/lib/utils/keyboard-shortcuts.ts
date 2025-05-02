type ShortcutHandler = (e: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: {
    handler: ShortcutHandler;
    description: string;
  };
}

class KeyboardShortcutManager {
  private shortcuts: ShortcutMap = {};
  private isEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (!this.isEnabled) return;

    // Don't trigger shortcuts when typing in input fields
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    const key = this.getKeyString(e);
    const shortcut = this.shortcuts[key];

    if (shortcut) {
      e.preventDefault();
      shortcut.handler(e);
    }
  }

  private getKeyString(e: KeyboardEvent): string {
    const parts: string[] = [];

    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Meta');

    // Add the key if it's not a modifier key
    if (
      !['Control', 'Alt', 'Shift', 'Meta'].includes(e.key) &&
      e.key.length === 1
    ) {
      parts.push(e.key.toUpperCase());
    } else if (e.key.length > 1) {
      parts.push(e.key);
    }

    return parts.join('+');
  }

  register(
    key: string,
    handler: ShortcutHandler,
    description: string
  ) {
    this.shortcuts[key] = { handler, description };
  }

  unregister(key: string) {
    delete this.shortcuts[key];
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  getShortcuts(): { key: string; description: string }[] {
    return Object.entries(this.shortcuts).map(([key, { description }]) => ({
      key,
      description,
    }));
  }

  cleanup() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }
}

// Create a singleton instance
export const keyboardShortcuts = typeof window !== 'undefined' ? new KeyboardShortcutManager() : null; 