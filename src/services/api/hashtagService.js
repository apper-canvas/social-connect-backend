import hashtagsData from "@/services/mockData/hashtags.json";

let hashtags = [...hashtagsData];

export const hashtagService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...hashtags];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const hashtag = hashtags.find(h => h.Id === parseInt(id));
    if (!hashtag) {
      throw new Error("Hashtag not found");
    }
    return { ...hashtag };
  },

  getTrending: async (limit = 10) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return hashtags
      .filter(hashtag => hashtag.trending)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  },

  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return hashtags.filter(hashtag => 
      hashtag.tag.toLowerCase().includes(searchTerm)
    );
  },

  create: async (hashtagData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newHashtag = {
      Id: Math.max(...hashtags.map(h => h.Id)) + 1,
      ...hashtagData,
      count: 1,
      trending: false,
      createdAt: new Date().toISOString()
    };
    hashtags.push(newHashtag);
    return { ...newHashtag };
  },

  incrementCount: async (tag) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = hashtags.findIndex(h => h.tag.toLowerCase() === tag.toLowerCase());
    
    if (index !== -1) {
      hashtags[index].count++;
      return { ...hashtags[index] };
    } else {
      // Create new hashtag if it doesn't exist
      return await this.create({ tag });
    }
  },

  getByTag: async (tag) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const hashtag = hashtags.find(h => h.tag.toLowerCase() === tag.toLowerCase());
    if (!hashtag) {
      throw new Error("Hashtag not found");
    }
    return { ...hashtag };
  },

  update: async (id, hashtagData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = hashtags.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Hashtag not found");
    }
    hashtags[index] = { ...hashtags[index], ...hashtagData };
    return { ...hashtags[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = hashtags.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Hashtag not found");
    }
    hashtags.splice(index, 1);
    return true;
  }
};