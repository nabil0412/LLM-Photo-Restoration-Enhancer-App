import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width - 40;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 1.3;

export default function RestoreProcessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;
  const repairScratches = params.repairScratches === 'true';
  const colorizePhoto = params.colorizePhoto === 'true';
  const improveClarity = params.improveClarity === 'true';
  const adToken = params.adToken as string;

  const [isProcessing, setIsProcessing] = useState(true);
  const [restoredImageUri, setRestoredImageUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sliderPosition, setSliderPosition] = useState(CONTAINER_WIDTH / 2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = gestureState.moveX - 20; // Adjust for container padding
        if (newPosition >= 0 && newPosition <= CONTAINER_WIDTH) {
          setSliderPosition(newPosition);
        }
      },
    })
  ).current;

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      console.log('\n========================================');
      console.log('📱 STARTING IMAGE PROCESSING - FRONTEND');
      console.log('========================================');
      console.log('Timestamp:', new Date().toISOString());
      
      setIsProcessing(true);
      setError(null);

      console.log('\n📋 IMAGE DETAILS:');
      console.log('Image URI:', imageUri);
      console.log('Repair Scratches:', repairScratches);
      console.log('Colorize Photo:', colorizePhoto);
      console.log('Improve Clarity:', improveClarity);
      console.log('Ad Token:', adToken ? `${adToken.substring(0, 20)}...` : 'NONE');

      // Create FormData to send image and options
      console.log('\n📦 CREATING FORM DATA...');
      const formData = new FormData();
      
      // Add the image file
      const filename = imageUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      console.log('Image filename:', filename);
      console.log('Image type:', type);
      
      formData.append('image', {
        uri: imageUri,
        name: filename,
        type: type,
      } as any);

      // Add restoration options
      formData.append('repairScratches', repairScratches.toString());
      formData.append('colorizePhoto', colorizePhoto.toString());
      formData.append('improveClarity', improveClarity.toString());
      
      // Add ad completion token for security
      formData.append('adToken', adToken);
      
      console.log('✅ FormData created successfully');

      // Backend API endpoint
      // For local development: http://localhost:3000/restore
      // For physical device: http://YOUR_IP:3000/restore (e.g., http://192.168.1.100:3000/restore)
      // For production: https://your-domain.com/restore
      const API_URL = 'http://192.168.1.5:3000/restore';

      console.log('\n🌐 SENDING API REQUEST...');
      console.log('API URL:', API_URL);
      console.log('Method: POST');
      console.log('Headers: multipart/form-data (auto)');
      
      const requestStartTime = Date.now();

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let fetch set it automatically with boundary
      });

      const requestTime = ((Date.now() - requestStartTime) / 1000).toFixed(2);
      console.log(`\n✅ API REQUEST COMPLETED in ${requestTime}s`);
      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (!response.ok) {
        console.error('❌ Response not OK!');
        console.error('Status:', response.status);
        console.error('Status text:', response.statusText);
        throw new Error(`Failed to process image: ${response.statusText}`);
      }

      console.log('\n📥 PARSING RESPONSE JSON...');
      const data = await response.json();
      console.log('Response data:', JSON.stringify(data, null, 2));
      
      if (data.success && data.restoredImageUrl) {
        console.log('\n✨ SUCCESS!');
        console.log('Restored image URL:', data.restoredImageUrl);
        
        setRestoredImageUri(data.restoredImageUrl);
        setIsProcessing(false);
        
        console.log('========================================');
        console.log('✅ PROCESSING COMPLETE - FRONTEND');
        console.log('========================================\n');
      } else {
        console.error('❌ Invalid response format:', data);
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('\n❌❌❌ ERROR OCCURRED - FRONTEND ❌❌❌');
      const error = err as Error;
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      
      setError('Failed to restore image. Please try again.');
      setIsProcessing(false);
      
      console.log('\n⚠️  FALLBACK: Using original image after 3 seconds...');
      
      // For demo purposes, fall back to original image after 3 seconds
      setTimeout(() => {
        console.log('Setting restored image to original (fallback)');
        setRestoredImageUri(imageUri);
        setError(null);
      }, 3000);
    }
  };

  const handleSaveToDevice = async () => {
    try {
      console.log('\n💾 SAVE TO DEVICE - STARTED');
      console.log('========================================');
      
      console.log('\n🔐 Requesting media library permissions...');
      const { status } = await MediaLibrary.requestPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        console.warn('⚠️  Permission denied by user');
        Alert.alert('Permission Required', 'Please grant permission to save photos to your device.');
        return;
      }
      
      console.log('✅ Permission granted');

      const imageToSave = restoredImageUri || imageUri;
      let localUri = imageToSave;
      
      console.log('\n📍 Image to save:', imageToSave);
      
      // If it's an HTTP URL, download it first
      if (imageToSave.startsWith('http://') || imageToSave.startsWith('https://')) {
        console.log('\n⬇️  Image is HTTP URL, downloading first...');
        
        const filename = `restored-${Date.now()}.jpg`;
        console.log('Target filename:', filename);
        
        // Create file reference
        console.log('Creating file reference...');
        const file = new FileSystem.File(FileSystem.Paths.cache, filename);
        console.log('File path:', file.uri);
        
        // Fetch the image
        console.log('Fetching image...');
        const fetchStartTime = Date.now();
        const response = await fetch(imageToSave);
        console.log(`Fetch completed in ${((Date.now() - fetchStartTime) / 1000).toFixed(2)}s`);
        
        console.log('Converting to blob...');
        const blob = await response.blob();
        console.log('Blob size:', (blob.size / 1024).toFixed(2), 'KB');
        
        // Convert blob to arrayBuffer using FileReader
        console.log('Converting blob to ArrayBuffer...');
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as ArrayBuffer);
          };
          reader.onerror = reject;
          reader.readAsArrayBuffer(blob);
        });
        console.log('ArrayBuffer size:', (arrayBuffer.byteLength / 1024).toFixed(2), 'KB');
        
        // Write to file using the write method
        console.log('Writing to file...');
        await file.write(new Uint8Array(arrayBuffer));
        
        localUri = file.uri;
        
        console.log('✅ Downloaded successfully to:', localUri);
      } else {
        console.log('ℹ️  Image is local URI, no download needed');
      }
      
      // Save to device gallery
      console.log('\n📲 Saving to device gallery...');
      await MediaLibrary.createAssetAsync(localUri);
      console.log('✅ Saved to gallery successfully!');
      
      console.log('\n========================================');
      console.log('✨ SAVE TO DEVICE - COMPLETE');
      console.log('========================================\n');
      
      Alert.alert('Success', 'Restored photo saved to your device!', [
        { text: 'OK', onPress: () => {} }
      ]);
    } catch (err) {
      console.error('\n❌ ERROR SAVING TO DEVICE');
      const error = err as Error;
      console.error('Error type:', error.name);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      Alert.alert('Error', 'Failed to save photo to device.');
    }
  };

  const handleGoHome = () => {
    // Navigate back to home screen
    router.push('/');
  };

  if (isProcessing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#00A6ED" />
        <Text style={styles.loadingTitle}>Processing...</Text>
        <Text style={styles.loadingDescription}>
          {error ? error : 'Sending your photo to AI for restoration...'}
        </Text>
        {error && (
          <Text style={styles.errorRetry}>Retrying with demo mode...</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Before & After</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Comparison Content */}
      <View style={styles.content}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Original</Text>
          </View>
          <View style={styles.tab}>
            <Text style={styles.tabText}>Restored</Text>
          </View>
        </View>

        {/* Before & After Slider Comparison */}
        <View style={styles.comparisonContainer}>
          {/* Restored Image (Background - Right side) */}
          <View style={styles.fullImageContainer}>
            <Image
              source={{ uri: restoredImageUri || imageUri }}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>

          {/* Original Image (Foreground - Left side, clipped) */}
          <View
            style={[
              styles.clippedImageContainer,
              { width: sliderPosition },
            ]}
          >
            <Image
              source={{ uri: imageUri }}
              style={[styles.fullImage, { width: CONTAINER_WIDTH }]}
              resizeMode="cover"
            />
          </View>

          {/* Vertical Slider */}
          <View
            style={[styles.sliderLine, { left: sliderPosition }]}
            {...panResponder.panHandlers}
          >
            {/* Slider Handle */}
            <View style={styles.sliderHandle}>
              <View style={styles.sliderArrowLeft}>
                <Ionicons name="chevron-back" size={16} color="#FFFFFF" />
              </View>
              <View style={styles.sliderArrowRight}>
                <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Labels */}
          <View style={styles.labelLeft}>
            <Text style={styles.labelText}>Original</Text>
          </View>
          <View style={styles.labelRight}>
            <Text style={styles.labelText}>Restored</Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSaveToDevice}
        >
          <Text style={styles.saveButtonText}>Save to Device</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.8}
          onPress={handleGoHome}
        >
          <Text style={styles.homeButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 24,
    marginBottom: 12,
  },
  loadingDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorRetry: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
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
    paddingHorizontal: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  comparisonContainer: {
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  fullImageContainer: {
    position: 'absolute',
    width: CONTAINER_WIDTH,
    height: CONTAINER_HEIGHT,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  clippedImageContainer: {
    position: 'absolute',
    height: CONTAINER_HEIGHT,
    overflow: 'hidden',
  },
  sliderLine: {
    position: 'absolute',
    width: 4,
    height: CONTAINER_HEIGHT,
    backgroundColor: '#00A6ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderHandle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00A6ED',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderArrowLeft: {
    marginRight: 4,
  },
  sliderArrowRight: {
    marginLeft: 4,
  },
  labelLeft: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  labelRight: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonsContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#00A6ED',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#00A6ED',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

