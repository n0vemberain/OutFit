import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

interface AmbientBackgroundProps {
  children?: React.ReactNode;
}

export const AmbientBackground: React.FC<AmbientBackgroundProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* Base Deep Midnight Gradient */}
      <LinearGradient
        colors={[Colors.background.base, '#0D1424', Colors.background.pureBlack]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Luminous Ambient Glow Orbs - providing the colorful refraction for glassmorphism */}
      <View style={styles.orbsContainer} pointerEvents="none">
        {/* Top-Right Violet Orb */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.45)', 'rgba(139, 92, 246, 0.0)']}
          style={[styles.orb, styles.topRightOrb]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Mid-Left Cyan Glow */}
        <LinearGradient
          colors={['rgba(6, 182, 212, 0.35)', 'rgba(6, 182, 212, 0.0)']}
          style={[styles.orb, styles.midLeftOrb]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Bottom-Center Rose/Fuchsia Glow */}
        <LinearGradient
          colors={['rgba(244, 63, 94, 0.35)', 'rgba(217, 70, 239, 0.0)']}
          style={[styles.orb, styles.bottomCenterOrb]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Center Deep Accent */}
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.25)', 'transparent']}
          style={[styles.orb, styles.centerOrb]}
        />
      </View>

      {/* Content wrapper */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.base,
    overflow: 'hidden',
  },
  orbsContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  topRightOrb: {
    width: width * 0.9,
    height: width * 0.9,
    top: -width * 0.25,
    right: -width * 0.25,
  },
  midLeftOrb: {
    width: width * 0.8,
    height: width * 0.8,
    top: height * 0.35,
    left: -width * 0.3,
  },
  bottomCenterOrb: {
    width: width * 0.85,
    height: width * 0.85,
    bottom: -width * 0.2,
    alignSelf: 'center',
    left: width * 0.1,
  },
  centerOrb: {
    width: width * 0.6,
    height: width * 0.6,
    top: height * 0.2,
    right: width * 0.1,
  },
  content: {
    flex: 1,
  },
});
