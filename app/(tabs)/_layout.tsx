/**
 * CareLog Tab Navigation
 * Hand-drawn care icons, frosted glass bar
 */
import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { IconComfort, IconVisit, IconHeart, IconNurture } from '@/components/icons/CareIcons';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? Colors.tabBar.active : Colors.tabBar.inactive;
  const size = 22;

  const icons: Record<string, React.ReactNode> = {
    Dashboard: <IconComfort size={size} color={color} strokeWidth={2} />,
    Visits: <IconVisit size={size} color={color} strokeWidth={2} />,
    Family: <IconHeart size={size} color={color} strokeWidth={2} />,
    Settings: <IconNurture size={size} color={color} strokeWidth={2} />,
  };

  return (
    <View style={styles.tabIcon}>
      {icons[name]}
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
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.tabBar.active,
    marginTop: 3,
  },
});
