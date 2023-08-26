import { LinearGradient } from 'expo-linear-gradient';
import { Group } from '@prisma/client';
import React, { useState, useEffect } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import { Text, View } from '../components/Themed';
import { GroupStackScreenProps } from '../types';
import GroupService from '../services/group';
import { canvasImages } from '../constants/canvasImages';
import { topicsConvertToEnum } from '../constants/topics';
import ChatStatusContext from '../components/ChatStatus';
import LoadingStatusContext from '../components/LoadingStatus';
export default function GroupCategory({
  navigation,
  route,
}: GroupStackScreenProps<'GroupCategoryList'>) {
  const currentCategory = route.params.category;
  const [groups, setGroups] = useState<Group[]>([]);
  const chatStatusCtx = React.useContext(ChatStatusContext);
  const { setLoadingStatus } = React.useContext(LoadingStatusContext);
  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await GroupService.fetchGroupsByCategory({
        category: topicsConvertToEnum[currentCategory],
      });
      setGroups(data.data);
    };
    fetchGroups();
  }, []);
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className=' px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false} className='pt-4'>
        {groups.map((_, index) => (
          <Pressable
            onPress={() => {
              chatStatusCtx.setHideBottomBar(true);
              setLoadingStatus({ isLoading: true });
              //this is to prevent the page shows before the bottom bar is hidden, if there still have gap between chat input box and bottom, we have to show bottom bar in chat conversation page.
              setTimeout(() => {
                setLoadingStatus({ isLoading: false });
                navigation.navigate('GroupDetail', { groupId: _.id });
              }, 100);
            }}
            className='bg-white rounded-lg mb-4'
            key={index}
          >
            <View
              className='flex flex-row items-center'
              style={{ backgroundColor: 'transparent' }}
            >
              <Image
                source={canvasImages[_.canvas]}
                className='h-[60px] w-[60px] m-4'
              />
              <View className='h-10 flex flex-col justify-between'>
                <Text className='font-bold text-Midnight-Mosaic text-[17px] '>
                  {_.title}
                </Text>
                <View className='flex flex-row items-center'>
                  <View className='h-2 w-2 bg-cranberry mr-2 rounded-full'></View>
                  <Text className='text-storm'>Last activity 30 mins ago</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
