import React from 'react';
import { Pressable } from 'react-native';

export interface CheckboxProps {
  checkedColor: string;
  uncheckedColor: string;
  value: boolean;
  onPress: () => void;
  style?: string;
  icon: React.ReactNode;
}

export default function Checkbox({
  checkedColor,
  uncheckedColor,
  value,
  onPress,
  style,
  icon,
}: CheckboxProps) {
  const _styles = `bg-${value ? checkedColor : uncheckedColor} ${style}`;

  return (
    <Pressable className={_styles} onPress={() => onPress()}>
      {value ? icon : null}
    </Pressable>
  );
}
