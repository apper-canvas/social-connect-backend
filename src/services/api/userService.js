import usersData from "@/services/mockData/users.json";
import followsData from "@/services/mockData/follows.json";

let users = [...usersData];
let follows = [...followsData];

export const userService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...users];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const user = users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  create: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newUser = {
      Id: Math.max(...users.map(u => u.Id)) + 1,
      ...userData,
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      verified: false,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return { ...newUser };
  },

  update: async (id, userData) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    users.splice(index, 1);
    return true;
  },

  search: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const searchTerm = query.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(searchTerm) ||
      user.displayName.toLowerCase().includes(searchTerm)
    );
  },

  getSuggestedUsers: async (currentUserId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const currentUserFollows = follows
      .filter(f => f.followerId === parseInt(currentUserId))
      .map(f => f.followingId);
    
    return users
      .filter(user => user.Id !== parseInt(currentUserId) && !currentUserFollows.includes(user.Id))
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 8);
  },

  follow: async (followerId, followingId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const existingFollow = follows.find(
      f => f.followerId === parseInt(followerId) && f.followingId === parseInt(followingId)
    );
    
    if (existingFollow) {
      throw new Error("Already following this user");
    }
    
    const newFollow = {
      Id: Math.max(...follows.map(f => f.Id)) + 1,
      followerId: parseInt(followerId),
      followingId: parseInt(followingId),
      createdAt: new Date().toISOString()
    };
    
    follows.push(newFollow);
    
    // Update user counts
    const followerIndex = users.findIndex(u => u.Id === parseInt(followerId));
    const followingIndex = users.findIndex(u => u.Id === parseInt(followingId));
    
    if (followerIndex !== -1) {
      users[followerIndex].followingCount++;
    }
    if (followingIndex !== -1) {
      users[followingIndex].followersCount++;
    }
    
    return newFollow;
  },

  unfollow: async (followerId, followingId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const followIndex = follows.findIndex(
      f => f.followerId === parseInt(followerId) && f.followingId === parseInt(followingId)
    );
    
    if (followIndex === -1) {
      throw new Error("Not following this user");
    }
    
    follows.splice(followIndex, 1);
    
    // Update user counts
    const followerIndex = users.findIndex(u => u.Id === parseInt(followerId));
    const followingIndex = users.findIndex(u => u.Id === parseInt(followingId));
    
    if (followerIndex !== -1) {
      users[followerIndex].followingCount--;
    }
    if (followingIndex !== -1) {
      users[followingIndex].followersCount--;
    }
    
    return true;
  }
};