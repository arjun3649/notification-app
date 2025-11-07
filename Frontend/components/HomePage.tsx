import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import { saveUserToFirestore } from '../firebase/User';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomePage() {
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);
  const [pushToken, setPushToken] = useState<string>('');

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      let storedUserId = await AsyncStorage.getItem('userId');
      if (!storedUserId) {
        storedUserId = Crypto.randomUUID();
        await AsyncStorage.setItem('userId', storedUserId);
      }
      setUserId(storedUserId);

      const token = await requestNotificationPermissions();
      if (token) {
        setPushToken(token);
        await saveUserToFirestore(storedUserId, token);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        console.warn('Notification permission denied');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID,
      });

      console.log('Push token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  };

  const handleSendNotification = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotificationSent(true);

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/send-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log('Notification response:', data);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    setTimeout(() => setNotificationSent(false), 3000);
  };

  if (loading) {
    return (
      <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="mt-4 text-lg text-white">Initializing...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f0c29', '#302b63', '#24243e']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 py-8">
          {/* Header Section */}
          <View className="mb-8 mt-8">
            <Text className="mb-2 text-4xl font-bold text-white">Push Notifications</Text>
            <Text className="mb-4 text-5xl">🔔</Text>
            <View className="mb-4 h-1 w-20 rounded-full bg-white/30" />
            <Text className="text-base text-white/80">Firebase Cloud Messaging Demo</Text>
          </View>

          {/* User ID Card */}
          <View className="mb-5 rounded-3xl border border-white/20 bg-white/10 p-6">
            <View className="mb-4 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Text className="text-xl">👤</Text>
              </View>
              <Text className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Your User ID
              </Text>
            </View>
            <View className="rounded-2xl bg-black/20 p-4">
              <Text className="font-mono text-xs leading-5 text-white">{userId}</Text>
            </View>
          </View>

          {/* Status Card */}
          <View className="mb-6 flex-row items-center rounded-3xl border border-white/20 bg-white/10 p-5">
            <View
              className={`mr-3 h-3 w-3 rounded-full ${notificationSent ? 'bg-green-400' : 'bg-yellow-400'}`}
            />
            <Text className="text-sm text-white">
              {notificationSent
                ? '✓ Notification Sent Successfully'
                : 'Ready to send notifications'}
            </Text>
          </View>

          {/* Send Button */}
          <TouchableOpacity onPress={handleSendNotification} activeOpacity={0.9}>
            <LinearGradient
              colors={['#FF416C', '#FF4B2B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 16 }}>
              <View className="items-center rounded-2xl p-5 shadow-2xl">
                <Text className="text-lg font-bold tracking-wide text-white">
                  🚀 Send Test Notification
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Feature Pills */}
          <View className="mt-8 flex-row flex-wrap gap-3">
            <View className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Text className="text-xs text-white/90">🔥 Real-time</Text>
            </View>
            <View className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Text className="text-xs text-white/90">☁️ Firestore</Text>
            </View>
            <View className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              <Text className="text-xs text-white/90">⚡ Node.js</Text>
            </View>
          </View>

          {/* Footer */}
          <View className="mt-12">
            <Text className="text-center text-xs text-white/50">
              Powered by Expo • Firebase • FCM
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
