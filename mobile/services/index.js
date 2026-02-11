import api from './api';
import * as SecureStore from 'expo-secure-store';

export const authService = {
  async signup(userData) {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success) {
      await SecureStore.setItemAsync('token', response.data.data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      await SecureStore.setItemAsync('token', response.data.data.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  async logout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  async getStoredUser() {
    const userStr = await SecureStore.getItemAsync('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  async isAuthenticated() {
    const token = await SecureStore.getItemAsync('token');
    return !!token;
  },
};

export const userService = {
  async getUserProfile(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data.data.user;
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  async uploadProfilePicture(imageUri) {
    const formData = new FormData();
    
    // Extract file extension for proper handling
    const fileExtension = imageUri.split('.').pop().toLowerCase();
    let mimeType = 'image/jpeg';
    
    // Handle different image formats including HEIC from iPhone
    if (fileExtension === 'heic' || fileExtension === 'heif') {
      mimeType = 'image/heic';
    } else if (fileExtension === 'png') {
      mimeType = 'image/png';
    }
    
    formData.append('profilePicture', {
      uri: imageUri,
      type: mimeType,
      name: `profile.${fileExtension}`,
    });

    const response = await api.put('/users/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async followUser(userId) {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  },

  async unfollowUser(userId) {
    const response = await api.post(`/users/${userId}/unfollow`);
    return response.data;
  },

  async searchUsers(query) {
    const response = await api.get(`/users/search?q=${query}`);
    return response.data.data.users;
  },
};

export const postService = {
  async createPost(postData) {
    const formData = new FormData();
    
    if (postData.text) {
      formData.append('text', postData.text);
    }
    
    if (postData.media && postData.media.length > 0) {
      postData.media.forEach((media, index) => {
        // Handle iPhone HEIC/HEIF and other formats
        const fileExtension = media.uri.split('.').pop().toLowerCase();
        let mimeType = media.type || 'image/jpeg';
        
        // Map common extensions to MIME types
        if (fileExtension === 'heic' || fileExtension === 'heif') {
          mimeType = 'image/heic';
        } else if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          mimeType = 'image/jpeg';
        }
        
        formData.append('media', {
          uri: media.uri,
          type: mimeType,
          name: `media_${index}.${fileExtension}`,
        });
      });
    }
    
    if (postData.links) {
      formData.append('links', JSON.stringify(postData.links));
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data.data.post;
  },

  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  async unlikePost(postId) {
    const response = await api.post(`/posts/${postId}/unlike`);
    return response.data;
  },

  async commentPost(postId, text) {
    const response = await api.post(`/posts/${postId}/comment`, { text });
    return response.data;
  },

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  async getUserPosts(userId, page = 1) {
    const response = await api.get(`/posts/user/${userId}?page=${page}`);
    return response.data.data;
  },
};

export const feedService = {
  async getFeed(page = 1) {
    const response = await api.get(`/feed?page=${page}`);
    return response.data.data;
  },

  async getDiscoverFeed(page = 1) {
    const response = await api.get(`/feed/discover?page=${page}`);
    return response.data.data;
  },
};
