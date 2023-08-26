import { Switch } from 'react-native';
import { View, Text } from '../Themed';
import React from 'react';

export interface SwitchPillProps {
  title: string;
  switchValue: boolean;
  onSwitchChange: () => void;
}

export default function SwitchPill({
  title,
  switchValue,
  onSwitchChange,
}: SwitchPillProps) {
  return (
    <View className='flex flex-row justify-between items-center p-3 rounded-lg'>
      <Text className=' text-midnight-mosaic text-lg'>{title}</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#41B89C' }}
        value={switchValue}
        onValueChange={() => onSwitchChange()}
      />
    </View>
  );
}
