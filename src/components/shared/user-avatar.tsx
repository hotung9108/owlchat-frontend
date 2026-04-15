import React from "react";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, className = "", size = "md" }) => {
  const getInitials = (userName: string) => {
    if (!userName) return "U";
    const parts = userName.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getColorFromName = (userName: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-amber-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Fallback if imageUrl is missing or generic
  if (imageUrl && !imageUrl.includes("default-avatar.jpg")) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`rounded-full object-cover border border-border shadow-sm ${sizeClasses[size]} ${className}`}
        onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-black/5 ${getColorFromName(
        name
      )} ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default UserAvatar;
