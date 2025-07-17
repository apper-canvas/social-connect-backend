import { postService } from "./postService";

export const feedService = {
  getHomeFeed: async (userId = null, page = 1, limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get all posts and sort by creation date (newest first)
    const allPosts = await postService.getAll();
    
    // For demo purposes, return recent posts
    // In real implementation, this would consider following relationships
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return allPosts.slice(startIndex, endIndex);
  },

  getExplorePosts: async (page = 1, limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get all posts and sort by popularity (likes + comments)
    const allPosts = await postService.getAll();
    const popularPosts = allPosts.sort((a, b) => {
      const aScore = a.likes + a.comments;
      const bScore = b.likes + b.comments;
      return bScore - aScore;
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return popularPosts.slice(startIndex, endIndex);
  },

  getUserPosts: async (userId, page = 1, limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userPosts = await postService.getByUserId(userId);
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return userPosts.slice(startIndex, endIndex);
  },

  toggleLike: async (postId, isLiked) => {
    return await postService.toggleLike(postId, isLiked);
  },

  addComment: async (postId, userId, text) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Increment comment count on post
    await postService.incrementComment(postId);
    
    // In real implementation, this would create a comment record
    return {
      Id: Date.now(),
      postId: parseInt(postId),
      userId: parseInt(userId),
      text,
      createdAt: new Date().toISOString()
    };
  },

  searchPosts: async (query) => {
    return await postService.search(query);
  }
};