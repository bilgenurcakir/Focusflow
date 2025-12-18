import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import Slider from "@react-native-community/slider";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function CycleSettingsModal({ visible, onClose }) {
  const [focus, setFocus] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [sessions, setSessions] = useState(4);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Cycle Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <FontAwesome name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SLIDER ITEM */}
          <View style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>Focus Session</Text>
              <Text style={styles.value}>{focus} min</Text>
            </View>
            <Slider
              minimumValue={15}
              maximumValue={60}
              step={5}
              value={focus}
              onValueChange={setFocus}
              minimumTrackTintColor="#4EC8C0"
              maximumTrackTintColor="#2A2E35"
              thumbTintColor="#D1D5DB"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>Short Break</Text>
              <Text style={styles.value}>{shortBreak} min</Text>
            </View>
            <Slider
              minimumValue={3}
              maximumValue={15}
              step={1}
              value={shortBreak}
              onValueChange={setShortBreak}
              minimumTrackTintColor="#4EC8C0"
              maximumTrackTintColor="#2A2E35"
              thumbTintColor="#D1D5DB"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>Long Break</Text>
              <Text style={styles.value}>{longBreak} min</Text>
            </View>
            <Slider
              minimumValue={10}
              maximumValue={30}
              step={5}
              value={longBreak}
              onValueChange={setLongBreak}
              minimumTrackTintColor="#4EC8C0"
              maximumTrackTintColor="#2A2E35"
              thumbTintColor="#D1D5DB"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>Sessions before Long Break</Text>
              <Text style={styles.value}>{sessions}</Text>
            </View>
            <Slider
              minimumValue={2}
              maximumValue={6}
              step={1}
              value={sessions}
              onValueChange={setSessions}
              minimumTrackTintColor="#4EC8C0"
              maximumTrackTintColor="#2A2E35"
              thumbTintColor="#D1D5DB"
            />
          </View>

          {/* DONE BUTTON */}
          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "#0E1525",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  closeBtn: {
    position: "absolute",
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2A2E35",
    justifyContent: "center",
    alignItems: "center",
  },

  item: {
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    color: "#fff",
    fontSize: 15,
  },

  value: {
    color: "#A0A4AB",
    fontSize: 14,
  },

  doneBtn: {
    marginTop: 10,
    backgroundColor: "#4EC8C0",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },

  doneText: {
    color: "#0E1525",
    fontSize: 18,
    fontWeight: "700",
  },
});