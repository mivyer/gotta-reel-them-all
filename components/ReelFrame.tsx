import React, { useRef } from 'react';
import { View, Image, StyleSheet, ViewStyle } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const FRAME_BLUE = require('@/assets/figma/bugreel-frame-blue.png');

interface ReelFrameProps {
  videoUrl: any;
  color: 'blue' | 'pink';
  width?: number;
  height?: number;
  style?: ViewStyle;
  playing?: boolean;
  muted?: boolean;
}

export default function ReelFrame({
  videoUrl,
  color,
  width = 240,
  height = 160,
  style,
  playing = true,
  muted = true,
}: ReelFrameProps) {
  const videoRef = useRef(null);

  const insetH = width * 0.08;
  const insetV = height * 0.12;

  return (
    <View style={[{ width, height }, styles.container, style]}>
      <Video
        ref={videoRef}
        source={videoUrl}
        style={[
          styles.video,
          {
            top: insetV,
            left: insetH,
            right: insetH,
            bottom: insetV,
            borderRadius: 6,
          },
        ]}
        shouldPlay={playing}
        isLooping
        isMuted={muted}
        resizeMode={ResizeMode.COVER}
      />
      <Image
        source={FRAME_BLUE}
        style={styles.frameOverlay}
        resizeMode="contain"
      />
    </View>
  );
}

export function ReelFrameSmall({ videoUrl, color }: { videoUrl: any; color: 'blue' | 'pink' }) {
  return <ReelFrame videoUrl={videoUrl} color={color} width={110} height={80} playing={false} />;
}

export function ReelFrameLarge({
  videoUrl,
  color,
  playing = true,
}: {
  videoUrl: any;
  color: 'blue' | 'pink';
  playing?: boolean;
}) {
  return <ReelFrame videoUrl={videoUrl} color={color} width={320} height={220} playing={playing} muted={false} />;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  video: {
    position: 'absolute',
    backgroundColor: '#000',
  },
  frameOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
});
