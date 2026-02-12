import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services';
import PostCard from '../../components/PostCard';
import UserAvatar from '../../components/UserAvatar';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?._id) {
      loadUserPosts();
    }
  }, [user]);

  const loadUserPosts = async () => {
    if (!user?._id) {
      console.log('No user ID available');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading posts for user:', user._id);
      const data = await postService.getUserPosts(user._id);
      console.log('Posts loaded:', data.posts?.length || 0);
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading user posts:', error);
      console.error('Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadUserPosts();
  };

  const handleDeletePost = (postId) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </View>

        {user?.coverPhoto && (
          <Image source={{ uri: user.coverPhoto }} style={styles.coverPhoto} />
        )}

        <View style={styles.profileSection}>
          <UserAvatar
            user={user}
            size={100}
            style={styles.avatar}
          />

          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.fullName}>{user?.fullName}</Text>
              {user?.isVerified && <Text style={styles.verified}>✓</Text>}
            </View>
            <Text style={styles.username}>@{user?.username}</Text>
          </View>

          {user?.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user?.followers?.length || 0}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{posts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user?.following?.length || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <Button
            mode="outlined"
            onPress={() => router.push('/edit-profile')}
            style={styles.editButton}
          >
            Edit Profile
          </Button>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Posts</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : posts.length === 0 ? (
            <Text style={styles.emptyText}>No posts yet</Text>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} onDelete={handleDeletePost} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    fontSize: 16,
    color: '#FF3B30',
  },
  coverPhoto: {
    width: '100%',
    height: 150,
    backgroundColor: '#eee',
  },
  profileSection: {
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    marginTop: -50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  nameSection: {
    alignItems: 'center',
    marginTop: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  verified: {
    color: '#007AFF',
    marginLeft: 6,
    fontSize: 20,
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    marginTop: 20,
    width: '100%',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
});
