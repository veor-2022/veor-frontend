import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Image, Pressable, ScrollView } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { Text, View } from '../components/Themed';
import UserContext from '../components/User';
import { emotions } from '../constants/emotions';
import { CheckInService } from '../services/checkIn';
import { UserStackScreenProps } from '../types';
import Chats from './user-detail/Chats';
import CheckIns from './user-detail/CheckIns';
import Groups from './user-detail/Groups';
import ListenerProfile from './user-detail/Profile';
import Support from './user-detail/Support';
import TrainingPrograms from './user-detail/Training';
import { CheckIn } from '@prisma/client';
import dayjs from 'dayjs';
import { tagToColor } from '../constants/tags';
import { useIsFocused } from '@react-navigation/native';
import { emotionColors } from '../constants/emotions';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import ChatStatusContext from '../components/ChatStatus';
import { unScreamingSnakeCase } from '../constants/helpers';
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export default function UserScreen({
  navigation,
  route,
}: UserStackScreenProps<'UserHome'>) {
  const { user } = useContext(UserContext);
  const tabBars = [
    'Check-Ins',
    'Groups',
    'Chats',
    'My Support',
    user.listenerProfile ? 'Listener Profile' : null,
    'Training Programs',
  ];
  const { setHideBottomBar } = useContext(ChatStatusContext);
  const isFocused = useIsFocused();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [tabBarSelect, setTabBarSelect] = useState(0);
  const [checkIns, setCheckIns] = useState([]);
  const [checkInCalendarData, setCheckInCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedData, setSelectedData] = useState([]);

  const fetchCheckIns = async () => {
    const { data: _checkIns } = await CheckInService.fetCheckInsByUser(user.id);
    const checkInCalendarData: any = {};
    _checkIns.forEach((element: CheckIn) => {
      const date = dayjs(element.takenAt).format('YYYY-MM-DD');
      if (!!Object.keys(checkInCalendarData).find((key) => key === date)) {
        if (checkInCalendarData[date].dots.length < 3) {
          checkInCalendarData[date].dots.push({
            key: element.emotion,
            color: emotionColors[element.emotion][0],
          });
        } else {
          return;
        }
        return;
      } else {
        checkInCalendarData[date] = {
          dots: [
            { key: element.emotion, color: emotionColors[element.emotion][0] },
          ],
        };
      }
    });
    setCheckIns(_checkIns);
    setCheckInCalendarData(checkInCalendarData);
    const isShowCheckInModal = !!route.params?.isShowModal;
    if (isShowCheckInModal) {
      const selectedCheckIns = _checkIns.filter((checkIn: CheckIn) => {
        const date = dayjs(checkIn.takenAt).format('YYYY-MM-DD');
        return (
          date === dayjs(new Date().toLocaleDateString()).format('YYYY-MM-DD')
        );
      });
      setSelectedData(selectedCheckIns);
      setTabBarSelect(0);
      setModalVisible(true);
      setSelectedDate(new Date().toLocaleDateString());
      navigation.setParams({ isShowModal: false });
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchCheckIns();
    }
  }, [isFocused]);

  useEffect(() => {
    if (selectedDate && !route.params?.isShowModal) {
      const selectedCheckIns = checkIns.filter((checkIn: CheckIn) => {
        const date = dayjs(checkIn.takenAt).format('YYYY-MM-DD');
        return date === selectedDate;
      });
      setSelectedData(selectedCheckIns);
    }
  }, [selectedDate]);

  const confirmDeleteCheckIn = (id: string) => {
    Alert.alert(
      'Are you sure?',
      'Deleting this check-in will remove it from your check-in history.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteCheckIn(id),
        },
      ]
    );
  };

  const handleDeleteCheckIn = async (id: string) => {
    const { data } = await CheckInService.deleteCheckIn(id);
    if (!data) return;
    selectedData.splice(
      selectedData.findIndex((checkIn: CheckIn) => checkIn.id === id),
      1
    );
    setSelectedData([...selectedData]);
    fetchCheckIns();
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={
          'relative overflow-visible ' +
          (Platform.OS === 'ios' ? 'pt-16' : 'pt-8')
        }
        style={{ backgroundColor: 'transparent' }}
      >
        <View
          className='flex flex-row justify-between'
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className='w-[60px]'
            style={{ backgroundColor: 'transparent' }}
          ></View>
          <View
            className='flex-row items-center justify-center flex-1'
            style={{ backgroundColor: 'transparent' }}
          >
            <Text className='text-2xl font-semibold text-midnight-mosaic'>
              Me
            </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate('Settings');
            }}
            className='w-[40px] h-[40px] flex flex-row justify-center items-center mr-7 '
          >
            <Ionicons size={28} name='settings-outline' color='#3D5467' />
          </Pressable>
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          className='pb-4 mt-4 ml-6'
        >
          {tabBars.map((tab, index) => {
            if (tab) {
              return (
                <Pressable
                  onPress={() => setTabBarSelect(index)}
                  key={tab}
                  className={
                    index == tabBarSelect
                      ? 'bg-jade px-4 py-2 rounded-full mr-2'
                      : 'bg-white border border-neutral-grey px-4 py-2 rounded-full mr-2'
                  }
                >
                  <Text
                    className={
                      index == tabBarSelect
                        ? 'text-white text-[14px] font-semibold'
                        : 'text-midnight-mosaic text-[14px] font-semibold'
                    }
                  >
                    {tab}
                  </Text>
                </Pressable>
              );
            }
          })}
        </ScrollView>

        {tabBarSelect == 0 && (
          <CheckIns
            navigation={navigation}
            isDayModalVisible={isModalVisible}
            setDayModalVisible={setModalVisible}
            openDayModal={() => {
              setModalVisible(true);
            }}
            checkInCalendarData={checkInCalendarData}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
        {tabBarSelect == 1 && <Groups navigation={navigation} />}
        {tabBarSelect == 2 && <Chats navigation={navigation} />}
        {tabBarSelect == 3 && <Support navigation={navigation} />}
        {tabBarSelect == 4 && <ListenerProfile />}
        {tabBarSelect == 5 && <TrainingPrograms navigation={navigation} />}
      </ScrollView>

      <Modal
        backdropOpacity={0.7}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          margin: 0,
        }}
        coverScreen={false}
        className='relative flex justify-end rounded-t-lg'
        isVisible={isModalVisible}
        onModalHide={() => {
          setHideBottomBar(false);
        }}
        onModalShow={() => {
          setHideBottomBar(true);
        }}
      >
        <View className='max-h-[65%] rounded-t-lg'>
          <LinearGradient
            locations={[0.7, 1]}
            colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
            className='z-50 px-4 py-10 pt-4 rounded-t-lg'
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{ backgroundColor: 'transparent' }}
                className='flex flex-row items-center justify-center w-full mb-6'
              >
                <Text className='text-midnight-mosaic text-center font-bold text-[15px] pt-4'>
                  {dayjs(selectedDate).format('MMMM D, YYYY')}
                </Text>
              </View>
              <GestureHandlerRootView
                className='mb-20'
                style={{ backgroundColor: 'transparent' }}
              >
                {selectedData.map((element: CheckIn, index: number) => (
                  <Swipeable
                    key={index}
                    friction={1}
                    leftThreshold={30}
                    renderRightActions={() => (
                      <View
                        style={{ backgroundColor: 'transparent' }}
                        className='px-2'
                      >
                        <Pressable
                          onPress={() => confirmDeleteCheckIn(element.id)}
                          className='flex flex-row items-center justify-center w-10 h-10 mt-4 rounded-lg bg-cranberry'
                        >
                          <View className='w-6 h-1 bg-white rounded-full'></View>
                        </Pressable>
                      </View>
                    )}
                  >
                    <View
                      style={{ backgroundColor: 'transparent' }}
                      className='flex flex-row w-full mb-8'
                    >
                      <View
                        className='flex flex-col items-center w-1/5'
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <View className='w-20 p-2 rounded-lg'>
                          <Image
                            className='relative w-10 h-10 m-auto left-1'
                            source={emotions[element.emotion]}
                          ></Image>
                          <Text className='font-semibold text-center text-storm text-md'>
                            {element.emotion[0] +
                              element.emotion.slice(1).toLowerCase()}
                          </Text>
                        </View>

                        <Text className='text-storm mt-2 text-[12px]'>
                          {new Date(element.takenAt).toLocaleTimeString(
                            'en-US',
                            {
                              hour12: true,
                              minute: 'numeric',
                              hour: 'numeric',
                            }
                          )}
                        </Text>
                      </View>
                      <View
                        style={{ backgroundColor: 'transparent' }}
                        className='w-4/5 pl-2'
                      >
                        <View className='p-1 px-2 rounded-lg'>
                          <View
                            style={{ backgroundColor: 'transparent' }}
                            className='flex flex-row flex-wrap gap-y-2'
                          >
                            {element.tags.map((tag: string, index: number) => (
                              <View
                                key={tag + index}
                                className='flex flex-row items-center mr-2 '
                                style={{ backgroundColor: 'transparent' }}
                              >
                                <View
                                  className={
                                    tagToColor[tag] + ' h-6 w-6 rounded-md'
                                  }
                                ></View>
                                <Text className='ml-1 font-semibold text-midnight-mosaic'>
                                  {unScreamingSnakeCase(tag)}
                                </Text>
                              </View>
                            ))}
                          </View>
                          <Text className='pr-4 my-2 text-lg text-storm'>
                            {element.notes || ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Swipeable>
                ))}
              </GestureHandlerRootView>
            </ScrollView>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}
