import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

export default function StatisticsScreen() {
  const radius = 60;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.75; // %75

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
        <Text style={styles.headerTitle}>Statistics</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* TOP STATS */}
      <View style={styles.statsRow}>
        <StatCard title="Total Pomodoros" value="1,204" />
        <StatCard title="Total Focus Time" value="502h" />
        <StatCard title="Longest Streak" value="32d" />
      </View>

      {/* WEEKLY PROGRESS */}
      <Text style={styles.sectionTitle}>WEEKLY PROGRESS</Text>
      <View style={styles.weeklyBox}>
        <View style={styles.daysRow}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Text key={day} style={styles.dayText}>
              {day}
            </Text>
          ))}
        </View>
      </View>

      {/* TIME DISTRIBUTION */}
      <Text style={styles.sectionTitle}>TIME DISTRIBUTION</Text>
      <View style={styles.distributionBox}>
        <Svg width={160} height={160}>
          <Circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#2A2E35"
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#4EC8C0"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            strokeLinecap="round"
            fill="none"
            rotation="-90"
            origin="80,80"
          />
        </Svg>

        <View style={styles.percentCenter}>
          <Text style={styles.percentText}>75%</Text>
          <Text style={styles.percentSub}>Focus</Text>
        </View>

        <View style={styles.legend}>
          <LegendItem color="#4EC8C0" label="Focus Time" value="502h" />
          <LegendItem color="#2A2E35" label="Break Time" value="167h" />
        </View>
      </View>

      {/* RECENT SESSIONS */}
      <Text style={styles.sectionTitle}>RECENT SESSIONS</Text>

      <SessionItem
        title="Design System Documentation"
        time="25 min"
        date="Today, 2:45 PM"
        icon="stopwatch-outline"
      />
      <SessionItem
        title="Short Break"
        time="5 min"
        date="Today, 2:20 PM"
        icon="cafe-outline"
      />
      <SessionItem
        title="Develop Login Screen UI"
        time="25 min"
        date="Today, 1:55 PM"
        icon="stopwatch-outline"
      />
      <SessionItem
        title="Team Stand-up Meeting"
        time="15 min"
        date="Yesterday, 9:00 AM"
        icon="stopwatch-outline"
      />

      {/* SHARE BUTTON */}
      <TouchableOpacity style={styles.shareBtn}>
        <Ionicons name="share-outline" size={20} color="#0E1525" />
        <Text style={styles.shareText}>Share Statistics</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------- COMPONENTS ---------- */

const StatCard = ({ title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statTitle}>{title}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const LegendItem = ({ color, label, value }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <View>
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{value}</Text>
    </View>
  </View>
);

const SessionItem = ({ title, date, time, icon }) => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1525",
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
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
    backgroundColor: "#151B2B",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  statTitle: {
    color: "#A0A4AB",
    fontSize: 12,
    textAlign: "center",
  },

  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },

  sectionTitle: {
    marginTop: 30,
    color: "#A0A4AB",
    fontSize: 12,
    letterSpacing: 1.5,
  },

  weeklyBox: {
    height: 140,
    backgroundColor: "#151B2B",
    borderRadius: 20,
    marginTop: 12,
    justifyContent: "flex-end",
    padding: 15,
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  dayText: {
    color: "#6E737B",
    fontSize: 12,
  },

  distributionBox: {
    backgroundColor: "#151B2B",
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
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },

  percentSub: {
    color: "#A0A4AB",
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
    color: "#fff",
    fontSize: 14,
  },

  legendValue: {
    color: "#A0A4AB",
    fontSize: 12,
  },

  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151B2B",
    borderRadius: 16,
    padding: 15,
    marginTop: 12,
  },

  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F1F23",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  sessionTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  sessionDate: {
    color: "#A0A4AB",
    fontSize: 12,
    marginTop: 2,
  },

  sessionTime: {
    color: "#fff",
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
    color: "#0E1525",
    fontSize: 16,
    fontWeight: "700",
  },
});