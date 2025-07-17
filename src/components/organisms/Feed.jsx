import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PostCard from "@/components/molecules/PostCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { feedService } from "@/services/api/feedService";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { toast } from "react-toastify";

const Feed = ({ 
  type = "home", 
  userId = null, 
  currentUser,
  onCreatePost,
  refreshTrigger 
}) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [type, userId, refreshTrigger]);

  const loadPosts = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      setError(null);
      
      let postsData;
      
      if (type === "profile" && userId) {
        postsData = await feedService.getUserPosts(userId);
      } else if (type === "explore") {
        postsData = await feedService.getExplorePosts();
      } else {
        postsData = await feedService.getHomeFeed();
      }

      // Load user data for posts
      const userIds = [...new Set(postsData.map(post => post.userId))];
      const usersData = {};
      
      for (const uid of userIds) {
        try {
          const user = await userService.getById(uid);
          usersData[uid] = user;
        } catch (err) {
          console.error(`Error loading user ${uid}:`, err);
          usersData[uid] = {
            Id: uid,
            username: "unknown",
            displayName: "Unknown User",
            avatar: null
          };
        }
      }

      if (pageNum === 1) {
        setPosts(postsData);
        setUsers(usersData);
      } else {
        setPosts(prev => [...prev, ...postsData]);
        setUsers(prev => ({ ...prev, ...usersData }));
      }

      setPage(pageNum);
      setHasMore(postsData.length === 10); // Assume page size of 10
    } catch (err) {
      console.error("Error loading posts:", err);
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await feedService.toggleLike(postId, isLiked);
      // Update local state
      setPosts(prev => prev.map(post => 
        post.Id === postId 
          ? { ...post, likes: isLiked ? post.likes + 1 : post.likes - 1 }
          : post
      ));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleComment = async (postId) => {
    // Navigate to post detail or show comments
    console.log("Comment on post:", postId);
  };

  const handleShare = async (postId) => {
    try {
      await navigator.share({
        title: "Check out this post",
        url: `${window.location.origin}/post/${postId}`
      });
    } catch (err) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
    }
};

  const handleEdit = async (postId, updatedData) => {
    try {
      const updatedPost = await postService.update(postId, updatedData);
      setPosts(prev => prev.map(post => 
        post.Id === postId ? updatedPost : post
      ));
      toast.success("Post updated successfully");
    } catch (err) {
      console.error("Error updating post:", err);
      toast.error("Failed to update post");
      throw err;
    }
  };

  const handleDelete = async (postId) => {
    try {
      await postService.delete(postId);
      setPosts(prev => prev.filter(post => post.Id !== postId));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Failed to delete post");
      throw err;
    }
  };

  const handleRetry = () => {
    loadPosts(1);
  };
  if (loading && posts.length === 0) {
    return <Loading type="posts" />;
  }

  if (error && posts.length === 0) {
    return <Error message={error} onRetry={handleRetry} type="posts" />;
  }

  if (posts.length === 0) {
    return (
      <Empty 
        type="posts" 
        onAction={onCreatePost}
        actionText="Create Your First Post"
      />
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
<PostCard
            post={post}
            user={users[post.userId]}
            currentUser={currentUser}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      ))}
      
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={() => loadPosts(page + 1)}
            className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105"
          >
            Load More Posts
          </button>
        </div>
      )}
    </div>
  );
};

export default Feed;