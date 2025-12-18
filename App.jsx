import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// SVG kütüphanesi
import Svg, { Circle, G } from 'react-native-svg'; 
// Ionicons yerine FontAwesome kullanmak için DEĞİŞTİRİLDİ
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 



// --- Sabitler ---
const { width } = Dimensions.get('window');
const initialTimeInSeconds = 25 * 60; // 25 dakika
const radius = 120;
const stroke = 18;
const circumference = 2 * Math.PI * radius;
const primaryColor = '#4EC8C0'; // Turkuaz
const darkBg = '#0E1525';
const darkCard = '#151B2B';
const darkControl = '#1F1F23';
const secondaryColor = '#2A2E35'; // Koyu arka plan halka rengi

export default function TimerScreen() {
  const [time, setTime] = useState(initialTimeInSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(1); // 1 = %100
  const [tasksVisible, setTasksVisible] = useState(false);

  // Zamanı Biçimlendirme (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // SVG Çevrim Ofsetini Hesaplama
  const calculateOffset = useCallback((currentTime) => {
    if (currentTime <= 0) return circumference; // Tamamlandığında çubuğu kapat
    const ratio = currentTime / initialTimeInSeconds;
    return circumference * (1 - ratio);
  }, [circumference]);

  // Başlangıç Hesaplaması
  useEffect(() => {
    setProgress(calculateOffset(time));
  }, [time, calculateOffset]);

  // Zamanlayıcı Mantığı
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
      // Zaman bittiğinde yapılacaklar...
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const handleToggle = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setTime(initialTimeInSeconds);
    setIsRunning(false);
  };

  const handleSwitchSession = () => {
    // Oturum değiştirme mantığı
    console.log("Oturum değiştirildi!");
  };

  const handleGoToStats = () => {
    // İstatistik sayfasına gitme mantığı
    console.log("İstatistiklere gidiliyor!");
  };

  const handleGoToSettings = () => {
    // Ayarlar sayfasına gitme mantığı
    console.log("Ayarlara gidiliyor!");
  };

  // SVG'nin düzgün görünmesi için boyut ve merkez hesaplaması
  const svgSize = radius * 2 + stroke * 2;
  const center = svgSize / 2;


  return (
    <View style={styles.container}>

      {/* HEADER (BAŞLIK ve İkonlar) */}
      <View style={styles.header}>
        
        {/* Sol: İstatistik İkonu */}
        <TouchableOpacity 
          onPress={handleGoToStats} 
          style={styles.iconButton}
          aria-label="İstatistikler"
        >
          {/* İkon DEĞİŞTİRİLDİ */}
          <FontAwesome name="bar-chart" size={28} color="#fff" /> 
        </TouchableOpacity>

        {/* Orta: Başlık (Mutlak Konumlandırma) */}
        <Text style={styles.title}>Focusflow</Text>
        
        {/* Sağ: Ayarlar İkonu */}
        <TouchableOpacity 
          onPress={handleGoToSettings} 
          style={styles.iconButton}
          aria-label="Ayarlar"
        >
          {/* İkon DEĞİŞTİRİLDİ */}
          <FontAwesome name="cog" size={28} color="#fff" /> 
        </TouchableOpacity>
      </View>

      {/* TIMER (ZAMANLAYICI) */}
      <View style={styles.timerContainer}>
        {/* SVG CONTAINER */}
        <Svg 
          width={svgSize} 
          height={svgSize} 
          viewBox={`0 0 ${svgSize} ${svgSize}`} 
          style={StyleSheet.absoluteFillObject}
        >
          {/* Grubu -90 derece döndürerek başlangıç noktasını saat 12'ye getirir */}
          <G rotation="-90" origin={`${center}, ${center}`}>
            {/* Arka halka */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={secondaryColor}
              strokeWidth={stroke}
              fill="none"
            />

            {/* İlerleme halkası */}
            <Circle
              cx={center}
              cy={center}
              r={radius}
              stroke={primaryColor}
              strokeWidth={stroke}
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
    
        <Text style={styles.timerText}>{formatTime(time)}</Text>
      </View>

      {/* FOCUS SESSION LABEL (ODAK SEANSI ETİKETİ) */}
      <Text style={styles.sessionLabel}>FOCUS SESSION</Text>

      {/* DROPDOWN (Proje/Görev Seçici) */}
      <TouchableOpacity style={styles.dropdown} aria-label="Görevi değiştir">
        <Text style={styles.dropdownText}>Studying Mobile Programming</Text>
        {/* İkon DEĞİŞTİRİLDİ (Aynı kaldı) */}
        <FontAwesome name="chevron-down" size={22} color="#fff" /> 
      </TouchableOpacity>

      {/* BUTTON GROUP (DÜĞME GRUBU) */}
      <View style={styles.controls}>
        {/* Sıfırla Düğmesi */}
        <TouchableOpacity 
          onPress={handleReset} 
          style={styles.controlBtn}
          aria-label="Zamanlayıcıyı Sıfırla"
        >
          {/* İkon DEĞİŞTİRİLDİ (Aynı kaldı) */}
          <FontAwesome name="refresh" size={26} color="#fff" /> 
        </TouchableOpacity>

        {/* Play/Pause Button (Turkuaz Halka/Dolgu, Beyaz İkon) */}
        <TouchableOpacity 
          onPress={handleToggle} 
          style={styles.pauseBtn}
          aria-label={isRunning ? "Zamanlayıcıyı Durdur" : "Zamanlayıcıyı Başlat"}
        >
          {/* İkon DEĞİŞTİRİLDİ (Aynı kaldı) */}
          <FontAwesome 
            name={isRunning ? "pause" : "play"} 
            size={40} 
            color="#fff" 
            style={isRunning ? {} : { marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Session Switch Button (Mola/Seans Değiştirme Düğmesi) - Turkuaz Daireli */}
        <TouchableOpacity 
          onPress={handleSwitchSession} 
          style={styles.sessionSwitchBtn}
          aria-label="Molaya Geç"
        >
            {/* İkon DEĞİŞTİRİLDİ */}
            <FontAwesome name="hourglass-start" size={26} color="#fff" /> 
        </TouchableOpacity>
      </View>

      {/* TO-DO LIST NAV (YAPILACAKLAR LİSTESİ NAVİGASYONU) */}
      <TouchableOpacity style={styles.todoNav} aria-label="Yapılacaklar listesini aç">
        {/* İkon DEĞİŞTİRİLDİ */}
        <FontAwesome name="list" size={20} color="#fff" /> 
        <Text style={styles.todoText}>To-Do List</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkBg,
    alignItems: 'center',
    paddingTop: 60,
  },
  header: {
    width: width * 0.9, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    zIndex: 0, 
  },
  iconButton: {
    zIndex: 1, 
    padding: 5,
  },
  timerContainer: {
    marginTop: 40,
    width: radius * 2 + stroke * 2,
    height: radius * 2 + stroke * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionLabel: {
    marginTop: 35,
    letterSpacing: 2,
    color: primaryColor,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    width: width * 0.85,
    marginTop: 10,
    backgroundColor: darkCard,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
    marginHorizontal: -17.5, 
  },
  controlBtn: {
    width: 60,
    height: 60,
    backgroundColor: darkControl,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 17.5, 
  },
  pauseBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: primaryColor,
    marginHorizontal: 17.5,
    borderColor: primaryColor,
    borderWidth: 3,
    shadowColor: primaryColor,
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  sessionSwitchBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkControl,
    marginHorizontal: 17.5,
    borderColor: primaryColor,
    borderWidth: 3,
  },
  todoNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  todoText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 15,
  },
}); 