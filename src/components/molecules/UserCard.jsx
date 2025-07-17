import { useState } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const UserCard = ({ 
  user, 
  onFollow, 
  onUnfollow, 
  isFollowing = false,
  className,
  variant = "default"
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (following) {
        await onUnfollow?.(user.Id);
        setFollowing(false);
      } else {
        await onFollow?.(user.Id);
        setFollowing(true);
      }
    } catch (error) {
      console.error("Follow/Unfollow error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center justify-between p-3 glass-morphism rounded-lg hover:shadow-md transition-all duration-200",
          className
        )}
      >
        <div className="flex items-center space-x-3">
          <Avatar 
            src={user.avatar} 
            alt={user.displayName || user.username}
            fallback={user.displayName?.charAt(0) || user.username?.charAt(0)}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-white text-sm">
              {user.displayName || user.username}
            </h3>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
        </div>
        
        <Button
          variant={following ? "outline" : "primary"}
          size="sm"
          onClick={handleFollowToggle}
          loading={loading}
          className="min-w-[80px]"
        >
          {following ? "Following" : "Follow"}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-morphism rounded-xl p-6 hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <Avatar 
          src={user.avatar} 
          alt={user.displayName || user.username}
          fallback={user.displayName?.charAt(0) || user.username?.charAt(0)}
          size="xl"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-white text-lg">
                {user.displayName || user.username}
              </h3>
              <p className="text-gray-400">@{user.username}</p>
            </div>
            
            <Button
              variant={following ? "outline" : "primary"}
              size="sm"
              onClick={handleFollowToggle}
              loading={loading}
            >
              <ApperIcon 
                name={following ? "UserMinus" : "UserPlus"} 
                size={16} 
                className="mr-2" 
              />
              {following ? "Unfollow" : "Follow"}
            </Button>
          </div>
          
          {user.bio && (
            <p className="text-gray-300 mb-4 leading-relaxed">{user.bio}</p>
          )}
          
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-white">
                {user.postsCount || 0}
              </span>
              <span className="text-gray-400">Posts</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-white">
                {user.followersCount || 0}
              </span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-white">
                {user.followingCount || 0}
              </span>
              <span className="text-gray-400">Following</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;