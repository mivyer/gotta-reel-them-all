import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface FigmaHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightContent?: React.ReactNode;
}

export default function FigmaHeader({ title, subtitle, onBack, rightContent }: FigmaHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {onBack !== null && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack ?? (() => router.back())}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {rightContent && <View style={styles.rightSlot}>{rightContent}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#9cebff',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 1,
  },
  backArrow: {
    fontSize: 28,
    color: '#000000',
    lineHeight: 32,
  },
  title: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 56,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 60,
    marginTop: 8,
  },
  subtitle: {
    fontFamily: 'Dokdo_400Regular',
    fontSize: 22,
    color: '#000000',
    textAlign: 'right',
    marginTop: 2,
  },
  rightSlot: {
    position: 'absolute',
    right: 16,
    bottom: 20,
  },
});
