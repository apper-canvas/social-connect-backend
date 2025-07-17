import commentsData from "@/services/mockData/comments.json";

let comments = [...commentsData];

export const commentService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...comments];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  },

  getByPostId: async (postId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return comments
      .filter(comment => comment.postId === parseInt(postId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  create: async (commentData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      ...commentData,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    return { ...newComment };
  },

  update: async (id, commentData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    comments[index] = { ...comments[index], ...commentData };
    return { ...comments[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    comments.splice(index, 1);
    return true;
  },

  getByUserId: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return comments
      .filter(comment => comment.userId === parseInt(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};