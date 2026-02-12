import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { TextInput, Button, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services';
import UserAvatar, { AVATAR_COLORS } from '../components/UserAvatar';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || 'blue');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setUsername(user.username || '');
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture || '');
      setAvatarColor(user.avatarColor || 'blue');
    }
  }, [user]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleUploadProfilePicture(result.assets[0].uri);
    }
  };

  const handleUploadProfilePicture = async (imageUri) => {
    setUploadingImage(true);
    try {
      const response = await userService.uploadProfilePicture(imageUri);
      setProfilePicture(response.data.profilePicture);
      
      // Update user in context
      const updatedUser = { ...user, profilePicture: response.data.profilePicture };
      updateUser(updatedUser);
      
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.updateProfile({
        fullName: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
        avatarColor: avatarColor,
      });

      // Update user in context
      const updatedUser = { ...user, ...response.data.user, avatarColor };
      updateUser(updatedUser);

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile'
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, loading && styles.disabledButton]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.avatarSection}>
          <UserAvatar 
            user={{ 
              fullName, 
              profilePicture, 
              avatarColor 
            }} 
            size={100} 
          />
          <Button
            mode="text"
            onPress={pickImage}
            loading={uploadingImage}
            disabled={uploadingImage}
            style={styles.changePhotoButton}
          >
            {uploadingImage ? 'Uploading...' : 'Upload Photo'}
          </Button>
          
          {profilePicture && (
            <Button
              mode="text"
              onPress={() => {
                setProfilePicture('');
                Alert.alert('Info', 'Photo removed. Save to confirm changes.');
              }}
              style={styles.removePhotoButton}
              textColor="#FF3B30"
            >
              Remove Photo
            </Button>
          )}
        </View>

        <View style={styles.colorSection}>
          <Text style={styles.sectionTitle}>Default Avatar Color</Text>
          <Text style={styles.sectionDescription}>
            Choose a color for your default avatar (shown when no photo is uploaded)
          </Text>
          <View style={styles.colorOptions}>
            {AVATAR_COLORS.map((color) => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: color.primary },
                  avatarColor === color.id && styles.selectedColor,
                ]}
                onPress={() => setAvatarColor(color.id)}
              >
                {avatarColor === color.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
            maxLength={50}
          />

          <TextInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
            maxLength={30}
          />

          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            maxLength={160}
          />

          <Text style={styles.characterCount}>
            {bio.length}/160
          </Text>
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
    color: '#666',
  },
  saveButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  changePhotoButton: {
    marginTop: 16,
  },
  removePhotoButton: {
    marginTop: 8,
  },
  colorSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#333',
  },
  checkmark: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: -12,
    marginBottom: 16,
  },
});
