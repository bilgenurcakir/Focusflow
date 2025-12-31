import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function ShareStatsModal({ navigation }) {
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
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#0E1525",
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
    backgroundColor: "#151B2B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    color: "#A0A4AB",
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    color: "#A0A4AB",
    fontSize: 14,
  },

  value: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "#1F1F23",
    marginVertical: 16,
  },

  footer: {
    textAlign: "center",
    color: "#5F646C",
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
    backgroundColor: "#2A2E35",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
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
    color: "#0E1525",
    fontSize: 16,
    fontWeight: "700",
  },
});