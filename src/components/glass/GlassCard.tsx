import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  variant?: 'default' | 'elevated' | 'subtle' | 'accent';
  borderRadius?: number;
  highlightBorder?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 35,
  variant = 'default',
  borderRadius = 22,
  highlightBorder = true,
}) => {
  const getGradientColors = (): [string, string, ...string[]] => {
    switch (variant) {
      case 'elevated':
        return ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.06)'];
      case 'accent':
        return ['rgba(139, 92, 246, 0.22)', 'rgba(6, 182, 212, 0.10)'];
      case 'subtle':
        return ['rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.02)'];
      case 'default':
      default:
        return ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)'];
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'accent':
        return 'rgba(139, 92, 246, 0.4)';
      case 'elevated':
        return Colors.glass.borderHighlight;
      case 'subtle':
        return Colors.glass.borderSubtle;
      default:
        return Colors.glass.border;
    }
  };

  return (
    <View
      style={[
        styles.outerContainer,
        {
          borderRadius,
          borderColor: getBorderColor(),
        },
        style,
      ]}
    >
      {/* Native Blur Layer */}
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />

      {/* Frosted Glass Gradient Fill with Specular Sheen */}
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />

      {/* Top Specular Reflection Highlight Line */}
      {highlightBorder && (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.45)', 'rgba(255, 255, 255, 0.0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.specularLine, { borderTopLeftRadius: borderRadius, borderTopRightRadius: borderRadius }]}
        />
      )}

      {/* Inner Card Content */}
      <View style={styles.innerContent}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: Platform.select({
      android: 'rgba(20, 27, 45, 0.72)', // Smooth fall-through for Android hardware renderers
      default: 'rgba(255, 255, 255, 0.02)',
    }),
    shadowColor: Colors.glass.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  specularLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
  innerContent: {
    position: 'relative',
    zIndex: 1,
  },
});
