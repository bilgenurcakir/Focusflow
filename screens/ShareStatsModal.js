import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { ThemeContext } from "../context/ThemeContext";

export default function ShareStatsModal({ navigation }) {
  const theme = useContext(ThemeContext);
  const styles = getStyles(theme);
  return (

      <View style={styles.overlay}>
        <View style={styles.card}>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <FontAwesome name="clock-o" size={20} color="#4EC8C0" />
            </View>
            <Text style={styles.title}>Focusflow</Text>
          </View>

          <Text style={styles.subtitle}>My focus session summary</Text>

          {/* STATS */}
          <View style={styles.row}>
            <Text style={styles.label}>Focus Time</Text>
            <Text style={styles.value}>12h 45m</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pomodoros Completed</Text>
            <Text style={styles.value}>32</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.footer}>focusflow.app</Text>
        </View>

        {/* BUTTONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.closeBtn}  onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shareBtn}
            onPress={() => console.log("Share pressed")}
          >
            <Text style={styles.shareText}>Share Now</Text>
          </TouchableOpacity>
        </View>
      </View>
 
  );
}
const getStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: theme.colors.textSecondary,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  value: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    marginVertical: 16,
  },

  footer: {
    textAlign: "center",
    color: theme.colors.textTertiary,
    fontSize: 12,
  },

  actions: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    gap: 12,
  },

  closeBtn: {
    flex: 1,
    backgroundColor: theme.colors.surfaceSecondary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  closeText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
  },

  shareBtn: {
    flex: 1,
    backgroundColor: "#4EC8C0",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  shareText: {
    color: theme.darkMode ? "#0E1525" : "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});