import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "@/constants/colors";
import type { HairstyleOption } from "@/contexts/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 3;

interface HairstyleCardProps {
  item: HairstyleOption;
  selected: boolean;
  onSelect: () => void;
}

export function HairstyleCard({ item, selected, onSelect }: HairstyleCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={selected ? colors.gradient.primary : colors.gradient.card}
        style={styles.gradient}
      >
        <Text style={styles.emoji}>{item.thumbnailEmoji}</Text>
        {item.isNew && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        {item.isTrending && !item.isNew && (
          <View style={[styles.badge, styles.badgeTrending]}>
            <Text style={styles.badgeText}>🔥</Text>
          </View>
        )}
      </LinearGradient>
      <Text style={[styles.name, selected && styles.nameSelected]} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 8,
    borderRadius: colors.radius,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: colors.primary,
    elevation: 8,
    ...Platform.select({
      native: {
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      web: {
        boxShadow: `0 0 12px 2px ${colors.primary}66`,
      },
    }),
  },
  gradient: {
    height: CARD_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 36 },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: colors.radiusFull,
  },
  badgeTrending: { backgroundColor: "transparent", padding: 0 },
  badgeText: { fontSize: 9, fontWeight: "800", color: colors.background, letterSpacing: 0.5 },
  name: {
    color: colors.mutedForeground,
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    paddingHorizontal: 4,
    paddingVertical: 6,
    backgroundColor: colors.card,
  },
  nameSelected: { color: colors.foreground },
});
