import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserStackScreenProps } from '../../types';
export default function EditLanguage({
  navigation,
}: UserStackScreenProps<'EditLanguage'>) {
  const [nickname, serNickname] = useState('');
  const { setUser } = useContext(UserContext);
  const lang = ['English', '中文'];
  const [selectedLang, setSelectedLang] = useState(lang[0]);

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='mt-3 rounded-xl p-5'>
          <Text className='text-midnight-mosaic text-2xl font-bold mb-5'>
            Select Your Language
          </Text>
          <Text className='text-storm text-[17px] '>
            Please select your preferred language for the app.
          </Text>
        </View>
        <View style={{ backgroundColor: 'transparent' }} className='mt-8'>
          {lang.map((language, index) => (
            <Pressable
              //   onPress={() => setSelectedLang(language)}
              key={index}
              className={
                language == selectedLang
                  ? 'bg-white flex flex-row items-center mt-4 rounded-lg p-3 px-4 border border-jade'
                  : 'bg-white flex flex-row items-center mt-4 rounded-lg p-4 opacity-40'
              }
            >
              <Checkbox
                className='relative w-6 h-6 mr-1 rounded-lg'
                color={language == selectedLang ? '#41B89C' : '#D1D5DB'}
                value={language == selectedLang}
                // onValueChange={() => setSelectedLang(language)}
              />
              <Text className='ml-4 text-midnight-mosaic font-semibold text-xl'>
                {language}
              </Text>
            </Pressable>
          ))}
        </View>
        <View
          style={{ backgroundColor: 'transparent' }}
          className='flex flex-row items-center mt-2'
        >
          <Feather name='info' size={16} color='#41B89C' />
          <Text className='ml-1 text-midnight-mosaic'>Coming soon</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
