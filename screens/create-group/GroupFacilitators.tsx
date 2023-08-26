import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, Share } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View } from '../../components/Themed';
import { GroupStackScreenProps } from '../../types';

export default function GroupFacilitators({
  navigation,
  route: { params },
}: GroupStackScreenProps<'GroupFacilitators'>) {
  const [facilitators, setFacilitators] = useState(params.facilitators || []);

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
            title='Facilitators'
            description='You can invite some members to become facilitators for the group. These people can help manage the group.'
          />
        </View>
        <View style={{ backgroundColor: 'transparent' }} className='mb-4'>
          <Button
            text='Send Invitation'
            leftIcon='mail-outline'
            onPress={() => {
              Share.share({
                message: 'https://www.veor.org/',
                title: 'Invite friends to join',
              });
            }}
          />
        </View>
        <Button
          text='Add Facilitator'
          leftIcon='add-outline'
          rightIcon='chevron-forward-outline'
        />
      </ScrollView>
    </LinearGradient>
  );
}
