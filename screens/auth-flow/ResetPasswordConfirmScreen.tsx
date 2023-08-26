import React, { useState } from 'react';
import { Text, View } from '../../components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { AuthStackScreenProps } from '../../types';
import { StackActions } from '@react-navigation/native';

export default function ResetPasswordConfirmScreen({
  navigation,
}: AuthStackScreenProps<'ResetPasswordConfirm'>) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleConfirmPassword = () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Please try again');
    } else {
      navigation.dispatch(StackActions.replace('Home', { screen: 'Home' }));
    }
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
                placeholder='Password'
                secureTextEntry={true}
              />
            </View>
            <View className='p-3 mt-3 rounded-lg'>
              <TextInput
                className='h-6 text-storm text-[17px]'
                placeholder='Comfirm Password'
                secureTextEntry={true}
              />
            </View>

            <View className='items-center justify-center flex-1 h-12 mt-8 rounded-lg bg-jade'>
              <Pressable className='' onPress={handleConfirmPassword}>
                <Text className='text-lg font-bold text-white'>
                  Reset password
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
