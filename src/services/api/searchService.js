import { postService } from "./postService";
import { userService } from "./userService";
import { hashtagService } from "./hashtagService";

export const searchService = {
  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.trim();
    const results = [];

    try {
      // Search posts
      const posts = await postService.search(searchTerm);
      results.push(...posts.map(post => ({
        ...post,
        type: "post",
        id: `post-${post.Id}`
      })));

      // Search users
      const users = await userService.search(searchTerm);
      results.push(...users.map(user => ({
        ...user,
        type: "user",
        id: `user-${user.Id}`
      })));

      // Search hashtags
      const hashtags = await hashtagService.search(searchTerm.replace('#', ''));
      results.push(...hashtags.map(hashtag => ({
        ...hashtag,
        type: "hashtag",
        id: `hashtag-${hashtag.Id}`
      })));

      // Sort results by relevance (exact matches first, then by popularity)
      return results.sort((a, b) => {
        const aExactMatch = a.type === "user" 
          ? a.username.toLowerCase() === searchTerm.toLowerCase() || a.displayName.toLowerCase() === searchTerm.toLowerCase()
          : a.type === "hashtag" 
          ? a.tag.toLowerCase() === searchTerm.toLowerCase()
          : a.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        const bExactMatch = b.type === "user"
          ? b.username.toLowerCase() === searchTerm.toLowerCase() || b.displayName.toLowerCase() === searchTerm.toLowerCase()
          : b.type === "hashtag"
          ? b.tag.toLowerCase() === searchTerm.toLowerCase()
          : b.content.toLowerCase().includes(searchTerm.toLowerCase());

        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Sort by popularity/relevance
        if (a.type === "user" && b.type === "user") {
          return b.followersCount - a.followersCount;
        }
        if (a.type === "hashtag" && b.type === "hashtag") {
          return b.count - a.count;
        }
        if (a.type === "post" && b.type === "post") {
          return b.likes - a.likes;
        }

        return 0;
      });
    } catch (error) {
      console.error("Search service error:", error);
      return [];
    }
  }
};