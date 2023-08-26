import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, DeviceEventEmitter } from 'react-native';
import Panel from '../../components/Panel';
import { Text, View } from '../../components/Themed';
import { ChatStackScreenProps } from '../../types';
import Button from '../../components/Button';

export default function ChatTopic({
  navigation,
  route,
}: ChatStackScreenProps<'ChatLanguage'>) {
  const language = route.params?.language;
  const lang = ['ENGLISH', '中文'];
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    return () => {
      DeviceEventEmitter.removeAllListeners('chat.request.lang');
    };
  }, []);

  const handleOnSelect = () => {
    DeviceEventEmitter.emit('chat.request.lang', { lang: selectedLang });
    navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='px-4 mt-4'
        style={{ backgroundColor: 'transparent' }}
      >
        <Panel
          title='Select a Language'
          description='What is your preferred language?'
        />
        <View style={{ backgroundColor: 'transparent' }} className='mt-4'>
          {lang.map((language, index) => (
            <Pressable
              onPress={() => setSelectedLang(language)}
              key={index}
              className={
                language == selectedLang
                  ? 'bg-white flex flex-row items-center mt-4 rounded-lg p-3 px-4 border border-jade'
                  : 'bg-white flex flex-row items-center mt-4 rounded-lg p-4'
              }
            >
              <Checkbox
                className='relative w-6 h-6 mr-1 rounded-lg'
                color={'#41B89C'}
                value={language == selectedLang}
                onValueChange={() => setSelectedLang(language)}
              />
              <Text className='ml-4 text-xl font-semibold text-midnight-mosaic'>
                {language}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View className='mb-20 px-6' style={{ backgroundColor: 'transparent' }}>
        <Button
          onPress={() => handleOnSelect()}
          text='DONE'
          backgroundColor='bg-jade'
          textColor='text-white'
        />
      </View>
    </LinearGradient>
  );
}
