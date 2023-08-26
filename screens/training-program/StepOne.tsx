import React, { useContext, useEffect, useState } from 'react';
import { Text, View } from '../../components/Themed';
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import { Alert } from 'react-native';

type props = {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  programType: 'LISTENER' | 'FACILITATOR';
  loading: boolean;
  userId: string;
};
export default function StepOne({
  programType,
  setCurrentStep,
  loading,
  userId,
}: props) {
  const [canGoNext, setCanGoNext] = useState(true);
  const [alreadyWatched, setAlreadyWatched] = useState(false);
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    AsyncStorage.getItem(`${programType}_${userId}`).then((value) => {
      if (value && value === 'true') {
        setCanGoNext(true);
        setAlreadyWatched(true);
      } else {
        const timeInMs = programType === 'LISTENER' ? 450000 : 705000;
        timeoutId = setTimeout(() => {
          AsyncStorage.setItem(`${programType}_${userId}`, 'true').then(() => {
            setCanGoNext(true);
          });
        }, timeInMs);
      }
    });
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  return (
    <View style={{ backgroundColor: 'transparent' }}>
      <View className='p-4 rounded-xl'>
        <View className='relative'>
          <View className='w-full h-2 rounded-full bg-neutral-grey-200 opacity-30'></View>
          <View className='absolute w-1/3 h-2 rounded-full bg-jade'></View>
        </View>

        <Text className='mt-2 mb-1 font-semibold text-storm'>Part 1/3</Text>
        <Text className='mb-2 text-xl font-semibold text-midnight-mosaic'>
          Quick Video
        </Text>
        <Text className='mb-4 text-md text-storm'>
          Please complete the training video and take notes as needed.
        </Text>
        {programType === 'LISTENER' ? (
          <Video
            paused={loading}
            resizeMode='contain'
            //@ts-ignore
            className='w-full h-52'
            controls
            onError={(e) => {
              Alert.alert(
                'Oops!',
                'Something went wrong. Please try again later.',
              );
            }}
            source={{
              uri: 'https://bctc-files.nyc3.cdn.digitaloceanspaces.com/veor-assets%2FListener%20Training%20Video.mp4',
            }}
          />
        ) : (
          <Video
            paused={loading}
            resizeMode='contain'
            //@ts-ignore
            className='w-full h-52'
            controls={true}
            onError={(e) => {
              Alert.alert(
                'Oops!',
                'Something went wrong. Please try again later.',
              );
            }}
            source={{
              uri: 'https://bctc-files.nyc3.cdn.digitaloceanspaces.com/veor-assets%2FFacilitator_Training_Program.mp4',
            }}
          />
        )}
      </View>
      <View style={{ backgroundColor: 'transparent' }} className='mt-4'>
        <Button
          text={alreadyWatched ? 'SKIP' : 'NEXT'}
          backgroundColor='bg-jade'
          textColor='text-white'
          disable={!canGoNext}
          onPress={() => {
            setCurrentStep(2);
          }}
        />
      </View>
    </View>
  );
}
