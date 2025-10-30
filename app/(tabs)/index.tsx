import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  // Animation values for stars
  const star1Opacity = useRef(new Animated.Value(0)).current;
  const star2Opacity = useRef(new Animated.Value(0)).current;
  const star3Opacity = useRef(new Animated.Value(0)).current;
  const star4Opacity = useRef(new Animated.Value(0)).current;

  const star1Scale = useRef(new Animated.Value(0.5)).current;
  const star2Scale = useRef(new Animated.Value(0.5)).current;
  const star3Scale = useRef(new Animated.Value(0.5)).current;
  const star4Scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Create twinkling animation for each star
    const createTwinkle = (opacity: Animated.Value, scale: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 800,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 800,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 800,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.5,
              duration: 800,
              easing: Easing.ease,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    // Start animations with different delays for staggered effect
    const animation1 = createTwinkle(star1Opacity, star1Scale, 0);
    const animation2 = createTwinkle(star2Opacity, star2Scale, 200);
    const animation3 = createTwinkle(star3Opacity, star3Scale, 400);
    const animation4 = createTwinkle(star4Opacity, star4Scale, 600);

    animation1.start();
    animation2.start();
    animation3.start();
    animation4.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
      animation4.stop();
    };
  }, []);

  const handleRestorePhoto = () => {
    // Navigate to the photo selection/upload screen (we'll create this next)
    router.push('/explore');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Photo Restore AI</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Icon Circle */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="magic-staff" size={64} color="#00A6ED" />
            
            {/* Animated Stars */}
            <Animated.View
              style={[
                styles.star,
                styles.star1,
                {
                  opacity: star1Opacity,
                  transform: [{ scale: star1Scale }],
                },
              ]}
            >
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
            </Animated.View>

            <Animated.View
              style={[
                styles.star,
                styles.star2,
                {
                  opacity: star2Opacity,
                  transform: [{ scale: star2Scale }],
                },
              ]}
            >
              <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
            </Animated.View>

            <Animated.View
              style={[
                styles.star,
                styles.star3,
                {
                  opacity: star3Opacity,
                  transform: [{ scale: star3Scale }],
                },
              ]}
            >
              <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
            </Animated.View>

            <Animated.View
              style={[
                styles.star,
                styles.star4,
                {
                  opacity: star4Opacity,
                  transform: [{ scale: star4Scale }],
                },
              ]}
            >
              <MaterialCommunityIcons name="star" size={14} color="#FFD700" />
            </Animated.View>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>
          Bring your memories{'\n'}back to life.
        </Text>

        {/* Description */}
        <Text style={styles.description}>
          Use the power of AI to restore, enhance, and colorize your old family photos instantly.
        </Text>
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleRestorePhoto}
        >
          <Text style={styles.buttonText}>Restore Photo</Text>
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
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 50,
  },
  iconCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#C5E8F7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  star: {
    position: 'absolute',
  },
  star1: {
    top: 15,
    right: 20,
  },
  star2: {
    bottom: 20,
    left: 15,
  },
  star3: {
    top: 25,
    left: 25,
  },
  star4: {
    bottom: 30,
    right: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 36,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
  },
  button: {
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
