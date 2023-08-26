import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, TextInput } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View } from '../../components/Themed';
import { GroupStackScreenProps } from '../../types';

export default function GroupNameScreen({
  navigation,
  route: { params },
}: GroupStackScreenProps<'GroupName'>) {
  const [name, setName] = useState(params.title || '');

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
        <View className='mb-4 rounded-lg'>
          <Panel
            title='Name'
            description='We recommend that your group name be specific.'
          />
        </View>
        <View className='p-4 bg-white rounded-lg text-midnight-mosaic'>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='E.G., Working parents under 35'
          />
        </View>

        <View className='mt-4 rounded-lg bg-jade'>
          <Button
            text='Done'
            onPress={() => {
              navigation.goBack();
              navigation.replace('CreateGroup', {
                ...params,
                title: name || undefined,
              });
            }}
            textColor='text-white'
            backgroundColor='bg-jade'
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
