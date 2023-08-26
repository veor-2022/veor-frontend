import { View, Text } from '../Themed';
import React from 'react';
import { Image } from 'react-native';

export default function UserAvatar({
  name,
  size,
  url,
}: {
  name: string;
  size: number;
  url?: string | null | undefined;
}) {
  const colors = [
    '#8A2BE2',
    '#5F9EA0',
    '#FF7F50',
    '#DC143C',
    '#008B8B',
    '#6495ED',
    '#006400',
    '#8B008B',
    '#FF8C00',
    '#8FBC8F',
    '#00CED1',
    '#2F4F4F',
    '#FF1493',
    '#1E90FF',
    '#7371FC',
    '#FFD700',
    '#FF69B4',
    '#CD5C5C',
    '#F0E68C',
    '#4B0082',
    '#F08080',
    '#20B2AA',
    '#FFA07A',
    '#228B22',
    '#00FA9A',
    '#FFDEAD',
  ];
  const alphabetArr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  let color = colors[0];
  if (name) {
    color = colors[alphabetArr.indexOf(name[0].toUpperCase())];
  }
  const style = 'rounded-full flex flex-row justify-center items-center';
  return url ? (
    <Image
      source={{ uri: url }}
      className=' rounded-full'
      style={{ width: size * 2, height: size * 2 }}
    />
  ) : (
    <View
      className={style}
      style={{ backgroundColor: color, width: size * 2, height: size * 2 }}
    >
      {name ? (
        <Text className='text-white font-semibold' style={{ fontSize: size }}>
          {name[0].toUpperCase()}
        </Text>
      ) : null}
    </View>
  );
}
