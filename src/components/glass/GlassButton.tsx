import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme/colors';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getGradientColors = (): [string, string, ...string[]] => {
    if (disabled) {
      return ['rgba(100, 116, 139, 0.3)', 'rgba(71, 85, 105, 0.2)'];
    }
    switch (variant) {
      case 'primary':
        return [Colors.accents.violet, '#6366F1'];
      case 'accent':
        return [Colors.accents.cyan, '#2563EB'];
      case 'danger':
        return ['#EF4444', '#DC2626'];
      case 'ghost':
        return ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)'];
      case 'secondary':
      default:
        return ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.06)'];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: 8,
          paddingHorizontal: 14,
          borderRadius: 14,
          fontSize: 13,
        };
      case 'lg':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 20,
          fontSize: 17,
        };
      case 'md':
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 18,
          borderRadius: 16,
          fontSize: 15,
        };
    }
  };

  const sizeConfig = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.buttonWrapper,
        { borderRadius: sizeConfig.borderRadius },
        disabled && styles.disabled,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingVertical: sizeConfig.paddingVertical,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            borderRadius: sizeConfig.borderRadius,
          },
        ]}
      >
        {variant === 'secondary' && (
          <BlurView
            intensity={20}
            tint="dark"
            style={[StyleSheet.absoluteFill, { borderRadius: sizeConfig.borderRadius }]}
          />
        )}

        {/* Top subtle highlight shimmer border */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.specularShine,
            { borderTopLeftRadius: sizeConfig.borderRadius, borderTopRightRadius: sizeConfig.borderRadius },
          ]}
        />

        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <View style={styles.contentRow}>
            {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
            <Text
              style={[
                styles.text,
                { fontSize: sizeConfig.fontSize },
                variant === 'ghost' && styles.ghostText,
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    shadowColor: Colors.accents.violet,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  ghostText: {
    color: Colors.text.secondary,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.55,
    shadowOpacity: 0,
    elevation: 0,
  },
  specularShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1.5,
  },
});
