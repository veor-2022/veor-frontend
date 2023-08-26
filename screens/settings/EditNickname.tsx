import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';
import SwitchPill from '../../components/SwitchPill';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserStackScreenProps } from '../../types';
import { UserService } from '../../services/user';

export default function EditNickname({
  navigation,
}: UserStackScreenProps<'EditNickname'>) {
  const { user, setUser } = useContext(UserContext);
  const [nickname, setNickname] = useState(user.nickname || '');
  const [isAnonymous, setIsAnonymous] = useState(!!user.nickname);

  const handleSubmit = async () => {
    if (isAnonymous && nickname.length > 15) {
      Alert.alert('Oops!', 'Nickname must be less than 15 characters.');
      return;
    }
    const newNickname = isAnonymous ? nickname : '';

    const updatedUser = await UserService.updateUserInfo({
      userId: user.id,
      data: {
        nickname: newNickname,
      },
    });
    if (!updatedUser.data) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      return;
    }
    setUser({ ...user, nickname: newNickname });
    navigation.goBack();
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='p-5 mt-3 rounded-xl'>
          <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
            Enter a Nickname
          </Text>
          <Text className='text-storm text-[17px] '>
            To remain anonymous, please tell us what we should call you.
          </Text>
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <View
            className='flex-col justify-center flex-1'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='mt-4 rounded-xl'>
              <SwitchPill
                title='Remain Anonymous'
                switchValue={isAnonymous}
                onSwitchChange={() => setIsAnonymous(!isAnonymous)}
              />
            </View>
            {isAnonymous && (
              <View className='mt-4 rounded-lg'>
                <TextInput
                  className='p-3 text-xl leading-6'
                  placeholder='Nickname'
                  onChangeText={setNickname}
                  value={nickname}
                />
              </View>
            )}

            <Pressable
              onPress={() => handleSubmit()}
              className='items-center justify-center flex-1 h-12 mt-8 rounded-lg bg-jade'
            >
              <Text className='text-lg font-bold text-white'>DONE</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
