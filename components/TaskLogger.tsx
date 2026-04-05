/**
 * TaskLogger — Checklist of care tasks during active visits
 * Appears on dashboard while clocked in
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import { supabase } from '@/services/supabase';
import type { TaskLog } from '@/types';

const PRESET_TASKS = [
  { name: 'Personal Care', category: 'personal_care' as const },
  { name: 'Meal Prep', category: 'meals' as const },
  { name: 'Medication', category: 'medication' as const },
  { name: 'Mobility Assist', category: 'mobility' as const },
  { name: 'Companionship', category: 'companionship' as const },
];

interface TaskLoggerProps {
  visitId: string;
  onTasksChanged?: (count: number) => void;
}

export default function TaskLogger({ visitId, onTasksChanged }: TaskLoggerProps) {
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [customTask, setCustomTask] = useState('');

  const toggleTask = async (name: string, category: string) => {
    const newState = !tasks[name];
    setTasks((prev) => ({ ...prev, [name]: newState }));

    if (newState) {
      await supabase.from('task_logs').insert({
        visit_id: visitId,
        name,
        category,
        completed: true,
      });
    } else {
      await supabase.from('task_logs')
        .delete()
        .eq('visit_id', visitId)
        .eq('name', name);
    }

    const count = Object.values({ ...tasks, [name]: newState }).filter(Boolean).length;
    onTasksChanged?.(count);
  };

  const addCustomTask = async () => {
    if (!customTask.trim()) return;
    const name = customTask.trim();
    setTasks((prev) => ({ ...prev, [name]: true }));
    setCustomTask('');

    await supabase.from('task_logs').insert({
      visit_id: visitId,
      name,
      category: 'other',
      completed: true,
    });

    const count = Object.values({ ...tasks, [name]: true }).filter(Boolean).length;
    onTasksChanged?.(count);
  };

  return (
    <Card variant="glass" style={styles.container}>
      <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 14 }]}>
        CARE TASKS
      </Text>

      {PRESET_TASKS.map((task) => (
        <TouchableOpacity
          key={task.name}
          style={styles.taskRow}
          onPress={() => toggleTask(task.name, task.category)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, tasks[task.name] && styles.checkboxActive]}>
            {tasks[task.name] && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={[
            Typography.body,
            { color: tasks[task.name] ? Colors.textPrimary : Colors.textTertiary },
          ]}>
            {task.name}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Custom task input */}
      <View style={styles.customRow}>
        <TextInput
          style={styles.customInput}
          value={customTask}
          onChangeText={setCustomTask}
          placeholder="Add custom task..."
          placeholderTextColor={Colors.textMuted}
          onSubmitEditing={addCustomTask}
          returnKeyType="done"
        />
        {customTask.trim() ? (
          <TouchableOpacity onPress={addCustomTask} style={styles.addBtn}>
            <Text style={{ color: Colors.primary, fontWeight: '700' }}>+</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Show custom tasks */}
      {Object.entries(tasks)
        .filter(([name]) => !PRESET_TASKS.find((t) => t.name === name))
        .map(([name, checked]) => (
          <TouchableOpacity
            key={name}
            style={styles.taskRow}
            onPress={() => toggleTask(name, 'other')}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, checked && styles.checkboxActive]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[
              Typography.body,
              { color: checked ? Colors.textPrimary : Colors.textTertiary },
            ]}>
              {name}
            </Text>
          </TouchableOpacity>
        ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '800',
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  customInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radius.sm,
    padding: 10,
    paddingVertical: 8,
    color: Colors.textPrimary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.border.card,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
