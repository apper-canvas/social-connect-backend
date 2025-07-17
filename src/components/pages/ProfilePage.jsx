import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UserProfile from "@/components/organisms/UserProfile";
import { userService } from "@/services/api/userService";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

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

  const handleEditProfile = () => {
    // Navigate to edit profile page or show modal
    console.log("Edit profile clicked");
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={handleBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </button>
      </motion.div>

      {/* Profile Content */}
      <UserProfile
        userId={parseInt(userId)}
        currentUserId={currentUser?.Id}
        onEditProfile={handleEditProfile}
      />
    </div>
  );
};

export default ProfilePage;