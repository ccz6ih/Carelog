/**
 * PhotoCapture — Take or pick photos during active visits
 * Stored as base64 in visit photos array (upgrade to S3 later)
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Card from '@/components/ui/Card';
import { supabase } from '@/services/supabase';

interface PhotoCaptureProps {
  visitId: string;
}

export default function PhotoCapture({ visitId }: PhotoCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async (useCamera: boolean) => {
    const permission = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      const msg = `Please allow ${useCamera ? 'camera' : 'photo library'} access to add visit photos.`;
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Permission needed', msg);
      return;
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.7, base64: false })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.7, base64: false });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const updated = [...photos, uri];
      setPhotos(updated);

      // Save to visit record
      await supabase.from('visits').update({ photos: updated }).eq('id', visitId);
    }
  };

  return (
    <Card variant="glass" style={styles.container}>
      <Text style={[Typography.sectionLabel, { color: Colors.textMuted, marginBottom: 10 }]}>
        VISIT PHOTOS
      </Text>

      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
          {photos.map((uri, i) => (
            <Image key={i} source={{ uri }} style={styles.photo} />
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.captureBtn} onPress={() => pickImage(true)}>
          <Text style={[Typography.caption, { color: Colors.primary }]}>📷 Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.captureBtn} onPress={() => pickImage(false)}>
          <Text style={[Typography.caption, { color: Colors.primary }]}>🖼 Gallery</Text>
        </TouchableOpacity>
      </View>

      {photos.length > 0 && (
        <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 8 }]}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} attached to this visit
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  photoScroll: { marginBottom: 10 },
  photo: { width: 72, height: 72, borderRadius: Layout.radius.sm, marginRight: 8, backgroundColor: Colors.surface },
  buttonRow: { flexDirection: 'row', gap: 10 },
  captureBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Layout.radius.sm,
    borderWidth: 1,
    borderColor: Colors.border.cardHover,
    alignItems: 'center',
  },
});
