import React from 'react';
import { ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Group, GroupEnrollment, User } from '@prisma/client';
interface props {
  data: Group & { members: (GroupEnrollment & { user: User })[] };
}

export default function GroupDetailGuidelines({ data }: props) {
  return data ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: 'transparent' }}
      className='mt-2 mb-40'
    >
      <Text className='ml-2 text-2xl text-midnight-mosaic'>Guidelines</Text>

      <View className='mt-6 px-2' style={{ backgroundColor: 'transparent' }}>
        <Text className=' text-midnight-mosaic text-xl mb-4'>
          {data.guidelines}
        </Text>
      </View>
    </ScrollView>
  ) : (
    <View style={{ backgroundColor: 'transparent' }}></View>
  );
}
