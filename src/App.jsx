import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/organisms/NavigationBar";
import CreatePostModal from "@/components/molecules/CreatePostModal";
import CreateStoryModal from "@/components/molecules/CreateStoryModal";
import StoryViewer from "@/components/molecules/StoryViewer";
import HomePage from "@/components/pages/HomePage";
import ExplorePage from "@/components/pages/ExplorePage";
import ProfilePage from "@/components/pages/ProfilePage";
import MessagesPage from "@/components/pages/MessagesPage";
import SearchResultsPage from "@/components/pages/SearchResultsPage";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { storyService } from "@/services/api/storyService";
import { toast } from "react-toastify";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryData, setCurrentStoryData] = useState(null);
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
      setShowCreateModal(false);
      
      // Trigger feed refresh to show new post
      setRefreshTrigger(prev => prev + 1);
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
      setShowCreateStoryModal(false);
      
      // Trigger refresh to show new story
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error("Error creating story:", err);
      toast.error("Failed to create story");
    }
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

  const handleRefreshFeed = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
<NavigationBar 
        currentUser={currentUser} 
        onCreatePost={handleOpenCreateModal}
        onCreateStory={handleOpenCreateStoryModal}
        onViewStory={handleOpenStoryViewer}
      />

      {/* Main Content */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
<Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} refreshTrigger={refreshTrigger} onRefreshFeed={handleRefreshFeed} />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/search" element={<SearchResultsPage currentUser={currentUser} />} />
        </Routes>
      </div>

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

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;