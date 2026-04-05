/**
 * VisitNotes — Quick notes input during active visits
 */
import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import { supabase } from '@/services/supabase';

interface VisitNotesProps {
  visitId: string;
}

export default function VisitNotes({ visitId }: VisitNotesProps) {
  const [notes, setNotes] = useState('');

  // Debounced save to DB
  const saveNotes = useCallback(
    (() => {
      let timeout: ReturnType<typeof setTimeout>;
      return (text: string) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          supabase.from('visits').update({ notes: text }).eq('id', visitId);
        }, 1000);
      };
    })(),
    [visitId]
  );

  const handleChange = (text: string) => {
    setNotes(text);
    saveNotes(text);
  };

  return (
    <Card variant="glass" style={styles.container}>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={handleChange}
        placeholder="Add visit notes..."
        placeholderTextColor={Colors.textMuted}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 0,
    overflow: 'hidden',
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    padding: Layout.spacing.md,
    minHeight: 72,
    fontSize: 14,
  },
});
