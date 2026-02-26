import { forwardRef } from 'react';

export const TrashZone = forwardRef<HTMLDivElement, { active: boolean }>(
  function TrashZone({ active }, ref) {
    return (
      <div
        ref={ref}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 56,
          height: 56,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          background: active ? '#b91c1c' : 'rgba(0,0,0,0.65)',
          boxShadow: active ? '0 10px 25px rgba(185,28,28,0.35)' : '0 10px 25px rgba(0,0,0,0.2)',
          transform: active ? 'scale(1.05)' : 'scale(1)',
          transition: 'all 120ms ease',
          zIndex: 99999,
        }}
        aria-label="Trash"
        title="Drop here to delete"
      >
        {/* simple trash icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3h6m-8 4h10m-9 0 1 16h6l1-16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  },
);