import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import StoryRing from "@/components/molecules/StoryRing";
import { storyService } from "@/services/api/storyService";
import { cn } from "@/utils/cn";

const NavigationBar = ({ currentUser, onCreatePost, onCreateStory, onViewStory }) => {
  const location = useLocation();
  const [isCreateHovered, setIsCreateHovered] = useState(false);
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);

  useEffect(() => {
    if (currentUser) {
      loadStories();
    }
  }, [currentUser]);

  const loadStories = async () => {
    try {
      const allStories = await storyService.getAll();
      setStories(allStories);
      
      // Get current user's stories
      const currentUserStories = allStories.filter(story => story.userId === currentUser.Id);
      setUserStories(currentUserStories);
    } catch (err) {
      console.error("Error loading stories:", err);
    }
  };

  const handleStoryClick = () => {
    if (userStories.length > 0) {
      onViewStory({ stories: userStories, startIndex: 0 });
    } else {
      onCreateStory();
    }
  };
const navItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Explore", path: "/explore", icon: "Compass" },
    { name: "Create", path: "#", icon: "Plus", isCreate: true },
    { name: "Messages", path: "/messages", icon: "MessageSquare" },
    { name: "Profile", path: `/profile/${currentUser?.Id || "1"}`, icon: "User" },
  ];

  const handleCreateClick = () => {
    onCreatePost?.();
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden lg:block fixed left-0 top-0 h-full w-64 glass-morphism border-r border-gray-700 z-40">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gradient">SocialConnect</h1>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.isCreate ? (
                  <motion.button
                    onClick={handleCreateClick}
                    onHoverStart={() => setIsCreateHovered(true)}
                    onHoverEnd={() => setIsCreateHovered(false)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <ApperIcon name={item.icon} size={18} />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200",
                        isActive
                          ? "bg-primary/20 text-primary"
                          : "text-gray-300 hover:text-white hover:bg-gray-700"
                      )
                    }
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                )}
              </div>
            ))}
          </nav>
        </div>
        
{/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="cursor-pointer" onClick={handleStoryClick}>
              <StoryRing 
                hasStory={userStories.length > 0}
                isViewed={false}
                size="md"
              >
                <Avatar 
                  src={currentUser?.avatar} 
                  alt={currentUser?.displayName || currentUser?.username}
                  fallback={currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0)}
                  size="md"
                />
              </StoryRing>
            </div>
            <div className="flex-1">
              <p className="font-medium text-white">
                {currentUser?.displayName || currentUser?.username}
              </p>
              <p className="text-sm text-gray-400">@{currentUser?.username}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Fixed bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass-morphism border-t border-gray-700 z-50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <div key={item.name} className="flex-1">
              {item.isCreate ? (
                <motion.button
                  onClick={handleCreateClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full flex flex-col items-center py-2"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-1">
                    <ApperIcon name={item.icon} size={24} className="text-white" />
                  </div>
                </motion.button>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex flex-col items-center py-2 transition-colors duration-200",
                      isActive ? "text-primary" : "text-gray-400"
                    )
                  }
                >
{item.name === "Profile" ? (
                    <div className="cursor-pointer" onClick={handleStoryClick}>
                      <StoryRing 
                        hasStory={userStories.length > 0}
                        isViewed={false}
                        size="sm"
                      >
                        <Avatar 
                          src={currentUser?.avatar} 
                          alt={currentUser?.displayName || currentUser?.username}
                          fallback={currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0)}
                          size="sm"
                          className="mb-1"
                        />
                      </StoryRing>
                    </div>
                  ) : (
                    <ApperIcon name={item.icon} size={24} className="mb-1" />
                  )}
                  <span className="text-xs">{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavigationBar;