import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import * as WebBrowser from 'expo-web-browser';
export default function TermsAndPolicies({
  navigation,
}: UserStackScreenProps<'TermsAndPolicies'>) {
  const documents = [
    {
      title: 'Mobile App EULA',
      icon: () => (
        <Ionicons name='document-text-outline' size={24} color='white' />
      ),
      goTo: 'https://www.veor.org/mobileappeula',
    },
    {
      title: 'Terms of Use',
      icon: () => (
        <Ionicons name='document-text-outline' size={24} color='white' />
      ),
      goTo: 'https://www.veor.org/termsofuse-app',
    },
    {
      title: 'Privacy Policy',
      icon: () => (
        <Ionicons name='shield-checkmark-outline' size={24} color='white' />
      ),
      goTo: 'https://www.veor.org/privacy-app',
    },
  ];
  const handleOpen = async (goTo: string) => {
    await WebBrowser.openBrowserAsync(goTo);
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {documents.map((document, index) => (
          <Pressable
            key={index}
            onPress={() => handleOpen(document.goTo)}
            className='bg-white w-full flex flex-row justify-between items-center mt-4 p-3 rounded-lg'
          >
            <View className=' flex flex-row justify-start items-center'>
              <View className=' bg-jade p-2 rounded-xl'>{document.icon()}</View>
              <Text className=' text-midnight-mosaic text-lg font-semibold ml-2'>
                {document.title}
              </Text>
            </View>
            <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
          </Pressable>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
