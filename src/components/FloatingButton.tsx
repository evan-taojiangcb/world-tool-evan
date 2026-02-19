import React from 'react';

interface FloatingButtonProps {
  position: { x: number; y: number };
  onClick: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ position, onClick }) => {
  return (
    <div
      className="word-tool-floating-button"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 2147483647,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    </div>
  );
};
