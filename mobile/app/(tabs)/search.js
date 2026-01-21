import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Searchbar, Avatar, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { userService } from '../../services';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const users = await userService.searchUsers(query);
      setResults(users);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => router.push(`/user/${item._id}`)}
    >
      <Avatar.Image
        size={50}
        source={{ uri: item.profilePicture || 'https://via.placeholder.com/50' }}
      />
      <View style={styles.userInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.userName}>{item.fullName}</Text>
          {item.isVerified && <Text style={styles.verified}>✓</Text>}
        </View>
        <Text style={styles.userUsername}>@{item.username}</Text>
        {item.bio && <Text style={styles.userBio} numberOfLines={1}>{item.bio}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search users..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderUser}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            searchQuery.length >= 2 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verified: {
    color: '#007AFF',
    marginLeft: 4,
    fontSize: 16,
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userBio: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
