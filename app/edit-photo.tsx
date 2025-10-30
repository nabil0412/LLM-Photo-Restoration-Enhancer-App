import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function EditPhotoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;

  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleRotateLeft = () => {
    setRotation((prev) => (prev - 90) % 360);
  };

  const handleRotateRight = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleReset = () => {
    setRotation(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    // Navigate to restoration options screen
    router.push({ pathname: '/restoration-options', params: { imageUri, rotation, isFlipped } });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Photo</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Photo Preview with Crop Border */}
      <View style={styles.photoContainer}>
        <View style={styles.cropBorder}>
          <View style={styles.photoWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.photo,
                {
                  transform: [
                    { rotate: `${rotation}deg` },
                    { scaleX: isFlipped ? -1 : 1 },
                  ],
                },
              ]}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Controls Section */}
      <View style={styles.controlsContainer}>
        {/* Rotate & Flip Header */}
        <View style={styles.controlsHeader}>
          <Text style={styles.controlsTitle}>Rotate & Flip</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Rotate Left */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRotateLeft}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="rotate-left" size={32} color="#000" />
            <Text style={styles.actionText}>Rotate Left</Text>
          </TouchableOpacity>

          {/* Rotate Right */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRotateRight}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="rotate-right" size={32} color="#000" />
            <Text style={styles.actionText}>Rotate Right</Text>
          </TouchableOpacity>

          {/* Flip */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFlip}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="flip-horizontal" size={32} color="#000" />
            <Text style={styles.actionText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Next Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.8}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#E8E8E8',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  photoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cropBorder: {
    borderWidth: 3,
    borderColor: '#00A6ED',
    borderStyle: 'dashed',
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  photoWrapper: {
    width: width - 100,
    height: width - 100,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  controlsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  resetText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00A6ED',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    fontSize: 12,
    color: '#000',
    marginTop: 8,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
  },
  nextButton: {
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

