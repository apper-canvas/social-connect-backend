import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = "md", 
  className, 
  fallback,
  ...props 
}) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-medium overflow-hidden",
        sizes[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {fallback ? (
            <span className="uppercase font-bold">
              {fallback.charAt(0)}
            </span>
          ) : (
            <ApperIcon name="User" size={size === "sm" ? 14 : size === "md" ? 18 : size === "lg" ? 22 : 28} />
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;