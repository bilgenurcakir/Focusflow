import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import Slider from '@react-native-community/slider';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function CycleSettingsModal({navigation}) {
  const [focus, setFocus] = useState(25);  // focus: Odak süresi (dakika)
  const [shortBreak, setShortBreak] = useState(5);// shortBreak: Kısa mola süresi (dakika)
  const [longBreak, setLongBreak] = useState(15);  // longBreak: Uzun mola süresi (dakika)
  const [sessions, setSessions] = useState(4); // sessions: Uzun mola öncesi seans sayısı

  return (
    // overlay: Modal'ın arka planı (yarı saydam siyah)
      <View style={styles.overlay}> 
      
        <View style={styles.container}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>Cycle Settings</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
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
             minimumValue={15}           // Minimum: 15 dakika
            maximumValue={60}           // Maximum: 60 dakika
            step={5}                    // Artış miktarı: 5'er dakika
            value={focus}               // Mevcut değer: focus state'i
            onValueChange={setFocus}    // Değer değişince setFocus çalışır
            minimumTrackTintColor="#4EC8C0" // Sol taraf: turkuaz
            maximumTrackTintColor="#2A2E35" // Sağ taraf: gri
            thumbTintColor="#D1D5DB"    // Kaydırıcı: açık gri
            />
          </View>

          <View style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.label}>Short Break</Text>
              <Text style={styles.value}>{shortBreak} min</Text>
            </View>
            <Slider
                   minimumValue={3}            // Minimum: 3 dakika
            maximumValue={15}           // Maximum: 15 dakika
            step={1}                    // Artış miktarı: 1'er dakika
            value={shortBreak}          // Mevcut değer
            onValueChange={setShortBreak} // Değiştiğinde setShortBreak çalışır
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
                minimumValue={10}           // Minimum: 10 dakika
            maximumValue={30}           // Maximum: 30 dakika
            step={5}                    // Artış miktarı: 5'er dakika
            value={longBreak}           // Mevcut değer
            onValueChange={setLongBreak} // Değiştiğinde setLongBreak çalışır
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
           minimumValue={2}            // Minimum: 2 seans
            maximumValue={6}            // Maximum: 6 seans
            step={1}                    // Artış miktarı: 1'er seans
            value={sessions}            // Mevcut değer
            onValueChange={setSessions} // Değiştiğinde setSessions çalışır
            minimumTrackTintColor="#4EC8C0"
            maximumTrackTintColor="#2A2E35"
            thumbTintColor="#D1D5DB"
            />
          </View>

          {/* DONE BUTTON */}
        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.goBack()}
        >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

        </View>
      </View>

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