import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import GroupService from '../../services/group';
export default function GroupGuidelines({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupGuidelines'>) {
  const [guidelines, setGuidelines] = useState(params.guidelines || '');
  const handleEditGroup = async () => {
    if (!guidelines) {
      return Alert.alert(`Please fill out the group guidelines`);
    }
    const { data } = await GroupService.editGroupInfo({
      groupId: params.id,
      data: { ...params, guidelines: guidelines || undefined },
    });
    if (!data) {
      return Alert.alert('Oops!', 'Something went wrong. Please try again.');
    }
    navigation.goBack();
    navigation.replace('EditGroup', {
      ...params,
      guidelines: guidelines || undefined,
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
            title='Guidelines'
            description="Help your group members understand how to protect the group's values and maintain a safe environment."
          />
        </View>
        <TextInput
          className='p-4 mb-4 bg-white rounded-lg min-h-[200px] text-midnight-mosaic'
          multiline
          numberOfLines={10}
          value={guidelines}
          onChangeText={setGuidelines}
          placeholder={`Example:

1. Be mindful.
2. Respect other members' boundaries.
3. Do not share group discussions without the involved member's consent.`}
          textAlignVertical='top'
        />
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
