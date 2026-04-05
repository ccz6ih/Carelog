/**
 * CareLog Tab Navigation
 * Frosted glass tab bar, teal active state, refined icons
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, { active: string; inactive: string }> = {
    Dashboard: { active: '◉', inactive: '○' },
    Visits: { active: '▣', inactive: '▢' },
    Family: { active: '♥', inactive: '♡' },
    Settings: { active: '⬢', inactive: '⬡' },
  };
  const icon = icons[name] || { active: '●', inactive: '○' };

  return (
    <View style={styles.tabIcon}>
      <Text style={[
        styles.iconText,
        { color: focused ? Colors.tabBar.active : Colors.tabBar.inactive },
      ]}>
        {focused ? icon.active : icon.inactive}
      </Text>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar.background,
          borderTopColor: Colors.border.subtle,
          borderTopWidth: 1,
          height: Platform.OS === 'web' ? 64 : 88,
          paddingBottom: Platform.OS === 'web' ? 8 : 24,
          paddingTop: 8,
          ...(Platform.OS === 'web' ? {
            // @ts-ignore
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          } : {}),
        } as any,
        tabBarActiveTintColor: Colors.tabBar.active,
        tabBarInactiveTintColor: Colors.tabBar.inactive,
        tabBarLabelStyle: {
          ...Typography.micro,
          marginTop: 2,
          letterSpacing: 0.8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabIcon name="Dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="visits"
        options={{
          title: 'Visits',
          tabBarIcon: ({ focused }) => <TabIcon name="Visits" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: ({ focused }) => <TabIcon name="Family" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon name="Settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '300',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.tabBar.active,
    marginTop: 3,
  },
});
