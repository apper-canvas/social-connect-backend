import highlightsData from "@/services/mockData/highlights.json";
import { storyService } from "./storyService";

let highlights = [...highlightsData];

export const highlightService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...highlights].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const highlight = highlights.find(h => h.Id === parseInt(id));
    if (!highlight) {
      throw new Error("Highlight not found");
    }
    return { ...highlight };
  },

  create: async (highlightData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newHighlight = {
      Id: Math.max(...highlights.map(h => h.Id), 0) + 1,
      ...highlightData,
      createdAt: new Date().toISOString()
    };
    highlights.unshift(newHighlight);
    return { ...newHighlight };
  },

  update: async (id, highlightData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = highlights.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Highlight not found");
    }
    highlights[index] = { ...highlights[index], ...highlightData };
    return { ...highlights[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = highlights.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Highlight not found");
    }
    highlights.splice(index, 1);
    return true;
  },

  getByUserId: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return highlights
      .filter(highlight => highlight.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  addStoryToHighlight: async (highlightId, storyId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const highlightIndex = highlights.findIndex(h => h.Id === parseInt(highlightId));
    if (highlightIndex === -1) {
      throw new Error("Highlight not found");
    }

    try {
      const story = await storyService.getById(storyId);
      
      if (!highlights[highlightIndex].stories.find(s => s.Id === parseInt(storyId))) {
        highlights[highlightIndex].stories.push(story);
        highlights[highlightIndex].updatedAt = new Date().toISOString();
      }
      
      return { ...highlights[highlightIndex] };
    } catch (error) {
      throw new Error("Story not found or expired");
    }
  },

  removeStoryFromHighlight: async (highlightId, storyId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const highlightIndex = highlights.findIndex(h => h.Id === parseInt(highlightId));
    if (highlightIndex === -1) {
      throw new Error("Highlight not found");
    }

    highlights[highlightIndex].stories = highlights[highlightIndex].stories.filter(
      story => story.Id !== parseInt(storyId)
    );
    highlights[highlightIndex].updatedAt = new Date().toISOString();
    
    return { ...highlights[highlightIndex] };
  },

  createFromStory: async (storyId, highlightData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      const story = await storyService.getById(storyId);
      
      const newHighlight = {
        Id: Math.max(...highlights.map(h => h.Id), 0) + 1,
        ...highlightData,
        stories: [story],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      highlights.unshift(newHighlight);
      return { ...newHighlight };
    } catch (error) {
      throw new Error("Story not found or expired");
    }
  }
};