import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import colors from "@/constants/colors";
import { MALE_HAIRSTYLES, FEMALE_HAIRSTYLES, CATEGORIES_MALE, CATEGORIES_FEMALE } from "@/data/hairstyles";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_W = (SCREEN_WIDTH - 48) / 2;

const TRENDING_ITEMS = [
  ...MALE_HAIRSTYLES.filter((h) => h.isTrending || h.isNew).map((h) => ({ ...h, type: "male" })),
  ...FEMALE_HAIRSTYLES.filter((h) => h.isTrending || h.isNew).map((h) => ({ ...h, type: "female" })),
].sort(() => Math.random() - 0.5);

const STYLE_GUIDES = [
  { id: "sg1", title: "2025 Men's Trends", subtitle: "Top cuts dominating this year", emoji: "✂️", color: ["#7C4DFF", "#5C30E0"] as [string, string] },
  { id: "sg2", title: "Korean Hair Inspo", subtitle: "K-drama inspired looks", emoji: "🇰🇷", color: ["#FF4081", "#C2185B"] as [string, string] },
  { id: "sg3", title: "Natural Textures", subtitle: "Embrace your natural hair", emoji: "🌿", color: ["#00BFA5", "#00897B"] as [string, string] },
  { id: "sg4", title: "Wedding Styles", subtitle: "Perfect looks for the big day", emoji: "💍", color: ["#FFB300", "#E65100"] as [string, string] },
  { id: "sg5", title: "Short & Bold", subtitle: "Make a statement with short hair", emoji: "⚡", color: ["#00E5FF", "#0097A7"] as [string, string] },
  { id: "sg6", title: "Long & Flowing", subtitle: "Romantic long hairstyle ideas", emoji: "🌊", color: ["#FF6E40", "#BF360C"] as [string, string] },
];

export default function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<"all" | "male" | "female">("all");

  const filtered = activeFilter === "all"
    ? TRENDING_ITEMS
    : TRENDING_ITEMS.filter((item) => item.type === activeFilter || item.gender === "unisex");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <Text style={styles.headerSub}>Trending styles & inspiration</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Style Guides */}
            <Text style={styles.sectionTitle}>Style Guides</Text>
            <FlatList
              data={STYLE_GUIDES}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.guidesScroll}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.guideCard} activeOpacity={0.8} onPress={() => Haptics.selectionAsync()}>
                  <LinearGradient colors={item.color} style={styles.guideGradient}>
                    <Text style={styles.guideEmoji}>{item.emoji}</Text>
                    <Text style={styles.guideTitle}>{item.title}</Text>
                    <Text style={styles.guideSub}>{item.subtitle}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            />

            {/* Trending Section */}
            <View style={styles.trendingHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <View style={styles.filterRow}>
                {(["all", "male", "female"] as const).map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
                    onPress={() => {
                      setActiveFilter(f);
                      Haptics.selectionAsync();
                    }}
                  >
                    <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.trendCard} activeOpacity={0.8} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <LinearGradient
              colors={item.isNew ? colors.gradient.accent : colors.gradient.card}
              style={styles.trendCardGradient}
            >
              <Text style={styles.trendEmoji}>{item.thumbnailEmoji}</Text>
              {item.isNew && (
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>NEW</Text>
                </View>
              )}
              {item.isTrending && !item.isNew && (
                <View style={[styles.newBadge, styles.trendBadge]}>
                  <Ionicons name="flame" size={10} color={colors.warning} />
                  <Text style={[styles.newBadgeText, { color: colors.warning }]}>HOT</Text>
                </View>
              )}
            </LinearGradient>
            <View style={styles.trendInfo}>
              <Text style={styles.trendName}>{item.name}</Text>
              <Text style={styles.trendCategory}>{item.category}</Text>
            </View>
            <View style={styles.trendFooter}>
              <View style={[styles.genderTag, item.type === "female" && styles.genderTagFemale]}>
                <Ionicons name={item.type === "female" ? "female" : "male"} size={10} color={item.type === "female" ? "#FF4081" : colors.accent} />
              </View>
              <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Ionicons name="heart-outline" size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="hair-dryer" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No trending styles yet</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: colors.foreground, fontSize: 26, fontFamily: "Poppins_700Bold" },
  headerSub: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_400Regular" },
  sectionTitle: { color: colors.foreground, fontSize: 17, fontFamily: "Poppins_600SemiBold", marginBottom: 12 },

  // Guides
  guidesScroll: { gap: 12, paddingRight: 8, marginBottom: 24 },
  guideCard: { width: 160, borderRadius: colors.radius, overflow: "hidden" },
  guideGradient: { padding: 16, height: 130, justifyContent: "flex-end" },
  guideEmoji: { fontSize: 32, marginBottom: 8 },
  guideTitle: { color: "#fff", fontFamily: "Poppins_700Bold", fontSize: 13 },
  guideSub: { color: "rgba(255,255,255,0.75)", fontFamily: "Poppins_400Regular", fontSize: 11 },

  // Trending
  trendingHeader: { marginBottom: 12 },
  filterRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: colors.radiusFull,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_500Medium" },
  filterTextActive: { color: "#fff", fontFamily: "Poppins_600SemiBold" },
  row: { gap: 16, marginBottom: 16 },
  trendCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendCardGradient: { height: CARD_W * 0.8, alignItems: "center", justifyContent: "center", position: "relative" },
  trendEmoji: { fontSize: 48 },
  newBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: colors.radiusFull,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  trendBadge: { backgroundColor: "rgba(0,0,0,0.4)" },
  newBadgeText: { color: "#fff", fontSize: 9, fontFamily: "Poppins_700Bold", letterSpacing: 0.5 },
  trendInfo: { padding: 10 },
  trendName: { color: colors.foreground, fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  trendCategory: { color: colors.mutedForeground, fontSize: 11, fontFamily: "Poppins_400Regular" },
  trendFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10, paddingBottom: 10 },
  genderTag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,229,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  genderTagFemale: { backgroundColor: "rgba(255,64,129,0.15)" },
  empty: { alignItems: "center", justifyContent: "center", padding: 48, gap: 12 },
  emptyText: { color: colors.mutedForeground, fontFamily: "Poppins_400Regular" },
});
