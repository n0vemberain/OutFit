import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../../theme/colors';

interface GlassInputProps extends TextInputProps {
  icon?: React.ReactNode;
  rightAction?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const GlassInput: React.FC<GlassInputProps> = ({
  icon,
  rightAction,
  containerStyle,
  style,
  placeholderTextColor = Colors.text.muted,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.focused,
        containerStyle,
      ]}
    >
      <BlurView
        intensity={20}
        tint="dark"
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        style={StyleSheet.absoluteFill}
      />
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
      {rightAction && <View style={styles.rightActionContainer}>{rightAction}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    overflow: 'hidden',
    paddingHorizontal: 14,
    height: 48,
  },
  focused: {
    borderColor: Colors.accents.violet,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: Colors.accents.violet,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    height: '100%',
  },
  rightActionContainer: {
    marginLeft: 8,
  },
});
