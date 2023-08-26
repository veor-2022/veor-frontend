import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';

export default function PreferencesSetting({
  navigation,
}: UserStackScreenProps<'ListenerProfileSetting'>) {
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={() => navigation.navigate('EditAvatar')}
          className='bg-white w-full flex flex-row justify-between items-center mt-4 p-3 rounded-lg'
        >
          <View className=' flex flex-row justify-start items-center'>
            <View className=' bg-jade p-2 rounded-xl'>
              <AntDesign name='picture' size={24} color='white' />
            </View>
            <Text className=' text-midnight-mosaic text-lg font-semibold ml-2'>
              Profile Picture
            </Text>
          </View>
          <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('EditTopic')}
          className='bg-white w-full flex flex-row justify-between items-center mt-4 p-3 rounded-lg'
        >
          <View className=' flex flex-row justify-start items-center'>
            <View className=' bg-jade p-2 rounded-xl'>
              <Ionicons
                name='chatbox-ellipses-outline'
                size={24}
                color='white'
              />
            </View>
            <Text className=' text-midnight-mosaic text-lg font-semibold ml-2'>
              Topics
            </Text>
          </View>
          <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('EditAbout')}
          className='bg-white w-full flex flex-row justify-between items-center mt-4 p-3 rounded-lg'
        >
          <View className=' flex flex-row justify-start items-center'>
            <View className=' bg-jade p-2 rounded-xl'>
              <AntDesign name='layout' size={24} color='white' />
            </View>
            <Text className=' text-midnight-mosaic text-lg font-semibold ml-2'>
              About
            </Text>
          </View>
          <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
