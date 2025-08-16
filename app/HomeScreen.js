import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import { compliments } from "../constants/compliments";
import { COLORS } from "../constants/cheerydrop-colors";

const STORAGE_KEY = "LAST_COMPLIMENT_INDEX";

function shuffle(array) {
  let arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function HomeScreen() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [complimentList, setComplimentList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    setFontLoaded(true);
  }, []);

  useEffect(() => {
    const init = async () => {
      let shuffled = shuffle(compliments);
      let lastIndex = 0;
      try {
        const savedIndex = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedIndex !== null) {
          lastIndex = parseInt(savedIndex, 10);
        }
      } catch {}
      setComplimentList(shuffled);
      setCurrentIndex(lastIndex);
    };
    init();
  }, []);

  const showNewCompliment = useCallback(async () => {
    let nextIndex = currentIndex + 1;
    let newList = complimentList;
    let newCycle = cycle;
    if (nextIndex >= complimentList.length) {
      newList = shuffle(compliments);
      nextIndex = 0;
      newCycle = cycle + 1;
    }
    setComplimentList(newList);
    setCurrentIndex(nextIndex);
    setCycle(newCycle);
    await AsyncStorage.setItem(STORAGE_KEY, nextIndex.toString());
  }, [currentIndex, complimentList, cycle]);

  const shareCompliment = async () => {
    try {
      await Share.share({
        message: complimentList[currentIndex],
      });
    } catch (error) {}
  };

  if (!fontLoaded || complimentList.length === 0) {
    return (
      <LinearGradient
        colors={COLORS.bubbleGradient}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={COLORS.button} />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.background, "#FFE5B4"]}
      style={styles.container}
    >
      <Image style={styles.Image} source={require("../assets/icon.png")} />

      <View style={styles.bubbleWrapper}>
        <LinearGradient colors={COLORS.bubbleGradient} style={styles.bubble}>
          <Text style={styles.compliment}>{complimentList[currentIndex]}</Text>
        </LinearGradient>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={showNewCompliment}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>New Compliment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={shareCompliment}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingTop: 32,
  },
  Image: {
    width: 102,
    height: 102,
    top: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: COLORS.bubbleShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  iconWrap: {
    marginTop: 16,
    marginBottom: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubble: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: COLORS.bubbleShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  bubbleWrapper: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bubble: {
    minHeight: 180,
    minWidth: "80%",
    borderRadius: 32,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.bubbleShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  compliment: {
    fontSize: 28,
    color: COLORS.complimentText,
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: 0.5,
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 48,
    flex: 1,
    marginTop: 16,
  },
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    shadowColor: COLORS.buttonShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.buttonText,
    fontWeight: "bold",
    letterSpacing: 0.2,
  },
});
