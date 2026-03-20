'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export default function useKeyboardShortcuts() {
  const router = useRouter();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'k',
      ctrl: true,
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      },
      description: 'Focus search',
    },
    {
      key: 's',
      ctrl: true,
      action: () => router.push('/search'),
      description: 'Go to search',
    },
    {
      key: 'c',
      ctrl: true,
      action: () => router.push('/create'),
      description: 'Create article',
    },
    {
      key: 'h',
      action: () => router.push('/'),
      description: 'Go home',
    },
    {
      key: '?',
      action: () => {
        const helpModal = document.getElementById('keyboard-help');
        if (helpModal) {
          helpModal.classList.toggle('hidden');
        }
      },
      description: 'Show keyboard shortcuts',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (keyMatch && ctrlMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function KeyboardHelpModal() {
  const shortcuts = [
    { key: 'Ctrl + K', description: 'Focus search' },
    { key: 'Ctrl + S', description: 'Go to search page' },
    { key: 'Ctrl + C', description: 'Create new article' },
    { key: 'H', description: 'Go to home' },
    { key: '?', description: 'Show this help' },
  ];

  return (
    <div
      id="keyboard-help"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.currentTarget.classList.add('hidden');
        }
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-ink">⌨️ Keyboard Shortcuts</h2>
          <button
            onClick={() => document.getElementById('keyboard-help')?.classList.add('hidden')}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">{s.description}</span>
              <kbd className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-mono">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-6 text-center">
          Press <kbd className="bg-gray-100 px-1 rounded">?</kbd> to toggle this help
        </p>
      </div>
    </div>
  );
}
