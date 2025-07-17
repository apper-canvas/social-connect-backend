import { motion } from "framer-motion";

const Loading = ({ type = "posts" }) => {
  const PostSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-morphism rounded-xl p-4 mb-4"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="skeleton w-10 h-10 rounded-full"></div>
        <div className="flex-1">
          <div className="skeleton h-4 w-24 rounded mb-2"></div>
          <div className="skeleton h-3 w-16 rounded"></div>
        </div>
      </div>
      <div className="skeleton h-4 w-full rounded mb-2"></div>
      <div className="skeleton h-4 w-3/4 rounded mb-4"></div>
      <div className="skeleton h-48 w-full rounded-lg mb-4"></div>
      <div className="flex items-center space-x-6">
        <div className="skeleton h-4 w-12 rounded"></div>
        <div className="skeleton h-4 w-16 rounded"></div>
        <div className="skeleton h-4 w-12 rounded"></div>
      </div>
    </motion.div>
  );

  const CommentSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex space-x-3 mb-4"
    >
      <div className="skeleton w-8 h-8 rounded-full"></div>
      <div className="flex-1">
        <div className="skeleton h-3 w-20 rounded mb-2"></div>
        <div className="skeleton h-4 w-full rounded mb-1"></div>
        <div className="skeleton h-4 w-2/3 rounded"></div>
      </div>
    </motion.div>
  );

  const UserSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-3 p-3"
    >
      <div className="skeleton w-12 h-12 rounded-full"></div>
      <div className="flex-1">
        <div className="skeleton h-4 w-24 rounded mb-2"></div>
        <div className="skeleton h-3 w-16 rounded"></div>
      </div>
      <div className="skeleton h-8 w-16 rounded-full"></div>
    </motion.div>
  );

  if (type === "posts") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (type === "comments") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (type === "users") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <UserSkeleton key={index} />
        ))}
      </div>
    );
  }

  return <PostSkeleton />;
};

export default Loading;