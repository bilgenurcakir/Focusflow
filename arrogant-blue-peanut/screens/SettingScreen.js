import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from '@react-native-community/slider';

export default function SettingsScreen({navigation}) {
  const [darkMode, setDarkMode] = useState(true);
  const [volume, setVolume] = useState(0.7);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
       <TouchableOpacity
  style={styles.backBtn}
  onPress={() => navigation.goBack()}
>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* DURATIONS */}
      <Text style={styles.sectionTitle}>DURATIONS</Text>
      <View style={styles.card}>
        <SettingRow icon="stopwatch-outline" label="Focus" value="25 min" />
        <Divider />
        <SettingRow icon="cafe-outline" label="Short Break" value="5 min" />
        <Divider />
        <SettingRow icon="moon-outline" label="Long Break" value="15 min" />
      </View>

      {/* NOTIFICATIONS */}
      <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
      <View style={styles.card}>
        <SettingRow icon="notifications-outline" label="Alert Sound" value="Chime" showArrow />
        <Divider />
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="volume-high-outline" size={22} color="#4EC8C0" />
            <Text style={styles.rowLabel}>Volume</Text>
          </View>
          <Slider
            style={{ width: 140 }}          // 140 piksel genişlik
            minimumValue={0}                // Minimum: 0 (sessiz)
            maximumValue={1}                // Maximum: 1 (tam ses)
            value={volume}                  // Mevcut değer: volume state'i
            onValueChange={setVolume}       // Değer değişince setVolume çalışır
            minimumTrackTintColor="#4EC8C0" // Sol taraf rengi: turkuaz
            maximumTrackTintColor="#2A2E35" // Sağ taraf rengi: gri
            thumbTintColor="#4EC8C0"        // Kaydırıcı rengi: turkuaz
          />
        </View>
      </View>

      {/* APPEARANCE */}
      <Text style={styles.sectionTitle}>APPEARANCE</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color="#4EC8C0" />
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
           value={darkMode}                // Mevcut değer: darkMode state'i
            onValueChange={setDarkMode}     // Değer değişince setDarkMode çalışır
            // trackColor: ray renkleri
            trackColor={{ 
              false: "#2A2E35",             // Kapalıyken: gri
              true: "#4EC8C0"               // Açıkken: turkuaz
            }}
            thumbColor="#fff"               // Kaydırıcı rengi: beyaz
          />
        </View>
      </View>

      {/* DATA MANAGEMENT */}
      <Text style={styles.sectionTitle}>DATA MANAGEMENT</Text>
      <View style={styles.card}>
        <SettingRow
          icon="cloud-upload-outline"
          label="Backup to Cloud"
          showArrow
        />
        <Divider />
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={22} color="#FF6B6B" />
            <Text style={[styles.rowLabel, { color: "#FF6B6B" }]}>
              Clear All Data
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

const SettingRow = ({ icon, label, value, showArrow }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={22} color="#4EC8C0" />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value && <Text style={styles.rowValue}>{value}</Text>}
      {showArrow && (
        <Ionicons name="chevron-forward" size={18} color="#A0A4AB" />
      )}
    </View>
  </View>
);

const Divider = () => <View style={styles.divider} />;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1525",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F1F23",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 30,
    color: "#A0A4AB",
    fontSize: 12,
    letterSpacing: 1.5,
  },

  card: {
    backgroundColor: "#151B2B",
    borderRadius: 20,
    marginTop: 12,
    paddingHorizontal: 15,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowLabel: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },

  rowRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowValue: {
    color: "#A0A4AB",
    fontSize: 14,
    marginRight: 6,
  },

  divider: {
    height: 1,
    backgroundColor: "#1F1F23",
  },
});