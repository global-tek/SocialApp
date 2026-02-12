import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-paper';

export const AVATAR_COLORS = [
  { id: 'blue', primary: '#007AFF', secondary: '#E3F2FF' },
  { id: 'purple', primary: '#5856D6', secondary: '#F0EFFF' },
  { id: 'green', primary: '#34C759', secondary: '#E5F8EA' },
  { id: 'orange', primary: '#FF9500', secondary: '#FFF3E0' },
  { id: 'pink', primary: '#FF2D55', secondary: '#FFE5EC' },
];

const getInitials = (name) => {
  if (!name) return '?';
  const names = name.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export default function UserAvatar({ user, size = 40, style }) {
  // If user has uploaded profile picture, show it
  if (user?.profilePicture) {
    return (
      <Avatar.Image
        size={size}
        source={{ uri: user.profilePicture }}
        style={style}
      />
    );
  }

  // Get user's selected color or default to first color
  const colorId = user?.avatarColor || 'blue';
  const color = AVATAR_COLORS.find(c => c.id === colorId) || AVATAR_COLORS[0];
  const initials = getInitials(user?.fullName || user?.username);

  return (
    <View
      style={[
        styles.defaultAvatar,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: color.primary 
        },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
