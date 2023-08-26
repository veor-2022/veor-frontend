import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react';
import { Pressable, Alert, Share } from 'react-native';
import UserAvatar from '../../components/UserAvatar';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import a from '../../services/axios';
import { ChatService } from '../../services/chat';
import { UserStackParamList } from '../../types';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { UserService } from '../../services/user';
import { Feather } from '@expo/vector-icons';
import LoadingStatusContext from '../../components/LoadingStatus';
import ChatStatusContext from '../../components/ChatStatus';
import Button from '../../components/Button';
interface Props {
  navigation: NativeStackNavigationProp<UserStackParamList, 'UserHome'>;
}

export default function UserDetailSupport({ navigation }: Props) {
  const userCtx = useContext(UserContext);
  const { setHideBottomBar } = useContext(ChatStatusContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const fetchUser = async () => {
    const { data: userData } = await a.get(`/users/${userCtx.user.id}`);
    if (!userData) return;
    userCtx.setUser(userData);
  };

  const handleStartDirectChat = async (userId: string) => {
    ChatService.createDirectChat(userId)
      .then((res) => res.data)
      .then((data) => {
        if (!data) return;
        setHideBottomBar(true);
        setLoadingStatus({ isLoading: true });
        //this is to prevent the page shows before the bottom bar is hidden, if there still have gap between chat input box and bottom, we have to show bottom bar in chat conversation page.
        setTimeout(() => {
          setLoadingStatus({ isLoading: false });
          navigation.navigate('ChatConversation', {
            chatId: data.id,
          });
        }, 100);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleRemoveSupport = async (userId: string, index: number) => {
    Alert.alert(
      'Are you sure?',
      'Removing this member from My Support will disconnect you from them.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const data = await UserService.removeSupporter({
              userId: userCtx.user.id,
              supporterId: userId,
            });
            if (!data) return;
            fetchUser();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };
  let row: Array<any> = [];
  return (
    <View className='px-4 mt-4' style={{ backgroundColor: 'transparent' }}>
      {userCtx.user.supports.map((_, index) => (
        <GestureHandlerRootView>
          <Swipeable
            ref={(ref) => (row[index] = ref)}
            friction={1}
            leftThreshold={30}
            key={'support' + index}
            renderRightActions={() => (
              <View
                style={{ backgroundColor: 'transparent' }}
                className='flex flex-row px-4 pb-4 my-auto'
              >
                <Pressable
                  onPress={() => handleRemoveSupport(_.id, index)}
                  className='flex flex-row items-center justify-center w-12 h-12 rounded-lg bg-cranberry'
                >
                  <Feather name='trash-2' size={24} color='white' />
                </Pressable>
              </View>
            )}
          >
            <View
              className='flex flex-row items-center justify-between w-full px-2 mb-4 bg-white rounded-lg'
              key={index}
            >
              <View className='flex flex-row items-center justify-start '>
                <View className='p-2 rounded-xl'>
                  <UserAvatar
                    name={_.displayName}
                    size={20}
                    url={_.profilePicture}
                  />
                </View>
                <Text className='ml-2 text-lg font-semibold text-midnight-mosaic'>
                  {_.displayName}
                </Text>
              </View>
              <Pressable
                className='p-2 mr-3 bg-tiffany rounded-xl'
                onPress={() => {
                  handleStartDirectChat(_.id);
                }}
              >
                <Ionicons
                  name='ios-chatbubbles-outline'
                  size={24}
                  color='white'
                />
              </Pressable>
            </View>
          </Swipeable>
        </GestureHandlerRootView>
      ))}
      <View style={{ backgroundColor: 'transparent' }}>
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
    </View>
  );
}
