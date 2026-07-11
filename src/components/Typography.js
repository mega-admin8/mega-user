// src/components/Typography.js
import React from 'react';
import { Text } from 'react-native';
import { theme } from '../theme';

export default function Typography({ style, weight = '400', children, ...props }) {
  // Map our weight prop to the exact Inter font files
  const fontFamilies = {
    '400': 'Inter_400Regular',
    '500': 'Inter_500Medium',
    '600': 'Inter_600SemiBold',
    '700': 'Inter_700Bold',
  };

  return (
    <Text 
      style={[
        { 
          fontFamily: fontFamilies[weight], 
          color: theme.colors.textDark, // Default to our slate black
          fontSize: 14 // Base font size
        }, 
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
}