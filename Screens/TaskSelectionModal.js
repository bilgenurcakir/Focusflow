import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionStorage } from "../utils/sessionStorage";
import { ThemeContext } from "../context/ThemeContext";

export default function TaskSelectionModal({ navigation, route }) {
  const theme = useContext(ThemeContext);
  const { currentTaskName, onTaskSelect } = route.params || {};
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await sessionStorage.getTasks();
    setTasks(loadedTasks);
  };

  const styles = getStyles(theme);
  const activeTasks = tasks.filter((task) => !task.completed);

  const handleSelectTask = (taskText) => {
    console.log('Task selected:', taskText);
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
            <Ionicons name="close" size={22} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Task</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* TASKS LIST */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="always">
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

const getStyles = (theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    flex: 1,
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
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
  },

  scrollView: {
    flex: 1,
    minHeight: 150,
  },

  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
  },

  taskItemSelected: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: "#4EC8C0",
  },

  taskText: {
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptySubtext: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
  },
});
