import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Feed from "@/components/organisms/Feed";
import CreatePostModal from "@/components/molecules/CreatePostModal";
import CreateStoryModal from "@/components/molecules/CreateStoryModal";
import StoryViewer from "@/components/molecules/StoryViewer";
import StoryRing from "@/components/molecules/StoryRing";
import Avatar from "@/components/atoms/Avatar";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { storyService } from "@/services/api/storyService";
import { toast } from "react-toastify";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryData, setCurrentStoryData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);

useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadStories();
    }
  }, [currentUser, refreshTrigger]);

  const loadCurrentUser = async () => {
    try {
      // For demo purposes, use the first user as current user
      const user = await userService.getById(1);
      setCurrentUser(user);
    } catch (err) {
      console.error("Error loading current user:", err);
    }
  };

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

  const handleCreateStory = async (storyData) => {
    try {
      const newStory = await storyService.create({
        userId: currentUser.Id,
        mediaUrl: storyData.mediaFile ? "/api/uploads/story-placeholder.jpg" : null,
        mediaType: storyData.mediaType || "image",
        text: storyData.text || "",
        backgroundColor: storyData.backgroundColor || "#1F2937",
        textColor: storyData.textColor || "#FFFFFF",
        duration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      });
      
      toast.success("Story created successfully!");
      setRefreshTrigger(prev => prev + 1);
      setShowCreateStoryModal(false);
    } catch (err) {
      console.error("Error creating story:", err);
      toast.error("Failed to create story");
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await postService.create({
        userId: currentUser.Id,
        content: postData.content,
        mediaUrl: postData.mediaFile ? "/api/uploads/placeholder.jpg" : null,
        mediaType: postData.mediaType || null,
        likes: 0,
        comments: 0,
        hashtags: extractHashtags(postData.content),
        createdAt: new Date().toISOString()
      });
      
      toast.success("Post created successfully!");
      setRefreshTrigger(prev => prev + 1);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating post:", err);
      toast.error("Failed to create post");
    }
  };

  const extractHashtags = (content) => {
    const hashtagRegex = /#(\w+)/g;
    const hashtags = [];
    let match;
    
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }
    
    return hashtags;
  };

const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleOpenCreateStoryModal = () => {
    setShowCreateStoryModal(true);
  };

  const handleCloseCreateStoryModal = () => {
    setShowCreateStoryModal(false);
  };

  const handleOpenStoryViewer = (storyData) => {
    setCurrentStoryData(storyData);
    setShowStoryViewer(true);
  };

  const handleCloseStoryViewer = () => {
    setShowStoryViewer(false);
    setCurrentStoryData(null);
  };

  const handleStoryClick = () => {
    if (userStories.length > 0) {
      handleOpenStoryViewer({ stories: userStories, startIndex: 0 });
    } else {
      handleOpenCreateStoryModal();
    }
  };

  // Group stories by user
  const groupedStories = stories.reduce((acc, story) => {
    if (!acc[story.userId]) {
      acc[story.userId] = [];
    }
    acc[story.userId].push(story);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Home</h1>
        <div className="flex items-center space-x-4">
          <button className="text-primary font-medium border-b-2 border-primary pb-2">
            For You
          </button>
          <button className="text-gray-400 hover:text-white transition-colors duration-200 pb-2">
            Following
          </button>
        </div>
      </motion.div>

      {/* Quick Create Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-4 mb-6"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {currentUser?.displayName?.charAt(0) || "U"}
            </span>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex-1 text-left px-4 py-3 bg-surface rounded-full text-gray-400 hover:text-white hover:bg-gray-600 transition-all duration-200"
          >
            What's happening?
          </button>
        </div>
</motion.div>

      {/* Stories Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism rounded-xl p-4 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Stories</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {/* Current User Story */}
          <div className="flex-shrink-0 text-center">
            <div className="cursor-pointer" onClick={handleStoryClick}>
              <StoryRing 
                hasStory={userStories.length > 0}
                isViewed={false}
                size="lg"
              >
                <Avatar 
                  src={currentUser?.avatar} 
                  alt={currentUser?.displayName || currentUser?.username}
                  fallback={currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0)}
                  size="lg"
                />
              </StoryRing>
            </div>
            <p className="text-xs text-gray-400 mt-2 max-w-16 truncate">
              {userStories.length > 0 ? "Your Story" : "Add Story"}
            </p>
          </div>

          {/* Other Users' Stories */}
          {Object.entries(groupedStories)
            .filter(([userId]) => parseInt(userId) !== currentUser?.Id)
            .map(([userId, userStoryList]) => (
              <div key={userId} className="flex-shrink-0 text-center">
                <div 
                  className="cursor-pointer" 
                  onClick={() => handleOpenStoryViewer({ stories: userStoryList, startIndex: 0 })}
                >
                  <StoryRing 
                    hasStory={true}
                    isViewed={false}
                    size="lg"
                  >
                    <Avatar 
                      src={userStoryList[0]?.user?.avatar} 
                      alt={userStoryList[0]?.user?.displayName || userStoryList[0]?.user?.username}
                      fallback={userStoryList[0]?.user?.displayName?.charAt(0) || userStoryList[0]?.user?.username?.charAt(0)}
                      size="lg"
                    />
                  </StoryRing>
                </div>
                <p className="text-xs text-gray-400 mt-2 max-w-16 truncate">
                  {userStoryList[0]?.user?.displayName || userStoryList[0]?.user?.username}
                </p>
              </div>
            ))}
        </div>
      </motion.div>
      {/* Feed */}
      <Feed 
        type="home" 
        onCreatePost={handleOpenCreateModal}
        refreshTrigger={refreshTrigger}
      />

{/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreatePost={handleCreatePost}
        currentUser={currentUser}
      />

      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={showCreateStoryModal}
        onClose={handleCloseCreateStoryModal}
        onCreateStory={handleCreateStory}
        currentUser={currentUser}
      />

      {/* Story Viewer */}
      <StoryViewer
        isOpen={showStoryViewer}
        onClose={handleCloseStoryViewer}
        storyData={currentStoryData}
        currentUser={currentUser}
      />
    </div>
  );
};

export default HomePage;