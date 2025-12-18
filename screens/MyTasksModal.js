import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MyTasksModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>My Tasks</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* ADD TASK */}
          <View style={styles.addTask}>
            <TextInput
              placeholder="Add new task..."
              placeholderTextColor="#7A7F87"
              style={styles.input}
            />
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="add" size={26} color="#0E1525" />
            </TouchableOpacity>
          </View>

          {/* TASKS */}
          <TaskItem text="Finalize project report" />
          <TaskItem text="Schedule team meeting for Q3" />
          <TaskItem text="Research new design trends" />

          {/* COMPLETED */}
          <View style={styles.completedHeader}>
            <Text style={styles.completedText}>COMPLETED (2)</Text>
            <Ionicons name="chevron-down" size={18} color="#A0A4AB" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- COMPONENTS ---------- */

const TaskItem = ({ text }) => (
  <View style={styles.taskItem}>
    <View style={styles.circle} />
    <Text style={styles.taskText}>{text}</Text>
  </View>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "#0E1525",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F1F23",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  addTask: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151B2B",
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingVertical: 14,
  },

  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#4EC8C0",
    justifyContent: "center",
    alignItems: "center",
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151B2B",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2A2E35",
    marginRight: 14,
  },

  taskText: {
    color: "#fff",
    fontSize: 15,
  },

  completedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },

  completedText: {
    color: "#7A7F87",
    fontSize: 12,
    letterSpacing: 1.2,
  },
});