import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const AD_DURATION = 5; // 5 seconds

export default function AdScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [progress, setProgress] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(AD_DURATION);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / AD_DURATION);
        if (newProgress >= 100) {
          clearInterval(interval);
          // Generate ad completion token for API security
          const adToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
          // Navigate to processing/result screen after ad completes
          setTimeout(() => {
            router.push({ pathname: '/restore-process', params: { ...params, adToken } });
          }, 300);
          return 100;
        }
        return newProgress;
      });

      setSecondsLeft((prev) => {
        const newSeconds = prev - 1;
        return newSeconds > 0 ? newSeconds : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Ad Header */}
      <View style={styles.header}>
        <View style={styles.adBadge}>
          <Text style={styles.adText}>Ad Simulation (Dev Mode)</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Ad Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Ad Playing...</Text>
        <Text style={styles.timer}>{secondsLeft}s</Text>
        <Text style={styles.description}>
          In production, this will be a real AdMob ad.{'\n'}
          For now, simulating a {AD_DURATION}-second ad.
        </Text>
      </View>

      {/* Bottom Text */}
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>
          Your photo will be restored after the ad
        </Text>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  adBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FCD34D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  adText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00A6ED',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#00A6ED',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
