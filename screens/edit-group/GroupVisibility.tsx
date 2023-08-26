import { Ionicons } from '@expo/vector-icons';
import classNames from 'classnames';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, Alert } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { Text, View } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import GroupService from '../../services/group';

export default function GroupVisibility({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupVisibility'>) {
  const [visibility, setVisibility] = useState(params.public || false); // false = private, true = public
  const handleEditGroup = async () => {
    const { data } = await GroupService.editGroupInfo({
      groupId: params.id,
      data: { ...params, public: visibility },
    });
    if (!data) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
    navigation.goBack();
    navigation.replace('EditGroup', {
      ...params,
      public: visibility,
    });
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4 rounded-lg'>
          <Panel
            title='Visibility'
            description='You need to have the Facilitator badge to create a public group.'
          />
        </View>
        <Pressable
          className={classNames(
            'flex-row items-center px-4 py-3 mb-4 border-2 bg-white rounded-lg text-midnight-mosaic',
            visibility ? 'border-white' : 'border-jade'
          )}
          onPress={() => setVisibility(false)}
        >
          <Ionicons
            name={visibility ? 'close-circle-outline' : 'checkmark-circle'}
            size={24}
            color={visibility ? '#3D5467' : '#41bb9c'}
          />
          <Text className='ml-3 text-lg font-semibold text-midnight-mosaic'>
            Private
          </Text>
        </Pressable>
        <Pressable
          className={classNames(
            'flex-row items-center px-4 py-3 mb-4 bg-white border-2 rounded-lg text-midnight-mosaic',
            visibility ? 'border-jade' : 'border-white'
          )}
          onPress={() => setVisibility(true)}
        >
          <Ionicons
            name={visibility ? 'checkmark-circle' : 'close-circle-outline'}
            size={24}
            color={visibility ? '#41bb9c' : '#3D5467'}
          />
          <Text className='ml-3 text-lg font-semibold text-midnight-mosaic'>
            Public
          </Text>
        </Pressable>
        <View className='mt-4 rounded-lg bg-jade'>
          <Button
            text='Done'
            onPress={() => {
              handleEditGroup();
            }}
            textColor='text-white'
            backgroundColor='bg-jade'
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
