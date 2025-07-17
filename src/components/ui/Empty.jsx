import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  type = "posts", 
  onAction, 
  actionText = "Get Started" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "posts":
        return {
          icon: "FileText",
          title: "No Posts Yet",
          description: "Be the first to share something amazing with the community!",
          actionText: "Create Your First Post",
        };
      case "comments":
        return {
          icon: "MessageCircle",
          title: "No Comments Yet",
          description: "Start the conversation! Be the first to share your thoughts.",
          actionText: "Add Comment",
        };
      case "followers":
        return {
          icon: "Users",
          title: "No Followers Yet",
          description: "Share great content and connect with others to build your community.",
          actionText: "Explore Users",
        };
      case "following":
        return {
          icon: "UserPlus",
          title: "Not Following Anyone",
          description: "Discover interesting people and build your network.",
          actionText: "Find People",
        };
      case "search":
        return {
          icon: "Search",
          title: "No Results Found",
          description: "Try different keywords or explore trending content.",
          actionText: "Explore Trending",
        };
      case "notifications":
        return {
          icon: "Bell",
          title: "No Notifications",
          description: "You're all caught up! Check back later for updates.",
          actionText: null,
        };
      default:
        return {
          icon: "Inbox",
          title: "Nothing Here",
          description: "There's nothing to show right now.",
          actionText: "Explore",
        };
    }
  };

  const { icon, title, description, actionText: defaultActionText } = getEmptyContent();
  const buttonText = actionText || defaultActionText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-center max-w-md w-full"
      >
        <div className="relative mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
            <ApperIcon name={icon} size={40} className="text-white" />
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-8 leading-relaxed">{description}</p>
        
        {buttonText && onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {buttonText}
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Empty;