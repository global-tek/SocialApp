import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    const { username, email, password, fullName, confirmPassword } = formData;

    if (!username || !email || !password || !fullName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup({ username, email, password, fullName });
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error.response?.data?.message || 'Could not create account'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join our community today</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => updateField('fullName', text)}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Username"
            value={formData.username}
            onChangeText={(text) => updateField('username', text)}
            mode="outlined"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            mode="outlined"
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sign Up
          </Button>

          <Button
            mode="text"
            onPress={() => router.push('/login')}
            style={styles.linkButton}
          >
            Already have an account? Sign In
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 16,
  },
});
