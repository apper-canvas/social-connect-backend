import followsData from "@/services/mockData/follows.json";

let follows = [...followsData];

export const followService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...follows];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const follow = follows.find(f => f.Id === parseInt(id));
    if (!follow) {
      throw new Error("Follow relationship not found");
    }
    return { ...follow };
  },

  follow: async (followerId, followingId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if already following
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
    return { ...newFollow };
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
    return true;
  },

  isFollowing: async (followerId, followingId) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const follow = follows.find(
      f => f.followerId === parseInt(followerId) && f.followingId === parseInt(followingId)
    );
    
    return !!follow;
  },

  getFollowers: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return follows
      .filter(follow => follow.followingId === parseInt(userId))
      .map(follow => follow.followerId);
  },

  getFollowing: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return follows
      .filter(follow => follow.followerId === parseInt(userId))
      .map(follow => follow.followingId);
  },

  getFollowCounts: async (userId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const followers = await this.getFollowers(userId);
    const following = await this.getFollowing(userId);
    
    return {
      followersCount: followers.length,
      followingCount: following.length
    };
  }
};