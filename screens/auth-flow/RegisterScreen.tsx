import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect, useContext } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import { Text, View } from '../../components/Themed';
import { AuthStackScreenProps } from '../../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import a, { setToken } from '../../services/axios';
import Spinner from 'react-native-loading-spinner-overlay';
import UserContext from '../../components/User';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingStatusContext from '../../components/LoadingStatus';
import * as WebBrowser from 'expo-web-browser';
import { useIsFocused } from '@react-navigation/native';
import Button from '../../components/Button';
import { UserService } from '../../services/user';
let isMounted = 0;
export default function RegisterScreen({
  navigation,
}: AuthStackScreenProps<'Register'>) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const { setUser } = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);

  const handleContinue = async () => {
    if (!emailInput.includes('@') || !emailInput) {
      return Alert.alert('Invalid email.', 'Please try again.');
    }
    if (passwordInput.length < 6)
      return alert('Password must be at least 6 characters.');
    if (passwordInput !== confirmPasswordInput) {
      return Alert.alert('Passwords do not match.', 'Please try again.');
    }
    setLoadingStatus({ isLoading: true });
    const { data } = await UserService.checkIfUserExist(emailInput);
    if (data.exists) {
      setLoadingStatus({ isLoading: false });
      return Alert.alert(
        'Oops!',
        'An account is already registered with this email.'
      );
    }
    setLoadingStatus({ isLoading: false });
    navigation.navigate('NewUserConfigName', {
      email: emailInput,
      password: passwordInput,
      signupType: 'email',
    });
  };

  const onAppleButtonPress = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      if (Platform.OS !== 'ios') {
        throw 'Unsupported Platform - Apple login only supported on iOS devices. You can still sign up with email and password.';
      }

      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      // Sign the user in with the credential
      return auth().signInWithCredential(appleCredential);
    } catch (e) {
      setLoadingStatus({ isLoading: false });
      // return Alert.alert('Oops!', 'Apple sign up has been canceled.');
    }
  };

  const onGoogleButtonPress = async () => {
    try {
      setLoadingStatus({ isLoading: true });
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const { idToken } = await GoogleSignin.signIn();
      if (!idToken) throw 'Google Sign-In failed - no identify token returned';
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (e) {
      setLoadingStatus({ isLoading: false });
      // return Alert.alert('Oops!', 'Google sign up has been canceled.');
    }
  };

  const onFacebookButtonPress = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      // Sign-in the user with the credential
      await auth().signInWithCredential(facebookCredential);
    } catch (e) {
      setLoadingStatus({ isLoading: false });
      // return Alert.alert('Oops!', 'Facebook sign up has been canceled.');
    }
  };

  const handleOpenWebsite = async (goTo: string) => {
    await WebBrowser.openBrowserAsync(goTo);
  };

  useEffect(() => {
    AsyncStorage.setItem('auth:screen', 'register');
  }, []);

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={100}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className='p-5 mt-3 rounded-xl'>
            <Text className='mb-3 text-xl font-medium text-midnight-mosaic'>
              Join Our Community
            </Text>
            <Text className='text-storm '>
              Sign in to find your support and track your journey here on the
              Veor platform.
            </Text>
          </View>
          <View style={{ backgroundColor: 'transparent' }} className='mt-3'>
            {/* <Pressable
              className='flex flex-row items-center justify-center p-3 mb-3 rounded-xl'
              style={{ backgroundColor: '#1877F2' }}
              onPress={() => onFacebookButtonPress()}
            >
              <FontAwesome5 name='facebook' size={24} color='white' />
              <Text className='text-white font-medium text-[16px] ml-4'>
                Continue with Facebook
              </Text>
            </Pressable> */}
            <Pressable
              onPress={() => onGoogleButtonPress()}
              className='flex flex-row items-center justify-center p-1 mb-3 rounded-xl'
              style={{ backgroundColor: '#fff' }}
            >
              <Image
                source={require('../../assets/images/google_logo.png')}
                className='w-10 h-10'
              />
              <Text className=' font-medium text-[16px] ml-4'>
                Continue with Google
              </Text>
            </Pressable>
            {Platform.OS === 'ios' && (
              <Pressable
                className='flex flex-row items-center justify-center p-3 mb-3 rounded-xl'
                style={{ backgroundColor: '#000' }}
                onPress={() => onAppleButtonPress()}
              >
                <Ionicons name='logo-apple' size={24} color='white' />
                <Text className='text-white font-medium text-[16px] ml-4'>
                  Continue with Apple
                </Text>
              </Pressable>
            )}
          </View>
          <View style={{ backgroundColor: 'transparent' }}>
            <View
              style={{
                backgroundColor: 'transparent',
              }}
              className='flex flex-row items-center my-2'
            >
              <View className='flex-1 h-[1px] bg-neutral-grey' />
              <View style={{ backgroundColor: 'transparent' }}>
                <Text className='w-[50px] text-center text-neutral-grey font-bold text-[16px]'>
                  OR
                </Text>
              </View>
              <View className='flex-1 h-[1px] bg-neutral-grey' />
            </View>
          </View>
          <View style={{ backgroundColor: 'transparent' }} className=''>
            {/** Email input, password input, confirm password input */}
            <View className='p-3 mt-3 rounded-lg'>
              <TextInput
                className='h-6 text-storm text-[17px]'
                placeholder='Email'
                onChangeText={setEmailInput}
                keyboardType='email-address'
              />
            </View>
            <View className='p-3 mt-3 rounded-lg'>
              <TextInput
                className='h-6 text-storm text-[17px]'
                placeholder='Password'
                onChangeText={setPasswordInput}
                secureTextEntry={true}
              />
            </View>
            <View className='p-3 mt-3 rounded-lg'>
              <TextInput
                className='h-6 text-storm text-[17px]'
                placeholder='Confirm Password'
                onChangeText={setConfirmPasswordInput}
                secureTextEntry={true}
              />
            </View>
            <View
              className='mt-3 rounded-xl mb-4'
              style={{ backgroundColor: 'transparent' }}
            >
              <Text className='text-midnight-mosaic text-[17px]'>
                By tapping continue or sign up, I agree to Veor's{' '}
                <Text
                  onPress={() => {
                    handleOpenWebsite('https://www.veor.org/termsofuse-app');
                  }}
                  className='text-link text-[17px]'
                >
                  Terms of Use
                </Text>
                ,{' '}
                <Text
                  onPress={() => {
                    handleOpenWebsite('https://www.veor.org/privacy-app');
                  }}
                  className='text-link text-[17px]'
                >
                  Privacy Policy
                </Text>
                , and{' '}
                <Text
                  onPress={() => {
                    handleOpenWebsite('https://www.veor.org/mobileappeula');
                  }}
                  className='text-link text-[17px]'
                >
                  Mobile App EULA
                </Text>
                .
              </Text>
            </View>
            <Button
              type='BUTTON'
              text={'CONTINUE'}
              backgroundColor='bg-jade'
              textColor='text-white'
              onPress={handleContinue}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
