import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { topics, topicsConvertToEnum } from '../../constants/topics';
import { UserStackScreenProps } from '../../types';
import { UserService } from '../../services/user';
import { Ionicons } from '@expo/vector-icons';
import GroupService from '../../services/group';
import UserAvatar from '../../components/UserAvatar';
import Button from '../../components/Button';
import { Chat, User, Program } from '@prisma/client';
import { PublicUser } from '../../constants/prismaTypes';
export default function EditTopic({
  navigation,
  route: { params },
}: UserStackScreenProps<'AddMember'>) {
  const { user, setUser } = useContext(UserContext);
  const [selectMembers, setSelectMembers] = useState<string[]>([]);
  const [memberList, setMemberList] = useState<
    (PublicUser & { chats: Chat[] })[]
  >([]);

  useEffect(() => {
    const getGroupMembers = async () => {
      if (!user) return;
      const { data: res } = await GroupService.fetchAddMemberList({
        groupId: params.groupId,
        userId: user.id,
      });
      setMemberList(res);
    };
    getGroupMembers();
  }, [params.groupId, user]);

  const handleSubmit = async () => {
    if (selectMembers.length > 0) {
      for (const u of selectMembers) {
        const { data } = await GroupService.requestToJoinGroup({
          userId: u,
          groupId: params.groupId,
          status: 'USER',
        });
        if (!data) {
          return Alert.alert(
            'Oops!',
            'Something went wrong. Please try again later.'
          );
        }
      }
      navigation.goBack();
    } else {
      Alert.alert(
        'Oops!',
        'No member selected. Please select at least one member.'
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='h-screen px-5 pt-0'
      >
        <View style={{ backgroundColor: 'transparent' }} className='mt-2 mr-3 '>
          {memberList.length > 0 &&
            memberList.map((supporter, index) => {
              return (
                <View
                  key={index}
                  className='flex flex-row items-center pr-10 mb-4'
                  style={{ backgroundColor: 'transparent' }}
                >
                  <View
                    className={
                      'mr-3 rounded-lg ' +
                      (selectMembers.includes(supporter.id)
                        ? ' bg-jade'
                        : ' bg-white')
                    }
                  >
                    <Pressable
                      onPress={() => {
                        if (selectMembers.includes(supporter.id)) {
                          setSelectMembers(
                            selectMembers.filter((u) => u !== supporter.id)
                          );
                        } else {
                          setSelectMembers([...selectMembers, supporter.id]);
                        }
                      }}
                      className='flex items-center justify-center w-10 h-10'
                    >
                      {selectMembers.includes(supporter.id) && (
                        <Ionicons name='checkmark' size={24} color='white' />
                      )}
                    </Pressable>
                  </View>
                  <View className='flex flex-row items-center w-full p-2 rounded-lg'>
                    <UserAvatar
                      name={supporter.nickname || supporter.firstName || 'a'}
                      size={22}
                      url={supporter.profilePicture}
                    />
                    <Text className='ml-2 text-lg font-semibold  text-midnight-mosaic'>
                      {supporter.nickname || supporter.firstName}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
        {memberList.length > 0 ? (
          <Button
            text='Done'
            onPress={() => handleSubmit()}
            backgroundColor='bg-jade'
            textColor='text-white'
          />
        ) : (
          <View
            className='flex flex-col items-center'
            style={{ backgroundColor: 'transparent' }}
          >
            <Text className='text-neutral-grey-300 text-[20px] font-bold'>
              Support list is vacant
            </Text>
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
}
