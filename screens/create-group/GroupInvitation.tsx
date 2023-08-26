import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, TextInput } from 'react-native';
import Panel from '../../components/Panel';
import { View } from '../../components/Themed';
import { GroupStackScreenProps } from '../../types';

export default function GroupInvitation({
  navigation,
}: GroupStackScreenProps<'GroupInvitation'>) {
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4'>
          <Panel
            title='Name'
            description='We recommend group name to be specific.'
          />
        </View>
        <TextInput placeholder='E.G., Working parents under 35' />
      </ScrollView>
    </LinearGradient>
  );
}
