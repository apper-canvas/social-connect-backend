import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { storyService } from "@/services/api/storyService";
import { highlightService } from "@/services/api/highlightService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const StoryViewer = ({ 
  isOpen, 
  onClose, 
  storyData, 
  currentUser 
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [highlights, setHighlights] = useState([]);

  const stories = storyData?.stories || [];
  const currentStory = stories[currentStoryIndex];

useEffect(() => {
    if (isOpen && storyData?.startIndex !== undefined) {
      setCurrentStoryIndex(storyData.startIndex);
    }
  }, [isOpen, storyData?.startIndex]);

  useEffect(() => {
    if (currentUser) {
      loadHighlights();
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isOpen || isPaused || !currentStory) return;

    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentStoryIndex, currentStory]);

  const loadHighlights = async () => {
    try {
      const userHighlights = await highlightService.getByUserId(currentUser.Id);
      setHighlights(userHighlights);
    } catch (err) {
      console.error("Error loading highlights:", err);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleAddToHighlight = async (highlightId) => {
    try {
      await highlightService.addStoryToHighlight(highlightId, currentStory.Id);
      toast.success("Story added to highlight!");
      setShowOptions(false);
    } catch (err) {
      console.error("Error adding to highlight:", err);
      toast.error("Failed to add story to highlight");
    }
  };

  const handleCreateHighlight = async () => {
    try {
      const title = prompt("Enter highlight title:");
      if (!title) return;

      await highlightService.createFromStory(currentStory.Id, {
        userId: currentUser.Id,
        title,
        coverImage: currentStory.mediaUrl || "/api/highlights/default-cover.jpg"
      });
      
      toast.success("Highlight created successfully!");
      setShowOptions(false);
      loadHighlights();
    } catch (err) {
      console.error("Error creating highlight:", err);
      toast.error("Failed to create highlight");
    }
  };

  const handleStoryView = async () => {
    if (currentStory) {
      try {
        await storyService.incrementView(currentStory.Id);
      } catch (err) {
        console.error("Error incrementing view:", err);
      }
    }
  };

  useEffect(() => {
    if (currentStory && isOpen) {
      handleStoryView();
    }
  }, [currentStory, isOpen]);

  const getTimeRemaining = () => {
    if (!currentStory?.expiresAt) return "";
    return storyService.getTimeRemaining(currentStory.expiresAt);
  };

  if (!isOpen || !currentStory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md h-full max-h-[90vh] bg-gray-900 rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bars */}
          <div className="absolute top-2 left-2 right-2 flex space-x-1 z-20">
            {stories.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: `${
                      index < currentStoryIndex
                        ? 100
                        : index === currentStoryIndex
                        ? progress
                        : 0
                    }%`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-3">
              <Avatar
                src={currentStory.user?.avatar}
                alt={currentStory.user?.displayName || currentStory.user?.username}
                fallback={currentStory.user?.displayName?.charAt(0) || currentStory.user?.username?.charAt(0)}
                size="sm"
              />
              <div>
                <p className="text-white font-medium text-sm">
                  {currentStory.user?.displayName || currentStory.user?.username}
                </p>
                <p className="text-white/70 text-xs">
                  {getTimeRemaining()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePause}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name={isPaused ? "Play" : "Pause"} size={16} />
              </Button>
              {currentStory.userId === currentUser?.Id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-white hover:bg-white/20"
                >
                  <ApperIcon name="MoreHorizontal" size={16} />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>

          {/* Story Content */}
          <div 
            className="relative w-full h-full flex items-center justify-center"
            style={{ backgroundColor: currentStory.backgroundColor }}
          >
            {/* Background Media */}
            {currentStory.mediaUrl && (
              <div className="absolute inset-0">
                {currentStory.mediaType === "video" ? (
                  <video
                    src={currentStory.mediaUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={currentStory.mediaUrl}
                    alt="Story content"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}

            {/* Text Overlay */}
            {currentStory.text && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <p
                  className="text-center text-lg font-medium leading-relaxed"
                  style={{ color: currentStory.textColor }}
                >
                  {currentStory.text}
                </p>
              </div>
            )}

            {/* Navigation Areas */}
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-4"
                onClick={handlePrevious}
              >
                {currentStoryIndex > 0 && (
                  <ApperIcon name="ChevronLeft" size={24} className="text-white/50" />
                )}
              </div>
              <div
                className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-4"
                onClick={handleNext}
              >
                {currentStoryIndex < stories.length - 1 && (
                  <ApperIcon name="ChevronRight" size={24} className="text-white/50" />
                )}
              </div>
            </div>
          </div>

          {/* Story Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="Heart" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="MessageCircle" size={20} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ApperIcon name="Send" size={20} />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">
                {currentStory.views} views
              </span>
            </div>
          </div>

          {/* Options Menu */}
          {showOptions && (
            <div className="absolute bottom-16 right-4 bg-gray-800 rounded-lg p-2 min-w-48 z-30">
              <button
                onClick={handleCreateHighlight}
                className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
              >
                Create Highlight
              </button>
              {highlights.length > 0 && (
                <>
                  <div className="border-t border-gray-700 my-2" />
                  <p className="px-3 py-1 text-gray-400 text-xs">Add to Highlight</p>
                  {highlights.map((highlight) => (
                    <button
                      key={highlight.Id}
                      onClick={() => handleAddToHighlight(highlight.Id)}
                      className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded-md text-sm"
                    >
                      {highlight.title}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StoryViewer;