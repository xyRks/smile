import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

// Custom, more abstract/unique icons instead of standard emojis
export const HappyIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" />
    <path d="M9 9L9.01 9" strokeWidth="3" />
    <path d="M15 9L15.01 9" strokeWidth="3" />
    <path d="M12 4C14 4 15 5 15 5" />
    <path d="M12 4C10 4 9 5 9 5" />
  </svg>
);

export const ExcitedIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 14H16L14 18H10L8 14Z" fill="currentColor" fillOpacity="0.3" />
    <path d="M9 8L10 10L8 11" />
    <path d="M15 8L14 10L16 11" />
    <path d="M12 2V4" />
    <path d="M4 12H2" />
    <path d="M22 12H20" />
    <path d="M5 5L6.5 6.5" />
    <path d="M19 5L17.5 6.5" />
  </svg>
);

export const NeutralIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 15H16" />
    <path d="M9 10H10" />
    <path d="M14 10H15" />
  </svg>
);

export const TiredIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 15C8 15 9.5 14 12 14C14.5 14 16 15 16 15" />
    <path d="M8 10C8 10 9 9 10 9C11 9 11 10 11 10" />
    <path d="M13 10C13 10 14 9 15 9C16 9 16 10 16 10" />
    <path d="M18 4H20L18 7H20" />
    <path d="M21 2H22L21 4H22" strokeWidth="1" />
  </svg>
);

export const SadIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 16C8 16 9.5 14 12 14C14.5 14 16 16 16 16" />
    <path d="M9 10L9.01 10" strokeWidth="3" />
    <path d="M15 10L15.01 10" strokeWidth="3" />
    <path d="M15 12V14" stroke="#3b82f6" opacity="0.8" />
  </svg>
);

export const AngryIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" opacity="0.2" />
    <path d="M8 16H16" />
    <path d="M8 9L10 10" />
    <path d="M16 9L14 10" />
    <path d="M9 11L9.01 11" strokeWidth="3" />
    <path d="M15 11L15.01 11" strokeWidth="3" />
    <path d="M12 15L12 14" />
  </svg>
);

export const getCustomMoodIcon = (mood: string, className: string = "w-full h-full") => {
  switch (mood) {
    case 'happy': return <HappyIcon className={className} />;
    case 'excited': return <ExcitedIcon className={className} />;
    case 'neutral': return <NeutralIcon className={className} />;
    case 'tired': return <TiredIcon className={className} />;
    case 'sad': return <SadIcon className={className} />;
    case 'angry': return <AngryIcon className={className} />;
    default: return <NeutralIcon className={className} />;
  }
};
