import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, ScrollView, TextInput, Alert } from 'react-native';
import SwitchPill from '../../components/SwitchPill';
import { Text, View } from '../../components/Themed';
import UserContext, { initialUser } from '../../components/User';
import { UserService } from '../../services/user';
import { UserStackScreenProps } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken } from '../../services/axios';
import LoadingStatusContext from '../../components/LoadingStatus';
import auth from '@react-native-firebase/auth';

export default function AccountSetting({
  navigation,
}: UserStackScreenProps<'AccountSetting'>) {
  const fbAuth = auth();
  const { user, setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const [emailInputState, setEmailInputState] = useState(0);
  const [currPasswordInputState, setCurrPasswordInputState] = useState(0);
  const [newPasswordInputState, setNewPasswordInputState] = useState(0);
  const [confirmPasswordInputState, setConfirmPasswordInputState] = useState(0);
  const [thirdParty, setThirdParty] = useState(true);
  const [email, setEmail] = useState(user.email);
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const checkThirdParty = async () => {
      // loop thru providerData to see if there is a providerId that is not password
      // @ts-ignore
      const { providerData } = await fbAuth.currentUser;
      for (let i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === 'password') {
          setThirdParty(false);
          return;
        }
      }
      setThirdParty(true);
    };
    checkThirdParty();
  }, [user]);

  const updateNewspaper = async () => {
    setLoadingStatus({ isLoading: true });
    try {
      if (!user.id) throw 'No user id';
      const { data } = await UserService.updateUserInfo({
        userId: user.id,
        data: { receiveNewsletter: !user.receiveNewsletter },
      });
      if (!data) throw 'failed to update newsletter';
      setUser({ ...user, receiveNewsletter: !user.receiveNewsletter });
      setLoadingStatus({ isLoading: false });
    } catch (error) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      setLoadingStatus({ isLoading: false });
    }
  };

  const handleUpdate = async () => {
    if (!newPassword) {
      return alert('Please enter a new password');
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please try again');
      return;
    }
    const { data } = await UserService.updatePassword({
      userId: user.id,
      newPassword: newPassword,
      oldPassword: currPassword,
    });
    if (!data)
      return Alert.alert(
        'Oops!',
        'Something went wrong, please try again later'
      );
    setConfirmPassword('');
    setCurrPassword('');
    setNewPassword('');
  };

  const handleDelete = async () => {
    Alert.alert(
      'Are you sure?',
      'You are about to delete this account. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setLoadingStatus({ isLoading: true });
            const { data } = await UserService.deleteUser(user.id);
            if (!data) return;
            await AsyncStorage.removeItem('token');
            setToken('');
            setUser(initialUser);
            navigation.navigate('Auth');
            fbAuth.signOut();
            setLoadingStatus({ isLoading: false });
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false} className='px-5'>
        <Text className='mb-1 text-lg font-semibold text-midnight-mosaic'>
          Email
        </Text>
        <TextInput
          // editable={!thirdParty}
          editable={false}
          onChangeText={(text) => setEmail(text)}
          value={email}
          onFocus={() => setEmailInputState(1)}
          onBlur={() => setEmailInputState(0)}
          className={
            emailInputState == 1
              ? 'p-3 leading-6 text-xl border-2 border-white border-b-jade bg-white rounded-lg  text-midnight-mosaic mb-4'
              : 'p-3 leading-6 text-xl border-2 border-white bg-white rounded-lg  text-midnight-mosaic mb-4'
          }
          placeholder='Enter your email'
        />
        {/* {!thirdParty && (
          <View
            className='my-6 w-28'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='items-center justify-center h-12 rounded-full bg-jade'>
              <Pressable className=''>
                <Text className='text-lg font-bold text-white'>Verify</Text>
              </Pressable>
            </View>
          </View>
        )} */}

        <SwitchPill
          title='Sign up for newsletters'
          switchValue={user.receiveNewsletter}
          onSwitchChange={() => updateNewspaper()}
        />
        <View className='border border-neutral-grey-200 border-0.5 my-6'></View>

        {!thirdParty ? (
          <>
            <Text className='mb-4 text-lg font-semibold text-midnight-mosaic'>
              Password
            </Text>
            <TextInput
              secureTextEntry
              onChangeText={(text) => setCurrPassword(text)}
              value={currPassword}
              onFocus={() => setCurrPasswordInputState(1)}
              onBlur={() => setCurrPasswordInputState(0)}
              className={
                currPasswordInputState == 1
                  ? 'py-2 text-xl px-4 border-2 border-white border-b-jade bg-white rounded-lg  text-midnight-mosaic mb-4'
                  : 'py-3 pt-1 text-xl px-4 border-2 border-white bg-white rounded-lg  text-midnight-mosaic mb-4'
              }
              placeholder='Current password'
            />
            <TextInput
              secureTextEntry
              onChangeText={(text) => setNewPassword(text)}
              value={newPassword}
              onFocus={() => setNewPasswordInputState(1)}
              onBlur={() => setNewPasswordInputState(0)}
              className={
                newPasswordInputState == 1
                  ? 'py-2 text-xl px-4 border-2 border-white border-b-jade bg-white rounded-lg  text-midnight-mosaic mb-4'
                  : 'py-3 pt-1 text-xl px-4 border-2 border-white bg-white rounded-lg  text-midnight-mosaic mb-4'
              }
              placeholder='New password'
            />
            <TextInput
              secureTextEntry
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              onFocus={() => setConfirmPasswordInputState(1)}
              onBlur={() => setConfirmPasswordInputState(0)}
              className={
                confirmPasswordInputState == 1
                  ? 'py-2 text-xl px-4 border-2 border-white border-b-jade bg-white rounded-lg  text-midnight-mosaic mb-4'
                  : 'py-3 pt-1 text-xl px-4 border-2 border-white bg-white rounded-lg  text-midnight-mosaic mb-4'
              }
              placeholder='Confirm password'
            />
            <Pressable
              onPress={() => {
                handleUpdate();
              }}
              className='my-2 w-28'
              style={{ backgroundColor: 'transparent' }}
            >
              <View className='items-center justify-center h-12 rounded-full bg-jade'>
                <Text className='text-lg font-bold text-white'>Update</Text>
              </View>
            </Pressable>
          </>
        ) : (
          <Text className='text-lg font-semibold text-midnight-mosaic'>
            This account is registered through a third-party service.
          </Text>
        )}

        <Pressable
          onPress={async () => {
            handleDelete();
          }}
        >
          <View
            style={{ backgroundColor: 'transparent' }}
            className='flex flex-row items-center justify-center my-4'
          >
            <Text className='text-lg font-semibold text-cranberry'>
              Delete This Account
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </LinearGradient>
  );
}
