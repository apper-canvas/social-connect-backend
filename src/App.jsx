import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import NavigationBar from "@/components/organisms/NavigationBar";
import CreatePostModal from "@/components/molecules/CreatePostModal";
import HomePage from "@/components/pages/HomePage";
import ExplorePage from "@/components/pages/ExplorePage";
import ProfilePage from "@/components/pages/ProfilePage";
import MessagesPage from "@/components/pages/MessagesPage";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

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
      
      // Refresh the page to show new post
      window.location.reload();
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <NavigationBar 
        currentUser={currentUser} 
        onCreatePost={handleOpenCreateModal}
      />

      {/* Main Content */}
      <div className="lg:ml-64 pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
        </Routes>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreatePost={handleCreatePost}
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