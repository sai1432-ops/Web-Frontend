// src/app/components/ui/InitialsAvatar.tsx

import React from 'react';
import { cn } from './utils';

interface InitialsAvatarProps {
  name: string;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
}

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  className,
  backgroundColor = "#E9EEF3",
  textColor = "#2563EB", // PrimaryBlue equivalent
  fontSize = "1.25rem"
}) => {
  const initial = name.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full overflow-hidden",
        className
      )}
      style={{
        backgroundColor,
        width: "3.5rem",
        height: "3.5rem",
      }}
    >
      <span
        style={{
          color: textColor,
          fontSize,
          fontWeight: 700,
        }}
      >
        {initial}
      </span>
    </div>
  );
};
