import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Emotion } from 'prisma-enum';
import React, { useContext, useState } from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { emotions } from '../../constants/emotions';
import { capitalize } from '../../constants/helpers';
import { UserStackParamList } from '../../types';
export default function UserDetailCheckIns({
  navigation,
  isDayModalVisible,
  setDayModalVisible,
  openDayModal,
  checkInCalendarData,
  selectedDate,
  setSelectedDate,
}: {
  navigation: NativeStackNavigationProp<
    UserStackParamList,
    'UserHome',
    undefined
  >;
  isDayModalVisible: boolean;
  setDayModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  openDayModal: () => void;
  checkInCalendarData: any;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <View style={{ backgroundColor: 'transparent' }} className='mt-2 ml-7'>
        <Text className='text-xl font-semibold text-midnight-mosaic'>
          How are you feeling?
        </Text>
      </View>
      <View
        style={{ backgroundColor: 'transparent' }}
        className='flex-row flex-wrap justify-around gap-4 px-5 pt-6'
      >
        <FlatList
          scrollEnabled={false}
          data={Object.keys(emotions)}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CreateEmotion', { emotion: item });
              }}
              key={item}
              className='flex-1 h-28 m-2 rounded-[16px] justify-center items-center bg-white'
            >
              <Image
                className='relative left-1'
                source={emotions[item as Emotion]}
              />
              <Text className='text-storm font-bold text-[15px]'>
                {capitalize(item)}
              </Text>
            </TouchableOpacity>
          )}
          numColumns={4}
        />
      </View>
      <View style={{ backgroundColor: 'transparent' }} className='mt-6 ml-7'>
        <Text className='text-xl font-semibold text-midnight-mosaic'>
          Check-In History
        </Text>
      </View>
      <View
        className='pb-20 mt-4 px-7 rounded-xl'
        style={{ backgroundColor: 'transparent' }}
      >
        <Calendar
          theme={{
            selectedDayBackgroundColor: '#fff',
            selectedDayTextColor: '#3D5467',
            arrowColor: '#686963',
            stylesheet: {
              calendar: {
                main: {
                  container: {
                    borderRadius: '16px',
                  },
                },
              },
            },
          }}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            openDayModal();
          }}
          monthFormat={'MMMM yyyy'}
          markingType={'multi-dot'}
          markedDates={checkInCalendarData}
          hideExtraDays={true}
          firstDay={1}
          onPressArrowLeft={(subtractMonth) => subtractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          disableAllTouchEventsForDisabledDays={true}
          className='rounded-lg'
        />
      </View>
    </View>
  );
}
