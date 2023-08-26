import { CheckIn } from '@prisma/client';
import classNames from 'classnames';
import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { emotions } from '../constants/emotions';
import { capitalize, unScreamingSnakeCase } from '../constants/helpers';
import { tagToColor } from '../constants/tags';

const CheckInPill: React.FC<CheckIn & { onPress?: () => void }> = ({
  id,
  emotion,
  notes,
  tags,
  takenAt,
  onPress,
}) => (
  <View
    style={{ backgroundColor: 'transparent' }}
    className='flex flex-row gap-4 py-2 px-7 justify-items-stretch'
    key={id}
  >
    <View
      className='flex items-center w-18'
      style={{ backgroundColor: 'transparent' }}
    >
      <View className='flex items-center w-full px-2 py-3 mb-2 bg-white rounded-lg'>
        <Image
          className='relative w-8 h-8 -mb-1 left-1'
          source={emotions[emotion]}
        ></Image>
        <Text className='text-xs font-medium text-storm f'>
          {capitalize(emotion)}
        </Text>
      </View>

      <Text className='text-xs font-light text-storm'>
        {new Date(takenAt).toLocaleTimeString('en-US', {
          hour12: true,
          minute: 'numeric',
          hour: 'numeric',
        })}
      </Text>
    </View>
    <Pressable onPress={onPress} className='flex-1 p-3 bg-white rounded-lg'>
      <View className='flex flex-row flex-wrap gap-x-1'>
        {tags.map((tag) => (
          <View key={tag} className='flex flex-row mb-1'>
            <View
              className={classNames('h-4 w-4 rounded mr-1', tagToColor[tag])}
            />
            {tags.length <= 2 ? (
              <Text className='text-xs text-storm'>
                {unScreamingSnakeCase(tag)}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
      <Text
        className='mt-2 text-sm truncate text-storm max-h-16'
        numberOfLines={3}
      >
        {notes}
      </Text>
    </Pressable>
  </View>
);

export default CheckInPill;
