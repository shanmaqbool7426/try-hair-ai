import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import colors from "@/constants/colors";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { useApp } from "@/contexts/AppContext";

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{
    originalUri: string;
    generatedUri: string;
    hairstyleName: string;
    lookId: string;
  }>();

  const { history, toggleFavorite } = useApp();
  const look = history.find((h) => h.id === params.lookId);
  const [isFavorite, setIsFavorite] = useState(look?.isFavorite ?? false);

  const handleFavorite = () => {
    if (params.lookId) {
      toggleFavorite(params.lookId);
      setIsFavorite((prev) => !prev);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my new ${params.hairstyleName} hairstyle generated with HairTry AI! 💇`,
      });
    } catch {}
  };

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPadding + 16 }}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-down" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Your Look</Text>
            <Text style={styles.headerSub}>{params.hairstyleName}</Text>
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={handleFavorite}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "#FF4081" : colors.foreground}
            />
          </TouchableOpacity>
        </View>

        {/* Before/After Slider */}
        <View style={styles.sliderSection}>
          <BeforeAfterSlider
            beforeUri={params.originalUri ?? ""}
            afterUri={params.generatedUri ?? ""}
            height={420}
          />
          <Text style={styles.sliderHint}>Drag to compare before & after</Text>
        </View>

        {/* Result Info Card */}
        <View style={styles.infoCard}>
          <LinearGradient colors={colors.gradient.card} style={styles.infoGradient}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="face-man-shimmer" size={20} color={colors.primary} />
              <View>
                <Text style={styles.infoLabel}>Hairstyle Applied</Text>
                <Text style={styles.infoValue}>{params.hairstyleName}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="auto-fix" size={20} color={colors.accent} />
              <View>
                <Text style={styles.infoLabel}>AI Processing</Text>
                <Text style={styles.infoValue}>Stable Diffusion · HD Quality</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.8}>
            <LinearGradient colors={colors.gradient.primary} style={styles.actionBtnGradient}>
              <Ionicons name="share-social" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>Share Look</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => {
              Alert.alert("Download", "HD download requires Pro subscription");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="download" size={20} color={colors.foreground} />
            <Text style={styles.actionBtnTextSecondary}>Download HD</Text>
            <View style={styles.proBadge}>
              <Ionicons name="diamond" size={10} color={colors.primary} />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Try Another */}
        <TouchableOpacity
          style={styles.tryAnotherBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="auto-fix" size={16} color={colors.primary} />
          <Text style={styles.tryAnotherText}>Try Another Style</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.card,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { color: colors.foreground, fontSize: 18, fontFamily: "Poppins_700Bold" },
  headerSub: { color: colors.primary, fontSize: 13, fontFamily: "Poppins_500Medium" },
  sliderSection: { paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  sliderHint: { color: colors.mutedForeground, fontSize: 12, textAlign: "center", fontFamily: "Poppins_400Regular" },
  infoCard: { marginHorizontal: 16, borderRadius: colors.radius, overflow: "hidden", borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  infoGradient: { padding: 16, gap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoDivider: { height: 1, backgroundColor: colors.border },
  infoLabel: { color: colors.mutedForeground, fontSize: 11, fontFamily: "Poppins_400Regular" },
  infoValue: { color: colors.foreground, fontSize: 14, fontFamily: "Poppins_600SemiBold" },
  actionsSection: { paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  actionBtn: { borderRadius: colors.radiusFull, overflow: "hidden" },
  actionBtnGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 16 },
  actionBtnText: { color: "#fff", fontSize: 15, fontFamily: "Poppins_700Bold" },
  actionBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderRadius: colors.radiusFull,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionBtnTextSecondary: { color: colors.foreground, fontSize: 15, fontFamily: "Poppins_600SemiBold" },
  proBadge: { flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "rgba(124,77,255,0.15)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: colors.radiusFull },
  proBadgeText: { color: colors.primary, fontSize: 10, fontFamily: "Poppins_700Bold" },
  tryAnotherBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12 },
  tryAnotherText: { color: colors.primary, fontSize: 14, fontFamily: "Poppins_600SemiBold" },
});
