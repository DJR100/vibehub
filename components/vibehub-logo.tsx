export function VibeHubLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="50"
      height="24"
      viewBox="0 0 50 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Remote Controller Background - Made wider */}
      <rect width="50" height="24" rx="4" fill="#1A1A1A" stroke="#FF4500" strokeWidth="1.5" />
      {/* Code Symbol </> on left side */}
      <text x="4" y="16" fontFamily="monospace" fontSize="10" fill="#FF4500" fontWeight="bold">
        &lt;/&gt;
      </text>
      {/* 4 Buttons in a cross pattern (12, 3, 6, and 9 o'clock) */}
      <circle cx="37" cy="6" r="2.5" fill="#FF4500" /> {/* 12 o'clock */}
      <circle cx="43" cy="12" r="2.5" fill="#FF4500" /> {/* 3 o'clock */}
      <circle cx="37" cy="18" r="2.5" fill="#FF4500" /> {/* 6 o'clock */}
      <circle cx="31" cy="12" r="2.5" fill="#FF4500" /> {/* 9 o'clock */}
    </svg>
  )
}

