import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ScrollView, Share, Pressable, Image, Alert } from 'react-native';
import Button from '../../components/Button';
import Panel from '../../components/Panel';
import { View, Text } from '../../components/Themed';
import { UserStackScreenProps } from '../../types';
import { Swipeable } from 'react-native-gesture-handler';
import UserAvatar from '../../components/UserAvatar';
import { Feather } from '@expo/vector-icons';
import GroupService from '../../services/group';
import { User } from '@prisma/client';

export default function GroupFacilitators({
  navigation,
  route: { params },
}: UserStackScreenProps<'GroupFacilitators'>) {
  const [coFacilitator, setCoFacilitators] = useState<User | null>(null);
  const groupId = params.groupId;
  let row: Array<any> = [];
  useEffect(() => {
    const getGroupMembers = async () => {
      const { data: res } = await GroupService.getGroupInfoById({
        groupId,
      });
      setCoFacilitators(
        res.members.find((member: any) => member.status === 'CO_FACILITATOR')
          ?.user
      );
    };
    getGroupMembers();
  }, [params]);

  const handleRemoveCoFacilitator = async (userId: string) => {
    Alert.alert('Revoke this co-facilitator', 'Are you sure?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Revoke',
        onPress: async () => {
          await GroupService.revokeCoFacilitator({
            groupId,
            userId,
          });
          setCoFacilitators(null);
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
        className='relative p-6 overflow-visible'
        style={{ backgroundColor: 'transparent' }}
      >
        <View className='mb-4 rounded-lg'>
          <Panel
            title='Co-Facilitator'
            description='You can invite another member to become your co-facilitator for the group. If you leave the group, the system will transfer the group ownership to the co-facilitator.'
          />
        </View>
        {/* <View style={{ backgroundColor: 'transparent' }} className='mb-4'>
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
        </View> */}
        {!coFacilitator && (
          <Button
            text='Add Co-Facilitator'
            leftIcon='add-outline'
            leftIconBackgroundColor='bg-jade'
            rightIcon='chevron-forward-outline'
            onPress={() =>
              navigation.navigate('AddCoFacilitatorList', {
                groupId: params.groupId,
              })
            }
          />
        )}

        {coFacilitator && (
          <Swipeable
            friction={1}
            leftThreshold={30}
            renderRightActions={() => (
              <View
                style={{ backgroundColor: 'transparent' }}
                className='px-4 flex flex-row my-auto pb-4 pt-4'
              >
                <Pressable
                  onPress={() => handleRemoveCoFacilitator(coFacilitator.id)}
                  className='w-12 h-12 bg-cranberry rounded-lg flex flex-row justify-center items-center'
                >
                  <Feather name='trash-2' size={24} color='white' />
                </Pressable>
              </View>
            )}
          >
            <View
              className='flex flex-row justify-between items-center my-4'
              style={{ backgroundColor: 'transparent' }}
            >
              <View className='w-full p-4 flex flex-row items-center rounded-xl mr-4'>
                {!coFacilitator.profilePicture ? (
                  <View className='mr-2'>
                    <UserAvatar
                      name={coFacilitator.nickname || coFacilitator.firstName}
                      size={20}
                      url={coFacilitator.profilePicture}
                    />
                  </View>
                ) : (
                  <Image
                    className='h-12 w-12 mr-3 rounded-full'
                    source={{ uri: coFacilitator.profilePicture }}
                    style={{ backgroundColor: 'transparent' }}
                  />
                )}
                <Text className='text-midnight-mosaic text-xl font-semibold'>
                  {coFacilitator.nickname || coFacilitator.firstName}
                </Text>
              </View>
            </View>
          </Swipeable>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
