import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
// SVG kütüphanesi
import Svg, { Circle, G } from 'react-native-svg'; 

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { sessionStorage } from '../utils/sessionStorage';
import { ThemeContext } from '../context/ThemeContext';



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


export default function TimerScreen({ navigation }) {
  const theme = useContext(ThemeContext);
  const [time, setTime] = useState(initialTimeInSeconds); // kalan süre
  const [isRunning, setIsRunning] = useState(false);  // timer aktif mi
  const [progress, setProgress] = useState(1);  // ilerleme çubuğu için 0-1
  const [tasksVisible, setTasksVisible] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [taskName, setTaskName] = useState('');
  const [initialDuration, setInitialDuration] = useState(initialTimeInSeconds / 60); // in minutes

  // Load saved task name on mount
  useEffect(() => {
    loadTaskName();
  }, []);

  const loadTaskName = async () => {
    // Try to load the last used task name from storage
    // For now, we'll keep the default, but this could be persisted
  };

  const handleTaskSelect = (selectedTaskName) => {
    // If a task is selected, use it. Otherwise keep current task name (custom)
    if (selectedTaskName && selectedTaskName.trim()) {
      setTaskName(selectedTaskName.trim());
      // Load task-specific settings when task is selected
      loadTaskSettings(selectedTaskName.trim());
    }
    // If empty string is passed (custom task selected), keep current task name
  };

  const loadTaskSettings = async (taskName) => {
    const taskSettings = await sessionStorage.getTaskSettings(taskName);
    if (taskSettings) {
      setSettings(taskSettings);
      updateTimerForSessionType(sessionType, taskSettings);
      console.log('Loaded task-specific settings for:', taskName, taskSettings);
    }
  };
  const [settings, setSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsBeforeLongBreak: 4,
  });
  const [focusSessionCount, setFocusSessionCount] = useState(0); // Track focus sessions for long break
  const sessionStartTime = useRef(null);
  const hasSavedSession = useRef(false);
  const initialTimeWhenStarted = useRef(null); // Track initial time when timer started

  const settingsInitialized = useRef(false);
  const previousSettings = useRef(null);
  const shouldPreserveTimer = useRef(false); // Track if we should preserve timer state

  // Load settings when component mounts and when screen focuses
  useEffect(() => {
    const initializeSettings = async () => {
      const loadedSettings = await sessionStorage.getSettings();
      
      // Load task-specific settings if a task is selected
      if (taskName && taskName.trim()) {
        const taskSettings = await sessionStorage.getTaskSettings(taskName);
        if (taskSettings) {
          setSettings(taskSettings);
          previousSettings.current = taskSettings;
          if (!settingsInitialized.current) {
            updateTimerForSessionType(sessionType, taskSettings);
            settingsInitialized.current = true;
          } else if (!isRunning) {
            updateTimerForSessionType(sessionType, taskSettings);
          }
          return;
        }
      }
      
      // Only update timer if settings have actually changed
      const settingsChanged = !previousSettings.current || 
        JSON.stringify(previousSettings.current) !== JSON.stringify(loadedSettings);
      
      // On first load, initialize the timer
      if (!settingsInitialized.current) {
        setSettings(loadedSettings);
        previousSettings.current = loadedSettings;
        updateTimerForSessionType(sessionType, loadedSettings);
        settingsInitialized.current = true;
        shouldPreserveTimer.current = false;
      } else if (settingsChanged && !isRunning) {
        // Settings changed - update timer only if not running
        // This happens when user changes settings in the settings modal
        setSettings(loadedSettings);
        previousSettings.current = loadedSettings;
        updateTimerForSessionType(sessionType, loadedSettings);
        shouldPreserveTimer.current = false; // Reset flag after updating
      } else {
        // Just update settings state without resetting timer
        // This happens when returning from another screen or when settings haven't changed
        setSettings(loadedSettings);
        previousSettings.current = loadedSettings;
      }
    };
    
    initializeSettings();
    
    const unsubscribe = navigation.addListener('focus', () => {
      // When returning to screen, preserve timer state
      shouldPreserveTimer.current = true;
      initializeSettings();
    });

    return unsubscribe;
  }, [navigation, sessionType, isRunning, updateTimerForSessionType, taskName]);


  // Update timer duration based on session type and settings
  const updateTimerForSessionType = useCallback((type, currentSettings) => {
    let durationInMinutes;
    switch (type) {
      case 'focus':
        durationInMinutes = currentSettings.focus;
        break;
      case 'shortBreak':
        durationInMinutes = currentSettings.shortBreak;
        break;
      case 'longBreak':
        durationInMinutes = currentSettings.longBreak;
        break;
      default:
        durationInMinutes = currentSettings.focus;
    }
    
    const durationInSeconds = durationInMinutes * 60;
    setInitialDuration(durationInMinutes);
    setTime(durationInSeconds);
  }, []);

  // Don't auto-update timer when settings change unless explicitly needed
  // Timer should only be reset on manual session switch or explicit reset

  // Zamanı Biçimlendirme (MM:SS)(25:00)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // SVG Çevrim Ofsetini Hesaplama
  const calculateOffset = useCallback((currentTime) => {
    if (currentTime <= 0) return circumference; // Tamamlandığında çubuğu kapat
    const currentInitial = initialDuration * 60; // Convert to seconds
    const ratio = currentTime / currentInitial;
    return circumference * (1 - ratio);
  }, [circumference, initialDuration]);

  // Başlangıç Hesaplaması
  useEffect(() => {
    setProgress(calculateOffset(time));
  }, [time, calculateOffset, initialDuration]);

  // Track session start time
  useEffect(() => {
    if (isRunning && !sessionStartTime.current) {
      sessionStartTime.current = Date.now();
      initialTimeWhenStarted.current = time; // Save the initial time when timer starts
      hasSavedSession.current = false; // Reset flag when starting a new session
      console.log('Timer started, session start time set, initial time:', time);
    } else if (!isRunning && sessionStartTime.current && time > 0) {
      // If timer is paused, keep the start time but don't reset the save flag
      // (so completed sessions stay saved)
    }
  }, [isRunning, time]);

  // Zamanlayıcı Mantığı
  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime - 1;
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  // Handle timer completion when time reaches 0
  useEffect(() => {
    if (time === 0 && !hasSavedSession.current) {
      // Ensure timer is stopped
      if (isRunning) {
        setIsRunning(false);
      }
      
      // Only save if we have a session start time (meaning timer was actually running)
      if (sessionStartTime.current) {
        // Use setTimeout to ensure state is fully updated
        setTimeout(() => {
          saveSessionOnComplete();
        }, 100);
      }
    }
  }, [time, isRunning, saveSessionOnComplete]);

  // Save session when timer completes
  const saveSessionOnComplete = useCallback(async () => {
    // Prevent multiple saves
    if (hasSavedSession.current) {
      console.log('Session already saved, skipping...');
      return;
    }
    
    // Mark as saving immediately to prevent duplicate calls
    hasSavedSession.current = true;
    
    const durationInMinutes = initialDuration;
    const startTime = sessionStartTime.current;
    const initialTime = initialTimeWhenStarted.current;
    
    // Calculate elapsed time
    let elapsedTime;
    if (startTime && initialTime !== null && initialTime > 0) {
      // Calculate based on how much time was used (initialTime - currentTime)
      // Since timer counts down, this is the most accurate method
      const timeUsedSeconds = initialTime - time; // How many seconds were used
      const timeUsedMinutes = Math.floor(timeUsedSeconds / 60);
      
      // Also calculate based on real elapsed time
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      
      // Use the maximum of both to ensure accuracy
      elapsedTime = Math.max(timeUsedMinutes, elapsedMinutes);
      
      console.log('Time calculation:', {
        initialTimeSeconds: initialTime,
        currentTimeSeconds: time,
        timeUsedSeconds,
        timeUsedMinutes,
        elapsedSeconds,
        elapsedMinutes,
        finalElapsedTime: elapsedTime
      });
      
      // If timer reached 0 and we have a valid initial time, trust the countdown
      // Use the full duration if calculations seem off
      if (time <= 0 && initialTime > 0) {
        // Timer completed - use the initial duration
        const fullDurationSeconds = initialDuration * 60;
        if (Math.abs(timeUsedSeconds - fullDurationSeconds) < 60) {
          // Within 1 minute of expected, use calculated value
          elapsedTime = Math.max(elapsedTime, durationInMinutes);
        } else {
          // Otherwise use full duration as fallback
          elapsedTime = durationInMinutes;
          console.log('Using full duration as timer completed:', elapsedTime);
        }
      }
      
      // Final safety check: if elapsed time is still 0 or too small, use the full duration
      if (elapsedTime < 1 && durationInMinutes > 0) {
        elapsedTime = durationInMinutes;
        console.log('Elapsed time too small, using full duration:', elapsedTime);
      }
    } else {
      // No start time or initial time recorded, use the full duration as fallback
      elapsedTime = durationInMinutes;
      console.log('No valid session tracking found, using full duration:', elapsedTime);
    }

    console.log('Saving session:', { 
      sessionType, 
      elapsedTime, 
      durationInMinutes, 
      taskName, 
      startTime: startTime ? new Date(startTime).toISOString() : 'none',
      now: new Date().toISOString()
    });

    // Only save if at least 80% of the session was completed
    const minCompletionTime = durationInMinutes * 0.8;
    if (elapsedTime < minCompletionTime) {
      console.log('Session too short, not saving:', elapsedTime, '<', minCompletionTime);
      sessionStartTime.current = null;
      hasSavedSession.current = false; // Reset so it can be tried again
      return;
    }

    try {
      await sessionStorage.saveSession({
        type: sessionType,
        duration: elapsedTime,
        taskName: taskName,
        date: new Date().toISOString(),
      });
      console.log('Session saved successfully!');
      sessionStartTime.current = null;
      
      // Auto-switch to next session type after completion
      let nextType;
      let shouldResetCount = false;
      
      if (sessionType === 'focus') {
        // Increment focus session count and decide next break type
        const newCount = focusSessionCount + 1;
        setFocusSessionCount(newCount);
        
        // After focus, decide between short break or long break
        if (newCount >= settings.sessionsBeforeLongBreak) {
          nextType = 'longBreak';
          shouldResetCount = true;
        } else {
          nextType = 'shortBreak';
        }
      } else {
        // After break, go back to focus
        nextType = 'focus';
      }
      
      if (shouldResetCount) {
        setFocusSessionCount(0);
      }
      
      // Switch to next session type
      setTimeout(() => {
        setSessionType(nextType);
        updateTimerForSessionType(nextType, settings);
        hasSavedSession.current = false; // Reset for next session
      }, 500); // Small delay to ensure state is updated
      
      // Optional: Show completion alert
      // Alert.alert('Session Complete!', `Great job completing your ${sessionType} session!`);
    } catch (error) {
      console.error('Error saving session:', error);
      hasSavedSession.current = false; // Reset on error so it can be retried
      sessionStartTime.current = startTime; // Restore start time on error
    }
  }, [sessionType, initialDuration, taskName, focusSessionCount, settings, updateTimerForSessionType]);

  const handleToggle = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    updateTimerForSessionType(sessionType, settings);
    setIsRunning(false);
    sessionStartTime.current = null;
    initialTimeWhenStarted.current = null;
    hasSavedSession.current = false; // Reset flag so session can be saved after reset
  };

  // Debug function to instantly complete timer
  const handleDebugComplete = () => {
    // Ensure we have a session start time for proper tracking
    if (!sessionStartTime.current) {
      sessionStartTime.current = Date.now() - (initialDuration * 60 * 1000); // Set start time to make it look like we ran for the full duration
    }
    
    // Ensure we have initial time tracked
    if (initialTimeWhenStarted.current === null && time > 0) {
      initialTimeWhenStarted.current = time;
    } else if (initialTimeWhenStarted.current === null) {
      // If time is already 0, set initial time to the full duration
      initialTimeWhenStarted.current = initialDuration * 60;
    }
    
    // Stop timer and set to 0 - this will trigger saveSessionOnComplete
    setIsRunning(false);
    setTime(0);
    hasSavedSession.current = false; // Reset to allow saving
  };

  const handleSwitchSession = () => {
    if (isRunning) {
      setIsRunning(false);
    }
    
    // Switch session type based on current type
    let nextType;
    if (sessionType === 'focus') {
      // After focus, decide between short break or long break
      if (focusSessionCount >= settings.sessionsBeforeLongBreak - 1) {
        nextType = 'longBreak';
        setFocusSessionCount(0); // Reset counter after long break
      } else {
        nextType = 'shortBreak';
      }
    } else {
      // After break, go back to focus
      nextType = 'focus';
    }
    
    setSessionType(nextType);
    shouldPreserveTimer.current = false; // Allow timer reset on manual switch
    updateTimerForSessionType(nextType, settings);
    sessionStartTime.current = null;
    hasSavedSession.current = false;
  };



  // SVG'nin düzgün görünmesi için boyut ve merkez hesaplaması
  const svgSize = radius * 2 + stroke * 2;
  const center = svgSize / 2;


  const styles = getStyles(theme);

  return (
    <View style={styles.container}>

      {/* HEADER (BAŞLIK ve İkonlar) */}
      <View style={styles.header}>
        
        {/* Sol: İstatistik İkonu */}
<TouchableOpacity 
  onPress={() => navigation.navigate("Statistic")} 
  style={styles.iconButton}
  aria-label="İstatistikler"
>
          
          <FontAwesome name="bar-chart" size={28} color={theme.colors.text} /> 
        </TouchableOpacity>

        {/* Orta: Başlık (Mutlak Konumlandırma) */}
        <Text style={styles.title}>Focusflow</Text>
        
        {/* Sağ: Ayarlar İkonu */}
<TouchableOpacity 
  onPress={() => navigation.navigate("Setting")} 
  style={styles.iconButton}
  aria-label="Ayarlar"
>

          <FontAwesome name="cog" size={28} color={theme.colors.text} /> 
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
      <Text style={styles.sessionLabel}>
        {sessionType === 'focus' ? 'FOCUS SESSION' : 
         sessionType === 'shortBreak' ? 'SHORT BREAK' : 
         'LONG BREAK'}
      </Text>

      {/* TASK SELECTION AND SETTINGS ROW */}
      <View style={styles.taskRow}>
        {/* DROPDOWN (Task Seçici) */}
        <TouchableOpacity
          style={styles.dropdown}
          aria-label="Select Task"
          onPress={() =>
            navigation.navigate("TaskSelectionModal", {
              currentTaskName: taskName,
              onTaskSelect: handleTaskSelect,
            })
          }
        >
          <Text style={styles.dropdownText} numberOfLines={1}>
            {taskName}
          </Text>
          <FontAwesome name="chevron-down" size={18} color={theme.colors.text} />
        </TouchableOpacity>

        {/* SETTINGS BUTTON */}
        <TouchableOpacity
          style={styles.settingsBtn}
          aria-label="Timer Settings"
          onPress={() => navigation.navigate("CycleModal", { taskName })}
        >
          <FontAwesome name="cog" size={18} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* BUTTON GROUP (DÜĞME GRUBU) */}
      <View style={styles.controls}>
        {/* Sıfırla Düğmesi */}
        <TouchableOpacity 
          onPress={handleReset} 
          style={styles.controlBtn}
          aria-label="Zamanlayıcıyı Sıfırla"
        >
         
          <FontAwesome name="refresh" size={26} color={theme.colors.text} /> 
        </TouchableOpacity>

        {/* Play/Pause Button (Turkuaz Halka/Dolgu, Beyaz İkon) */}
        <TouchableOpacity 
          onPress={handleToggle} 
          style={styles.pauseBtn}
          aria-label={isRunning ? "Zamanlayıcıyı Durdur" : "Zamanlayıcıyı Başlat"}
        >
      
          <FontAwesome 
            name={isRunning ? "pause" : "play"} 
            size={40} 
            color={theme.colors.text} 
            style={isRunning ? {} : { marginLeft: 4 }}
          />
        </TouchableOpacity>

        {/* Session Switch Button (Mola/Seans Değiştirme Düğmesi) - Turkuaz Daireli */}
        <TouchableOpacity 
          onPress={handleSwitchSession}
          style={styles.sessionSwitchBtn}
          aria-label="Switch Session"
        >
        
            <FontAwesome name="hourglass-start" size={26} color={theme.colors.text} /> 
        </TouchableOpacity>
      </View>

      {/* TO-DO LIST NAV (YAPILACAKLAR LİSTESİ NAVİGASYONU) */}
      <TouchableOpacity style={styles.todoNav} aria-label="Yapılacaklar listesini aç"  onPress={() => navigation.navigate("TasksModal")}>
    
        <FontAwesome name="list" size={20} color={theme.colors.text} /> 
        <Text style={styles.todoText}>To-Do List</Text>
      </TouchableOpacity>

      {/* DEBUG BUTTON - Remove in production */}
      <TouchableOpacity 
        style={styles.debugBtn} 
        onPress={handleDebugComplete}
        aria-label="Debug: Complete Timer"
      >
        <Text style={styles.debugBtnText}>⚡</Text>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
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
    color: theme.colors.text,
  },
  sessionLabel: {
    marginTop: 35,
    letterSpacing: 2,
    color: primaryColor,
    fontSize: 14,
    fontWeight: '600',
  },
  taskRow: {
    width: width * 0.85,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdown: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  settingsBtn: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 40,
    marginHorizontal: -17.5, 
  },
  controlBtn: {
    width: 60,
    height: 60,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 17, 
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
    backgroundColor: theme.colors.surfaceSecondary,
    marginHorizontal: 17.5,
    borderColor: theme.colors.surfaceSecondary,
    borderWidth: 3,
  },
  todoNav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
  },
  todoText: {
    color: theme.colors.text,
    marginLeft: 8,
    fontSize: 15,
  },
  debugBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(78, 200, 192, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4EC8C0',
  },
  debugBtnText: {
    color: '#4EC8C0',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 