import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { Colors } from '../../theme/colors';

interface GlassBadgeProps {
  label: string;
  color?: string;
  variant?: 'outline' | 'filled' | 'glow';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md';
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  label,
  color = Colors.accents.violet,
  variant = 'filled',
  icon,
  style,
  textStyle,
  size = 'md',
}) => {
  const isSm = size === 'sm';

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderColor: color,
          borderWidth: 1,
        };
      case 'glow':
        return {
          backgroundColor: `${color}28`,
          borderColor: `${color}80`,
          borderWidth: 1,
          shadowColor: color,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 6,
          elevation: 3,
        };
      case 'filled':
      default:
        return {
          backgroundColor: `${color}22`,
          borderColor: `${color}40`,
          borderWidth: 1,
        };
    }
  };

  return (
    <View
      style={[
        styles.badge,
        isSm ? styles.badgeSm : styles.badgeMd,
        getContainerStyle(),
        style,
      ]}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.label,
          isSm ? styles.labelSm : styles.labelMd,
          { color: variant === 'outline' ? color : '#FFFFFF' },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 999,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelSm: {
    fontSize: 11,
  },
  labelMd: {
    fontSize: 12,
  },
});
