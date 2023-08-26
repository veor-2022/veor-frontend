import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput } from 'react-native';
import { Text, View } from '../../components/Themed';
import { GroupStackScreenProps } from '../../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import GroupService from '../../services/group';
import UserContext from '../../components/User';

export default function GroupMembersEmailInvite({
  navigation,
  route,
}: GroupStackScreenProps<'GroupMembersEmailInvite'>) {
  const [email, setEmail] = useState('');

  const { user } = useContext(UserContext);

  const handleSendEmail = async () => {
    try {
      const emailResult = await GroupService.inviteCoFacilitatorsByEmail({
        emails: email,
        groupId: route.params.id,
      })
        .then((res) => res.data)
        .catch((err) => {
          throw err;
        });
      if (emailResult) {
        setEmail('');
        // navigation.navigate('Support');
      }
    } catch (error) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      console.error(error);
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
            Send Invitation
          </Text>
          <Text className='text-storm '>
            We will send an invitation to the email provided below. You can use
            comma (,) to seperate email addresses to invite multiple members.
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
                placeholder='Email, comma seperated'
                keyboardType='email-address'
                onChangeText={setEmail}
              />
            </View>
            <View className='items-center justify-center flex-1 h-12 mt-8 rounded-lg bg-jade'>
              <Pressable className='' onPress={handleSendEmail}>
                <Text className='text-lg font-bold text-white'>SEND</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
