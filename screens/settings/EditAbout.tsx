import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserStackScreenProps } from '../../types';
import LoadingStatusContext from '../../components/LoadingStatus';
import { UserService } from '../../services/user';

export default function EditAbout({
  navigation,
}: UserStackScreenProps<'EditAbout'>) {
  const [nickname, serNickname] = useState('');
  const { user, setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const [about, setAbout] = useState(user.listenerProfile?.about || '');

  const handleUpdate = async () => {
    setLoadingStatus({ isLoading: true });
    try {
      if (!user.id) throw 'No user id';
      const { data } = await UserService.updateListenerProfile({
        userId: user.id,
        data: { about },
      });
      if (!data) throw 'failed to update about';
      setUser({ ...user, listenerProfile: data });
      setLoadingStatus({ isLoading: false });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      setLoadingStatus({ isLoading: false });
    }
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled
        keyboardVerticalOffset={100}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='p-5 mt-3 rounded-xl'>
            <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
              Edit story about you
            </Text>
            <Text className='text-storm text-[17px] '>
              Building trust with anyone you want to support from the start by
              telling them a little bit about yourself.
            </Text>
          </View>
          <TextInput
            value={about}
            onChangeText={(text) => setAbout(text)}
            className='mt-4 p-4 mb-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            placeholder='Tell us a bit about yourself...'
            textAlignVertical='top'
          />
          <View
            className='w-full my-3'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='items-center justify-center h-12 rounded-lg bg-jade'>
              <Pressable onPress={() => handleUpdate()}>
                <Text className='text-lg font-bold text-white'>Done</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
