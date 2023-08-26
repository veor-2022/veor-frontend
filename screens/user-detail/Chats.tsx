import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import UserAvatar from '../../components/UserAvatar';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import { UserService } from '../../services/user';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pressable, Alert, Dimensions } from 'react-native';
import {
  Swipeable,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { ChatService } from '../../services/chat';
import ChatStatusContext from '../../components/ChatStatus';
import LoadingStatusContext from '../../components/LoadingStatus';
dayjs.extend(relativeTime);
export default function UserDetailChats({ navigation }: any) {
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const isTabFocused = useIsFocused();
  const [chatContactHistory, setChatContactHistory] = useState<any[]>([]);
  const { user } = useContext(UserContext);

  const fetchChatContactHistory = async () => {
    setLoadingStatus({ isLoading: true });
    const chatContactHistory =
      await UserService.fetchUserChatContactHistory().then((res) => res.data);
    if (!chatContactHistory) {
      setLoadingStatus({ isLoading: false });
      return;
    }
    if (chatContactHistory.length === 0) {
      setLoadingStatus({ isLoading: false });
      return;
    }
    const _history = chatContactHistory.filter((chatContact: any) => {
      if (chatContact.users[0].id === user.id) {
        return !user.blocked.find((u: any) => u.id === chatContact.users[1].id);
      }
      return !user.blocked.find((u: any) => u.id === chatContact.users[0].id);
    });
    setLoadingStatus({ isLoading: false });
    if (_history.length === 0) {
      return setChatContactHistory([]);
    }
    setChatContactHistory(_history);
  };

  useEffect(() => {
    if (!isTabFocused) {
      return;
    }
    fetchChatContactHistory();
  }, [isTabFocused]);

  const handleRemoveChat = async (chatId: string, index: number) => {
    Alert.alert(
      'Are you sure?',
      'Deleting this chatroom may disconnect you from the member.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { data: res } = await ChatService.deleteChatHistory(chatId);
            row[index].close();
            const temp = [...chatContactHistory];
            temp.splice(index, 1);
            setChatContactHistory([...temp]);
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
  const { setHideBottomBar } = useContext(ChatStatusContext);
  return (
    <View className='px-4 mt-4' style={{ backgroundColor: 'transparent' }}>
      {chatContactHistory.length > 0 ? (
        chatContactHistory.map((chatContact, i) => (
          <GestureHandlerRootView>
            <Swipeable
              ref={(ref) => (row[i] = ref)}
              friction={1}
              key={'conv' + i}
              leftThreshold={30}
              renderRightActions={() => (
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='flex flex-row px-4 pb-4 my-auto'
                >
                  <Pressable
                    onPress={() => handleRemoveChat(chatContact.id, i)}
                    className='flex flex-row items-center justify-center w-12 h-12 rounded-lg bg-cranberry'
                  >
                    <Feather name='trash-2' size={24} color='white' />
                  </Pressable>
                </View>
              )}
            >
              <Pressable
                onPress={() => {
                  setHideBottomBar(true);
                  setLoadingStatus({ isLoading: true });
                  //this is to prevent the page shows before the bottom bar is hidden, if there still have gap between chat input box and bottom, we have to show bottom bar in chat conversation page.
                  setTimeout(() => {
                    setLoadingStatus({ isLoading: false });
                    navigation.navigate('ChatConversation', {
                      chatId: chatContact.id,
                    });
                  }, 100);
                }}
              >
                <View className='p-2 mb-4 rounded-lg'>
                  <View
                    className='flex flex-row items-start justify-between'
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <View
                      className='flex flex-row flex-shrink'
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <UserAvatar
                        name={
                          user.id === chatContact.users[0].id
                            ? (
                                chatContact.users[1].nickname ||
                                chatContact.users[1].firstName
                              ).toUpperCase()
                            : (
                                chatContact.users[0].nickname ||
                                chatContact.users[0].firstName
                              ).toUpperCase() || 'A'
                        }
                        size={24}
                        url={
                          user.id === chatContact.users[0].id
                            ? chatContact.users[1].profilePicture
                            : chatContact.users[0].profilePicture
                        }
                      />
                      <View
                        className='ml-2'
                        style={{ backgroundColor: 'transparent' }}
                      >
                        <Text className='mb-1 font-bold text-midnight-mosaic text-[17px] '>
                          {user.id === chatContact.users[0].id
                            ? chatContact.users[1].nickname ||
                              chatContact.users[1].firstName
                            : chatContact.users[0].nickname ||
                              chatContact.users[0].firstName}
                        </Text>
                        <View
                          style={{
                            maxWidth: Dimensions.get('window').width * 0.7,
                          }}
                        >
                          <Text
                            numberOfLines={1}
                            className='mt-1 ml-0.5 text-midnight-mosaic text-[15px] w-full'
                          >
                            {chatContact.messages.length > 0
                              ? chatContact.messages[0].content
                              : ''}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className='flex flex-row items-center'>
                      <View className='w-2 h-2 mr-2 rounded-full bg-cranberry'></View>
                      <Text className='mr-4'>
                        {chatContact.messages.length > 0
                          ? dayjs(chatContact.messages[0].sentAt).fromNow()
                          : dayjs(chatContact.createdAt).fromNow()}
                      </Text>
                      <FontAwesome
                        name='angle-right'
                        size={20}
                        color='#9B9B9B'
                      />
                    </View>
                  </View>
                </View>
              </Pressable>
            </Swipeable>
          </GestureHandlerRootView>
        ))
      ) : (
        <View
          className='flex flex-col items-center'
          style={{ backgroundColor: 'transparent' }}
        >
          <Text className='text-neutral-grey-300 text-[20px] font-bold'>
            No chat history
          </Text>
        </View>
      )}
    </View>
  );
}
