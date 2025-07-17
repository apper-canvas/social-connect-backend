import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const CreatePostModal = ({ 
  isOpen, 
  onClose, 
  onCreatePost, 
  currentUser 
}) => {
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onCreatePost({
        content: content.trim(),
        mediaFile,
        mediaType: mediaPreview?.type || null
      });
      
      // Reset form
      setContent("");
      setMediaFile(null);
      setMediaPreview(null);
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const isValid = content.trim().length > 0;
  const characterCount = content.length;
  const maxCharacters = 280;

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
          className="glass-morphism rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Create Post</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex space-x-3 mb-4">
              <Avatar 
                src={currentUser?.avatar} 
                alt={currentUser?.displayName || currentUser?.username}
                fallback={currentUser?.displayName?.charAt(0) || currentUser?.username?.charAt(0)}
                size="md"
              />
              <div className="flex-1">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="min-h-[120px] text-lg border-none bg-transparent resize-none focus:ring-0 p-0"
                  maxLength={maxCharacters}
                />
              </div>
            </div>

            {/* Media Preview */}
            {mediaPreview && (
              <div className="mb-4 relative">
                <div className="rounded-lg overflow-hidden bg-gray-800">
                  {mediaPreview.type === "image" ? (
                    <img 
                      src={mediaPreview.url} 
                      alt="Media preview" 
                      className="w-full h-auto max-h-64 object-cover"
                    />
                  ) : (
                    <video 
                      src={mediaPreview.url} 
                      className="w-full h-auto max-h-64 object-cover"
                      controls
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors duration-200"
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
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
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  <ApperIcon name="MapPin" size={20} />
                </button>
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  <ApperIcon name="Smile" size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    characterCount > maxCharacters * 0.8 ? "text-red-500" : "text-gray-400"
                  )}>
                    {maxCharacters - characterCount}
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 relative",
                    characterCount > maxCharacters * 0.8 ? "border-red-500" : "border-gray-600"
                  )}>
                    <div 
                      className={cn(
                        "absolute inset-0 rounded-full",
                        characterCount > maxCharacters * 0.8 ? "bg-red-500" : "bg-primary"
                      )}
                      style={{
                        transform: `rotate(${(characterCount / maxCharacters) * 360}deg)`,
                        clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)"
                      }}
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={!isValid || loading}
                  loading={loading}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreatePostModal;