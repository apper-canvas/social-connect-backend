import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  type = "general" 
}) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again.",
        };
      case "notFound":
        return {
          icon: "Search",
          title: "Nothing Found",
          description: "We couldn't find what you're looking for.",
        };
      case "posts":
        return {
          icon: "FileText",
          title: "Failed to Load Posts",
          description: "We had trouble loading the latest posts.",
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Oops!",
          description: message,
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="glass-morphism rounded-2xl p-8 text-center max-w-md w-full"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
            <ApperIcon name={icon} size={32} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Error;