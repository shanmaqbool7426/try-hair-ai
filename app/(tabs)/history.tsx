import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import type { GeneratedLook } from "@/contexts/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_W = (SCREEN_WIDTH - 48) / 2;

type FilterType = "all" | "favorites";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, favorites, toggleFavorite, removeFromHistory, clearHistory } = useApp();
  const [filter, setFilter] = useState<FilterType>("all");

  const data = filter === "favorites" ? favorites : history;
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const handleDelete = (id: string) => {
    Alert.alert("Remove Look", "Remove this look from your history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          removeFromHistory(id);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  const handleClearAll = () => {
    Alert.alert("Clear History", "This will remove all your generated looks. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: () => {
          clearHistory();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: GeneratedLook }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/result",
          params: {
            originalUri: item.originalUri,
            generatedUri: item.generatedUri,
            hairstyleName: item.hairstyleName,
            lookId: item.id,
          },
        })
      }
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: item.generatedUri }} style={styles.cardImage} />
        <LinearGradient colors={["transparent", "rgba(10,10,15,0.9)"]} style={styles.cardOverlay} />

        {/* Actions */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              toggleFavorite(item.id);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={item.isFavorite ? "#FF4081" : colors.foreground}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash-outline" size={16} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.hairstyleName}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          {item.color && item.color !== "Natural" && (
            <Text style={styles.cardColor}>· {item.color}</Text>
          )}
        </View>
        <Text style={styles.cardDate}>
          {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Looks</Text>
          <Text style={styles.headerSub}>{history.length} generated · {favorites.length} saved</Text>
        </View>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
            <Ionicons name="trash" size={14} color={colors.destructive} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(["all", "favorites"] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => {
              setFilter(f);
              Haptics.selectionAsync();
            }}
          >
            {filter === f ? (
              <LinearGradient colors={colors.gradient.primary} style={styles.filterGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Ionicons name={f === "favorites" ? "heart" : "images"} size={14} color="#fff" />
                <Text style={styles.filterTextActive}>{f === "favorites" ? "Favorites" : "All Looks"}</Text>
              </LinearGradient>
            ) : (
              <>
                <Ionicons name={f === "favorites" ? "heart-outline" : "images-outline"} size={14} color={colors.mutedForeground} />
                <Text style={styles.filterText}>{f === "favorites" ? "Favorites" : "All Looks"}</Text>
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="image-off" size={56} color={colors.border} />
            <Text style={styles.emptyTitle}>
              {filter === "favorites" ? "No favorites yet" : "No looks yet"}
            </Text>
            <Text style={styles.emptySub}>
              {filter === "favorites"
                ? "Heart your generated looks to save them here"
                : "Generate your first AI hairstyle look"}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12 },
  headerTitle: { color: colors.foreground, fontSize: 26, fontFamily: "Poppins_700Bold" },
  headerSub: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_400Regular" },
  clearBtn: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255,68,68,0.1)",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 16, marginBottom: 16 },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: colors.radiusFull,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  filterBtnActive: { borderColor: colors.primary, padding: 0 },
  filterGradient: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 16, paddingVertical: 8 },
  filterText: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_500Medium" },
  filterTextActive: { color: "#fff", fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  row: { gap: 16, marginBottom: 16 },
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: colors.radius,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImageContainer: { position: "relative", height: CARD_W },
  cardImage: { width: "100%", height: "100%" },
  cardOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 60 },
  cardActions: { position: "absolute", top: 8, right: 8, gap: 6 },
  actionBtn: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { padding: 10 },
  cardTitle: { color: colors.foreground, fontSize: 13, fontFamily: "Poppins_600SemiBold" },
  cardMeta: { flexDirection: "row", gap: 4, marginTop: 2 },
  cardCategory: { color: colors.primary, fontSize: 11, fontFamily: "Poppins_500Medium" },
  cardColor: { color: colors.mutedForeground, fontSize: 11, fontFamily: "Poppins_400Regular" },
  cardDate: { color: colors.mutedForeground, fontSize: 10, fontFamily: "Poppins_400Regular", marginTop: 4 },
  empty: { alignItems: "center", justifyContent: "center", padding: 60, gap: 12 },
  emptyTitle: { color: colors.foreground, fontSize: 18, fontFamily: "Poppins_600SemiBold", textAlign: "center" },
  emptySub: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_400Regular", textAlign: "center", lineHeight: 20 },
});
