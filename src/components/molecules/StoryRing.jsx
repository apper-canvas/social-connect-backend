import React from "react";
import { cn } from "@/utils/cn";

const StoryRing = ({ 
  children, 
  hasStory = false, 
  isViewed = false, 
  size = "md", 
  className,
  onClick,
  ...props 
}) => {
  const sizeClasses = {
    sm: "p-0.5",
    md: "p-1",
    lg: "p-1.5",
    xl: "p-2"
  };

  const ringColors = {
    hasStory: !isViewed 
      ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500" 
      : "bg-gradient-to-tr from-gray-500 to-gray-400",
    noStory: "bg-gray-600"
  };

  return (
    <div
      className={cn(
        "rounded-full transition-all duration-200",
        sizeClasses[size],
        hasStory ? ringColors.hasStory : ringColors.noStory,
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="bg-background rounded-full p-0.5">
        {children}
      </div>
    </div>
  );
};

export default StoryRing;