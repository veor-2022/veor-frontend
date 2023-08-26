import React from 'react';
import { Text, View } from '../Themed';

export interface PanelProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export default function Panel({ title, description, children }: PanelProps) {
  return (
    <View className='justify-between w-full p-4 rounded-lg'>
      {title && (
        <Text className='text-2xl font-medium text-midnight-mosaic'>
          {title}
        </Text>
      )}
      {description && (
        <Text className='mt-4 text-lg font-normal text-midnight-mosaic'>
          {description}
        </Text>
      )}
      {children && <View className='mt-4'>{children}</View>}
    </View>
  );
}
