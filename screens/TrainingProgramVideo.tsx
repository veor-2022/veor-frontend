import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import Button from '../components/Button';
import { View, Text } from '../components/Themed';
import Video from 'react-native-video';
import { UserStackScreenProps } from '../types';

export default function TrainingProgramVideoScreen({
  navigation,
  route: { params },
}: UserStackScreenProps<'TrainingProgramVideo'>) {
  const programType = params?.type;
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
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
                resizeMode='contain'
                //@ts-ignore
                className='w-full h-52'
                controls
                onError={(e) => {
                  Alert.alert(
                    'Oops!',
                    'Something went wrong. Please try again later.'
                  );
                }}
                source={{
                  uri: 'https://bctc-files.nyc3.cdn.digitaloceanspaces.com/veor-assets%2FListener%20Training%20Video.mp4',
                }}
              />
            ) : (
              <Video
                resizeMode='contain'
                //@ts-ignore
                className='w-full h-52'
                controls={true}
                onError={(e) => {
                  Alert.alert(
                    'Oops!',
                    'Something went wrong. Please try again later.'
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
              text='back'
              backgroundColor='bg-jade'
              textColor='text-white'
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
