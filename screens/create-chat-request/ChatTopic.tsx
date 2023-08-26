import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, DeviceEventEmitter, Pressable } from 'react-native';
import Panel from '../../components/Panel';
import { Text, View } from '../../components/Themed';
import { topics } from '../../constants/topics';
import { ChatStackScreenProps } from '../../types';
export default function ChatTopic({
  navigation,
}: ChatStackScreenProps<'ChatTopic'>) {
  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('chat.request.topic');
    };
  }, []);

  const handleOnSelect = (index: number) => {
    DeviceEventEmitter.emit('chat.request.topic', {
      topic: topics[index].name,
    });
    navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='px-4 mt-12'
        style={{ backgroundColor: 'transparent' }}
      >
        <Panel
          title='Select a topic'
          description='What is the topic you have on your mind? '
        />
        <View className='mb-10' style={{ backgroundColor: 'transparent' }}>
          {topics.map((topic, index) => (
            <Pressable onPress={() => handleOnSelect(index)} key={index}>
              <View className='flex flex-row items-center mt-4 rounded-lg p-3'>
                <Image className='h-12 w-12' source={topic.image} />
                <Text className='ml-4 text-midnight-mosaic font-semibold text-lg'>
                  {topic.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
