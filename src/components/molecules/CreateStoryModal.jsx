import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const CreateStoryModal = ({ 
  isOpen, 
  onClose, 
  onCreateStory, 
  currentUser 
}) => {
  const [text, setText] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState("#1F2937");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);

  const backgroundColors = [
    "#1F2937", "#6366F1", "#EC4899", "#10B981", "#F59E0B", 
    "#EF4444", "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
  ];

  const textColors = [
    "#FFFFFF", "#000000", "#F59E0B", "#EF4444", "#10B981", "#6366F1"
  ];

  const handleMediaUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview({
          url: e.target.result,
          type: file.type.startsWith("image/") ? "image" : "video"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaFile) return;

    setLoading(true);
    try {
      await onCreateStory({
        text: text.trim(),
        mediaFile,
        mediaType: mediaPreview?.type || "text",
        backgroundColor,
        textColor
      });
      
      // Reset form
      setText("");
      setMediaFile(null);
      setMediaPreview(null);
      setBackgroundColor("#1F2937");
      setTextColor("#FFFFFF");
      onClose();
    } catch (error) {
      console.error("Error creating story:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = text.trim().length > 0 || mediaFile;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Create Story</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Story Preview */}
          <div className="p-4">
            <div 
              className="relative w-full h-64 rounded-lg overflow-hidden mb-4"
              style={{ backgroundColor }}
            >
              {/* Background Media */}
              {mediaPreview && (
                <div className="absolute inset-0">
                  {mediaPreview.type === "video" ? (
                    <video
                      src={mediaPreview.url}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                    />
                  ) : (
                    <img
                      src={mediaPreview.url}
                      alt="Story preview"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Text Overlay */}
              {text && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <p
                    className="text-center text-lg font-medium leading-relaxed"
                    style={{ color: textColor }}
                  >
                    {text}
                  </p>
                </div>
              )}

              {/* User Info */}
              <div className="absolute top-2 left-2 flex items-center space-x-2">
                <Avatar
                  src={currentUser?.avatar}
                  alt={currentUser?.displayName || currentUser?.username}
                  fallback={currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0)}
                  size="sm"
                />
                <p className="text-white text-sm font-medium">
                  {currentUser?.displayName || currentUser?.username}
                </p>
              </div>

              {/* Remove Media Button */}
              {mediaPreview && (
                <button
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              )}
            </div>

            {/* Content Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Share what's on your mind..."
                className="min-h-[80px] border-gray-600 bg-gray-800"
                maxLength={150}
              />

              {/* Media Upload */}
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer text-primary hover:text-primary/80 transition-colors duration-200">
                  <ApperIcon name="Image" size={20} />
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-400">Add photo or video</span>
              </div>

              {/* Background Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Background Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBackgroundColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all duration-200",
                        backgroundColor === color 
                          ? "border-white scale-110" 
                          : "border-gray-600 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Text Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTextColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-all duration-200",
                        textColor === color 
                          ? "border-white scale-110" 
                          : "border-gray-600 hover:border-gray-400"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-400">
                  Stories disappear after 24 hours
                </div>
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  loading={loading}
                  variant="story"
                  size="md"
                >
                  Share Story
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateStoryModal;