import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ExploreSection from "@/components/organisms/ExploreSection";
import { userService } from "@/services/api/userService";

const ExplorePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const handleSelectUser = (user) => {
    navigate(`/profile/${user.Id}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Explore</h1>
        <p className="text-gray-400">
          Discover new people and trending content
        </p>
      </motion.div>

      {/* Explore Content */}
      <ExploreSection
        currentUserId={currentUser?.Id}
        onSelectUser={handleSelectUser}
      />
    </div>
  );
};

export default ExplorePage;