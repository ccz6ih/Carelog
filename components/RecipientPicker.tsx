/**
 * RecipientPicker — Switch between care recipients
 * Horizontal scrollable pill selector
 */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';
import type { CareRecipient } from '@/types';

interface RecipientPickerProps {
  onSelect: (recipient: CareRecipient) => void;
  selectedId?: string;
}

export default function RecipientPicker({ onSelect, selectedId }: RecipientPickerProps) {
  const user = useAppStore((s) => s.user);
  const [recipients, setRecipients] = useState<CareRecipient[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('recipients')
        .select('*')
        .eq('caregiver_id', user?.id)
        .eq('is_active', true);

      if (data) {
        setRecipients(
          data.map((r) => ({
            id: r.id,
            firstName: r.first_name,
            lastName: r.last_name,
            relationship: r.relationship,
            providerId: r.provider_id,
            recipientId: r.recipient_id,
            state: r.state,
            aggregator: r.aggregator,
          }))
        );
      }
    }
    if (user?.id) load();
  }, [user?.id]);

  if (recipients.length <= 1) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {recipients.map((r) => {
        const isSelected = r.id === selectedId;
        const label = r.relationship
          ? `${r.relationship.charAt(0).toUpperCase() + r.relationship.slice(1)} (${r.firstName})`
          : `${r.firstName} ${r.lastName}`;

        return (
          <TouchableOpacity
            key={r.id}
            onPress={() => onSelect(r)}
            style={[styles.pill, isSelected && styles.pillActive]}
            activeOpacity={0.7}
          >
            <View style={[styles.dot, { backgroundColor: isSelected ? Colors.primary : Colors.textMuted }]} />
            <Text
              style={[
                Typography.caption,
                { color: isSelected ? Colors.primary : Colors.textSecondary },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  content: {
    gap: 8,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Layout.radius.full,
    borderWidth: 1,
    borderColor: Colors.border.cardHover,
    backgroundColor: Colors.surface,
  },
  pillActive: {
    borderColor: Colors.primary + '50',
    backgroundColor: Colors.primary + '10',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
