import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { highlightService } from "@/services/api/highlightService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const HighlightManager = ({ 
  isOpen, 
  onClose, 
  currentUser 
}) => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHighlightTitle, setNewHighlightTitle] = useState("");
  const [selectedHighlight, setSelectedHighlight] = useState(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadHighlights();
    }
  }, [isOpen, currentUser]);

  const loadHighlights = async () => {
    setLoading(true);
    try {
      const userHighlights = await highlightService.getByUserId(currentUser.Id);
      setHighlights(userHighlights);
    } catch (err) {
      console.error("Error loading highlights:", err);
      toast.error("Failed to load highlights");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHighlight = async (e) => {
    e.preventDefault();
    if (!newHighlightTitle.trim()) return;

    setLoading(true);
    try {
      await highlightService.create({
        userId: currentUser.Id,
        title: newHighlightTitle.trim(),
        coverImage: "/api/highlights/default-cover.jpg",
        stories: []
      });
      
      toast.success("Highlight created successfully!");
      setNewHighlightTitle("");
      setShowCreateForm(false);
      loadHighlights();
    } catch (err) {
      console.error("Error creating highlight:", err);
      toast.error("Failed to create highlight");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHighlight = async (highlightId) => {
    if (!confirm("Are you sure you want to delete this highlight?")) return;

    setLoading(true);
    try {
      await highlightService.delete(highlightId);
      toast.success("Highlight deleted successfully!");
      loadHighlights();
    } catch (err) {
      console.error("Error deleting highlight:", err);
      toast.error("Failed to delete highlight");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStoryFromHighlight = async (highlightId, storyId) => {
    if (!confirm("Remove this story from highlight?")) return;

    setLoading(true);
    try {
      await highlightService.removeStoryFromHighlight(highlightId, storyId);
      toast.success("Story removed from highlight!");
      loadHighlights();
    } catch (err) {
      console.error("Error removing story:", err);
      toast.error("Failed to remove story");
    } finally {
      setLoading(false);
    }
  };

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
          className="glass-morphism rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Manage Highlights</h2>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowCreateForm(true)}
                variant="primary"
                size="sm"
              >
                <ApperIcon name="Plus" size={16} />
                New Highlight
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Create Form */}
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-morphism rounded-lg p-4 mb-6"
              >
                <form onSubmit={handleCreateHighlight} className="flex space-x-4">
                  <Input
                    value={newHighlightTitle}
                    onChange={(e) => setNewHighlightTitle(e.target.value)}
                    placeholder="Enter highlight title..."
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={!newHighlightTitle.trim() || loading}
                    loading={loading}
                    variant="primary"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewHighlightTitle("");
                    }}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Highlights Grid */}
            {loading && highlights.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : highlights.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Star" size={48} className="text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No highlights yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Create highlights to save your favorite stories permanently
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlights.map((highlight) => (
                  <motion.div
                    key={highlight.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {highlight.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setSelectedHighlight(
                            selectedHighlight?.Id === highlight.Id ? null : highlight
                          )}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white"
                        >
                          <ApperIcon name="Eye" size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDeleteHighlight(highlight.Id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                      <img
                        src={highlight.coverImage}
                        alt={highlight.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{highlight.stories.length} stories</span>
                      <span>{new Date(highlight.createdAt).toLocaleDateString()}</span>
                    </div>

                    {/* Stories Preview */}
                    {selectedHighlight?.Id === highlight.Id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 space-y-2"
                      >
                        {highlight.stories.map((story) => (
                          <div
                            key={story.Id}
                            className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg"
                          >
                            <div className="w-10 h-10 bg-gray-700 rounded-lg overflow-hidden">
                              {story.mediaUrl ? (
                                <img
                                  src={story.mediaUrl}
                                  alt="Story"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ApperIcon name="Type" size={16} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-white text-sm truncate">
                                {story.text || "Media story"}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {new Date(story.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleRemoveStoryFromHighlight(highlight.Id, story.Id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300"
                            >
                              <ApperIcon name="X" size={14} />
                            </Button>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HighlightManager;