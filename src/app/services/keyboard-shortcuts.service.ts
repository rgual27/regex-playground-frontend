import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ShortcutEvent {
  key: string;
  action: string;
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardShortcutsService {
  private shortcuts = new Subject<ShortcutEvent>();
  public shortcuts$ = this.shortcuts.asObservable();

  private showingHelp = false;

  constructor() {
    this.initializeShortcuts();
  }

  private initializeShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Enter - Test pattern
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        this.shortcuts.next({ key: 'ctrl+enter', action: 'test' });
      }

      // Ctrl/Cmd + S - Save pattern
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        this.shortcuts.next({ key: 'ctrl+s', action: 'save' });
      }

      // Ctrl/Cmd + K - Open cheat sheet
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.shortcuts.next({ key: 'ctrl+k', action: 'cheatsheet' });
      }

      // Ctrl/Cmd + E - Open examples
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        this.shortcuts.next({ key: 'ctrl+e', action: 'examples' });
      }

      // Ctrl/Cmd + / - Show help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        this.shortcuts.next({ key: 'ctrl+/', action: 'help' });
      }

      // ? - Show keyboard shortcuts help
      if (event.key === '?' && !this.isTyping(event)) {
        event.preventDefault();
        this.toggleShortcutsHelp();
      }
    });
  }

  private isTyping(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement;
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
  }

  toggleShortcutsHelp() {
    this.showingHelp = !this.showingHelp;
    this.shortcuts.next({ key: '?', action: 'toggle-help' });
  }

  isHelpShowing(): boolean {
    return this.showingHelp;
  }
}
