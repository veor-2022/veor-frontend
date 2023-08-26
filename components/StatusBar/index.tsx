import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Pressable,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text } from '../Themed';
import { Bar } from 'react-native-progress';
import ChatStatusContext from '../../components/ChatStatus';
import { Feather, Ionicons } from '@expo/vector-icons';
import { ChatService } from '../../services/chat';
import { Chat } from '@prisma/client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import LoadingStatusContext from '../LoadingStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnumConvertToTopics } from '../../constants/topics';
import Modal from 'react-native-modal';
import Button from '../Button';

dayjs.extend(relativeTime);

export default function StatusBar({ navigation }: any) {
  const {
    chatStatus,
    setChatStatus,
    chatStatusId,
    hideChatStatus,
    prevChatStatus,
    pendingChatCount,
    setHideBottomBar,
    setPrevChatStatus,
    setHideChatStatus,
    setChatStatusId,
    setHideNavBar,
    acceptChat,
    isRequestsPanelOpen,
    setIsRequestsPanelOpen,
  } = useContext(ChatStatusContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);

  const Matching = () => {
    const handleConfirmChatRequest = () => {
      Alert.alert('Are you sure?', '', [
        {
          text: 'Change My Mind',
          style: 'cancel',
        },
        {
          text: 'Cancel Request',
          style: 'destructive',
          onPress: handleDeleteChatRequest,
        },
      ]);
    };

    const handleDeleteChatRequest = () => {
      if (!chatStatusId) {
        return;
      }
      ChatService.deleteOneOnOneChatRequest(chatStatusId).then((data) => {
        if (!data) {
          return;
        }
        setChatStatus({ status: 'NONE' });
        setChatStatusId('');
      });
    };
    return (
      <View>
        <Bar
          indeterminate
          height={5}
          color={'#41B89C'}
          borderRadius={0}
          unfilledColor={'#E6E6E6'}
          width={null}
          borderWidth={0}
        />
        <View className='py-3 px-7'>
          <Text className='text-lg font-semibold text-midnight-mosaic'>
            Connecting you with a Listener...
          </Text>
          <View className='flex flex-row'>
            <Text className='font-light text-storm'>
              Thank you for your patience.
            </Text>
            <Pressable
              className='ml-1'
              onPress={() => handleConfirmChatRequest()}
            >
              <Text className='font-semibold text-cranberry'>
                Cancel Request
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const Listener = () => {
    return (
      <View>
        <Bar
          progress={100}
          height={5}
          color={'#41B89C'}
          borderRadius={0}
          unfilledColor={'#E6E6E6'}
          width={null}
          borderWidth={0}
        />
        <View className='flex flex-row items-center justify-between py-4 px-7'>
          <View className='flex flex-row'>
            <Text className='mr-1 text-lg font-semibold text-midnight-mosaic'>
              {pendingChatCount}
            </Text>
            <Text className='text-lg text-midnight-mosaic'>
              Pending Chat Requests
            </Text>
          </View>
          <Pressable
            onPress={() => {
              // setChatStatus({ status: 'REQUESTS' });
              setIsRequestsPanelOpen(true);
            }}
          >
            <Text className='text-lg font-semibold text-jade'>View</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const Matched = () => {
    const handleJoinChatRequest = (id: string) => {
      setLoadingStatus({ isLoading: true });
      ChatService.getOneOnOneChatRequestDetail(id)
        .then((res) => res.data)
        .then((data) => {
          if (!data) {
            return;
          }
          setHideChatStatus(true);
          setHideNavBar(false);
          setChatStatus({ status: 'NONE' });
          AsyncStorage.setItem('chatReqSession:' + id, 'true');
          setTimeout(() => {
            setHideBottomBar(true);
            navigation.getParent()?.navigate('ChatConversation', {
              chatId: data.chatId,
            });
            setLoadingStatus({ isLoading: false });
          }, 1000);
        });
    };
    return (
      <View className=''>
        <Pressable
          onPress={() => {
            ChatService.deleteOneOnOneChatRequest(chatStatusId)
              .then((res) => res.data)
              .then((data) => {
                if (!data) {
                  return;
                }
                setHideBottomBar(false);
                setHideNavBar(false);
                setChatStatus({ status: 'NONE' });
                setIsRequestsPanelOpen(false);
                setChatStatusId('');
                setHideChatStatus(false);
              });
          }}
          className='absolute bottom-0 h-screen bg-storm opacity-60 w-screen'
          style={{ zIndex: -10 }}
        ></Pressable>
        <View className='rounded-t-lg absolute bottom-0 w-screen'>
          <LinearGradient
            locations={[0.7, 1]}
            colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
            className='z-50 px-4 py-10 rounded-t-lg'
          >
            <View style={{ backgroundColor: 'transparent' }}>
              <Image
                source={require('../../assets/images/found_hero.png')}
                className='w-full h-40'
              />
              <View
                className='relative px-2 -top-8'
                style={{ backgroundColor: 'transparent' }}
              >
                <Text className='text-2xl font-semibold  text-midnight-mosaic'>
                  Your Listener is ready!
                </Text>

                <Text className=' text-storm mt-6 text-[15px] leading-5'>
                  Our Listeners are volunteers and are here to help. If you do
                  not find the match helpful for any reason, you can always send
                  a new request and our system will match you with a different
                  Listener.
                </Text>
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='mt-8'
                >
                  <Button
                    onPress={() => {
                      handleJoinChatRequest(chatStatusId);
                    }}
                    text='CHAT NOW'
                    backgroundColor='bg-jade'
                    textColor='text-white'
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    );
  };

  const PendingChat = () => {
    return (
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className={
          'h-screen px-5 ' + (Platform.OS === 'ios' ? ' pt-16' : 'pt-4')
        }
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            className='flex flex-row items-center justify-between mb-6 '
            style={{ backgroundColor: 'transparent' }}
          >
            <Pressable onPress={() => setIsRequestsPanelOpen(false)}>
              <Ionicons name='close' size={24} color='#3D5467' />
            </Pressable>
            <Text className='text-xl font-semibold text-midnight-mosaic'>
              Pending Chat Requests
            </Text>
            <View
              className='w-8 '
              style={{ backgroundColor: 'transparent' }}
            ></View>
          </View>
          {pendingChat.length > 0 &&
            pendingChat.map((chat: any, i: number) => {
              return (
                <View className='p-4 mb-4 rounded-xl' key={i}>
                  <View
                    className='flex flex-row justify-between mb-4 '
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <Text className='text-xl font-semibold text-midnight-mosaic'>
                      {chat.requester.nickname
                        ? chat.requester.nickname
                        : chat.requester.firstName}
                    </Text>
                    <View className='flex flex-row items-center'>
                      <View className='w-2 h-2 mr-1 rounded-full bg-jade'></View>
                      <Text className=' text-storm'>
                        {dayjs(chat.createdAt).fromNow()}
                      </Text>
                    </View>
                  </View>
                  <View className='flex flex-row justify-between'>
                    <View>
                      <View className='flex flex-row items-center mb-2'>
                        <View className='w-5 h-5 mr-1 rounded-md bg-love-life'></View>
                        <Text className=' text-storm'>
                          {EnumConvertToTopics[chat.topic]}
                        </Text>
                      </View>
                      <View className='flex flex-row items-center '>
                        <View className='flex flex-col items-center justify-center w-5 h-5 mr-1 rounded-md bg-jade'>
                          <Feather name='globe' size={14} color='white' />
                        </View>
                        <Text className='text-storm'>
                          {chat.language == 'ENGLISH' ? 'English' : '中文'}
                        </Text>
                      </View>
                    </View>
                    <View className='flex flex-col justify-end'>
                      <Pressable
                        className='flex flex-col items-center justify-center px-4 py-3 rounded-full bg-jade'
                        onPress={() => {
                          handleAcceptChatRequest(chat);
                          setChatStatus({
                            status: 'NONE',
                          });
                        }}
                      >
                        <Text className='font-semibold text-white'>Accept</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </LinearGradient>
    );
  };

  if (hideChatStatus) {
    return null;
  }

  const Core = () => {
    if (isRequestsPanelOpen) {
      return <PendingChat />;
    }
    if (chatStatus.status === 'MATCHING') {
      return <Matching />;
    }
    if (chatStatus.status === 'LISTENER') {
      return <Listener />;
    }
    if (chatStatus.status === 'MATCHED') {
      return <Matched />;
    }
    return null;
  };

  const [pendingChat, setPendingChat] = useState<any>([]);

  const fetchPendingChat = () => {
    ChatService.getOneOnOneChatRequest()
      .then((res) => res.data)
      .then((data) => {
        if (!data.chatRoom) {
          return;
        }
        setPendingChat(data.chatRoom);
      });
  };

  const handleAcceptChatRequest = (chat: Chat) => {
    setLoadingStatus({ isLoading: true });
    ChatService.acceptOneOnOneChatRequest(chat.id)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setHideBottomBar(true);
        setChatStatus({ status: 'NONE' });
        navigation.getParent()?.navigate('ChatConversation', {
          chatId: data.id,
        });
        setLoadingStatus({ isLoading: false });
      });
  };

  useEffect(() => {
    if (isRequestsPanelOpen) {
      fetchPendingChat();
    }
  }, [isRequestsPanelOpen]);

  return (
    <View>
      <Core />
    </View>
  );
}
