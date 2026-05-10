import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";

interface SettingRowProps {
  icon: string;
  iconLib?: "ionicons" | "feather" | "mc";
  label: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ icon, iconLib = "ionicons", label, value, onPress, rightElement, danger }: SettingRowProps) {
  const IconComp = iconLib === "feather" ? Feather : iconLib === "mc" ? MaterialCommunityIcons : Ionicons;
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={[styles.settingIcon, danger && styles.settingIconDanger]}>
        <IconComp name={icon as any} size={18} color={danger ? colors.destructive : colors.primary} />
      </View>
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {rightElement}
        {onPress && !rightElement && <Ionicons name="chevron-forward" size={16} color={colors.border} />}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { history, favorites, freeGenerationsLeft, isPremium, clearHistory } = useApp();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const PLANS = [
    {
      id: "free",
      name: "Free",
      price: "0",
      features: ["5 free generations", "Basic hairstyles", "Standard quality"],
      current: !isPremium,
    },
    {
      id: "pro",
      name: "Pro",
      price: "9.99",
      features: ["Unlimited generations", "All hairstyles & colors", "HD export", "Before/After comparison", "Priority AI processing"],
      current: isPremium,
      gradient: colors.gradient.primary as [string, string],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 34 : 20 }}>
        {/* Header / Avatar */}
        <View style={styles.headerSection}>
          <LinearGradient colors={colors.gradient.hero} style={styles.avatarBg}>
            <LinearGradient colors={colors.gradient.primary} style={styles.avatar}>
              <MaterialCommunityIcons name="face-man-shimmer" size={48} color="#fff" />
            </LinearGradient>
            <Text style={styles.displayName}>HairTry User</Text>
            <Text style={styles.displaySub}>Explore your best look</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              {[
                { label: "Generated", value: history.length },
                { label: "Favorites", value: favorites.length },
                { label: "Free Left", value: freeGenerationsLeft },
              ].map((stat, i) => (
                <View key={i} style={styles.stat}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Premium Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plans</Text>
          <View style={styles.plansRow}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[styles.planCard, plan.current && styles.planCardActive]}
                activeOpacity={0.8}
                onPress={() => {
                  if (!plan.current) {
                    Alert.alert("Upgrade to Pro", `Get unlimited generations for $${plan.price}/month`, [
                      { text: "Cancel", style: "cancel" },
                      { text: "Subscribe" },
                    ]);
                  }
                }}
              >
                {plan.gradient ? (
                  <LinearGradient colors={plan.gradient} style={styles.planGradient}>
                    <PlanContent plan={plan} />
                  </LinearGradient>
                ) : (
                  <View style={styles.planInner}>
                    <PlanContent plan={plan} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsCard}>
            <SettingRow
              icon="moon"
              label="Dark Mode"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={(v) => {
                    setDarkMode(v);
                    Haptics.selectionAsync();
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.foreground}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow
              icon="notifications"
              label="Notifications"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={(v) => {
                    setNotifications(v);
                    Haptics.selectionAsync();
                  }}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.foreground}
                />
              }
            />
            <View style={styles.divider} />
            <SettingRow icon="male-female" label="Default Gender" value="Male" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="image" label="Export Quality" value="HD" onPress={() => {}} />
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsCard}>
            <SettingRow icon="star" label="Rate App" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="share-social" label="Share App" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="shield-checkmark" label="Privacy Policy" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="document-text" label="Terms of Service" onPress={() => {}} />
            <View style={styles.divider} />
            <SettingRow icon="information-circle" label="Version" value="1.0.0" />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.settingsCard}>
            <SettingRow
              icon="trash"
              label="Clear All History"
              danger
              onPress={() => {
                Alert.alert("Clear History", "This will delete all your generated looks.", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearHistory },
                ]);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function PlanContent({ plan }: { plan: any }) {
  return (
    <>
      <View style={styles.planHeader}>
        <Text style={styles.planName}>{plan.name}</Text>
        {plan.current && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>Current</Text>
          </View>
        )}
      </View>
      <Text style={styles.planPrice}>
        ${plan.price}<Text style={styles.planPeriod}>/mo</Text>
      </Text>
      {plan.features.map((f: string, i: number) => (
        <View key={i} style={styles.planFeatureRow}>
          <Ionicons name="checkmark-circle" size={14} color={plan.gradient ? "#fff" : colors.primary} />
          <Text style={[styles.planFeature, plan.gradient && { color: "rgba(255,255,255,0.9)" }]}>{f}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerSection: { marginBottom: 8 },
  avatarBg: { padding: 24, alignItems: "center", gap: 8 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  displayName: { color: colors.foreground, fontSize: 22, fontFamily: "Poppins_700Bold" },
  displaySub: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_400Regular" },
  statsRow: { flexDirection: "row", gap: 32, marginTop: 16 },
  stat: { alignItems: "center" },
  statValue: { color: colors.foreground, fontSize: 22, fontFamily: "Poppins_700Bold" },
  statLabel: { color: colors.mutedForeground, fontSize: 12, fontFamily: "Poppins_400Regular" },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: { color: colors.foreground, fontSize: 17, fontFamily: "Poppins_600SemiBold", marginBottom: 12 },

  // Plans
  plansRow: { flexDirection: "row", gap: 12 },
  planCard: { flex: 1, borderRadius: colors.radius, overflow: "hidden", borderWidth: 1, borderColor: colors.border },
  planCardActive: { borderColor: colors.primary },
  planGradient: { padding: 16, gap: 6 },
  planInner: { padding: 16, gap: 6, backgroundColor: colors.card },
  planHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  planName: { color: colors.foreground, fontSize: 16, fontFamily: "Poppins_700Bold" },
  currentBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: colors.radiusFull },
  currentBadgeText: { color: "#fff", fontSize: 10, fontFamily: "Poppins_600SemiBold" },
  planPrice: { color: colors.foreground, fontSize: 24, fontFamily: "Poppins_700Bold", marginBottom: 8 },
  planPeriod: { fontSize: 13, fontFamily: "Poppins_400Regular", color: colors.mutedForeground },
  planFeatureRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  planFeature: { color: colors.mutedForeground, fontSize: 12, fontFamily: "Poppins_400Regular", flex: 1 },

  // Settings
  settingsCard: { backgroundColor: colors.card, borderRadius: colors.radius, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
  settingRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "rgba(124,77,255,0.12)", alignItems: "center", justifyContent: "center" },
  settingIconDanger: { backgroundColor: "rgba(255,68,68,0.12)" },
  settingLabel: { flex: 1, color: colors.foreground, fontSize: 14, fontFamily: "Poppins_500Medium" },
  settingLabelDanger: { color: colors.destructive },
  settingRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingValue: { color: colors.mutedForeground, fontSize: 13, fontFamily: "Poppins_400Regular" },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 64 },
});
