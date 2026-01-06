import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionStorage } from "../utils/sessionStorage";

export default function MyTasksModal({ navigation }) 
{
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [completedExpanded, setCompletedExpanded] = useState(false);

  // Load tasks when modal opens
  useEffect(() => {
    loadTasks();
    
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });

    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    const loadedTasks = await sessionStorage.getTasks();
    setTasks(loadedTasks);
  };

  const handleAddTask = async () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;
    
    const added = await sessionStorage.addTask(trimmed);
    if (added) {
      setNewTask("");
      loadTasks(); // Reload to get updated list
    }
  };

  const handleDeleteTask = async (id) => {
    const deleted = await sessionStorage.deleteTask(id);
    if (deleted) {
      loadTasks(); // Reload to get updated list
    }
  };

  const handleToggleComplete = async (id) => {
    await sessionStorage.toggleTaskCompletion(id);
    loadTasks(); // Reload to get updated list
  };

  // Separate completed and active tasks
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
  
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* HEADER */}
          <View style={styles.header}>
<TouchableOpacity
  onPress={navigation.goBack}
  style={styles.closeBtn}
>
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
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={handleAddTask}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
              <Ionicons name="add" size={26} color="#0E1525" />
            </TouchableOpacity>
          </View>

          {/* TASKS LIST */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Active Tasks */}
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                completed={task.completed}
                onToggle={() => handleToggleComplete(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}

            {/* COMPLETED SECTION */}
            {completedTasks.length > 0 && (
              <>
                <TouchableOpacity
                  style={styles.completedHeader}
                  onPress={() => setCompletedExpanded(!completedExpanded)}
                >
                  <Text style={styles.completedText}>
                    COMPLETED ({completedTasks.length})
                  </Text>
                  <Ionicons
                    name={completedExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#A0A4AB"
                  />
                </TouchableOpacity>

                {completedExpanded &&
                  completedTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      text={task.text}
                      completed={task.completed}
                      onToggle={() => handleToggleComplete(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
              </>
            )}

            {tasks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No tasks yet</Text>
                <Text style={styles.emptySubtext}>Add your first task above!</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
 
  );
}

/* ---------- COMPONENTS ---------- */
// TaskItem: Tek bir görev elemanı
const TaskItem = ({ text, completed, onToggle, onDelete }) => (
  <View style={styles.taskItem}>
    <TouchableOpacity onPress={onToggle} style={styles.circleContainer}>
      {completed ? (
        <View style={styles.circleFilled}>
          <Ionicons name="checkmark" size={14} color="#0E1525" />
        </View>
      ) : (
        <View style={styles.circle} />
      )}
    </TouchableOpacity>
    <Text
      style={[
        styles.taskText,
        completed && styles.taskTextCompleted,
      ]}
    >
      {text}
    </Text>
    <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
      <Ionicons name="trash-outline" size={20} color="#A0A4AB" />
    </TouchableOpacity>
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
    maxHeight: "90%",
  },

  scrollView: {
    flex: 1,
    maxHeight: 500,
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
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  circleContainer: {
    marginRight: 14,
  },

  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#2A2E35",
  },

  circleFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#4EC8C0",
    justifyContent: "center",
    alignItems: "center",
  },

  taskText: {
    color: "#fff",
    fontSize: 15,
    flex: 1,
  },

  taskTextCompleted: {
    color: "#7A7F87",
    textDecorationLine: "line-through",
  },

  deleteBtn: {
    padding: 4,
    marginLeft: 8,
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
  },
});