/**
 * CareLog Visits Screen — Visit history with EVV status
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import VisitCard from '@/components/VisitCard';

const MOCK_VISITS = [
  { id: '1', recipientName: 'Mom (Dorothy)', date: 'Today · 9:02 AM – 1:14 PM', duration: '4h 12m', tasksCompleted: 5, evvStatus: 'submitted' as const },
  { id: '2', recipientName: 'Mom (Dorothy)', date: 'Yesterday · 8:45 AM – 12:30 PM', duration: '3h 45m', tasksCompleted: 4, evvStatus: 'submitted' as const },
  { id: '3', recipientName: 'Mom (Dorothy)', date: 'Mon, Mar 31 · 9:00 AM – 1:00 PM', duration: '4h 00m', tasksCompleted: 6, evvStatus: 'submitted' as const },
  { id: '4', recipientName: 'Mom (Dorothy)', date: 'Sun, Mar 30 · 10:15 AM – 2:45 PM', duration: '4h 30m', tasksCompleted: 5, evvStatus: 'error' as const },
  { id: '5', recipientName: 'Mom (Dorothy)', date: 'Sat, Mar 29 · 9:30 AM – 1:00 PM', duration: '3h 30m', tasksCompleted: 4, evvStatus: 'submitted' as const },
];

export default function VisitsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>VISIT HISTORY</Text>
        <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 24 }]}>
          Your Visits
        </Text>

        {MOCK_VISITS.map((visit) => (
          <VisitCard
            key={visit.id}
            recipientName={visit.recipientName}
            date={visit.date}
            duration={visit.duration}
            tasksCompleted={visit.tasksCompleted}
            evvStatus={visit.evvStatus}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Layout.spacing.xl,
    paddingTop: 16,
  },
});
