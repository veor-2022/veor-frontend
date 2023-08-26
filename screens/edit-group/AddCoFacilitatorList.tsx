import Checkbox from 'expo-checkbox';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView } from 'react-native';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserStackScreenProps } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import GroupService from '../../services/group';
import UserAvatar from '../../components/UserAvatar';
import Button from '../../components/Button';
import { GroupEnrollment, User, Program } from '@prisma/client';
export default function EditTopic({
  navigation,
  route: { params },
}: UserStackScreenProps<'AddCoFacilitatorList'>) {
  const { user } = useContext(UserContext);
  const [selectMember, setSelectMember] = useState<string>();
  const [groupMembers, setGroupMembers] = useState<
    (GroupEnrollment & {
      user: User & {
        programs: Program[];
      };
    })[]
  >([]);

  useEffect(() => {
    const getGroupMembers = async () => {
      const { data: res } = await GroupService.fetchAddCoFacilitatorList({
        groupId: params.groupId,
      });
      setGroupMembers(res);
    };
    getGroupMembers();
  }, [params.groupId]);

  const handleSubmit = async () => {
    if (selectMember) {
      const { data } = await GroupService.requestToJoinGroup({
        userId: selectMember,
        groupId: params.groupId,
        status: 'CO_FACILITATOR',
      });
      if (!data) {
        Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      }
    }
    navigation.goBack();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='h-screen px-5 pt-0'
      >
        <View style={{ backgroundColor: 'transparent' }} className='mt-2 mr-3 '>
          {groupMembers.length > 0 &&
            groupMembers.map((member, index) => {
              if (member.userId !== user.id) {
                return (
                  <View
                    key={index}
                    className='flex flex-row items-center pr-10 mb-4'
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <View
                      className={
                        'mr-3 rounded-lg ' +
                        (member.user.id === selectMember
                          ? ' bg-jade'
                          : ' bg-white')
                      }
                    >
                      <Pressable
                        onPress={() => setSelectMember(member.user.id)}
                        className='flex items-center justify-center w-10 h-10'
                      >
                        {member.user.id === selectMember && (
                          <Ionicons name='checkmark' size={24} color='white' />
                        )}
                      </Pressable>
                    </View>
                    <View className='flex flex-row items-center w-full p-2 rounded-lg'>
                      <UserAvatar
                        name={member.user.nickname || member.user.firstName}
                        size={22}
                        url={member.user.profilePicture}
                      />
                      <Text className='ml-2 text-lg font-semibold  text-midnight-mosaic'>
                        {member.user.nickname || member.user.firstName}
                      </Text>
                    </View>
                  </View>
                );
              }
            })}
        </View>
        {groupMembers.length > 0 ? (
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
              No other group member yet
            </Text>
          </View>
        )}
      </LinearGradient>
    </ScrollView>
  );
}
