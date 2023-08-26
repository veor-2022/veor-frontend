import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, Share, Image, Pressable, Alert } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View, Text } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import GroupService from '../../services/group';
import { GroupEnrollment, User, Program } from '@prisma/client';
import UserAvatar from '../../components/UserAvatar';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import UserContext from '../../components/User';
export default function GroupMembers({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupMembers'>) {
  let row: Array<any> = [];
  const { user } = useContext(UserContext);
  const [groupMembers, setGroupMembers] = useState<
    (GroupEnrollment & {
      user: User & {
        programs: Program[];
      };
    })[]
  >([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getGroupMembers = async () => {
      const { data: res } = await GroupService.getGroupInfoById({
        groupId: params.id,
      });
      res.members.forEach((member: any) => {
        if (member.user.id === user.id && member.status === 'FACILITATOR') {
          setIsAdmin(true);
        }
      });
      setGroupMembers(res.members);
    };
    getGroupMembers();
  }, [params.id]);

  const handleRemoveMember = async (userId: string, index: number) => {
    Alert.alert('Are you sure?', 'Remove this member from the group?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          const { data } = await GroupService.removeMember({
            groupId: params.id,
            userId,
          });
          if (!data) return;
          const newMembers = [...groupMembers];
          newMembers.splice(index, 1);
          setGroupMembers(newMembers);
        },
      },
    ]);
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full '
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='relative p-6 mb-10 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4 rounded-lg'>
          <Panel
            title='Members'
            description='Here are the members of your group.'
          />
        </View>
        {groupMembers.map((member, i) => (
          <Swipeable
            ref={(ref) => (row[i] = ref)}
            friction={1}
            leftThreshold={30}
            key={i}
            renderRightActions={() =>
              isAdmin ? (
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='flex flex-row px-4 pb-4 my-auto'
                >
                  <Pressable
                    onPress={() => handleRemoveMember(member.user.id, i)}
                    className='flex flex-row items-center justify-center w-12 h-12 rounded-lg bg-cranberry'
                  >
                    <Feather name='trash-2' size={24} color='white' />
                  </Pressable>
                </View>
              ) : null
            }
          >
            <View
              className='flex flex-row items-center justify-between mb-4'
              style={{ backgroundColor: 'transparent' }}
            >
              <View className='flex flex-row items-center w-full px-4 py-2 mr-4 rounded-xl'>
                {!member.user.profilePicture ? (
                  <View className='mr-2'>
                    <UserAvatar
                      name={member.user.nickname || member.user.firstName}
                      size={22}
                      url={member.user.profilePicture}
                    />
                  </View>
                ) : (
                  <Image
                    className='w-11 h-11 mr-3 rounded-full'
                    source={{ uri: member.user.profilePicture }}
                    style={{ backgroundColor: 'transparent' }}
                  />
                )}

                <Text className='text-xl font-semibold text-midnight-mosaic'>
                  {member.user.nickname || member.user.firstName}
                </Text>
              </View>
            </View>
          </Swipeable>
        ))}
        <View style={{ backgroundColor: 'transparent' }} className='mb-4'>
          <Button
            text='Send Invitation'
            leftIcon='mail-outline'
            leftIconBackgroundColor='bg-jade'
            onPress={() => {
              Share.share({
                message: 'https://www.veor.org/',
                title: 'Invite friends to join',
              });
            }}
          />
        </View>

        {isAdmin && (
          <Button
            text='Invite a Member'
            leftIcon='add-outline'
            leftIconBackgroundColor='bg-jade'
            rightIcon='chevron-forward-outline'
            onPress={() =>
              navigation.navigate('AddMember', {
                groupId: params.id,
              })
            }
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}
