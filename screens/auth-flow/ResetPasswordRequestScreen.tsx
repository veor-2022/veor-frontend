import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { AuthStackScreenProps } from '../../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import UserContext from '../../components/User';

export default function ResetPasswordRequestScreen({
  navigation,
}: AuthStackScreenProps<'ResetPasswordRequest'>) {
  const [email, setEmail] = useState('');
  const [thirdParty, setThirdParty] = useState(true);
  const { user, setUser } = useContext(UserContext);
  // const fbAuth = auth();
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
    Alert.alert(
      'This is a third party account',
      'Please reset your password through the service.'
    );
  };

  const handleResetPassword = async () => {
    try {
      // await checkThirdParty();
      const passwordResetResult = await auth().sendPasswordResetEmail(email);
      if (passwordResetResult == null) {
        Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      }
      Alert.alert(
        'Check your Email',
        'An email with instructions to reset your password has been sent.'
      );
    } catch (error) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      console.error(error);
    }
    // navigation.navigate('ResetPasswordConfirm');
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='p-5 mt-3 rounded-xl'>
          <Text className='mb-3 text-xl font-medium text-midnight-mosaic'>
            Reset Password
          </Text>
          <Text className='text-storm '>
            We will email you a link to reset your password.
          </Text>
        </View>
        <View style={{ backgroundColor: 'transparent' }}>
          <View
            className='flex-col justify-center flex-1'
            style={{ backgroundColor: 'transparent' }}
          >
            <View className='p-3 mt-3 rounded-lg'>
              <TextInput
                className='h-6 text-storm text-[17px]'
                placeholder='Email'
                keyboardType='email-address'
                onChangeText={setEmail}
              />
            </View>
            <View className='items-center justify-center flex-1 h-12 mt-8 rounded-lg bg-jade'>
              <Pressable className='' onPress={handleResetPassword}>
                <Text className='text-lg font-bold text-white'>SEND</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
