import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionStorage } from "../utils/sessionStorage";

export default function TaskSelectionModal({ navigation, route }) {
  const { currentTaskName, onTaskSelect } = route.params || {};
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await sessionStorage.getTasks();
    setTasks(loadedTasks);
  };

  const activeTasks = tasks.filter((task) => !task.completed);

  const handleSelectTask = (taskText) => {
    if (onTaskSelect) {
      onTaskSelect(taskText);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.sheet}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Select Task</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* TASKS LIST */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={[
                  styles.taskItem,
                  currentTaskName === task.text && styles.taskItemSelected,
                ]}
                onPress={() => handleSelectTask(task.text)}
              >
                <Text
                  style={[
                    styles.taskText,
                    currentTaskName === task.text && styles.taskTextSelected,
                  ]}
                >
                  {task.text}
                </Text>
                {currentTaskName === task.text && (
                  <Ionicons name="checkmark" size={20} color="#4EC8C0" />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No active tasks</Text>
              <Text style={styles.emptySubtext}>
                Create tasks in the To-Do List first
              </Text>
            </View>
          )}

          {/* Show current custom task if it's not in the active tasks list */}
          {currentTaskName && 
           !activeTasks.find(t => t.text === currentTaskName) && (
            <TouchableOpacity
              style={[styles.taskItem, styles.taskItemSelected]}
              onPress={() => handleSelectTask(currentTaskName)}
            >
              <Text style={styles.taskTextSelected}>{currentTaskName}</Text>
              <Ionicons name="checkmark" size={20} color="#4EC8C0" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

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
    maxHeight: "70%",
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

  scrollView: {
    flex: 1,
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#151B2B",
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  taskItemSelected: {
    backgroundColor: "#1F2A3A",
    borderWidth: 1,
    borderColor: "#4EC8C0",
  },

  taskText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },

  taskTextSelected: {
    color: "#4EC8C0",
    fontWeight: "600",
  },

  customTaskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151B2B",
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2A2E35",
    borderStyle: "dashed",
  },

  customTaskText: {
    color: "#4EC8C0",
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
  },

  emptyState: {
    paddingVertical: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubtext: {
    color: "#7A7F87",
    fontSize: 14,
    textAlign: "center",
  },
});
