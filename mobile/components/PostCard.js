import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Avatar, IconButton, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { postService } from '../services';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function PostCard({ post, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleLike = async () => {
    try {
      if (liked) {
        await postService.unlikePost(post._id);
        setLikesCount((prev) => prev - 1);
      } else {
        await postService.likePost(post._id);
        setLikesCount((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await postService.deletePost(post._id);
              if (onDelete) {
                onDelete(post._id);
              }
              Alert.alert('Success', 'Post deleted successfully');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Failed to delete post. Please try again.');
            }
          },
        },
      ]
    );
  };

  const isOwnPost = user && post.author._id === user._id;

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = now - postDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorInfo}
          onPress={() => router.push(`/user/${post.author._id}`)}
        >
          <Avatar.Image
            size={40}
            source={{
              uri: post.author.profilePicture || 'https://via.placeholder.com/40',
            }}
          />
          <View style={styles.authorText}>
            <View style={styles.nameRow}>
              <Text style={styles.authorName}>{post.author.fullName}</Text>
              {post.author.isVerified && (
                <Text style={styles.verified}>✓</Text>
              )}
            </View>
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          </View>
        </TouchableOpacity>
        
        {isOwnPost && (
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={24}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handleDelete();
              }}
              title="Delete Post"
              leadingIcon="delete"
            />
          </Menu>
        )}
      </View>

      {post.content.text && (
        <Text style={styles.text}>{post.content.text}</Text>
      )}

      {post.content.media && post.content.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.content.media.map((media, index) => (
            <Image
              key={index}
              source={{ uri: media.url }}
              style={styles.media}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {post.content.links && post.content.links.length > 0 && (
        <View style={styles.linksContainer}>
          {post.content.links.map((link, index) => (
            <View key={index} style={styles.linkCard}>
              {link.thumbnail && (
                <Image
                  source={{ uri: link.thumbnail }}
                  style={styles.linkThumbnail}
                />
              )}
              <Text style={styles.linkTitle} numberOfLines={2}>
                {link.title || link.url}
              </Text>
              {link.description && (
                <Text style={styles.linkDescription} numberOfLines={2}>
                  {link.description}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.action} onPress={handleLike}>
          <IconButton
            icon={liked ? 'heart' : 'heart-outline'}
            size={24}
            iconColor={liked ? '#FF3B30' : '#666'}
          />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <IconButton icon="comment-outline" size={24} iconColor="#666" />
          <Text style={styles.actionText}>
            {post.comments?.length || 0}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <IconButton icon="share-outline" size={24} iconColor="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorText: {
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verified: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
  },
  media: {
    width: width,
    height: width * 0.75,
    backgroundColor: '#f5f5f5',
  },
  linksContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  linkCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  linkThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: -8,
  },
});
