const Svg = ({ children, className = "h-4 w-4", strokeWidth = 2, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const SearchIcon = (p) => (
  <Svg {...p}><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></Svg>
);
export const CloseIcon = (p) => (
  <Svg {...p}><path d="M6 18L18 6M6 6l12 12" /></Svg>
);
export const PlusIcon = (p) => (
  <Svg strokeWidth={2.5} {...p}><path d="M12 4v16m8-8H4" /></Svg>
);
export const PencilIcon = (p) => (
  <Svg {...p}><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></Svg>
);
export const TrashIcon = (p) => (
  <Svg {...p}><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></Svg>
);
export const RefreshIcon = (p) => (
  <Svg {...p}><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></Svg>
);
export const CalendarIcon = (p) => (
  <Svg {...p}><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></Svg>
);
export const ChevronDownIcon = (p) => (
  <Svg {...p}><path d="M19 9l-7 7-7-7" /></Svg>
);
export const ChevronLeftIcon = (p) => (
  <Svg {...p}><path d="M15 19l-7-7 7-7" /></Svg>
);
export const ChevronRightIcon = (p) => (
  <Svg {...p}><path d="M9 5l7 7-7 7" /></Svg>
);
export const GearIcon = (p) => (
  <Svg {...p}>
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </Svg>
);
export const SunIcon = (p) => (
  <Svg {...p}><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></Svg>
);
export const MoonIcon = (p) => (
  <Svg {...p}><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></Svg>
);
export const DownloadIcon = (p) => (
  <Svg {...p}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></Svg>
);
export const UploadIcon = (p) => (
  <Svg {...p}><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></Svg>
);
export const RepeatIcon = (p) => (
  <Svg {...p}><path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4m14 4v2a4 4 0 01-4 4H3" transform="translate(0 -2)" /></Svg>
);
export const WalletIcon = (p) => (
  <Svg {...p}><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></Svg>
);
export const TrendUpIcon = (p) => (
  <Svg {...p}><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></Svg>
);
export const CoinIcon = (p) => (
  <Svg {...p}><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></Svg>
);
