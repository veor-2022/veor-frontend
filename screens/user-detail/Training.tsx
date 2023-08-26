import React, { useEffect, useContext, useState } from 'react';
import { Image, Pressable } from 'react-native';
import { Text, View } from '../../components/Themed';
import { ProgramService } from '../../services/programs';
import UserContext from '../../components/User';
import { Program } from '@prisma/client';
import { AntDesign } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../types';
import { useIsFocused } from '@react-navigation/native';
interface Props {
  navigation: NativeStackNavigationProp<
    UserStackParamList,
    'UserHome',
    undefined
  >;
}

export default function UserDetailTraining({ navigation }: Props) {
  const { user } = useContext(UserContext);
  const isFocused = useIsFocused();
  const [programs, setPrograms] = useState<Program[]>([]);
  useEffect(() => {
    const fetchPrograms = async () => {
      if (isFocused) {
        const { data } = await ProgramService.getUserPrograms({
          userId: user.id,
        });
        setPrograms(data);
      }
    };
    fetchPrograms();
  }, [isFocused]);
  const LTP = programs.find((p) => p.type === 'LISTENER');
  const FTP = programs.find((p) => p.type === 'FACILITATOR');

  return (
    <View className='mt-4 px-4' style={{ backgroundColor: 'transparent' }}>
      <View className='rounded-lg mb-4 p-3'>
        <View
          className='flex flex-row justify-between items-start'
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className='flex flex-row flex-shrink'
            style={{ backgroundColor: 'transparent' }}
          >
            <Image
              source={require('../../assets/images/icon.png')}
              className='h-[60px] w-[60px] rounded-md mr-3'
            />
            <View
              className='flex flex-col flex-shrink'
              style={{ backgroundColor: 'transparent' }}
            >
              <Text className='mb-1 font-bold text-midnight-mosaic text-[20px] '>
                Listener Training Program
              </Text>

              {LTP && LTP.status === 'ACCEPTED' && (
                <View className=' bg-neutral-grey-100 rounded-md w-48 p-2 flex flex-row items-center justify-center mt-1 mb-2'>
                  <AntDesign name='checkcircle' size={18} color='#41B89C' />
                  <Text className='ml-2 font-bold text-jade'>
                    Training Completed
                  </Text>
                </View>
              )}

              {LTP && LTP.status === 'REVIEWING' && (
                <View className=' bg-neutral-grey-100 rounded-full w-48 p-2 flex flex-row items-center justify-center mt-1 mb-2'>
                  <AntDesign name='clockcircleo' size={18} color='#F38D68' />
                  <Text className='ml-2 font-bold text-melon-red '>
                    Waiting for Review
                  </Text>
                </View>
              )}
              {(!LTP ||
                LTP.status === 'REJECTED' ||
                LTP.status === 'INCOMPLETE') && (
                <Text className='mb-2 font-bold text-storm text-[15px] '>
                  Estimated Time: 30 mins
                </Text>
              )}

              <Text className='mb-2 text-storm text-[15px]'>
                {LTP &&
                  LTP.status === 'REVIEWING' &&
                  'Thank you for completing the program. We are currently reviewing your final step answers.'}
                {LTP &&
                  LTP.status === 'ACCEPTED' &&
                  'Congratulations! You have earned the Listener badge!'}
                {(!LTP ||
                  LTP.status === 'REJECTED' ||
                  LTP.status === 'INCOMPLETE') &&
                  'Become a Veor Listener and earn the Listener badge.'}
              </Text>
              {(!LTP ||
                LTP.status === 'REJECTED' ||
                LTP.status === 'INCOMPLETE') && (
                <Pressable
                  className='mt-2 bg-jade rounded-full px-4 py-2 w-20 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgram', {
                      type: 'LISTENER',
                    });
                  }}
                >
                  <Text className='text-white font-semibold'>Begin</Text>
                </Pressable>
              )}
              {LTP && LTP.status === 'ACCEPTED' && (
                <Pressable
                  className='mt-2 bg-white border-jade border rounded-full px-3 py-2 w-48 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgramVideo', {
                      type: 'LISTENER',
                    });
                  }}
                >
                  <Text className='text-jade font-semibold text-lg'>
                    Review Training
                  </Text>
                </Pressable>
              )}
              {LTP && LTP.status === 'REVIEWING' && (
                <Pressable
                  className='mt-2 bg-white border-jade border rounded-full px-3 py-2 w-48 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgramVideo', {
                      type: 'LISTENER',
                    });
                  }}
                >
                  <Text className='text-jade font-semibold text-lg'>
                    View Training
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>

      <View className='rounded-lg mb-4 p-3'>
        <View
          className='flex flex-row justify-between items-start'
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            className='flex flex-row flex-shrink'
            style={{ backgroundColor: 'transparent' }}
          >
            <Image
              source={require('../../assets/images/FTP_icon.png')}
              className='h-[60px] w-[60px] rounded-md mr-3'
            />
            <View
              className='flex flex-col flex-shrink'
              style={{ backgroundColor: 'transparent' }}
            >
              <Text className='mb-1 font-bold text-midnight-mosaic text-[20px] '>
                Facilitator Training Program
              </Text>
              {FTP && FTP.status === 'ACCEPTED' && (
                <View className=' bg-neutral-grey-100 rounded-md w-48 p-2 flex flex-row items-center justify-center mt-1 mb-2'>
                  <AntDesign name='checkcircle' size={18} color='#41B89C' />
                  <Text className='ml-2 font-bold text-jade'>
                    Training Completed
                  </Text>
                </View>
              )}
              {FTP && FTP.status === 'REVIEWING' && (
                <View className=' bg-neutral-grey-100 rounded-md w-48 p-2 flex flex-row items-center justify-center mt-1 mb-2'>
                  <AntDesign name='clockcircleo' size={18} color='#F38D68' />
                  <Text className='ml-2 font-bold text-melon-red '>
                    Waiting for Review
                  </Text>
                </View>
              )}
              {(!FTP ||
                FTP.status === 'REJECTED' ||
                FTP.status === 'INCOMPLETE') && (
                <Text className='mb-2 font-bold text-storm text-[15px] '>
                  Estimated Time: 30 mins
                </Text>
              )}
              <Text className='mb-2 text-storm text-[15px]'>
                {FTP &&
                  FTP.status === 'REVIEWING' &&
                  'Thank you for completing the program. We are currently reviewing your final step answers.'}
                {FTP &&
                  FTP.status === 'ACCEPTED' &&
                  'Congratulations! You have earned the Facilitator badge!'}
                {(!FTP ||
                  FTP.status === 'REJECTED' ||
                  FTP.status === 'INCOMPLETE') &&
                  'Earn your Facilitator badge by completing this training.'}
              </Text>
              {(!FTP ||
                FTP.status === 'REJECTED' ||
                FTP.status === 'INCOMPLETE') && (
                <Pressable
                  className='mt-2 bg-jade rounded-full px-4 py-2 w-20 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgram', {
                      type: 'FACILITATOR',
                    });
                  }}
                >
                  <Text className='text-white font-semibold'>Begin</Text>
                </Pressable>
              )}
              {FTP && FTP.status === 'ACCEPTED' && (
                <Pressable
                  className='mt-2 bg-white border-jade border rounded-full px-3 py-2 w-48 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgramVideo', {
                      type: 'LISTENER',
                    });
                  }}
                >
                  <Text className='text-jade font-semibold text-lg'>
                    Review Training
                  </Text>
                </Pressable>
              )}
              {FTP && FTP.status === 'REVIEWING' && (
                <Pressable
                  className='mt-2 bg-white border-jade border rounded-full px-3 py-2 w-48 flex justify-center items-center'
                  onPress={() => {
                    navigation.navigate('TrainingProgramVideo', {
                      type: 'LISTENER',
                    });
                  }}
                >
                  <Text className='text-jade font-semibold text-lg'>
                    View Training
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
