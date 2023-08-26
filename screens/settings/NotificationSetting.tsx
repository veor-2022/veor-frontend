import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView } from 'react-native';
import SwitchPill from '../../components/SwitchPill';
import { View } from '../../components/Themed';

export default function NotificationSetting() {
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='mb-4' style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='Pending Chat Requests'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='New Messages'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View className='border border-neutral-grey-200 border-0.5 my-6'></View>
        <View style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='Add-to-Support Requests'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View className='border border-neutral-grey-200 border-0.5 my-6'></View>
        <View className='mb-4' style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='Group Invitations'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View className='mb-4' style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='Group Updates'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View className='mb-4' style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='New members'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
        <View className='mb-4' style={{ backgroundColor: 'transparent' }}>
          <SwitchPill
            title='New Group Messages'
            switchValue={true}
            onSwitchChange={() => {}}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
