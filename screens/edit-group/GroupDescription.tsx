import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import GroupService from '../../services/group';

export default function GroupDescription({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupDescription'>) {
  const { description, meetingInfo, meetingSchedule, meetingLink } = params;

  const [_description, setDescription] = useState(description || '');
  const [_meetingInfo, setMeetingInfo] = useState(meetingInfo || '');
  const [_meetingSchedule, setMeetingSchedule] = useState(
    meetingSchedule || ''
  );
  const [_meetingLink, setMeetingLink] = useState(meetingLink || '');
  const handleEditGroup = async () => {
    if (!_description) {
      return Alert.alert(`Please fill out the group description`);
    }
    const { data } = await GroupService.editGroupInfo({
      groupId: params.id,
      data: {
        ...params,
        description: _description || undefined,
        meetingInfo: _meetingInfo,
        meetingSchedule: _meetingSchedule,
        meetingLink: _meetingLink,
      },
    });
    if (!data) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
    navigation.goBack();
    navigation.replace('EditGroup', {
      ...params,
      description: _description || undefined,
      meetingInfo: _meetingInfo,
      meetingSchedule: _meetingSchedule,
      meetingLink: _meetingLink,
    });
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior='padding'
        enabled={Platform.OS === 'ios'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='relative p-6 overflow-visible'
          style={{ backgroundColor: 'transparent' }}
        >
          <View className='mb-4 rounded-lg'>
            <Panel
              title='About'
              description="Clearly describing your group's focus and goals helps you bring the right people on the bus."
            />
          </View>
          <TextInput
            className='p-4 mb-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            placeholder='Group Description'
            value={_description}
            onChangeText={setDescription}
            textAlignVertical='top'
          />
          <View className='mb-4 rounded-lg'>
            <Panel
              title='Meetings (Optional)'
              description='If the group has virtual meetings, please provide meeting information here.'
            />
          </View>
          <TextInput
            className='p-4  mb-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            placeholder='Meeting Schedule'
            value={_meetingInfo}
            onChangeText={setMeetingInfo}
            textAlignVertical='top'
          />
          <TextInput
            className='p-4 mb-4 bg-white rounded-lg min-h-[100px] text-midnight-mosaic'
            multiline
            numberOfLines={10}
            placeholder='Meeting Time'
            value={_meetingSchedule}
            onChangeText={setMeetingSchedule}
            textAlignVertical='top'
          />
          <TextInput
            className='p-4 mb-4 bg-white rounded-lg text-midnight-mosaic'
            placeholder='Meeting Link'
            value={_meetingLink}
            onChangeText={setMeetingLink}
          />
          <View className='mb-10 rounded-lg bg-jade'>
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
