import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const PostCard = ({ 
  post, 
  user, 
  currentUser,
  onLike, 
  onComment, 
  onShare,
  onEdit,
  onDelete,
  onRepost,
  isLiked = false,
  className 
}) => {
const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [repostComment, setRepostComment] = useState("");
  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    onLike && onLike(post.Id, newLiked);
  };

  const handleComment = () => {
    setShowComments(!showComments);
    onComment && onComment(post.Id);
  };

const handleShare = () => {
    onShare && onShare(post.Id);
  };

  const handleRepost = () => {
    setShowRepostModal(true);
  };

  const handleRepostSubmit = async () => {
    if (!onRepost) return;
    
    try {
      await onRepost(post.Id, repostComment.trim());
      setShowRepostModal(false);
      setRepostComment("");
    } catch (error) {
      console.error("Error reposting:", error);
    }
  };

  const formatHashtags = (text) => {
    return text.split(" ").map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span key={index} className="text-primary font-medium">
            {word}{" "}
          </span>
        );
      }
      return word + " ";
});
  };

  const handleEditSubmit = async () => {
    if (!editContent.trim()) return;
    
    setIsEditing(true);
    try {
      await onEdit(post.Id, { content: editContent.trim() });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error editing post:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(post.Id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const isOwner = currentUser && post.userId === currentUser.Id;

return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-morphism rounded-xl p-4 hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      {/* Repost Attribution */}
      {post.isRepost && (
        <div className="mb-3 pb-3 border-b border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <ApperIcon name="Repeat" size={16} />
            <span>
              <span className="text-white font-medium">{user?.displayName || user?.username}</span> reposted
            </span>
          </div>
          {post.repostComment && (
            <p className="text-white mt-2 text-sm">{post.repostComment}</p>
          )}
        </div>
      )}
{/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar 
          src={post.isRepost ? post.originalPost?.user?.avatar : user?.avatar} 
          alt={post.isRepost ? (post.originalPost?.user?.displayName || post.originalPost?.user?.username) : (user?.displayName || user?.username)}
          fallback={post.isRepost ? (post.originalPost?.user?.displayName?.charAt(0) || post.originalPost?.user?.username?.charAt(0)) : (user?.displayName?.charAt(0) || user?.username?.charAt(0))}
          size="md"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {post.isRepost ? (post.originalPost?.user?.displayName || post.originalPost?.user?.username) : (user?.displayName || user?.username)}
          </h3>
          <p className="text-sm text-gray-400">
            @{post.isRepost ? post.originalPost?.user?.username : user?.username} · {formatDistanceToNow(new Date(post.isRepost ? post.originalPost?.createdAt : post.createdAt), { addSuffix: true })}
          </p>
        </div>
        {isOwner && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
            >
              <ApperIcon name="MoreHorizontal" size={16} />
            </Button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 glass-morphism rounded-lg shadow-lg z-10"
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <ApperIcon name="Edit" size={16} />
                      <span>Edit Post</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <ApperIcon name="Trash2" size={16} />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

{/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed mb-3">
          {formatHashtags(post.isRepost ? post.originalPost?.content : post.content)}
        </p>
        
        {(post.isRepost ? post.originalPost?.mediaUrl : post.mediaUrl) && (
          <div className="rounded-lg overflow-hidden bg-gray-800">
            {(post.isRepost ? post.originalPost?.mediaType : post.mediaType) === "image" ? (
              <img 
                src={post.isRepost ? post.originalPost?.mediaUrl : post.mediaUrl} 
                alt="Post media" 
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : (
              <video 
                src={post.isRepost ? post.originalPost?.mediaUrl : post.mediaUrl} 
                className="w-full h-auto max-h-96 object-cover"
                controls
              />
            )}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-3">
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={cn(
              "flex items-center space-x-2 transition-colors duration-200",
              liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
            )}
          >
            <motion.div
              animate={liked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ApperIcon 
                name={liked ? "Heart" : "Heart"} 
                size={20} 
                className={liked ? "fill-current" : ""}
              />
            </motion.div>
            <span className="text-sm font-medium">{likeCount}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComment}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="MessageCircle" size={20} />
            <span className="text-sm font-medium">{post.comments || 0}</span>
          </motion.button>

<motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRepost}
            className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors duration-200"
          >
            <ApperIcon name="Repeat" size={20} />
            <span className="text-sm font-medium">Repost</span>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-gray-400 hover:text-accent transition-colors duration-200"
        >
          <ApperIcon name="Bookmark" size={20} />
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-700"
          >
            <div className="space-y-3">
              {/* Comment Input */}
              <div className="flex space-x-3">
                <Avatar size="sm" />
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full px-3 py-2 bg-surface border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              {/* Sample Comments */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Avatar size="sm" fallback="J" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">johndoe</span>
                      <span className="text-xs text-gray-400">2h</span>
                    </div>
                    <p className="text-sm text-gray-300">Great post! Thanks for sharing.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
)}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-morphism rounded-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Edit Post</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditModal(false)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="min-h-[120px]"
                    maxLength={280}
                  />
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleEditSubmit}
                      disabled={!editContent.trim() || isEditing}
                      loading={isEditing}
                      className="bg-gradient-to-r from-primary to-secondary"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-morphism rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="AlertTriangle" size={20} className="text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Delete Post</h3>
                    <p className="text-sm text-gray-400">This action cannot be undone</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this post? This will permanently remove it from your profile and timeline.
                </p>
                
                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Post
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
)}
      </AnimatePresence>

      {/* Repost Modal */}
      <AnimatePresence>
        {showRepostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRepostModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-morphism rounded-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Repost</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRepostModal(false)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <Textarea
                    value={repostComment}
                    onChange={(e) => setRepostComment(e.target.value)}
                    placeholder="Add a comment (optional)"
                    className="min-h-[80px]"
                    maxLength={280}
                  />
                  
                  {/* Original Post Preview */}
                  <div className="border border-gray-600 rounded-lg p-3 bg-gray-800/50">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar 
                        src={user?.avatar} 
                        alt={user?.displayName || user?.username}
                        fallback={user?.displayName?.charAt(0) || user?.username?.charAt(0)}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {user?.displayName || user?.username}
                        </p>
                        <p className="text-xs text-gray-400">
                          @{user?.username}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-3">
                      {post.content}
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRepostModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRepostSubmit}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <ApperIcon name="Repeat" size={16} className="mr-2" />
                      Repost
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostCard;