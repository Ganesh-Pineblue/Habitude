import React from 'react';

export const FriendlyChatbotLogo = ({ size = 100 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Outer Headset */}
    <ellipse cx="50" cy="50" rx="40" ry="38" fill="#2563eb" />
    {/* Face background */}
    <ellipse cx="50" cy="50" rx="32" ry="30" fill="#fff" />
    {/* Antennas */}
    <circle cx="18" cy="30" r="3" fill="#2563eb" />
    <rect x="17" y="33" width="2" height="8" rx="1" fill="#2563eb" />
    <circle cx="82" cy="30" r="3" fill="#2563eb" />
    <rect x="81" y="33" width="2" height="8" rx="1" fill="#2563eb" />
    {/* Earpieces */}
    <rect x="7" y="45" width="8" height="18" rx="4" fill="#2563eb" />
    <rect x="85" y="45" width="8" height="18" rx="4" fill="#2563eb" />
    {/* Face */}
    <ellipse cx="50" cy="55" rx="18" ry="15" fill="#fff" />
    {/* Eyes */}
    <ellipse cx="43" cy="55" rx="2" ry="3" fill="#2563eb" />
    <ellipse cx="57" cy="55" rx="2" ry="3" fill="#2563eb" />
    {/* Smile */}
    <path d="M44 62 Q50 67 56 62" stroke="#2563eb" strokeWidth="2" fill="none" />
  </svg>
);

export default FriendlyChatbotLogo; 