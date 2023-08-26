import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useContext } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import Button from '../components/Button';
import { View, Text } from '../components/Themed';
import UserAvatar from '../components/UserAvatar';
import { UserService } from '../services/user';
import StarRating from 'react-native-star-rating';
import UserContext from '../components/User';
import {
  HomeStackScreenProps,
  UserStackScreenProps,
  ChatStackScreenProps,
} from '../types';

export default function GroupDescription({
  navigation,
  route: { params },
}:
  | HomeStackScreenProps<'ListenerReview'>
  | UserStackScreenProps<'ListenerReview'>
  | ChatStackScreenProps<'ListenerReview'>) {
  const { userId } = params;
  const { user } = useContext(UserContext);
  const [listener, setListener] = useState<{
    displayName: string;
    nickName: string;
    profilePicture: string;
  } | null>(null);
  const [starCount, setStarCount] = useState(5);
  const [comment, setComment] = useState('');

  const fetchUserById = async () => {
    const { data: response } = await UserService.fetchUserPublicInfo(userId);
    if (!response) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.)');
    }
    setListener(response);
  };

  useEffect(() => {
    fetchUserById();
  }, [userId]);

  const handleSubmit = async () => {
    const { data: response } = await UserService.createReview({
      userId: user.id,
      rating: starCount,
      content: comment,
      targetListenerId: userId,
    });
    if (!response)
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full pt-16'
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='relative p-6 overflow-visible'
          style={{ backgroundColor: 'transparent' }}
        >
          {listener && (
            <View className='mb-10' style={{ backgroundColor: 'transparent' }}>
              <View
                className='relative z-10 mx-auto top-8'
                style={{ backgroundColor: 'transparent' }}
              >
                <UserAvatar
                  size={40}
                  name={listener.nickName || listener.displayName}
                  url={listener.profilePicture}
                />
              </View>
              <View className='flex flex-col items-center justify-center pb-4 rounded-lg '>
                <Text className='mt-12 mb-2 text-2xl font-semibold text-midnight-mosaic'>
                  {listener.nickName || listener.displayName}
                </Text>
                <StarRating
                  emptyStarColor='#DADADA'
                  fullStarColor='#FFD700'
                  starSize={28}
                  disabled={false}
                  maxStars={5}
                  rating={starCount}
                  selectedStar={(rating) => setStarCount(rating)}
                />
              </View>
              <TextInput
                className='p-4 my-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
                multiline
                numberOfLines={10}
                placeholder='How was your experience with this Listener?'
                value={comment}
                onChangeText={setComment}
                textAlignVertical='top'
              />
              <Button
                onPress={() => handleSubmit()}
                backgroundColor='bg-jade'
                textColor='text-white'
                text='SUBMIT'
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
