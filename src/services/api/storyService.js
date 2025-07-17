import storiesData from "@/services/mockData/stories.json";
import { userService } from "./userService";

let stories = [...storiesData];

export const storyService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Filter out expired stories
    const currentTime = new Date().getTime();
    const activeStories = stories.filter(story => {
      const expiresAt = new Date(story.expiresAt).getTime();
      return expiresAt > currentTime;
    });
    
    // Update stories array to remove expired ones
    stories = activeStories;
    
    // Enrich with user data
    const enrichedStories = await Promise.all(
      activeStories.map(async (story) => {
        try {
          const user = await userService.getById(story.userId);
          return { ...story, user };
        } catch (error) {
          return story;
        }
      })
    );
    
    return enrichedStories.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const story = stories.find(s => s.Id === parseInt(id));
    if (!story) {
      throw new Error("Story not found");
    }
    
    // Check if story is expired
    const currentTime = new Date().getTime();
    const expiresAt = new Date(story.expiresAt).getTime();
    if (expiresAt <= currentTime) {
      throw new Error("Story has expired");
    }
    
    return { ...story };
  },

  create: async (storyData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newStory = {
      Id: Math.max(...stories.map(s => s.Id), 0) + 1,
      ...storyData,
      views: 0,
      createdAt: new Date().toISOString(),
      expiresAt: storyData.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    stories.unshift(newStory);
    return { ...newStory };
  },

  update: async (id, storyData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = stories.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }
    stories[index] = { ...stories[index], ...storyData };
    return { ...stories[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = stories.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }
    stories.splice(index, 1);
    return true;
  },

  getByUserId: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentTime = new Date().getTime();
    
    return stories
      .filter(story => {
        const expiresAt = new Date(story.expiresAt).getTime();
        return story.userId === parseInt(userId) && expiresAt > currentTime;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  incrementView: async (storyId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = stories.findIndex(s => s.Id === parseInt(storyId));
    if (index === -1) {
      throw new Error("Story not found");
    }
    
    stories[index].views++;
    return { ...stories[index] };
  },

  getTimeRemaining: (expiresAt) => {
    const currentTime = new Date().getTime();
    const expireTime = new Date(expiresAt).getTime();
    const timeLeft = expireTime - currentTime;
    
    if (timeLeft <= 0) {
      return "Expired";
    }
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  cleanupExpiredStories: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const currentTime = new Date().getTime();
    const initialCount = stories.length;
    
    stories = stories.filter(story => {
      const expiresAt = new Date(story.expiresAt).getTime();
      return expiresAt > currentTime;
    });
    
    const removedCount = initialCount - stories.length;
    return { removedCount, remainingCount: stories.length };
  }
};