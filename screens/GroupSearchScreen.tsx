import { Ionicons } from '@expo/vector-icons';
import { Group, Message } from '@prisma/client';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { Text, View } from '../components/Themed';
import GroupService from '../services/group';
import { GroupStackScreenProps } from '../types';
import { canvasImages } from '../constants/canvasImages';
import ChatStatusContext from '../components/ChatStatus';
import LoadingStatusContext from '../components/LoadingStatus';
import dayjs from 'dayjs';
export default function GroupSearch({
  navigation,
  route,
}: GroupStackScreenProps<'GroupSearch'>) {
  const [inputSelected, setInputSelected] = useState(false);
  const [groups, setGroups] = useState<(Group & { messages: Message[] })[]>([]);
  const [allPublicGroups, setAllPublicGroups] = useState<
    (Group & { messages: Message[] })[]
  >([]);
  const chatStatusCtx = React.useContext(ChatStatusContext);
  const { setLoadingStatus } = React.useContext(LoadingStatusContext);
  const handleSearchGroups = async (text: string) => {
    if (text) {
      const { data } = await GroupService.searchGroups({
        searchQuery: text,
      });
      setGroups(data.data);
    } else {
      setGroups(allPublicGroups);
    }
  };
  useEffect(() => {
    const fetchPublicGroups = async () => {
      const { data } = await GroupService.fetchPublicGroups();
      setAllPublicGroups(data);
      setGroups(data);
    };
    fetchPublicGroups();
  }, []);
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false} className='pt-10'>
        <View
          style={{ backgroundColor: 'transparent' }}
          className='relative pb-10'
        >
          <View className='absolute left-3 top-[18px] z-50'>
            <Ionicons name='search' size={24} color='#3D5467' />
          </View>

          <TextInput
            onChangeText={(text) => {
              handleSearchGroups(text);
            }}
            onFocus={() => setInputSelected(true)}
            onBlur={() => setInputSelected(false)}
            className={
              inputSelected
                ? 'mb-4 pt-3 pb-4 text-xl pl-12 pr-4 border-2 border-white border-b-jade bg-white rounded-lg  text-midnight-mosaic'
                : 'mb-4 py-3 text-xl pl-12 pr-4 border-2 border-white bg-white rounded-lg  text-midnight-mosaic'
            }
            placeholder='Search for group'
          />

          {groups.length
            ? groups.map((_, index) => (
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
                      className='h-[60px] w-[60px] m-4 rounded-lg'
                    />
                    <View className='h-10 flex flex-col justify-between'>
                      <Text
                        className='font-bold text-Midnight-Mosaic text-[17px]'
                        numberOfLines={1}
                        style={{
                          maxWidth: Dimensions.get('window').width * 0.6,
                        }}
                      >
                        {_.title}
                      </Text>
                      <View className='flex flex-row items-center'>
                        <View className='h-2 w-2 bg-cranberry mr-2 rounded-full'></View>
                        <Text className='text-storm'>
                          {_.messages.length === 0
                            ? 'No Activity'
                            : `Last activity ${dayjs(
                                _.messages[0].sentAt
                              ).fromNow()}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))
            : null}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
