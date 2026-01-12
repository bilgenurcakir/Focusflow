import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SESSIONS_KEY = '@focusflow_sessions';
const SETTINGS_KEY = '@focusflow_settings';
const TASKS_KEY = '@focusflow_tasks';

// Session structure: { id, type, duration, taskName, date, timestamp }
// type: 'focus' | 'shortBreak' | 'longBreak'

export const sessionStorage = {
  // Save a new session
  async saveSession(session) {
    try {
      const sessions = await this.getSessions();
      const newSession = {
        id: Date.now().toString(),
        ...session,
        timestamp: session.timestamp || Date.now(),
      };
      sessions.push(newSession);
      await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      return newSession;
    } catch (error) {
      console.error('Error saving session:', error);
      return null;
    }
  },

  // Get all sessions
  async getSessions() {
    try {
      const data = await AsyncStorage.getItem(SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  },

  // Get sessions for a specific date range
  async getSessionsInRange(startDate, endDate) {
    try {
      const sessions = await this.getSessions();
      return sessions.filter(
        (session) =>
          session.timestamp >= startDate && session.timestamp <= endDate
      );
    } catch (error) {
      console.error('Error getting sessions in range:', error);
      return [];
    }
  },

  // Get recent sessions (last N sessions)
  async getRecentSessions(limit = 10) {
    try {
      const sessions = await this.getSessions();
      return sessions
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent sessions:', error);
      return [];
    }
  },

  // Calculate statistics
  async getStatistics() {
    try {
      const sessions = await this.getSessions();
      
      // Filter focus sessions only (pomodoros)
      const focusSessions = sessions.filter((s) => s.type === 'focus');
      
      // Total pomodoros
      const totalPomodoros = focusSessions.length;
      
      // Total focus time (in minutes)
      const totalFocusMinutes = focusSessions.reduce(
        (sum, session) => sum + (session.duration || 0),
        0
      );
      
      // Total focus time in hours
      const totalFocusHours = Math.floor(totalFocusMinutes / 60);
      
      // Calculate longest streak
      const longestStreak = this.calculateStreak(sessions);
      
      // Weekly progress (last 7 days)
      const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const weeklySessions = sessions.filter(
        (s) => s.timestamp >= oneWeekAgo && s.type === 'focus'
      );
      const weeklyFocusMinutes = weeklySessions.reduce(
        (sum, session) => sum + (session.duration || 0),
        0
      );
      
      // Time distribution
      const totalBreakMinutes = sessions
        .filter((s) => s.type === 'shortBreak' || s.type === 'longBreak')
        .reduce((sum, session) => sum + (session.duration || 0), 0);
      
      const totalMinutes = totalFocusMinutes + totalBreakMinutes;
      const focusPercentage =
        totalMinutes > 0 ? (totalFocusMinutes / totalMinutes) * 100 : 0;
      
      // Weekly breakdown (for the weekly progress chart)
      const weeklyBreakdown = this.getWeeklyBreakdown(sessions);
      
      return {
        totalPomodoros,
        totalFocusHours,
        totalFocusMinutes,
        longestStreak,
        weeklyFocusMinutes,
        focusPercentage,
        totalBreakMinutes,
        weeklyBreakdown,
      };
    } catch (error) {
      console.error('Error calculating statistics:', error);
      return {
        totalPomodoros: 0,
        totalFocusHours: 0,
        totalFocusMinutes: 0,
        longestStreak: 0,
        weeklyFocusMinutes: 0,
        focusPercentage: 0,
        totalBreakMinutes: 0,
        weeklyBreakdown: {},
      };
    }
  },

  // Calculate longest streak (consecutive days with at least one focus session)
  calculateStreak(sessions) {
    if (sessions.length === 0) return 0;
    
    const focusSessions = sessions.filter((s) => s.type === 'focus');
    if (focusSessions.length === 0) return 0;
    
    // Group sessions by date
    const sessionsByDate = {};
    focusSessions.forEach((session) => {
      const date = new Date(session.timestamp);
      const dateKey = date.toDateString();
      if (!sessionsByDate[dateKey]) {
        sessionsByDate[dateKey] = true;
      }
    });
    
    // Sort dates
    const dates = Object.keys(sessionsByDate)
      .map((dateStr) => new Date(dateStr).getTime())
      .sort((a, b) => b - a);
    
    if (dates.length === 0) return 0;
    
    // Calculate streak (check consecutive days from today backwards)
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < dates.length; i++) {
      const sessionDate = new Date(dates[i]);
      sessionDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor(
        (currentDate - sessionDate) / (1000 * 60 * 60 * 24)
      );
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  },

  // Get weekly breakdown for chart
  getWeeklyBreakdown(sessions) {
    const breakdown = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentSessions = sessions.filter(
      (s) => s.timestamp >= oneWeekAgo && s.type === 'focus'
    );
    
    recentSessions.forEach((session) => {
      const date = new Date(session.timestamp);
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[dayIndex];
      
      if (breakdown.hasOwnProperty(dayName)) {
        breakdown[dayName] += session.duration || 0;
      }
    });
    
    return breakdown;
  },

  // Clear all sessions (for testing/reset)
  async clearAllSessions() {
    try {
      await AsyncStorage.removeItem(SESSIONS_KEY);
    } catch (error) {
      console.error('Error clearing sessions:', error);
    }
  },

  // Settings storage
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Return default settings
      return {
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsBeforeLongBreak: 4,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        focus: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsBeforeLongBreak: 4,
      };
    }
  },

  async saveSettings(settings, taskName = null) {
    try {
      if (taskName) {
        // Save task-specific settings
        const allSettings = await AsyncStorage.getItem(SETTINGS_KEY);
        const parsed = allSettings ? JSON.parse(allSettings) : {};
        
        // Ensure taskSettings object exists
        if (!parsed.taskSettings) {
          parsed.taskSettings = {};
        }
        
        parsed.taskSettings[taskName] = settings;
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(parsed));
        console.log('Task-specific settings saved for:', taskName, settings);
      } else {
        // Save global settings
        await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  },

  async getTaskSettings(taskName) {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.taskSettings && parsed.taskSettings[taskName]) {
          console.log('Loaded task-specific settings for:', taskName, parsed.taskSettings[taskName]);
          return parsed.taskSettings[taskName];
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting task settings:', error);
      return null;
    }
  },

  // Task storage
  // Task structure: { id, text, completed, createdAt }
  async getTasks() {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      console.log(`Platform: ${Platform.OS}, Raw data:`, data);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks) {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  },

  async addTask(taskText) {
    try {
      const tasks = await this.getTasks();
      const newTask = {
        id: Date.now().toString(),
        text: taskText.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      tasks.unshift(newTask); // Add to beginning
      await this.saveTasks(tasks);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  },

  async deleteTask(taskId) {
    try {
      const tasks = await this.getTasks();
      const filtered = tasks.filter((task) => task.id !== taskId);
      await this.saveTasks(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  async toggleTaskCompletion(taskId) {
    try {
      const tasks = await this.getTasks();
      const updated = tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      await this.saveTasks(updated);
      return true;
    } catch (error) {
      console.error('Error toggling task completion:', error);
      return false;
    }
  },

  // Clear all tasks
  async clearAllTasks() {
    try {
      await AsyncStorage.removeItem(TASKS_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  },
};
