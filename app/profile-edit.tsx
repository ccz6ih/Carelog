/**
 * Profile Edit Screen — Complete caregiver identity for compliance
 * HIPAA requires: Full name, DOB, photo, contact information
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Layout from '@/constants/Layout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { IconCaregiver } from '@/components/icons/CareIcons';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/services/supabase';

export default function ProfileEditScreen() {
  const { user, setUser } = useAppStore();
  const { userId, ready } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Basic info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Address (for tax documents - 1099)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    if (!ready) return;

    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId!)
          .single();

        if (error) throw error;

        if (data) {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setDateOfBirth(data.date_of_birth || '');
          setAvatarUrl(data.avatar_url || null);
          setAddress(data.address || '');
          setCity(data.city || '');
          setState(data.state || '');
          setZipCode(data.zip_code || '');
          setEmergencyName(data.emergency_contact_name || '');
          setEmergencyPhone(data.emergency_contact_phone || '');
        }
      } catch (e) {
        console.error('[ProfileEdit] Load error:', e);
        const msg = e instanceof Error ? e.message : 'Failed to load profile';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [ready, userId]);

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        const msg = 'Permission to access camera roll is required.';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Permission Required', msg);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.error('[ProfileEdit] Image picker error:', e);
      const msg = e instanceof Error ? e.message : 'Failed to pick image';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
    }
  };

  const uploadPhoto = async (uri: string) => {
    setUploadingPhoto(true);

    try {
      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update profile immediately
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId!);

      const msg = 'Photo uploaded successfully!';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Success', msg);
    } catch (e) {
      console.error('[ProfileEdit] Upload error:', e);
      const msg = e instanceof Error ? e.message : 'Failed to upload photo';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      const msg = 'First name and last name are required.';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Required Fields', msg);
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          date_of_birth: dateOfBirth || null,
          address: address || null,
          city: city || null,
          state: state || null,
          zip_code: zipCode || null,
          emergency_contact_name: emergencyName || null,
          emergency_contact_phone: emergencyPhone || null,
        })
        .eq('id', userId!);

      if (error) throw error;

      // Update Zustand store
      if (user) {
        setUser({
          ...user,
          firstName,
          lastName,
        });
      }

      const msg = 'Profile updated successfully!';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Success', msg);
      router.back();
    } catch (e) {
      console.error('[ProfileEdit] Save error:', e);
      const msg = e instanceof Error ? e.message : 'Failed to save profile';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Error', msg);
    } finally {
      setSaving(false);
    }
  };

  if (!ready || loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={[Typography.body, { color: Colors.textMuted, marginTop: 16 }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[Typography.sectionLabel, { color: Colors.primary }]}>PROFILE</Text>
          <Text style={[Typography.h1, { color: Colors.textPrimary, marginTop: 4, marginBottom: 8 }]}>
            Edit Your Information
          </Text>
          <Text style={[Typography.body, { color: Colors.textSecondary, marginBottom: 24 }]}>
            Complete your profile for compliance and tax purposes (1099).
          </Text>

          {/* Photo Upload */}
          <Card borderColor={Colors.primary} style={{ marginBottom: 16 }}>
            <View style={styles.photoSection}>
              <View style={styles.avatarContainer}>
                {avatarUrl ? (
                  <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <IconCaregiver size={48} color={Colors.textMuted} strokeWidth={1.5} />
                  </View>
                )}
                {uploadingPhoto && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 4 }]}>
                  Profile Photo
                </Text>
                <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 12 }]}>
                  Required for identification and compliance
                </Text>
                <Button
                  title={avatarUrl ? 'Change Photo' : 'Upload Photo'}
                  onPress={handlePickImage}
                  variant="outline"
                  size="sm"
                  disabled={uploadingPhoto}
                  loading={uploadingPhoto}
                />
              </View>
            </View>
          </Card>

          {/* Basic Info */}
          <Card borderColor={Colors.primary} style={{ marginBottom: 16 }}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 16 }]}>
              Basic Information
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, { backgroundColor: Colors.background + '80' }]}
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor={Colors.textMuted}
              />
              <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 4 }]}>
                Email cannot be changed (linked to authentication)
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textMuted}
              />
              <Text style={[Typography.micro, { color: Colors.textMuted, marginTop: 4 }]}>
                Required for compliance verification
              </Text>
            </View>
          </Card>

          {/* Mailing Address (for 1099 tax forms) */}
          <Card borderColor={Colors.accent.orange} style={{ marginBottom: 16 }}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 8 }]}>
              Mailing Address
            </Text>
            <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 16 }]}>
              For tax documents (1099) and payment verification
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Street Address</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="123 Main St, Apt 4B"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Denver"
                  placeholderTextColor={Colors.textMuted}
                />
              </View>

              <View style={[styles.field, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={state}
                  onChangeText={setState}
                  placeholder="CO"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="characters"
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                placeholder="80202"
                placeholderTextColor={Colors.textMuted}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </Card>

          {/* Emergency Contact */}
          <Card borderColor={Colors.error} style={{ marginBottom: 24 }}>
            <Text style={[Typography.h3, { color: Colors.textPrimary, marginBottom: 8 }]}>
              Emergency Contact
            </Text>
            <Text style={[Typography.caption, { color: Colors.textMuted, marginBottom: 16 }]}>
              For your safety during care visits
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Contact Name</Text>
              <TextInput
                style={styles.input}
                value={emergencyName}
                onChangeText={setEmergencyName}
                placeholder="Partner, family member, or friend"
                placeholderTextColor={Colors.textMuted}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput
                style={styles.input}
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                placeholder="(555) 123-4567"
                placeholderTextColor={Colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </Card>

          {/* Save Button */}
          <Button
            title="Save Profile"
            onPress={handleSave}
            loading={saving}
            size="lg"
            style={{ marginBottom: 16 }}
          />

          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="ghost"
            disabled={saving}
          />
        </View>
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
    paddingBottom: 60,
  },
  content: {
    padding: Layout.spacing.xl,
    paddingTop: Platform.OS === 'web' ? 40 : 20,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginBottom: Layout.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.surface,
    borderRadius: 8,
    padding: 14,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary + '30',
    borderStyle: 'dashed',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background + 'CC',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
