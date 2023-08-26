import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Text, View } from '../../components/Themed';
import { AuthStackScreenProps } from '../../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import decodeJWT from 'jwt-decode';
import a, { setToken } from '../../services/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import UserContext from '../../components/User';
import { StackActions } from '@react-navigation/native';
import LoadingStatusContext from '../../components/LoadingStatus';
const LANDING_ITEMS = [
  {
    title: 'Welcome to Veor!',
    desc: 'A place for you to be happier, healthier, and a light to others.',
    image: require('../../assets/images/landing/landing_1.png'),
  },
  {
    title: 'Dedicated Peer Support',
    desc: 'Chat with our Listeners and find your support groups. Connect with people who hear, understand, and care for you.',
    image: require('../../assets/images/landing/landing_2.png'),
  },
  {
    title: 'Self-Help Tools',
    desc: 'Keep track of your feelings and find clarity in your own thoughts.',
    image: require('../../assets/images/landing/landing_3.png'),
  },
];

export default function LandingScreen({
  navigation,
}: AuthStackScreenProps<'Landing'>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onCallbackFirebaseAuthChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const onCallbackFirebaseAuthChanged = async (
    user: FirebaseAuthTypes.User | null
  ) => {
    if (user === null) {
      return;
    }
    const screenResult = await AsyncStorage.getItem('auth:screen');
    if (screenResult === 'login') {
      return serverLogin();
    }
    if (screenResult === 'register') {
      return serverThirdPartySignup();
    }
    console.warn('auth:screen is not login or register, is ' + screenResult);
  };

  const serverThirdPartySignup = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      if (auth().currentUser?.displayName == null) {
        setLoadingStatus({ isLoading: false });
        navigation.navigate('NewUserConfigName', {
          email: '',
          password: '',
          signupType: 'firebase',
        });
        return;
      }
      const fbToken = await auth().currentUser?.getIdToken();
      const { data: token } = await a.post('/auth/firebase/signup', {
        token: fbToken,
      });
      if (!token) {
        auth().signOut();
        throw 'An account is already registered with this email.';
      }
      setToken(token);
      const { id } = decodeJWT(token) as { id: string };
      const { data: user } = await a.get('/users/' + id);

      if (!user) {
        throw 'An account is already registered with this email.';
      }
      await AsyncStorage.setItem('auth:screen', '');
      await AsyncStorage.setItem('token', token);
      setUser(user);
      setLoadingStatus({ isLoading: false });
      navigation.dispatch(StackActions.replace('Root', { screen: 'Home' }));
    } catch (e) {
      setLoadingStatus({ isLoading: false });
      Alert.alert('Oops!', e);
    }
    if (auth().currentUser == null) {
      return;
    }
  };

  const serverLogin = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      if (auth().currentUser === null) {
        throw 'Login failed. Please try again.';
      }
      const fbToken = await auth().currentUser?.getIdToken();
      const { data: token } = await a.post('/auth/firebase/login', {
        token: fbToken,
      });
      if (!token) {
        auth().signOut();
        throw 'Login failed. Please try again.';
      }

      const { id } = decodeJWT(token) as { id: string };
      if (typeof id !== 'string') {
        throw 'An error occurred while decoding the JWT token. Please contact Veor support.';
      }
      setToken(token);
      const { data: userData } = await a.get(`/users/${id}`);
      if (!userData) {
        throw 'Your account does not exist. Please contact Veor support.';
      }
      await AsyncStorage.setItem('auth:screen', '');
      await AsyncStorage.setItem('token', token);
      setUser(userData);
      navigation.dispatch(StackActions.replace('Root'));
      setLoadingStatus({ isLoading: false });
    } catch (err: any) {
      setLoadingStatus({ isLoading: false });
      console.error(err);
      Alert.alert('Oops! Something went wrong.');
    }
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-6 pt-10'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={Platform.OS === 'ios' ? 'pt-12 pb-20' : ''}
      >
        <View style={{ backgroundColor: 'transparent' }}>
          <View
            className='flex-row justify-center flex-1'
            style={{ backgroundColor: 'transparent' }}
          >
            <Image
              className=''
              style={{ width: 70, height: 31 }}
              source={require('../../assets/images/logo-transparent.png')}
            />
          </View>
        </View>
        <View className='items-center pt-8 pb-6 my-8 rounded-xl'>
          <Carousel
            onSnapToItem={(index) => setActiveIndex(index)}
            //@ts-ignore
            className={'max-w-xl'}
            sliderWidth={300}
            itemWidth={300}
            data={LANDING_ITEMS}
            renderItem={(item) => {
              return (
                <View className='flex flex-col items-center px-2'>
                  <Image
                    className=''
                    style={{
                      width: 240,
                      height: 200,
                    }}
                    source={item.item.image}
                  />
                  <View>
                    <Text className='pt-8 text-2xl text-midnight-mosaic'>
                      {item.item.title}
                    </Text>
                    <Text className='pt-2 pb-4 text-storm'>
                      {item.item.desc}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
          <Pagination
            dotsLength={LANDING_ITEMS.length}
            activeDotIndex={activeIndex}
            containerStyle={{ paddingBottom: 4 }}
            dotColor={'#41B89C'}
            inactiveDotColor={'#E6E6E6'}
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 1,
              backgroundColor: '#41B89C',
            }}
            inactiveDotStyle={{
              backgroundColor: '#E6E6E6',
            }}
            inactiveDotOpacity={0.8}
            inactiveDotScale={1}
          />
        </View>
        <Button
          type='BUTTON'
          text={'GET STARTED'}
          backgroundColor='bg-jade'
          textColor='text-white'
          onPress={() => {
            navigation.navigate('Register');
          }}
        />

        <View
          style={{ backgroundColor: 'transparent' }}
          className='flex flex-row items-center justify-center mt-5 text-center'
        >
          <Text className='text-lg text-midnight-mosaic '>
            Already have an account?{' '}
            <Text
              className='ml-1 underline text-link'
              onPress={() => {
                navigation.navigate('Login');
              }}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
