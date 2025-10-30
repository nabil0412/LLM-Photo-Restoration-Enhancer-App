import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RestorationOptionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUri = params.imageUri as string;

  const [repairScratches, setRepairScratches] = useState(true);
  const [colorizePhoto, setColorizePhoto] = useState(false);
  const [improveClarity, setImproveClarity] = useState(true);

  const handleRestore = () => {
    // Navigate to ad screen first
    router.push({ 
      pathname: '/ad-screen', 
      params: { 
        imageUri, 
        repairScratches: repairScratches.toString(), 
        colorizePhoto: colorizePhoto.toString(), 
        improveClarity: improveClarity.toString() 
      } 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Choose Enhancements</Text>

        {/* Options List */}
        <View style={styles.optionsList}>
          {/* Repair Scratches and Tears */}
          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="bandage" size={24} color="#000" />
              <Text style={styles.optionText}>Repair Scratches and Tears</Text>
            </View>
            <Switch
              value={repairScratches}
              onValueChange={setRepairScratches}
              trackColor={{ false: '#D1D5DB', true: '#00A6ED' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          {/* Colorize Photo */}
          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="palette" size={24} color="#000" />
              <Text style={styles.optionText}>Colorize Photo</Text>
            </View>
            <Switch
              value={colorizePhoto}
              onValueChange={setColorizePhoto}
              trackColor={{ false: '#D1D5DB', true: '#00A6ED' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
            />
          </View>

          {/* Improve Clarity */}
          <View style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <MaterialCommunityIcons name="star-four-points" size={24} color="#000" />
              <Text style={styles.optionText}>Improve Clarity</Text>
            </View>
            <Switch
              value={improveClarity}
              onValueChange={setImproveClarity}
              trackColor={{ false: '#D1D5DB', true: '#00A6ED' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D1D5DB"
            />
          </View>
        </View>
      </View>

      {/* Restore Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.restoreButton}
          activeOpacity={0.8}
          onPress={handleRestore}
        >
          <Text style={styles.restoreButtonText}>Restore</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
  },
  optionsList: {
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingTop: 16,
  },
  restoreButton: {
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
  restoreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

