import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const PostCard = ({ 
  post, 
  user, 
  onLike, 
  onComment, 
  onShare, 
  isLiked = false,
  className 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-morphism rounded-xl p-4 hover:shadow-lg transition-all duration-200",
        className
      )}
    >
      {/* Post Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar 
          src={user?.avatar} 
          alt={user?.displayName || user?.username}
          fallback={user?.displayName?.charAt(0) || user?.username?.charAt(0)}
          size="md"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {user?.displayName || user?.username}
          </h3>
          <p className="text-sm text-gray-400">
            @{user?.username} · {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
        <Button variant="ghost" size="sm">
          <ApperIcon name="MoreHorizontal" size={16} />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-white leading-relaxed mb-3">
          {formatHashtags(post.content)}
        </p>
        
        {post.mediaUrl && (
          <div className="rounded-lg overflow-hidden bg-gray-800">
            {post.mediaType === "image" ? (
              <img 
                src={post.mediaUrl} 
                alt="Post media" 
                className="w-full h-auto max-h-96 object-cover"
              />
            ) : (
              <video 
                src={post.mediaUrl} 
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
            onClick={handleShare}
            className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="Share" size={20} />
            <span className="text-sm font-medium">Share</span>
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
    </motion.div>
  );
};

export default PostCard;