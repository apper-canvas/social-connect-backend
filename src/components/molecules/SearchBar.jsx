import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  onSelectUser, 
  onSelectHashtag,
  onSubmit,
  placeholder = "Search users and hashtags...",
  className 
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      // Simulate search delay
      const timer = setTimeout(() => {
        performSearch(query);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const performSearch = async (searchQuery) => {
    try {
      const searchResults = await onSearch?.(searchQuery);
      setResults(searchResults || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setIsOpen(false);
    }
  };

const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit?.(query.trim());
    }
  };

  const handleSelectUser = (user) => {
    setQuery("");
    setIsOpen(false);
    onSelectUser?.(user);
  };

  const handleSelectHashtag = (hashtag) => {
    setQuery("");
    setIsOpen(false);
    onSelectHashtag?.(hashtag);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-surface border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ApperIcon name="X" size={20} />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
)}
      </form>
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-morphism rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {result.type === "user" ? (
                    <button
                      onClick={() => handleSelectUser(result)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <Avatar 
                        src={result.avatar} 
                        alt={result.displayName || result.username}
                        fallback={result.displayName?.charAt(0) || result.username?.charAt(0)}
                        size="sm"
                      />
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">
                          {result.displayName || result.username}
                        </p>
                        <p className="text-sm text-gray-400">@{result.username}</p>
                      </div>
                      <ApperIcon name="User" size={16} className="text-gray-400" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectHashtag(result)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <ApperIcon name="Hash" size={16} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-white">#{result.tag}</p>
                        <p className="text-sm text-gray-400">{result.count} posts</p>
                      </div>
                      <ApperIcon name="TrendingUp" size={16} className="text-gray-400" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;