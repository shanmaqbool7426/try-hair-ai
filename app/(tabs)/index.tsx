import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Dimensions,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import colors from "@/constants/colors";
import { useApp } from "@/contexts/AppContext";
import { HairstyleCard } from "@/components/HairstyleCard";
import { CategoryPill } from "@/components/CategoryPill";
import { GenerationLoader } from "@/components/GenerationLoader";
import {
  MALE_HAIRSTYLES,
  FEMALE_HAIRSTYLES,
  HAIR_COLORS,
  BEARD_STYLES,
  CATEGORIES_MALE,
  CATEGORIES_FEMALE,
} from "@/data/hairstyles";
import type { HairstyleOption } from "@/contexts/AppContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type Tab = "style" | "color" | "beard";

export default function TryOnScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selectedGender, setSelectedGender, addToHistory, freeGenerationsLeft, decrementGenerations, isPremium } = useApp();

  const [selfieUri, setSelfieUri] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<HairstyleOption | null>(null);
  const [selectedColorId, setSelectedColorId] = useState<string>("c1");
  const [selectedBeardId, setSelectedBeardId] = useState<string>("b1");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<Tab>("style");
  const [isGenerating, setIsGenerating] = useState(false);

  const hairstyles = selectedGender === "male" ? MALE_HAIRSTYLES : FEMALE_HAIRSTYLES;
  const categories = selectedGender === "male" ? CATEGORIES_MALE : CATEGORIES_FEMALE;

  const filteredStyles =
    activeCategory === "All"
      ? hairstyles
      : hairstyles.filter((h) => h.category === activeCategory);

  const pickFromGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo access to select your selfie.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setSelfieUri(result.assets[0].uri);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const takePhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow camera access to take your selfie.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
      cameraType: ImagePicker.CameraType.front,
    });
    if (!result.canceled && result.assets[0]) {
      setSelfieUri(result.assets[0].uri);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selfieUri) {
      Alert.alert("No photo", "Please upload or take a selfie first.");
      return;
    }
    if (!selectedStyle) {
      Alert.alert("Select a style", "Please choose a hairstyle to try on.");
      return;
    }
    if (!isPremium && freeGenerationsLeft <= 0) {
      Alert.alert(
        "Free limit reached",
        "You've used all your free generations. Upgrade to Premium for unlimited looks!",
        [{ text: "Maybe later", style: "cancel" }, { text: "Go Premium" }]
      );
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsGenerating(true);

    // Simulate AI generation (in production, call Replicate API)
    await new Promise((resolve) => setTimeout(resolve, 4000));

    const selectedColor = HAIR_COLORS.find((c) => c.id === selectedColorId);
    const generatedLook = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      originalUri: selfieUri,
      generatedUri: selfieUri, // In production: the AI-generated image URL
      hairstyleName: selectedStyle.name,
      category: selectedStyle.category,
      color: selectedColor?.name,
      createdAt: Date.now(),
      isFavorite: false,
    };

    addToHistory(generatedLook);
    decrementGenerations();
    setIsGenerating(false);

    router.push({
      pathname: "/result",
      params: {
        originalUri: selfieUri,
        generatedUri: selfieUri,
        hairstyleName: selectedStyle.name,
        lookId: generatedLook.id,
      },
    });
  }, [selfieUri, selectedStyle, selectedColorId, isPremium, freeGenerationsLeft, addToHistory, decrementGenerations, router]);

  const handleGenderChange = useCallback(
    (gender: "male" | "female") => {
      setSelectedGender(gender);
      setSelectedStyle(null);
      setActiveCategory("All");
      Haptics.selectionAsync();
    },
    [setSelectedGender]
  );

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient colors={["#7C4DFF", "#00E5FF"]} style={styles.logoGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <MaterialCommunityIcons name="face-man-shimmer" size={20} color="#fff" />
        </LinearGradient>
        <Text style={styles.logoText}>HairTry AI</Text>
        <View style={styles.headerRight}>
          {!isPremium && (
            <View style={styles.gensBadge}>
              <Text style={styles.gensText}>{freeGenerationsLeft} free</Text>
            </View>
          )}
          <TouchableOpacity style={styles.premiumBtn}>
            <LinearGradient colors={colors.gradient.primary} style={styles.premiumGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="diamond" size={12} color="#fff" />
              <Text style={styles.premiumText}>Pro</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Selfie Upload */}
        <View style={styles.uploadSection}>
          {selfieUri ? (
            <View style={styles.selfieContainer}>
              <Image source={{ uri: selfieUri }} style={styles.selfieImage} />
              <LinearGradient colors={["transparent", "rgba(10,10,15,0.8)"]} style={styles.selfieOverlay} />
              <TouchableOpacity style={styles.changePhotoBtn} onPress={pickFromGallery}>
                <BlurView intensity={60} style={styles.blurBtn}>
                  <Feather name="refresh-cw" size={14} color={colors.foreground} />
                  <Text style={styles.changePhotoText}>Change</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <LinearGradient colors={["rgba(124,77,255,0.1)", "rgba(0,229,255,0.05)"]} style={styles.uploadGradient}>
                <View style={styles.uploadIconCircle}>
                  <LinearGradient colors={colors.gradient.primary} style={styles.uploadIconGradient}>
                    <Ionicons name="person" size={36} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={styles.uploadTitle}>Upload Your Selfie</Text>
                <Text style={styles.uploadSubtitle}>AI will detect your face shape{"\n"}and apply your chosen style</Text>
                <View style={styles.uploadBtns}>
                  <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto} activeOpacity={0.8}>
                    <LinearGradient colors={colors.gradient.primary} style={styles.uploadBtnGradient}>
                      <Ionicons name="camera" size={18} color="#fff" />
                      <Text style={styles.uploadBtnText}>Camera</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnSecondary]} onPress={pickFromGallery} activeOpacity={0.8}>
                    <Ionicons name="images" size={18} color={colors.foreground} />
                    <Text style={styles.uploadBtnTextSecondary}>Gallery</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Gender Toggle */}
        <View style={styles.genderRow}>
          <View style={styles.genderToggle}>
            <TouchableOpacity
              style={[styles.genderBtn, selectedGender === "male" && styles.genderBtnActive]}
              onPress={() => handleGenderChange("male")}
              activeOpacity={0.8}
            >
              {selectedGender === "male" ? (
                <LinearGradient colors={colors.gradient.primary} style={styles.genderBtnGradient}>
                  <Ionicons name="male" size={14} color="#fff" />
                  <Text style={styles.genderTextActive}>Male</Text>
                </LinearGradient>
              ) : (
                <View style={styles.genderBtnInner}>
                  <Ionicons name="male" size={14} color={colors.mutedForeground} />
                  <Text style={styles.genderText}>Male</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.genderBtn, selectedGender === "female" && styles.genderBtnActive]}
              onPress={() => handleGenderChange("female")}
              activeOpacity={0.8}
            >
              {selectedGender === "female" ? (
                <LinearGradient colors={colors.gradient.primary} style={styles.genderBtnGradient}>
                  <Ionicons name="female" size={14} color="#fff" />
                  <Text style={styles.genderTextActive}>Female</Text>
                </LinearGradient>
              ) : (
                <View style={styles.genderBtnInner}>
                  <Ionicons name="female" size={14} color={colors.mutedForeground} />
                  <Text style={styles.genderText}>Female</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          {(["style", "color", "beard"] as Tab[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => {
                setActiveTab(tab);
                Haptics.selectionAsync();
              }}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === "style" ? "Hairstyle" : tab === "color" ? "Color" : "Beard"}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Style Tab */}
        {activeTab === "style" && (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContent}>
              {categories.map((cat) => (
                <CategoryPill
                  key={cat}
                  label={cat}
                  selected={activeCategory === cat}
                  onPress={() => {
                    setActiveCategory(cat);
                    Haptics.selectionAsync();
                  }}
                />
              ))}
            </ScrollView>
            <View style={styles.stylesGrid}>
              {filteredStyles.map((item) => (
                <HairstyleCard
                  key={item.id}
                  item={item}
                  selected={selectedStyle?.id === item.id}
                  onSelect={() => {
                    setSelectedStyle(item);
                    Haptics.selectionAsync();
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Color Tab */}
        {activeTab === "color" && (
          <View style={styles.colorsSection}>
            <Text style={styles.sectionLabel}>Choose Hair Color</Text>
            <View style={styles.colorsGrid}>
              {HAIR_COLORS.map((color) => (
                <TouchableOpacity
                  key={color.id}
                  style={[styles.colorItem, selectedColorId === color.id && styles.colorItemSelected]}
                  onPress={() => {
                    setSelectedColorId(color.id);
                    Haptics.selectionAsync();
                  }}
                >
                  <View style={[styles.colorSwatch, { backgroundColor: color.hex }]}>
                    {selectedColorId === color.id && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.colorName}>{color.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Beard Tab */}
        {activeTab === "beard" && (
          <View style={styles.colorsSection}>
            <Text style={styles.sectionLabel}>Choose Beard Style</Text>
            <View style={styles.beardGrid}>
              {BEARD_STYLES.map((beard) => (
                <TouchableOpacity
                  key={beard.id}
                  style={[styles.beardItem, selectedBeardId === beard.id && styles.beardItemSelected]}
                  onPress={() => {
                    setSelectedBeardId(beard.id);
                    Haptics.selectionAsync();
                  }}
                >
                  <LinearGradient
                    colors={selectedBeardId === beard.id ? colors.gradient.primary : colors.gradient.card}
                    style={styles.beardGradient}
                  >
                    <Text style={styles.beardEmoji}>{beard.emoji}</Text>
                  </LinearGradient>
                  <Text style={[styles.beardName, selectedBeardId === beard.id && styles.beardNameActive]}>
                    {beard.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Generation Section */}
        {isGenerating ? (
          <GenerationLoader />
        ) : (
          <View style={styles.generateSection}>
            {selectedStyle && (
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedInfoText}>
                  {selectedStyle.name}
                  {HAIR_COLORS.find((c) => c.id === selectedColorId)?.name !== "Natural"
                    ? ` · ${HAIR_COLORS.find((c) => c.id === selectedColorId)?.name}`
                    : ""}
                </Text>
                <View style={styles.selectedDot} />
              </View>
            )}
            <TouchableOpacity
              style={[styles.generateBtn, (!selfieUri || !selectedStyle) && styles.generateBtnDisabled]}
              onPress={handleGenerate}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={selfieUri && selectedStyle ? colors.gradient.accent : ["#2A2A3E", "#2A2A3E"]}
                style={styles.generateBtnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="auto-fix" size={22} color="#fff" />
                <Text style={styles.generateBtnText}>Generate Look</Text>
              </LinearGradient>
            </TouchableOpacity>
            {!selfieUri && (
              <Text style={styles.hintText}>Upload a selfie to get started</Text>
            )}
            {selfieUri && !selectedStyle && (
              <Text style={styles.hintText}>Select a hairstyle above</Text>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
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
    paddingVertical: 12,
    gap: 10,
  },
  logoGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    flex: 1,
    color: colors.foreground,
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  gensBadge: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: colors.radiusFull,
  },
  gensText: { color: colors.mutedForeground, fontSize: 12, fontFamily: "Poppins_500Medium" },
  premiumBtn: { borderRadius: colors.radiusFull, overflow: "hidden" },
  premiumGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumText: { color: "#fff", fontSize: 12, fontFamily: "Poppins_700Bold" },
  scrollContent: { paddingHorizontal: 16 },

  // Upload
  uploadSection: { marginBottom: 16 },
  uploadPlaceholder: { borderRadius: colors.radiusLg, overflow: "hidden", borderWidth: 1, borderColor: colors.border, borderStyle: "dashed" },
  uploadGradient: { padding: 32, alignItems: "center", gap: 12 },
  uploadIconCircle: { width: 80, height: 80, borderRadius: 40, overflow: "hidden", marginBottom: 4 },
  uploadIconGradient: { flex: 1, alignItems: "center", justifyContent: "center" },
  uploadTitle: { color: colors.foreground, fontSize: 18, fontFamily: "Poppins_600SemiBold" },
  uploadSubtitle: { color: colors.mutedForeground, fontSize: 13, textAlign: "center", fontFamily: "Poppins_400Regular", lineHeight: 20 },
  uploadBtns: { flexDirection: "row", gap: 12, marginTop: 8 },
  uploadBtn: { borderRadius: colors.radiusFull, overflow: "hidden" },
  uploadBtnGradient: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  uploadBtnText: { color: "#fff", fontFamily: "Poppins_600SemiBold", fontSize: 14 },
  uploadBtnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radiusFull,
  },
  uploadBtnTextSecondary: { color: colors.foreground, fontFamily: "Poppins_600SemiBold", fontSize: 14 },
  selfieContainer: { height: 280, borderRadius: colors.radiusLg, overflow: "hidden", position: "relative" },
  selfieImage: { width: "100%", height: "100%" },
  selfieOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: 100 },
  changePhotoBtn: { position: "absolute", bottom: 12, right: 12, borderRadius: colors.radiusFull, overflow: "hidden" },
  blurBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
  changePhotoText: { color: colors.foreground, fontSize: 13, fontFamily: "Poppins_500Medium" },

  // Gender
  genderRow: { marginBottom: 16 },
  genderToggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: colors.radiusFull,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  genderBtn: { flex: 1, borderRadius: colors.radiusFull, overflow: "hidden" },
  genderBtnActive: {},
  genderBtnGradient: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  genderBtnInner: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10 },
  genderText: { color: colors.mutedForeground, fontFamily: "Poppins_500Medium", fontSize: 14 },
  genderTextActive: { color: "#fff", fontFamily: "Poppins_600SemiBold", fontSize: 14 },

  // Tabs
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center", position: "relative" },
  tabActive: {},
  tabText: { color: colors.mutedForeground, fontSize: 14, fontFamily: "Poppins_500Medium" },
  tabTextActive: { color: colors.primary, fontFamily: "Poppins_600SemiBold" },
  tabUnderline: { position: "absolute", bottom: -1, left: "15%", right: "15%", height: 2, backgroundColor: colors.primary, borderRadius: 1 },

  // Categories
  categoryScroll: { marginBottom: 16 },
  categoryContent: { paddingRight: 8 },
  stylesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },

  // Colors
  colorsSection: { marginBottom: 16 },
  sectionLabel: { color: colors.foreground, fontSize: 15, fontFamily: "Poppins_600SemiBold", marginBottom: 12 },
  colorsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  colorItem: { alignItems: "center", gap: 6 },
  colorItemSelected: {},
  colorSwatch: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  colorName: { color: colors.mutedForeground, fontSize: 11, fontFamily: "Poppins_400Regular" },

  // Beards
  beardGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  beardItem: { alignItems: "center", gap: 6, width: (Dimensions.get("window").width - 32 - 60) / 3 },
  beardItemSelected: {},
  beardGradient: { width: 64, height: 64, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  beardEmoji: { fontSize: 28 },
  beardName: { color: colors.mutedForeground, fontSize: 11, fontFamily: "Poppins_400Regular", textAlign: "center" },
  beardNameActive: { color: colors.foreground },

  // Generate
  generateSection: { gap: 12, marginTop: 8, marginBottom: 16 },
  selectedInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderRadius: colors.radiusFull,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
  },
  selectedInfoText: { color: colors.foreground, fontSize: 13, fontFamily: "Poppins_500Medium" },
  selectedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  generateBtn: { borderRadius: colors.radiusFull, overflow: "hidden" },
  generateBtnDisabled: { opacity: 0.5 },
  generateBtnGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  generateBtnText: { color: "#fff", fontSize: 16, fontFamily: "Poppins_700Bold" },
  hintText: { color: colors.mutedForeground, fontSize: 13, textAlign: "center", fontFamily: "Poppins_400Regular" },
});
