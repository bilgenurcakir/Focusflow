import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import { sessionStorage } from "../utils/sessionStorage";
import { ThemeContext } from "../context/ThemeContext";

export default function StatisticsScreen({navigation}) {
  const theme = useContext(ThemeContext);
  const [statistics, setStatistics] = useState({
    totalPomodoros: 0,
    totalFocusHours: 0,
    totalFocusMinutes: 0,
    longestStreak: 0,
    focusPercentage: 0,
    totalBreakMinutes: 0,
    weeklyBreakdown: {},
  });
  const [recentSessions, setRecentSessions] = useState([]);

  const radius = 60; // Dairenin yarıçapı (piksel)
  const stroke = 14; // Çizgi kalınlığı
  const circumference = 2 * Math.PI * radius; // Çevrenin uzunluğu (matematik)

  // Load statistics when screen is focused
  useEffect(() => {
    loadStatistics();
    
    // Reload when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadStatistics();
    });

    return unsubscribe;
  }, [navigation]);

  const loadStatistics = async () => {
    const stats = await sessionStorage.getStatistics();
    setStatistics(stats);
    
    const recent = await sessionStorage.getRecentSessions(10);
    setRecentSessions(recent);
  };

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sessionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = today - sessionDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
    
    if (diffDays === 0) {
      return `Today, ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${timeStr}`;
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long', hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get session icon based on type
  const getSessionIcon = (type) => {
    switch (type) {
      case 'focus':
        return 'stopwatch-outline';
      case 'shortBreak':
      case 'longBreak':
        return 'cafe-outline';
      default:
        return 'stopwatch-outline';
    }
  };

  // Get session title based on type
  const getSessionTitle = (session) => {
    if (session.type === 'focus') {
      return session.taskName || 'Focus Session';
    } else if (session.type === 'shortBreak') {
      return 'Short Break';
    } else if (session.type === 'longBreak') {
      return 'Long Break';
    }
    return 'Session';
  };

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const progress = statistics.focusPercentage / 100; // Convert percentage to ratio
  const styles = getStyles(theme);

  return ( //showsVerticalScrollIndicator=kaydırma çubuğunu gizle
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}> 
      {/* HEADER */}
      <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.navigate("Timer")}>
  <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
</TouchableOpacity>
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* TOP STATS */}
      <View style={styles.statsRow}>
        <StatCard title="Total Pomodoros" value={formatNumber(statistics.totalPomodoros)} styles={styles} />
        <StatCard title="Total Focus Time" value={formatDuration(statistics.totalFocusMinutes)} styles={styles} />
        <StatCard title="Longest Streak" value={`${statistics.longestStreak}d`} styles={styles} />
      </View>

      {/* WEEKLY PROGRESS */}
      <Text style={styles.sectionTitle}>WEEKLY PROGRESS</Text>
      <View style={styles.weeklyBox}>
        <View style={styles.daysRow}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
            const minutes = statistics.weeklyBreakdown[day] || 0;
            const allMinutes = Object.values(statistics.weeklyBreakdown);
            const maxMinutes = allMinutes.length > 0 ? Math.max(...allMinutes, 1) : 1;
            const heightPercent = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;
            const barHeight = Math.max(heightPercent, minutes > 0 ? 8 : 0); // Minimum 8% if there's data
            
            return (
              <View key={day} style={styles.dayColumn}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      { 
                        height: `${barHeight}%`,
                        opacity: minutes > 0 ? 1 : 0.3,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* TIME DISTRIBUTION */}
      <Text style={styles.sectionTitle}>TIME DISTRIBUTION</Text>
      <View style={styles.distributionBox}>
        <Svg width={160} height={160}>
          <Circle
            cx="80"                  // Merkez X: 80 (160'ın yarısı)
            cy="80"                  // Merkez Y: 80
            r={radius}               // Yarıçap: 60
            stroke="#2A2E35"         // Çizgi rengi: gri
            strokeWidth={stroke}     // Kalınlık: 14
            fill="none"              // İç dolgu yok
          />
          <Circle
            cx="80"
            cy="80"
            r={radius}
                      stroke="#4EC8C0"         // Turkuaz
            strokeWidth={stroke}
            strokeDasharray={circumference}  // Kesikli çizgi paterni
            // strokeDashoffset: çizginin ne kadarı boş
            // circumference * (1 - progress): %75 dolu, %25 boş
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"    // Uçlar yuvarlak
            fill="none"
            rotation="-90"           // -90 derece döndür (saat 12'den başla)
            origin="80,80"           // Dönme merkezi

          />
        </Svg>

        <View style={styles.percentCenter}>
          <Text style={styles.percentText}>{Math.round(statistics.focusPercentage)}%</Text>
          <Text style={styles.percentSub}>Focus</Text>
        </View>

        <View style={styles.legend}>
          <LegendItem 
            color="#4EC8C0" 
            label="Focus Time" 
            value={formatDuration(statistics.totalFocusMinutes)} 
            styles={styles}
          />
          <LegendItem 
            color="#2A2E35" 
            label="Break Time" 
            value={formatDuration(statistics.totalBreakMinutes)} 
            styles={styles}
          />
        </View>
      </View>

      {/* RECENT SESSIONS */}
      <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>

      {recentSessions.length > 0 ? (
        recentSessions.map((session) => (
          <SessionItem
            key={session.id}
            title={getSessionTitle(session)}
            time={`${session.duration} min`}
            date={formatDate(session.timestamp)}
            icon={getSessionIcon(session.type)}
            styles={styles}
          />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No sessions yet</Text>
          <Text style={styles.emptyStateSubtext}>Complete your first timer session to see statistics here!</Text>
        </View>
      )}

      {/* SHARE BUTTON */}
  <TouchableOpacity
  style={styles.shareBtn}
  onPress={() => navigation.navigate("ShareModal")}
>
        <Ionicons name="share-outline" size={20} color="#0E1525" />
        <Text style={styles.shareText}>Share Statistics</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- COMPONENTS ---------- */

// StatCard: İstatistik kartı componenti
// { title, value, styles }: component'e gönderilen prop'lar
// Örnek: <StatCard title="Total Pomodoros" value="1,204" styles={styles} />
const StatCard = ({ title, value, styles }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// LegendItem: Legend elemanı (renkli nokta + etiket + değer)
// { color, label, value, styles }: component'e gönderilen prop'lar
const LegendItem = ({ color, label, value, styles }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <View>
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  </View>
);

// SessionItem: Seans elemanı (ikon + başlık + tarih + süre)
// { title, date, time, icon, styles }: component'e gönderilen prop'lar
const SessionItem = ({ title, date, time, icon, styles }) => (
  <View style={styles.sessionItem}>
    <View style={styles.sessionIcon}>
      <Ionicons name={icon} size={22} color="#4EC8C0" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.sessionTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.sessionDate}>{date}</Text>
    </View>
    <Text style={styles.sessionTime}>{time}</Text>
  </View>
);

/* ---------- STYLES ---------- */

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },

  statCard: {
    width: "31%",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  statTitle: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },

  statValue: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },

  sectionTitle: {
    marginTop: 30,
    color: theme.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.5,
  },

  weeklyBox: {
    height: 140,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginTop: 12,
    justifyContent: "flex-end",
    padding: 15,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: "100%",
  },

  dayColumn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },

  barContainer: {
    width: "80%",
    height: 80,
    justifyContent: "flex-end",
    marginBottom: 8,
  },

  bar: {
    width: "100%",
    backgroundColor: "#4EC8C0",
    borderRadius: 4,
  },

  dayText: {
    color: theme.colors.textTertiary,
    fontSize: 12,
  },

  distributionBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginTop: 12,
    padding: 20,
    alignItems: "center",
  },

  percentCenter: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },

  percentText: {
    color: theme.colors.text,
    fontSize: 26,
    fontWeight: "700",
  },

  percentSub: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },

  legend: {
    marginTop: 20,
    width: "100%",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  legendLabel: {
    color: theme.colors.text,
    fontSize: 14,
  },

  legendValue: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },

  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 15,
    marginTop: 12,
  },

  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sessionTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "600",
  },

  sessionDate: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  sessionTime: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "600",
  },

  shareBtn: {
    backgroundColor: "#4EC8C0",
    marginVertical: 30,
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  shareText: {
    color: theme.darkMode ? "#0E1525" : "#000",
    fontSize: 16,
    fontWeight: "700",
  },

  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginTop: 12,
  },

  emptyStateText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptyStateSubtext: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
  },
});