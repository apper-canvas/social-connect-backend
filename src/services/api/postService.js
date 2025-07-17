import postsData from "@/services/mockData/posts.json";

let posts = [...postsData];

export const postService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

create: async (postData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      ...postData,
      likes: 0,
      comments: 0,
      type: postData.type || "post", // Support for story type
      createdAt: new Date().toISOString()
    };
    posts.unshift(newPost);
    return { ...newPost };
  },

  update: async (id, postData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    posts[index] = { ...posts[index], ...postData };
    return { ...posts[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = posts.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Post not found");
    }
    posts.splice(index, 1);
    return true;
  },

  getByUserId: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return posts
      .filter(post => post.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  toggleLike: async (postId, isLiked) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = posts.findIndex(p => p.Id === parseInt(postId));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts[index].likes += isLiked ? 1 : -1;
    posts[index].likes = Math.max(0, posts[index].likes);
    
    return { ...posts[index] };
  },

  incrementComment: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = posts.findIndex(p => p.Id === parseInt(postId));
    if (index === -1) {
      throw new Error("Post not found");
    }
    
    posts[index].comments++;
    return { ...posts[index] };
  },

search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return posts.filter(post => 
      post.content.toLowerCase().includes(searchTerm) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  },

  getByType: async (type) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return posts
      .filter(post => post.type === type)
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  repost: async (postId, userId, comment = "") => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const originalPost = posts.find(p => p.Id === parseInt(postId));
    if (!originalPost) {
      throw new Error("Post not found");
    }
    
    const repost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      userId: parseInt(userId),
      isRepost: true,
      repostComment: comment,
      originalPost: { ...originalPost },
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString()
    };
    
    posts.unshift(repost);
    return { ...repost };
  }
};