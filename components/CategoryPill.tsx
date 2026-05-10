import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/constants/colors";

interface CategoryPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function CategoryPill({ label, selected, onPress }: CategoryPillProps) {
  if (selected) {
    return (
      <LinearGradient
        colors={colors.gradient.primary}
        style={styles.pill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.textSelected}>{label}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity style={[styles.pill, styles.pillUnselected]} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: colors.radiusFull,
    marginRight: 8,
  },
  pillUnselected: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: { color: colors.mutedForeground, fontSize: 13, fontWeight: "600" },
  textSelected: { color: colors.foreground, fontSize: 13, fontWeight: "700" },
});
