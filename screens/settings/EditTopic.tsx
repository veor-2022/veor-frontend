import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Alert, Image, Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { topics, topicsConvertToEnum } from '../../constants/topics';
import { UserStackScreenProps } from '../../types';
import { UserService } from '../../services/user';
import { Ionicons } from '@expo/vector-icons';

export default function EditTopic({
  navigation,
}: UserStackScreenProps<'EditTopic'>) {
  const [nickname, serNickname] = useState('');
  const { user, setUser } = useContext(UserContext);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    user.listenerProfile?.topics || [],
  );

  const handleOnchange = (index: number) => {
    if (selectedTopics.includes(topicsConvertToEnum[topics[index].name])) {
      setSelectedTopics(
        selectedTopics.filter(
          (topic) => topic !== topicsConvertToEnum[topics[index].name],
        ),
      );
    } else {
      setSelectedTopics([
        ...selectedTopics,
        topicsConvertToEnum[topics[index].name],
      ]);
    }
  };

  const handleSubmit = async () => {
    const { data } = await UserService.updateListenerProfile({
      userId: user.id,
      data: {
        topics: selectedTopics,
      },
    });
    if (!data) {
      return Alert.alert(
        'Oops!',
        'Something went wrong. Please try again later.',
      );
    }
    setUser({ ...user, listenerProfile: data });
    navigation.goBack();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='h-full px-5 pt-0'
      >
        <View className='p-5 mt-3 rounded-xl'>
          <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
            Select your topics
          </Text>
          <Text className='text-storm text-[17px] '>
            Please select any topics that you feel comfortable providing
            support.
          </Text>
        </View>
        <View style={{ backgroundColor: 'transparent' }} className='mt-8 mr-3 '>
          {topics.map((topic, index) => (
            <View
              key={index}
              className='flex flex-row items-center pr-10 mb-4'
              style={{ backgroundColor: 'transparent' }}
            >
              <View
                className={
                  'mr-3 rounded-lg ' +
                  (selectedTopics.includes(topicsConvertToEnum[topic.name])
                    ? ' bg-jade'
                    : ' bg-white')
                }
              >
                <Pressable
                  onPress={() => handleOnchange(index)}
                  className='flex items-center justify-center w-10 h-10'
                >
                  {selectedTopics.includes(topicsConvertToEnum[topic.name]) && (
                    <Ionicons name='checkmark' size={24} color='white' />
                  )}
                </Pressable>
                {/* <Checkbox
                  style={{ transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }] }}
                  className='relative w-10 h-10 border-0 rounded-lg'
                  color={'#41B89C'}
                  value={selectedTopics.includes(
                    topicsConvertToEnum[topic.name]
                  )}
                  onTouchStart={() => handleOnchange(index)}
                /> */}
              </View>
              <View className='flex flex-row items-center w-full p-2 rounded-lg'>
                <Image source={topic.image} className='w-12 h-10 mr-4' />
                <Text className='text-lg font-semibold text-midnight-mosaic'>
                  {topic.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View
          className='w-full my-6'
          style={{ backgroundColor: 'transparent' }}
        >
          <View className='items-center justify-center h-12 rounded-lg bg-jade'>
            <Pressable onPress={() => handleSubmit()}>
              <Text className='text-lg font-bold text-white'>DONE</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}
