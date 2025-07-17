import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserCard from "@/components/molecules/UserCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Feed from "@/components/organisms/Feed";
import { userService } from "@/services/api/userService";
import { hashtagService } from "@/services/api/hashtagService";
import { feedService } from "@/services/api/feedService";

const ExploreSection = ({ currentUserId, onSelectUser }) => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [users, hashtags] = await Promise.all([
        userService.getSuggestedUsers(currentUserId),
        hashtagService.getTrending()
      ]);
      
      setSuggestedUsers(users);
      setTrendingHashtags(hashtags);
    } catch (err) {
      console.error("Error loading explore data:", err);
      setError(err.message || "Failed to load explore data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const results = [];
      
      // Search users
      if (query.startsWith("@")) {
        const users = await userService.search(query.substring(1));
        results.push(...users.map(user => ({ ...user, type: "user" })));
      } else if (query.startsWith("#")) {
        const hashtags = await hashtagService.search(query.substring(1));
        results.push(...hashtags.map(tag => ({ ...tag, type: "hashtag" })));
      } else {
        // Search both users and hashtags
        const [users, hashtags] = await Promise.all([
          userService.search(query),
          hashtagService.search(query)
        ]);
        results.push(...users.map(user => ({ ...user, type: "user" })));
        results.push(...hashtags.map(tag => ({ ...tag, type: "hashtag" })));
      }
      
      return results;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  };

  const handleFollow = async (userId) => {
    try {
      await userService.follow(currentUserId, userId);
      // Update local state
      setSuggestedUsers(prev => prev.map(user => 
        user.Id === userId ? { ...user, isFollowing: true } : user
      ));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await userService.unfollow(currentUserId, userId);
      // Update local state
      setSuggestedUsers(prev => prev.map(user => 
        user.Id === userId ? { ...user, isFollowing: false } : user
      ));
    } catch (err) {
      console.error("Error unfollowing user:", err);
    }
  };

  const handleSelectUser = (user) => {
    onSelectUser?.(user);
  };

  const handleSelectHashtag = (hashtag) => {
    console.log("Selected hashtag:", hashtag);
    // Navigate to hashtag page or filter posts
  };

  const handleRetry = () => {
    loadExploreData();
  };

  const tabs = [
    { id: "users", label: "People", icon: "Users" },
    { id: "hashtags", label: "Trending", icon: "TrendingUp" },
    { id: "posts", label: "Posts", icon: "FileText" },
  ];

  if (loading) {
    return <Loading type="users" />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} type="network" />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          onSelectUser={handleSelectUser}
          onSelectHashtag={handleSelectHashtag}
          placeholder="Search users, hashtags, or posts..."
        />
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 p-1 glass-morphism rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
            >
              <ApperIcon name={tab.icon} size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div>
        {activeTab === "users" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedUsers.length > 0 ? (
              suggestedUsers.map((user) => (
                <motion.div
                  key={user.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <UserCard
                    user={user}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    isFollowing={user.isFollowing}
                    variant="compact"
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <Empty type="followers" />
              </div>
            )}
          </div>
        )}

        {activeTab === "hashtags" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingHashtags.length > 0 ? (
              trendingHashtags.map((hashtag, index) => (
                <motion.div
                  key={hashtag.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-morphism rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleSelectHashtag(hashtag)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Hash" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">#{hashtag.tag}</h3>
                      <p className="text-sm text-gray-400">{hashtag.count} posts</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full">
                <Empty type="search" />
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            <Feed type="explore" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreSection;