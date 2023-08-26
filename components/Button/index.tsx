import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TouchableOpacity } from 'react-native';
import { Text, View } from '../Themed';

export interface ButtonProps {
  text: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  type?: 'BUTTON' | 'SECTION';
  leftIconColor?: string;
  leftIconBackgroundColor?: string;
  rightIconColor?: string;
  textColor?: string;
  backgroundColor?: string;
  onPress?: () => void;
  disable?: boolean;
}

export default function Button({
  text,
  leftIcon,
  rightIcon,
  type = 'BUTTON',
  leftIconColor,
  rightIconColor,
  textColor,
  leftIconBackgroundColor,
  backgroundColor,
  onPress,
  disable,
}: ButtonProps) {
  const convertToTitleCase = (text: string) => {
    const preposition = [
      'of',
      'the',
      'in',
      'at',
      'on',
      'for',
      'to',
      'from',
      'by',
      'over',
      'under',
      'a',
      'an',
    ];
    const textArr = text.toLowerCase().split(' ');
    const result = textArr.map((word, index) => {
      if (index === 0 || !preposition.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
    return result.join(' ');
  };
  return (
    <TouchableOpacity
      className={
        'flex-row items-center w-full p-4  rounded-lg ' +
        (!leftIcon && !rightIcon ? 'justify-center' : 'justify-between') +
        ' ' +
        (backgroundColor ? backgroundColor : 'bg-white') +
        ' ' +
        (disable ? 'opacity-70' : '') +
        ' ' +
        (type === 'BUTTON' ? 'py-2' : 'py-4')
      }
      disabled={disable}
      onPress={onPress}
    >
      {leftIcon && (
        <View
          className={'flex flex-row items-center justify-between space-x-3'}
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className={
              'p-1 rounded-lg ' +
              (leftIconBackgroundColor
                ? leftIconBackgroundColor
                : backgroundColor || 'bg-white')
            }
          >
            <Ionicons
              name={leftIcon}
              color={leftIconColor ? leftIconColor : 'white'}
              size={28}
            />
          </View>
          <View style={{ backgroundColor: 'transparent' }}>
            <Text
              className={
                'text-lg font-bold ' +
                (textColor ? textColor : 'text-midnight-mosaic')
              }
            >
              {text}
            </Text>
          </View>
        </View>
      )}
      {text && !leftIcon && (
        <View style={{ backgroundColor: 'transparent' }}>
          <Text
            className={
              'text-lg font-bold ' +
              (textColor ? textColor : 'text-midnight-mosaic')
            }
          >
            {convertToTitleCase(text)}
          </Text>
        </View>
      )}
      {rightIcon && (
        <View className='bg-white' style={{ backgroundColor: 'transparent' }}>
          <Ionicons
            name={rightIcon}
            color={rightIconColor ? rightIconColor : '#3D5467'}
            size={28}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}
