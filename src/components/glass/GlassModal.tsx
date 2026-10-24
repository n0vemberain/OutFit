import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { GlassCard } from './GlassCard';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  maxHeightRatio?: number;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onClose,
  children,
  maxHeightRatio = 0.85,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <BlurView
            intensity={45}
            tint="dark"
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
            style={StyleSheet.absoluteFill}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.avoidingView}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <GlassCard
                  variant="elevated"
                  intensity={60}
                  borderRadius={28}
                  style={styles.card}
                >
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={styles.scrollContent}
                  >
                    {children}
                  </ScrollView>
                </GlassCard>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 15, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  avoidingView: {
    width: '100%',
    maxWidth: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%',
    maxHeight: '92%',
  },
  card: {
    padding: 0,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  scrollContent: {
    padding: 20,
  },
});
