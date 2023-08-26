import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Group, GroupEnrollment, User } from '@prisma/client';
import { tagToColor } from '../../constants/tags';
import { EnumConvertToTopics } from '../../constants/topics';
interface props {
  data: Group & { members: (GroupEnrollment & { user: User })[] };
}

export default function GroupDetailAbout({ data }: props) {
  return data ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'transparent' }}
      className='mt-2'
    >
      <Text className='ml-2 text-2xl text-midnight-mosaic'>About</Text>
      <View
        className='flex flex-row items-center'
        style={{ backgroundColor: 'transparent' }}
      >
        <View
          className='flex flex-row items-center mt-2 ml-2'
          style={{ backgroundColor: 'transparent' }}
        >
          <View className='p-2 mr-2 bg-midnight-mosaic rounded-xl'>
            <Feather name='globe' size={20} color='white' />
          </View>
          <Text className='text-lg font-semibold text-midnight-mosaic'>
            {data.public ? 'Public' : 'Private'}
          </Text>
        </View>
        <View
          className='flex flex-row items-center mt-2 ml-4'
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className={
              'p-2 rounded-xl mr-2 w-[38px] h-[38px] ' + tagToColor[data.topic]
            }
          ></View>
          <Text className='text-lg font-semibold text-midnight-mosaic'>
            {EnumConvertToTopics[data.topic]}
          </Text>
        </View>
      </View>
      <View className='px-2 mt-2' style={{ backgroundColor: 'transparent' }}>
        <Text className='mt-2 text-2xl text-midnight-mosaic'>
          Group Description
        </Text>
        <Text className='mb-2 text-lg text-midnight-mosaic'>
          {data.description}
        </Text>
      </View>

      <View className='pb-24 ml-2' style={{ backgroundColor: 'transparent' }}>
        {data.meetingInfo || data.meetingSchedule || data.meetingLink ? (
          <Text className='mt-2 text-2xl text-midnight-mosaic'>Meetings</Text>
        ) : null}
        {data.meetingInfo ? (
          <View style={{ backgroundColor: 'transparent' }}>
            <Text className='mt-2 text-xl font-semibold text-midnight-mosaic'>
              Meeting Schedule
            </Text>
            <Text className='text-lg text-midnight-mosaic'>
              {data.meetingInfo}
            </Text>
          </View>
        ) : null}
        {data.meetingSchedule ? (
          <View style={{ backgroundColor: 'transparent' }}>
            <Text className='mt-4 text-xl font-semibold text-midnight-mosaic'>
              Meeting Time
            </Text>
            <Text className='text-lg text-midnight-mosaic'>
              {data.meetingSchedule}
            </Text>
          </View>
        ) : null}
        {data.meetingLink ? (
          <View style={{ backgroundColor: 'transparent' }}>
            <Text className='mt-4 text-xl font-semibold text-midnight-mosaic'>
              Meeting Link
            </Text>
            <Text
              onPress={() => Linking.openURL(data.meetingLink as string)}
              className='text-lg text-link'
            >
              {data.meetingLink}
            </Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  ) : (
    <View style={{ backgroundColor: 'transparent' }}></View>
  );
}
