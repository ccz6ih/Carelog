/**
 * MedicationLogger — Log medication administration during visits
 * Pro/Family tier feature. Tracks administered, skipped, and timing.
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { supabase } from '@/services/supabase';
import { useAppStore } from '@/store/useAppStore';

interface MedEntry {
  id: string;
  medication_name: string;
  dosage: string | null;
  administered_at: string | null;
  skipped: boolean;
  skip_reason: string | null;
  notes: string | null;
}

interface MedicationLoggerProps {
  visitId: string;
  recipientId: string;
}

export default function MedicationLogger({ visitId, recipientId }: MedicationLoggerProps) {
  const user = useAppStore((s) => s.user);
  const [entries, setEntries] = useState<MedEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, [visitId]);

  async function loadEntries() {
    const { data } = await supabase
      .from('medication_logs')
      .select('id, medication_name, dosage, administered_at, skipped, skip_reason, notes')
      .eq('visit_id', visitId)
      .order('created_at');
    if (data) setEntries(data);
  }

  const handleAdd = async () => {
    if (!medName.trim()) return;
    setSaving(true);

    await supabase.from('medication_logs').insert({
      recipient_id: recipientId,
      visit_id: visitId,
      logged_by: user?.id,
      medication_name: medName.trim(),
      dosage: dosage.trim() || null,
      administered_at: new Date().toISOString(),
      skipped: false,
    });

    setMedName('');
    setDosage('');
    setShowAdd(false);
    setSaving(false);
    loadEntries();
  };

  const handleSkip = async (id: string) => {
    await supabase.from('medication_logs')
      .update({ skipped: true, administered_at: null, skip_reason: 'Skipped by caregiver' })
      .eq('id', id);
    loadEntries();
  };

  const handleAdminister = async (id: string) => {
    await supabase.from('medication_logs')
      .update({ skipped: false, administered_at: new Date().toISOString() })
      .eq('id', id);
    loadEntries();
  };

  // Only show for Pro/Family tiers
  if (user?.tier === 'basic') return null;

  return (
    <Card variant="glass" style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.sectionLabel, { color: Colors.accent.pink }]}>MEDICATIONS</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}>
          <Text style={[Typography.caption, { color: Colors.primary }]}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {entries.length === 0 ? (
        <Text style={[Typography.bodySm, { color: Colors.textMuted, marginTop: 8 }]}>
          No medications logged for this visit. Tap + Add to log one.
        </Text>
      ) : (
        entries.map((entry) => (
          <View key={entry.id} style={styles.entryRow}>
            <TouchableOpacity
              style={[
                styles.statusCircle,
                entry.skipped
                  ? { borderColor: Colors.warning }
                  : entry.administered_at
                    ? { borderColor: Colors.success, backgroundColor: Colors.success }
                    : { borderColor: Colors.textMuted },
              ]}
              onPress={() => entry.administered_at ? handleSkip(entry.id) : handleAdminister(entry.id)}
            >
              {entry.administered_at && !entry.skipped && (
                <Text style={{ color: Colors.textInverse, fontSize: 10, fontWeight: '800' }}>✓</Text>
              )}
              {entry.skipped && (
                <Text style={{ color: Colors.warning, fontSize: 10, fontWeight: '800' }}>—</Text>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={[Typography.body, { color: Colors.textPrimary }]}>
                {entry.medication_name}
              </Text>
              {entry.dosage && (
                <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 2 }]}>
                  {entry.dosage}
                </Text>
              )}
            </View>
            <Badge
              label={entry.skipped ? 'Skipped' : entry.administered_at ? 'Given' : 'Pending'}
              color={entry.skipped ? Colors.warning : entry.administered_at ? Colors.success : Colors.textMuted}
              variant="dot"
              size="sm"
            />
          </View>
        ))
      )}

      {/* Add Medication Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={[Typography.h2, { color: Colors.textPrimary, marginTop: 8 }]}>
              Log Medication
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Medication Name</Text>
              <TextInput
                style={styles.input}
                value={medName}
                onChangeText={setMedName}
                placeholder="e.g. Metformin, Lisinopril"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Dosage (optional)</Text>
              <TextInput
                style={styles.input}
                value={dosage}
                onChangeText={setDosage}
                placeholder="e.g. 500mg, 2 tablets"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={{ gap: 8, marginTop: 16 }}>
              <Button title="Log as Administered" onPress={handleAdd} loading={saving} fullWidth size="lg" />
              <Button title="Cancel" onPress={() => setShowAdd(false)} variant="ghost" fullWidth />
            </View>
          </View>
        </View>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  statusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay.heavy, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: Colors.backgroundElevated, borderTopLeftRadius: Layout.radius.xxl, borderTopRightRadius: Layout.radius.xxl, padding: Layout.spacing.xl, paddingBottom: 48, maxWidth: Layout.content.maxWidth, width: '100%', alignSelf: 'center' },
  modalHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.textMuted, alignSelf: 'center', marginBottom: 16, opacity: 0.4 },
  inputContainer: { marginBottom: 12, marginTop: 8 },
  label: { ...Typography.micro, color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  input: { backgroundColor: Colors.surface, borderRadius: Layout.radius.md, padding: Layout.spacing.md, paddingVertical: 12, color: Colors.textPrimary, fontSize: 15, borderWidth: 1, borderColor: Colors.border.card },
});
