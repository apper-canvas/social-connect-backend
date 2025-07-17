import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Feed from "@/components/organisms/Feed";
import CreatePostModal from "@/components/molecules/CreatePostModal";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";

const HomePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      // For demo purposes, use the first user as current user
      const user = await userService.getById(1);
      setCurrentUser(user);
    } catch (err) {
      console.error("Error loading current user:", err);
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
    </div>
  );
};

export default HomePage;