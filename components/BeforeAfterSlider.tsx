import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  Dimensions,
  Text,
  Platform,
} from "react-native";
import colors from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface BeforeAfterSliderProps {
  beforeUri: string;
  afterUri: string;
  height?: number;
}

export function BeforeAfterSlider({ beforeUri, afterUri, height = 400 }: BeforeAfterSliderProps) {
  const [sliderX, setSliderX] = useState(0.5);
  const containerWidth = useRef(SCREEN_WIDTH - 32);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.locationX / containerWidth.current;
        setSliderX(Math.min(1, Math.max(0, x)));
      },
      onPanResponderMove: (e) => {
        const x = e.nativeEvent.locationX / containerWidth.current;
        setSliderX(Math.min(1, Math.max(0, x)));
      },
    })
  ).current;

  const onLayout = useCallback((e: any) => {
    containerWidth.current = e.nativeEvent.layout.width;
  }, []);

  const sliderPx = sliderX * containerWidth.current;

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={onLayout}
      {...panResponder.panHandlers}
    >
      {/* After (full width) */}
      <Image source={{ uri: afterUri }} style={[styles.image, { height }]} resizeMode="cover" />

      {/* Before (clipped) */}
      <View style={[styles.clip, { width: sliderPx, height }]}>
        <Image
          source={{ uri: beforeUri }}
          style={[styles.image, { width: containerWidth.current, height }]}
          resizeMode="cover"
        />
      </View>

      {/* Divider */}
      <View style={[styles.divider, { left: sliderPx - 1, height }]}>
        <View style={styles.handle}>
          <Text style={styles.handleArrows}>‹ ›</Text>
        </View>
      </View>

      {/* Labels */}
      <View style={[styles.label, styles.labelBefore]}>
        <Text style={styles.labelText}>BEFORE</Text>
      </View>
      <View style={[styles.label, styles.labelAfter]}>
        <Text style={styles.labelText}>AFTER</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: colors.radiusLg,
    overflow: "hidden",
    backgroundColor: colors.card,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
  clip: {
    position: "absolute",
    top: 0,
    left: 0,
    overflow: "hidden",
  },
  divider: {
    position: "absolute",
    top: 0,
    width: 2,
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.foreground,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    ...Platform.select({
      native: {
        shadowColor: "#000",
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
      },
    }),
  },
  handleArrows: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: -2,
  },
  label: {
    position: "absolute",
    top: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: colors.radiusFull,
  },
  labelBefore: { left: 12 },
  labelAfter: { right: 12 },
  labelText: {
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 1,
  },
});
