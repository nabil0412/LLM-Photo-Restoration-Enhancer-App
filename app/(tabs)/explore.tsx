import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function PhotoSelectionScreen() {
  const router = useRouter();

  const handleUploadFromGallery = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Open gallery picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;
      // Navigate to edit photo screen
      router.push({ pathname: '/edit-photo', params: { imageUri: selectedImage } });
    }
  };

  const handleUseCamera = async () => {
    // Request permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    // Open camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const capturedImage = result.assets[0].uri;
      // Navigate to edit photo screen
      router.push({ pathname: '/edit-photo', params: { imageUri: capturedImage } });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Photo</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose how to add your photo</Text>
        <Text style={styles.description}>
          Select a photo from your gallery or take a new one with your camera
        </Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Upload from Gallery Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleUploadFromGallery}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="image-multiple" size={48} color="#00A6ED" />
            </View>
            <Text style={styles.optionTitle}>Upload from Gallery</Text>
            <Text style={styles.optionDescription}>
              Choose from your existing photos
            </Text>
          </TouchableOpacity>

          {/* Use Camera Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleUseCamera}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="camera" size={48} color="#00A6ED" />
            </View>
            <Text style={styles.optionTitle}>Use Camera</Text>
            <Text style={styles.optionDescription}>
              Take a new photo right now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  buttonsContainer: {
    gap: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
