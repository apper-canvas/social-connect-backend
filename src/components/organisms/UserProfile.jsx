import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Feed from "@/components/organisms/Feed";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";
import { followService } from "@/services/api/followService";

const UserProfile = ({ userId, currentUserId, onEditProfile }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    loadUser();
    checkFollowStatus();
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getById(userId);
      setUser(userData);
    } catch (err) {
      console.error("Error loading user:", err);
      setError(err.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!currentUserId || userId === currentUserId) return;
    
    try {
      const following = await followService.isFollowing(currentUserId, userId);
      setIsFollowing(following);
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId || userId === currentUserId) return;
    
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await followService.unfollow(currentUserId, userId);
        setIsFollowing(false);
        setUser(prev => prev ? { ...prev, followersCount: prev.followersCount - 1 } : null);
      } else {
        await followService.follow(currentUserId, userId);
        setIsFollowing(true);
        setUser(prev => prev ? { ...prev, followersCount: prev.followersCount + 1 } : null);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleRetry = () => {
    loadUser();
  };

  if (loading) {
    return <Loading type="users" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="notFound" />;
  }

  if (!user) {
    return <Empty type="search" />;
  }

  const isOwnProfile = userId === currentUserId;

  const tabs = [
    { id: "posts", label: "Posts", count: user.postsCount },
    { id: "replies", label: "Replies", count: 0 },
    { id: "media", label: "Media", count: 0 },
    { id: "likes", label: "Likes", count: 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-6 mb-6"
      >
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-primary to-secondary rounded-lg mb-4 relative">
          <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 -mt-16">
          <Avatar 
            src={user.avatar} 
            alt={user.displayName || user.username}
            fallback={user.displayName?.charAt(0) || user.username?.charAt(0)}
            size="2xl"
            className="border-4 border-background"
          />
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">
              {user.displayName || user.username}
            </h1>
            <p className="text-gray-400 mb-3">@{user.username}</p>
            
            {user.bio && (
              <p className="text-gray-300 mb-4 leading-relaxed">{user.bio}</p>
            )}
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-white">{user.followingCount || 0}</span>
                <span className="text-gray-400">Following</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-white">{user.followersCount || 0}</span>
                <span className="text-gray-400">Followers</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-white">{user.postsCount || 0}</span>
                <span className="text-gray-400">Posts</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            {isOwnProfile ? (
              <Button
                onClick={onEditProfile}
                variant="outline"
                className="px-6"
              >
                <ApperIcon name="Edit" size={16} className="mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={isFollowing ? "outline" : "primary"}
                  onClick={handleFollowToggle}
                  loading={followLoading}
                  className="px-6"
                >
                  <ApperIcon 
                    name={isFollowing ? "UserMinus" : "UserPlus"} 
                    size={16} 
                    className="mr-2" 
                  />
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
                <Button variant="outline" size="md">
                  <ApperIcon name="MessageCircle" size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 p-1 glass-morphism rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "posts" && (
          <Feed type="profile" userId={userId} />
        )}
        {activeTab === "replies" && (
          <Empty type="posts" />
        )}
        {activeTab === "media" && (
          <Empty type="posts" />
        )}
        {activeTab === "likes" && (
          <Empty type="posts" />
        )}
      </div>
    </div>
  );
};

export default UserProfile;