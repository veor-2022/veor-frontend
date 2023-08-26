import { StackActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import jwtDecode from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import a, { setToken } from '../../services/axios';
import { AuthStackScreenProps } from '../../types';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingStatusContext from '../../components/LoadingStatus';
import Constants from 'expo-constants';
import Button from '../../components/Button';

export default function NewUserConfigNameScreen({
  navigation,
  route: {
    params: { email, password, signupType },
  },
}: AuthStackScreenProps<'NewUserConfigName'>) {
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const { setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);

  const handleServerRegister = async () => {
    setLoadingStatus({ isLoading: true });
    if (auth().currentUser == null) {
      setLoadingStatus({ isLoading: false });
      return;
    }
    // @ts-ignore
    const fbToken = await auth().currentUser?.getIdToken();
    const { data: token } = await a.post('/auth/firebase/signup', {
      token: fbToken,
      firstName: firstNameInput,
      lastName: lastNameInput,
    });
    if (!token) {
      auth().signOut();
      setLoadingStatus({ isLoading: false });
      return;
    }
    setToken(token);
    const { id } = jwtDecode(token) as { id: string };
    const { data: user } = await a.get('/users/' + id);

    if (!user) {
      setLoadingStatus({ isLoading: false });
      return;
    }
    await AsyncStorage.setItem('token', token);
    setUser(user);
    setLoadingStatus({ isLoading: false });

    navigation.dispatch(StackActions.replace('Root', { screen: 'Home' }));
  };

  const handleRegister = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      const { data: token } = await a.post('/auth/signup', {
        email,
        password,
        firstName: firstNameInput,
        lastName: lastNameInput,
      });

      if (!token) {
        setLoadingStatus({ isLoading: false });

        Alert.alert('Failed to register', 'No token received from server');
      }

      setToken(token);
      const { id } = jwtDecode(token) as { id: string };
      const { data: user } = await a.get('/users/' + id);

      if (!user) {
        setLoadingStatus({ isLoading: false });
        Alert.alert('Failed to register', 'No user received from server');
      }
      await auth().signInWithEmailAndPassword(email, password);
      setUser(user);
      navigation.dispatch(StackActions.replace('Root', { screen: 'Home' }));
      setLoadingStatus({ isLoading: false });
    } catch (error) {
      setLoadingStatus({ isLoading: false });
      Alert.alert(
        'Failed to register',
        error?.message?.toString() || 'Unknown error'
      );
    }
  };

  useEffect(() => {
    AsyncStorage.setItem('auth:screen', '');
  }, []);

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='p-5 mt-3 rounded-xl'>
          <Text className='mb-5 text-2xl font-bold text-midnight-mosaic'>
            Enter Your Name
          </Text>
          <Text className='text-storm text-[17px] '>
            You can set up a nickname to remain anonymous after you join.
          </Text>
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <View
            className='flex-col justify-center flex-1'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='p-3 mt-4 rounded-xl'>
              <TextInput
                className='h-8 text-xl'
                placeholder='First Name'
                onChangeText={setFirstNameInput}
              />
            </View>
            <View className='p-3 mt-4 rounded-xl'>
              <TextInput
                className='h-8 text-xl'
                placeholder='Last Name'
                onChangeText={setLastNameInput}
              />
            </View>
            <Button
              backgroundColor='bg-jade'
              textColor='text-white'
              type='BUTTON'
              onPress={() => {
                if (signupType === 'email') handleRegister();
                else handleServerRegister();
              }}
              text='SIGN UP'
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
