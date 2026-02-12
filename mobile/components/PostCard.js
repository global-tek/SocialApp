import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Avatar, IconButton, Menu, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { postService } from '../services';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

const { width } = Dimensions.get('window');

export default function PostCard({ post, onDelete }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [submittingComment, setSubmittingComment] = useState(false);
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

  const handleComment = async () => {
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await postService.commentPost(post._id, commentText);
      // Add the new comment to the list
      const newComment = {
        _id: Date.now().toString(),
        user: {
          _id: user._id,
          username: user.username,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
        },
        text: commentText,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setCommentText('');
      Alert.alert('Success', 'Comment added');
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    try {
      // Generate shareable content
      const postUrl = `https://socialapp.com/post/${post._id}`; // Replace with your actual domain
      const shareMessage = post.content.text 
        ? `${post.content.text}\n\nShared from SocialApp by ${post.author.fullName}`
        : `Check out this post by ${post.author.fullName} on SocialApp`;

      // Try native share first
      const result = await Share.share(
        {
          message: Platform.OS === 'ios' ? shareMessage : `${shareMessage}\n\n${postUrl}`,
          url: Platform.OS === 'ios' ? postUrl : undefined,
          title: 'Share Post',
        },
        {
          // iOS only
          subject: 'Check out this post on SocialApp',
          dialogTitle: 'Share this post',
        }
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type (iOS)
          console.log('Shared via:', result.activityType);
        } else {
          // Shared successfully (Android)
          console.log('Post shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Share dialog was dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: Copy link to clipboard
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      const postUrl = `https://socialapp.com/post/${post._id}`;
      await Clipboard.setStringAsync(postUrl);
      Alert.alert('Link Copied', 'Post link has been copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
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
          <UserAvatar user={post.author} size={40} />
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

        <TouchableOpacity style={styles.action} onPress={() => setCommentModalVisible(true)}>
          <IconButton icon="comment-outline" size={24} iconColor="#666" />
          <Text style={styles.actionText}>
            {comments.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action} onPress={handleShare}>
          <IconButton icon="share-outline" size={24} iconColor="#666" />
        </TouchableOpacity>
      </View>

      {/* Comments Modal */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setCommentModalVisible(false)}>
              <Text style={styles.modalCloseButton}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Comments</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          <ScrollView style={styles.commentsList}>
            {comments.length === 0 ? (
              <Text style={styles.noComments}>No comments yet. Be the first to comment!</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment._id} style={styles.commentItem}>
                  <UserAvatar user={comment.user} size={32} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{comment.user?.fullName || 'Unknown'}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write a comment..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <Button
              mode="contained"
              onPress={handleComment}
              disabled={!commentText.trim() || submittingComment}
              loading={submittingComment}
              compact
            >
              Post
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalCloseButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalPlaceholder: {
    width: 50,
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  noComments: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 14,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 8,
    alignItems: 'flex-end',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
  },
});
