import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import PostCard from "@/components/molecules/PostCard";
import UserCard from "@/components/molecules/UserCard";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import { searchService } from "@/services/api/searchService";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import { followService } from "@/services/api/followService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const SearchResultsPage = ({ currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    const hashtag = params.get("hashtag");
    
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else if (hashtag) {
      setSearchQuery(`#${hashtag}`);
      performSearch(hashtag);
    }
  }, [location.search]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const allUsers = await userService.getAll();
      setUsers(allUsers);
    } catch (err) {
      console.error("Error loading users:", err);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchService.search(query);
      setResults(searchResults);
    } catch (err) {
      setError("Failed to search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const searchResults = await searchService.search(query);
      return searchResults;
    } catch (error) {
      console.error("Search error:", error);
      return [];
    }
  };

  const handleSelectUser = (user) => {
    navigate(`/profile/${user.Id}`);
  };

  const handleSelectHashtag = (hashtag) => {
    navigate(`/search?hashtag=${hashtag.tag}`);
  };

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followService.follow(currentUser.Id, userId);
      toast.success("User followed successfully!");
      loadUsers();
    } catch (err) {
      toast.error("Failed to follow user");
      console.error("Follow error:", err);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await followService.unfollow(currentUser.Id, userId);
      toast.success("User unfollowed successfully!");
      loadUsers();
    } catch (err) {
      toast.error("Failed to unfollow user");
      console.error("Unfollow error:", err);
    }
  };

  const handleLike = async (postId, isLiked) => {
    try {
      await postService.toggleLike(postId, isLiked);
      // Refresh search results to show updated like count
      if (searchQuery) {
        performSearch(searchQuery);
      }
    } catch (err) {
      toast.error("Failed to update like");
      console.error("Like error:", err);
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      await postService.incrementComment(postId);
      toast.success("Comment added successfully!");
      // Refresh search results to show updated comment count
      if (searchQuery) {
        performSearch(searchQuery);
      }
    } catch (err) {
      toast.error("Failed to add comment");
      console.error("Comment error:", err);
    }
  };

  const filteredResults = results.filter(result => {
    if (activeFilter === "all") return true;
    return result.type === activeFilter;
  });

  const filterOptions = [
    { key: "all", label: "All", count: results.length },
    { key: "post", label: "Posts", count: results.filter(r => r.type === "post").length },
    { key: "user", label: "Users", count: results.filter(r => r.type === "user").length },
    { key: "hashtag", label: "Hashtags", count: results.filter(r => r.type === "hashtag").length }
  ];

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-6 lg:hidden">
          <SearchBar 
            onSearch={handleSearch}
            onSelectUser={handleSelectUser}
            onSelectHashtag={handleSelectHashtag}
            onSubmit={handleSearchSubmit}
            placeholder="Search posts, users, hashtags..."
            className="w-full"
          />
        </div>

        {/* Search Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : "Search"}
          </h1>
          {results.length > 0 && (
            <p className="text-gray-400">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {/* Filter Tabs */}
        {searchQuery && (
          <div className="mb-6">
            <div className="flex space-x-1 bg-surface rounded-lg p-1">
              {filterOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setActiveFilter(option.key)}
                  className={cn(
                    "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    activeFilter === option.key
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  )}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={() => performSearch(searchQuery)} />
        ) : !searchQuery ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Search SocialConnect</h2>
            <p className="text-gray-400">
              Find posts, users, and hashtags that interest you
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <Empty 
            title="No results found"
            description={`No results found for "${searchQuery}". Try different keywords or check your spelling.`}
            action={
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  navigate("/search");
                }}
                className="mt-4"
              >
                <ApperIcon name="RotateCcw" size={16} className="mr-2" />
                Clear Search
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {result.type === "post" ? (
                  <PostCard
                    post={result}
                    user={users.find(u => u.Id === result.userId)}
                    currentUser={currentUser}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ) : result.type === "user" ? (
                  <UserCard
                    user={result}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                    currentUser={currentUser}
                  />
                ) : result.type === "hashtag" ? (
                  <div className="glass-morphism rounded-xl p-4 hover:bg-gray-700 transition-colors duration-200">
                    <button
                      onClick={() => handleSelectHashtag(result)}
                      className="w-full flex items-center space-x-4"
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="Hash" size={24} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-white text-lg">#{result.tag}</h3>
                        <p className="text-gray-400">{result.count} posts</p>
                      </div>
                      <ApperIcon name="TrendingUp" size={20} className="text-gray-400" />
                    </button>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;