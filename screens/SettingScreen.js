import React, { useState, useCallback, useEffect, useContext } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import { sessionStorage } from '../utils/sessionStorage';
import { ThemeContext } from '../context/ThemeContext';

export default function SettingsScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const [volume, setVolume] = useState(0.7);

  const handleDarkModeToggle = useCallback((value) => {
    theme.toggleDarkMode(value);
  }, [theme]);

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all tasks and statistics. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Clear All',
          onPress: async () => {
            try {
              await sessionStorage.clearAllTasks();
              await sessionStorage.clearAllSessions();
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
              console.error('Error clearing data:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: theme.colors.surfaceSecondary }]}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* NOTIFICATIONS */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>NOTIFICATIONS</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <SettingRow
          icon="notifications-outline"
          label="Alert Sound"
          value="Chime"
          showArrow
          theme={theme}
        />
        <Divider theme={theme} />
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="volume-high-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Volume</Text>
          </View>
          <Slider
            style={{ width: 140 }}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={setVolume}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.border}
            thumbTintColor={theme.colors.primary}
          />
        </View>
      </View>

      {/* APPEARANCE */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>APPEARANCE</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={theme.colors.primary} />
            <Text style={[styles.rowLabel, { color: theme.colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={theme.darkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* DATA MANAGEMENT */}
      <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>DATA MANAGEMENT</Text>
      <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <SettingRow
          icon="cloud-upload-outline"
          label="Backup to Cloud"
          showArrow
          theme={theme}
        />
        <Divider theme={theme} />
        <TouchableOpacity onPress={handleClearAllData} style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
            <Text style={[styles.rowLabel, { color: '#FF6B6B' }]}>
              Clear All Data
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const SettingRow = ({ icon, label, value, showArrow, theme }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color={theme.colors.primary} />
      <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={[styles.rowValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
      {showArrow && (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
      )}
    </View>
  </View>
);

const Divider = ({ theme }) => <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1525',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F1F23',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 30,
    color: '#A0A4AB',
    fontSize: 12,
    letterSpacing: 1.5,
  },

  card: {
    backgroundColor: '#151B2B',
    borderRadius: 20,
    marginTop: 12,
    paddingHorizontal: 15,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowLabel: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },

  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowValue: {
    color: '#A0A4AB',
    fontSize: 14,
    marginRight: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#1F1F23',
  },
});
