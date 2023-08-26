import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Button from '../../components/Button';
import { View } from '../../components/Themed';
import { fields } from '../../constants/createGroupFields';
import { GroupStackScreenProps } from '../../types';
import UserContext from '../../components/User';
import GroupService from '../../services/group';
import { ProgramService } from '../../services/programs';
import { Program } from '@prisma/client';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatStatusContext from '../../components/ChatStatus';
import LoadingStatusContext from '../../components/LoadingStatus';
export default function CreateGroupScreen({
  navigation,
  route: { params },
}: GroupStackScreenProps<'CreateGroup'>) {
  const { user } = useContext(UserContext);
  const [hasPassFacilitator, setHasPassFacilitator] = useState(false);
  const [groupData, setGroupData] = useState(params);
  const chatStatusCtx = React.useContext(ChatStatusContext);
  const { setLoadingStatus } = React.useContext(LoadingStatusContext);
  const handleCreateGroup = async () => {
    //check if all fields are filled out
    for (const field of fields) {
      if (
        groupData[field.name.toLowerCase() as keyof typeof params] ===
          undefined &&
        field.name !== 'Public'
      ) {
        return alert(`Please fill out ${field.name}`);
      }
    }
    const { data } = await GroupService.createNewGroup({
      groupData,
      creator: user.id,
    });
    if (!data) return;
    params = {};
    setGroupData({});
    AsyncStorage.setItem('groupData', JSON.stringify({}));
    chatStatusCtx.setHideBottomBar(true);
    setLoadingStatus({ isLoading: true });
    //this is to prevent the page shows before the bottom bar is hidden, if there still have gap between chat input box and bottom, we have to show bottom bar in chat conversation page.
    setTimeout(() => {
      setLoadingStatus({ isLoading: false });
      navigation.navigate('GroupDetail', { groupId: data.id });
    }, 100);
  };

  const getUserPrograms = async () => {
    const { data } = await ProgramService.getUserPrograms({ userId: user.id });
    const _isFacilitator =
      data.find(
        (program: Program) =>
          program.type === 'FACILITATOR' && program.status == 'ACCEPTED'
      ) !== undefined;
    if (!_isFacilitator) {
      params = { ...params, public: false };
      setGroupData(params);
    }
    setHasPassFacilitator(_isFacilitator);
  };
  useEffect(() => {
    getUserPrograms();
  }, [user]);

  useEffect(() => {
    setGroupData(params);
    AsyncStorage.setItem('groupData', JSON.stringify(params));
  }, [params]);

  useEffect(() => {
    AsyncStorage.getItem('groupData').then((data) => {
      if (data) {
        setGroupData(JSON.parse(data));
      }
    });
  });

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
        {fields.map((field, index) => (
          <View
            style={{ backgroundColor: 'transparent' }}
            className='mb-3'
            key={index}
          >
            <Button
              type='SECTION'
              disable={field.name === 'Public' && !hasPassFacilitator}
              leftIconBackgroundColor={
                groupData[field.name.toLowerCase() as keyof typeof params] ===
                undefined
                  ? 'bg-neutral-grey-200'
                  : 'bg-jade'
              }
              text={field.name === 'Public' ? 'Visibility' : field.name}
              leftIcon={
                groupData[field.name.toLowerCase() as keyof typeof params] ===
                undefined
                  ? 'close-outline'
                  : 'checkmark-outline'
              }
              rightIcon='chevron-forward-outline'
              // @ts-ignore
              onPress={() => navigation.navigate(field.route, params)}
            />
          </View>
        ))}
        <View className='mt-4 rounded-lg bg-jade'>
          <Button
            text='create'
            textColor='text-white'
            backgroundColor='bg-jade'
            onPress={() => {
              handleCreateGroup();
            }}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
