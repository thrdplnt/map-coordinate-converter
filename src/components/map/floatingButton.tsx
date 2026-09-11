/**
 * @fileoverview Floating action button to open the coordinate form.
 */

import React from 'react';

interface FloatingButtonProps {
  /** Whether the form is currently open */
  isOpen: boolean;
  /** Handler to open the form */
  onOpen: () => void;
}

/**
 * Floating button fixed to the map that triggers the coordinate form popup.
 * @param props - FloatingButtonProps
 */
const FloatingButton: React.FC<FloatingButtonProps> = ({ isOpen, onOpen }) => {
  return (
    <button
      onClick={onOpen}
      aria-label="Open coordinate form"
      className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
        isOpen
          ? 'bg-slate-200 text-slate-500 scale-90'
          : 'bg-sky-600 text-white hover:bg-sky-700 hover:scale-105 active:scale-95'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        )}
      </svg>
    </button>
  );
};

export default FloatingButton;
