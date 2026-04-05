/**
 * Marketing Pages Layout
 * No auth required, includes nav + footer
 */
import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function MarketingLayout() {
  return (
    <View style={styles.container}>
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
