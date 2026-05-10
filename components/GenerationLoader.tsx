import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/constants/colors";

const STEPS = [
  "Detecting face shape...",
  "Mapping hair region...",
  "Applying hairstyle...",
  "Rendering details...",
  "Finishing touches...",
];

export function GenerationLoader() {
  const rotation = useRef(new Animated.Value(0)).current;
  const [step, setStep] = React.useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== "web",
      })
    ).start();

    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % STEPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["rgba(124,77,255,0.15)", "rgba(0,229,255,0.05)"]}
        style={styles.gradient}
      >
        <Animated.View style={{ transform: [{ rotate }] }}>
          <View style={styles.spinner}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              style={styles.spinnerInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
        </Animated.View>
        <Text style={styles.title}>AI Processing</Text>
        <Text style={styles.step}>{STEPS[step]}</Text>
        <View style={styles.dotsRow}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: colors.radiusLg,
    overflow: "hidden",
    marginVertical: 8,
  },
  gradient: {
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  spinner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: colors.border,
    overflow: "hidden",
  },
  spinnerInner: { flex: 1 },
  title: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
  },
  step: {
    color: colors.mutedForeground,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  dotsRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: { backgroundColor: colors.primary, width: 16 },
});
