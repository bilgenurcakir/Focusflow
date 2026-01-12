import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { sessionStorage } from "../utils/sessionStorage";
import { ThemeContext } from "../context/ThemeContext";

export default function MyTasksModal({ navigation }) 
{
  const theme = useContext(ThemeContext);
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
    try {
      const loadedTasks = await sessionStorage.getTasks();
      console.log('Loaded tasks:', loadedTasks ? loadedTasks.length : 0, loadedTasks);
      setTasks(Array.isArray(loadedTasks) ? loadedTasks : []);
    } catch (err) {
      console.error('Error loading tasks:', err);
      Alert.alert('Error', 'Could not load tasks.');
      setTasks([]);
    }
  };

  const handleAddTask = async () => {
    const trimmed = newTask.trim();
    if (!trimmed) return;

    try {
      const added = await sessionStorage.addTask(trimmed);
      if (added) {
        console.log('Task added:', added);
        setNewTask("");
        loadTasks(); // Reload to get updated list
      } else {
        console.warn('Failed to add task');
        Alert.alert('Error', 'Could not add task. Please try again.');
      }
    } catch (err) {
      console.error('Error adding task:', err);
      Alert.alert('Error', 'Could not add task. Please try again.');
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

  // Debug: log tasks whenever they change
  useEffect(() => {
    console.log('Tasks state changed:', tasks.length, tasks);
  }, [tasks]);

  const styles = getStyles(theme);

  // Separate completed and active tasks
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  // Debug: log filtered tasks
  console.log('Active tasks:', activeTasks);
  console.log('Completed tasks:', completedTasks);

  return (
  
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* HEADER */}
          <View style={styles.header}>
<TouchableOpacity
  onPress={navigation.goBack}
  style={styles.closeBtn}
>
              <Ionicons name="close" size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>My Tasks</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* DEBUG: show tasks count and sample items */}
          <View style={styles.debug}>
            <Text style={styles.debugText}>{`Tasks: ${tasks.length} | Active: ${activeTasks.length}`}</Text>
            {activeTasks.slice(0,3).map((t) => (
              <Text key={t.id} style={styles.debugItem}>{t.text}</Text>
            ))}
          </View>

          {/* ADD TASK */}
          <View style={styles.addTask}>
            <TextInput
              placeholder="Add new task..."
              placeholderTextColor={theme.colors.textSecondary}
              style={styles.input}
              value={newTask}
              onChangeText={setNewTask}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={handleAddTask}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Enter') {
                  handleAddTask();
                }
              }}
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
              <Ionicons name="add" size={26} color="#0E1525" />
            </TouchableOpacity>
          </View>

          {/* TASKS LIST */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          >
            {/* Active Tasks */}
            {activeTasks.map((task) => (
              <TaskItem
                key={task.id}
                text={task.text}
                completed={task.completed}
                onToggle={() => handleToggleComplete(task.id)}
                onDelete={() => handleDeleteTask(task.id)}
                styles={styles}
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
                      styles={styles}
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
const TaskItem = ({ text, completed, onToggle, onDelete, styles }) => {
  console.log('Rendering TaskItem:', text, 'Completed:', completed);
  return (
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
};

/* ---------- STYLES ---------- */

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
    maxHeight: "90%",
  },

  scrollView: {
    flex: 1,
    minHeight: 200,
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

  addTask: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    paddingHorizontal: 15,
    marginBottom: 20,
  },

  input: {
    flex: 1,
    color: theme.colors.text,
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
    backgroundColor: theme.colors.surface,
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
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    fontSize: 15,
    flex: 1,
  },

  taskTextCompleted: {
    color: theme.colors.textSecondary,
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
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2,
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
  },

  /* Debug */
  debug: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 12,
    marginBottom: 12,
  },
  debugText: {
    color: '#4EC8C0',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '600',
  },
  debugItem: {
    color: theme.colors.text,
    fontSize: 13,
  },
});