import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextInput, Button, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { postService } from '../../services';

export default function CreatePostScreen() {
  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMedia([...media, ...result.assets]);
    }
  };

  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!text && media.length === 0) {
      Alert.alert('Error', 'Please add some content to your post');
      return;
    }

    setLoading(true);
    try {
      await postService.createPost({
        text,
        media: media.map((m) => ({
          uri: m.uri,
          type: m.type || m.mimeType || 'image/jpeg',
          fileName: m.fileName || `image_${Date.now()}.jpg`,
        })),
      });
      
      Alert.alert('Success', 'Post created successfully');
      setText('');
      setMedia([]);
      router.back();
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Could not create post'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <Button
          mode="contained"
          onPress={handleCreatePost}
          loading={loading}
          disabled={loading || (!text && media.length === 0)}
          compact
        >
          Post
        </Button>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          placeholder="What's on your mind?"
          value={text}
          onChangeText={setText}
          multiline
          numberOfLines={6}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.mediaSection}>
          <Button
            mode="outlined"
            icon="image"
            onPress={pickImage}
            style={styles.mediaButton}
          >
            Add Photo/Video
          </Button>

          {media.length > 0 && (
            <ScrollView horizontal style={styles.mediaPreview}>
              {media.map((item, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri: item.uri }} style={styles.mediaImage} />
                  <IconButton
                    icon="close-circle"
                    size={24}
                    onPress={() => removeMedia(index)}
                    style={styles.removeButton}
                  />
                </View>
              ))}
            </ScrollView>
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
    minHeight: 150,
  },
  mediaSection: {
    marginTop: 16,
  },
  mediaButton: {
    marginBottom: 16,
  },
  mediaPreview: {
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: 12,
    position: 'relative',
  },
  mediaImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
});
