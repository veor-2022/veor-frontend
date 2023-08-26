import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { DeviceEventEmitter, Image, Pressable } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Group, GroupEnrollment, User, Program } from '@prisma/client';
import UserContext from '../../components/User';
import UserAvatar from '../../components/UserAvatar';
import { ChatService } from '../../services/chat';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { GroupStackParamList } from '../../types';
import ChatStatusContext from '../../components/ChatStatus';
interface props {
  data: Group & {
    members: (GroupEnrollment & { user: User & { programs: Program[] } })[];
  };
  navigation: NativeStackNavigationProp<
    GroupStackParamList,
    'GroupDetail',
    undefined
  >;
}

export default function GroupDetailFacilitators({ data, navigation }: props) {
  const { user } = useContext(UserContext);
  const { setHideBottomBar } = useContext(ChatStatusContext);
  const admins = data.members.filter(
    (member) =>
      member.status === 'FACILITATOR' || member.status === 'CO_FACILITATOR'
  );

  const createDirectChatRoom = async (userId: string) => {
    ChatService.createDirectChat(userId)
      .then((res) => res.data)
      .then((res) => {
        setHideBottomBar(true);
        navigation.navigate('ChatConversation', {
          chatId: res.id,
        });
      });
  };

  return (
    <View className='mt-4' style={{ backgroundColor: 'transparent' }}>
      {admins.map((a, index) => (
        <View
          className='flex flex-row items-center justify-between w-full p-3 mb-4 bg-white rounded-lg'
          key={index}
        >
          <View className='flex flex-row items-center justify-start '>
            <View className='p-2 rounded-xl'>
              <UserAvatar
                name={a.user.nickname || a.user.firstName}
                size={20}
                url={a.user.profilePicture}
              />
            </View>
            <Text className='ml-2 text-lg font-semibold text-midnight-mosaic'>
              {a.user.nickname || a.user.firstName}
            </Text>
          </View>
          {a.user.id !== user.id && (
            <Pressable
              className='p-2 mr-3 bg-tiffany rounded-xl'
              onPress={() => {
                createDirectChatRoom(a.userId);
              }}
            >
              <Ionicons
                name='ios-chatbubbles-outline'
                size={24}
                color='white'
              />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}
