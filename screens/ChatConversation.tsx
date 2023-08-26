import { Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
} from 'react-native';
import UserAvatar from '../components/UserAvatar';
import { Text, View } from '../components/Themed';
import {
  ChatConversationObject,
  ChatStackScreenProps,
  HomeStackScreenProps,
} from '../types';
import firestore from '@react-native-firebase/firestore';
import { ChatService } from '../services/chat';
import UserContext, { initialUser } from '../components/User';
import { ListenerProfile, User } from '@prisma/client';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { UserService } from '../services/user';
import { RequestService } from '../services/request';
import { Platform } from 'react-native';
import ChatStatusContext from '../components/ChatStatus';
import LoadingStatusContext from '../components/LoadingStatus';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

dayjs.extend(relativeTime);
export default function ChatScreen({
  navigation,
  route,
}: ChatStackScreenProps<'ChatConversation'>) {
  const chatId = route.params.chatId;
  const [isModalVisible, setModalVisible] = React.useState(false);
  const userCtx = useContext(UserContext);
  const { setHideBottomBar, setHideNavBar } = useContext(ChatStatusContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = React.useState('');
  const [isBlocked, setBlocked] = React.useState(false);
  const [isReviewed, setIsReviewed] = React.useState(false);
  const [isRequesting, setRequesting] = React.useState(false);
  const [targetUser, setTargetUser] = React.useState<
    Omit<User, 'password'> & { listenerProfile: ListenerProfile | null }
  >(initialUser);
  const [conversation, setConversation] = React.useState<
    ChatConversationObject[]
  >([]);
  let chatScrollRef = useRef<ScrollView>(null);
  const delay = 500;

  const isFocused = useIsFocused();
  const [inputPressed, setInputPressed] = useState(false);
  const [firstPress, setFirstPress] = useState(true);
  const [lastTime, setLastTime] = useState(new Date().getTime());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMessageInputFocused, setMessageInputFocused] = useState(false);
  const [KeyboardAvoidingViewOffset, setKeyboardAvoidingViewOffset] =
    useState(0);

  useEffect(() => {
    setHideBottomBar(true);
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => setModalVisible(true)} className=''>
          <Entypo name='dots-three-vertical' size={24} color='#3D5467' />
        </Pressable>
      ),
    });
    return () => {
      setHideBottomBar(false);
      setHideNavBar(false);
    };
  }, []);

  useEffect(() => {
    return () => {
      timer && clearTimeout(timer);
    };
  });

  const onTap = useCallback(
    (item: any) => {
      const now = new Date().getTime();

      // Single tap
      if (firstPress) {
        setFirstPress(false);

        setTimer(
          setTimeout(() => {
            setFirstPress(true);
            setTimer(null);
          }, delay)
        );

        setLastTime(now);
      } else {
        // Double tap
        if (now - lastTime < delay) {
          timer && clearTimeout(timer);
          onLikeMessage(item);
          setFirstPress(true);
        }
      }
    },
    [firstPress, lastTime, delay, timer]
  );

  const handleSendChatMessage = async () => {
    if (!currentMessage) {
      return;
    }
    ChatService.postChatMessage(chatId, currentMessage)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setCurrentMessage('');
      });
  };

  const handleAddToSupport = async () => {
    RequestService.createSupportRequest(targetUser.id)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setRequesting(true);
      });
  };

  const deleteChatHistory = async () => {
    Alert.alert(
      'Permanently delete this conversation?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            ChatService.cleanChatConversation(chatId)
              .then((res) => res.data)
              .then((data) => {
                if (!data) {
                  return;
                }
                setConversation([]);
                navigation.goBack();
              })
              .catch((err) => {
                alert('Oops! Something went wrong. Please try again later.');
              });
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const onUnsentMessage = (msgId: string) => {
    Alert.alert(
      'Unsent this message?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Unsend',
          style: 'destructive',
          onPress: () => {
            ChatService.unsentChatMessage(chatId, msgId)
              .then((res) => res.data)
              .then((data) => {
                if (!data) {
                  return;
                }
              });
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  const onLikeMessage = async (msgId: string) => {
    setLoadingStatus({ isLoading: true });
    const isAlreadyLiked = await AsyncStorage.getItem(
      'liked:' + chatId + msgId
    );
    if (isAlreadyLiked === 'true') {
      ChatService.unlikeChatMessage({ chatId, msgId })
        .then((res) => res.data)
        .then((data) => {
          if (!data) {
            setTimeout(() => {
              setLoadingStatus({ isLoading: false });
            }, 500);
            return;
          }
          AsyncStorage.removeItem('liked:' + chatId + msgId);
        });
      setTimeout(() => {
        setLoadingStatus({ isLoading: false });
      }, 500);
      return;
    }
    ChatService.likeChatMessage({ chatId, msgId })
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        AsyncStorage.setItem('liked:' + chatId + msgId, 'true');
      });
    setTimeout(() => {
      setLoadingStatus({ isLoading: false });
    }, 500);
  };

  const checkIsReviewed = async () => {
    if (targetUser.id && isFocused && targetUser.listenerProfile) {
      const { data: isReviewed } =
        await UserService.getReviewByUserIdAndListenerId({
          userId: userCtx.user.id,
          listenerId: targetUser.listenerProfile.id,
        });
      if (isReviewed) {
        setIsReviewed(true);
      } else {
        setIsReviewed(false);
      }
    }
  };

  const checkIsAddToSupport = async () => {
    if (targetUser.id && isFocused) {
      const { data: isAdded } = await RequestService.checkRequestStatus({
        fromId: userCtx.user.id,
        toId: targetUser.id,
        type: 'ADD_TO_SUPPORTS_REQUEST',
      });
      if (isAdded === null || isAdded.status === null) {
        setRequesting(false);
        return;
      }
      if (
        (isAdded && isAdded.status === 'PENDING') ||
        isAdded.status === 'ACCEPTED'
      ) {
        setRequesting(true);
      } else {
        setRequesting(false);
      }
    }
  };

  useEffect(() => {
    checkIsReviewed();
    checkIsAddToSupport();
  }, [targetUser, isFocused]);

  useEffect(() => {
    let subscriber;
    setLoadingStatus({ isLoading: true });
    setIsLoading(true);
    ChatService.fetchChatInfo(chatId)
      .then((res) => res.data)
      .then((data: any) => {
        if (!data) {
          throw new Error('No data');
        }
        const targetUser = data.users.find(
          (user: any) => user.id !== userCtx.user.id
        );
        return targetUser;
      })
      .then((_targetUser) => {
        if (!_targetUser) {
          throw new Error('No target user');
        }
        return _targetUser;
      })
      .then((_targetUser) => {
        firestore().collection('chatMessages').doc(chatId).get();
        return _targetUser;
      })
      .then((_targetUser) => {
        if (
          userCtx.user.blocked.filter((ele) => ele.id === _targetUser.id)
            .length > 0
        ) {
          setBlocked(true);
        } else {
          setBlocked(false);
        }
        subscriber = firestore()
          .collection('chatMessages')
          .doc(chatId)
          .onSnapshot(async (documentSnapshot) => {
            if (!documentSnapshot.exists) {
              return;
            }
            const msgData = documentSnapshot.data();
            const mappedData = msgData?.messages.map((msg: any) => {
              const ret: ChatConversationObject = {
                id: msg.id,
                content: msg.content,
                from: (
                  _targetUser.nickname ||
                  _targetUser.firstName ||
                  'Anonymous'
                ).toUpperCase(),
                isMe: msg.uid === userCtx.user.id,
                likes: msg.likes || 0,
                createdAt: msg.ts.toDate().toString(),
                avatar: _targetUser.profilePicture || '',
              };
              return ret;
            });
            const resolvedData = await Promise.all(mappedData);
            setConversation([...resolvedData]);
            setTargetUser(_targetUser);
            setLoadingStatus({ isLoading: false });
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setLoadingStatus({ isLoading: false });
        setIsLoading(false);
        Alert.alert('Oops!', 'Something went wrong, please try again later');
      });

    // Stop listening for updates when no longer required
    return subscriber;
  }, [chatId]);

  const confirmBlockMember = () => {
    Alert.alert(
      'Block this member?',
      "They won't be able to send you any message, invitation, or request.",
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: handleBlock,
        },
      ]
    );
  };

  const handleBlock = async () => {
    const { data } = await UserService.editBlockedUser({
      userId: userCtx.user.id,
      targetUser: targetUser.id,
    });
    if (!data) {
      Alert.alert('Oops!', 'Something went wrong. Please try again later.');
    }
    if (data) {
      const newBlockedUsers = userCtx.user.blocked;
      newBlockedUsers.push({
        id: targetUser.id,
        firstName: targetUser.firstName,
        nickname: targetUser.nickname || '',
        profilePicture: targetUser.profilePicture || '',
      });
      userCtx.setUser({ ...userCtx.user, blocked: newBlockedUsers });
      alert(targetUser.firstName + ' has been blocked.');
      setModalVisible(false);
      navigation.goBack();
    }
  };
  const handleUnblock = async () => {
    const { data } = await UserService.editBlockedUser({
      userId: userCtx.user.id,
      targetUser: targetUser.id,
    });
    if (!data) {
      return;
    }
    const newBlockedUsers = userCtx.user.blocked.filter(
      (blockedUser) => blockedUser.id !== targetUser.id
    );
    userCtx.setUser({ ...userCtx.user, blocked: newBlockedUsers });
    alert(targetUser.firstName + ' has been unblocked.');
    setModalVisible(false);
  };

  return (
    <View>
      <View
        className={
          'z-50 w-full bg-neutral-grey-100 shadow-sm flex flex-row justify-between items-center ' +
          (Platform.OS === 'ios' ? 'pt-8 h-[102px]' : 'h-[70px]')
        }
      >
        {!isLoading && (
          <View
            className={
              'flex flex-row items-center mt-1 ' +
              (Platform.OS === 'ios' ? 'pl-10 ' : 'pl-12 pb-4')
            }
            style={{ backgroundColor: 'transparent' }}
          >
            <UserAvatar
              size={18}
              name={targetUser.nickname || targetUser.firstName}
              url={targetUser.profilePicture}
            />
            <View style={{ backgroundColor: 'transparent' }} className='ml-4'>
              <Text className='text-2xl font-semibold text-midnight-mosaic'>
                {targetUser.nickname || targetUser.firstName}
              </Text>
              {/* <View
                className='flex flex-row items-center'
                style={{ backgroundColor: 'transparent' }}
              >
                <View className='w-2 h-2 mr-2 rounded-full bg-jade'></View>
                <Text className='text-storm'>Online</Text>
              </View> */}
            </View>
          </View>
        )}
      </View>
      {!isLoading && (
        <KeyboardAvoidingView
          className='h-screen'
          behavior={Platform.OS === 'ios' ? 'position' : 'position'}
          style={{
            backgroundColor: 'transparent',
          }}
          keyboardVerticalOffset={KeyboardAvoidingViewOffset}
        >
          <LinearGradient
            locations={[0.7, 1]}
            colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
            className=''
          >
            <View
              style={{
                backgroundColor: 'transparent',
              }}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                className='px-4'
                style={{
                  backgroundColor: 'transparent',
                }}
                ref={chatScrollRef}
                onContentSizeChange={() =>
                  chatScrollRef.current?.scrollToEnd({ animated: false })
                }
              >
                <Pressable
                  onPress={() => {
                    setKeyboardAvoidingViewOffset(0);
                    setMessageInputFocused(false);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backgroundColor: 'transparent',
                    minHeight: Dimensions.get('window').height,
                    paddingTop: inputPressed
                      ? Platform.OS === 'ios'
                        ? 140
                        : 20
                      : 20,
                    paddingBottom:
                      Platform.OS === 'ios'
                        ? inputPressed
                          ? isMessageInputFocused
                            ? 140
                            : 90
                          : 190
                        : inputPressed
                        ? isMessageInputFocused
                          ? 140
                          : 90
                        : 150,
                  }}
                >
                  {conversation.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: 'transparent',
                      }}
                    >
                      {index === 0 && (
                        <View
                          style={{ backgroundColor: 'transparent' }}
                          className='flex flex-col items-center mb-4'
                        >
                          <Text className=' text-neutral-grey-300'>
                            {dayjs(item.createdAt).fromNow()}
                          </Text>
                        </View>
                      )}

                      <View
                        key={index}
                        className={
                          item.isMe
                            ? 'flex flex-row justify-end items-end mb-8 mr-2'
                            : 'flex flex-row justify-start items-end mb-8'
                        }
                        style={{ backgroundColor: 'transparent' }}
                      >
                        {!item.isMe && (
                          <UserAvatar
                            name={targetUser.nickname || targetUser.firstName}
                            size={16}
                            url={targetUser.profilePicture}
                          />
                        )}
                        <Pressable
                          onPress={() => {
                            onTap(item.id);
                            setMessageInputFocused(false);
                            setKeyboardAvoidingViewOffset(0);
                            Keyboard.dismiss();
                          }}
                          onLongPress={() => {
                            if (item.isMe) {
                              onUnsentMessage(item.id);
                            } else {
                              return;
                            }
                          }}
                          className={
                            item.isMe
                              ? 'bg-jade rounded-xl p-3'
                              : 'bg-white rounded-xl p-3 ml-2'
                          }
                        >
                          <Text
                            style={{
                              maxWidth: Dimensions.get('window').width * 0.7,
                            }}
                            className={
                              item.isMe
                                ? 'text-lg text-white'
                                : 'text-lg text-midnight-mosaic'
                            }
                          >
                            {item.content}
                          </Text>
                          {item.likes > 0 && (
                            <View
                              className={
                                item.isMe
                                  ? 'absolute -bottom-3 left-0 bg-neutral-grey-100 border border-white rounded-full px-1 flex flex-row items-center'
                                  : 'absolute -bottom-3 -right-0 bg-neutral-grey-100 border border-white rounded-full px-1 flex flex-row items-center'
                              }
                            >
                              <View
                                className='flex flex-row items-center justify-center w-4'
                                style={{ backgroundColor: 'transparent' }}
                              >
                                <Ionicons
                                  name='heart'
                                  size={14}
                                  color='#F85D96'
                                />
                              </View>

                              {item.likes > 1 && (
                                <Text className='w-2 ml-0.5 text-xs font-semibold text-midnight-mosaic'>
                                  {item.likes}
                                </Text>
                              )}
                            </View>
                          )}
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </Pressable>
              </ScrollView>
            </View>
          </LinearGradient>
          <View
            className='absolute bg-neutral-grey-100 w-full px-4'
            style={{
              height: isMessageInputFocused ? 160 : 100,
              bottom:
                Platform.OS === 'ios'
                  ? inputPressed
                    ? 0
                    : 100
                  : inputPressed
                  ? 0
                  : 60,
            }}
          >
            <TextInput
              textAlignVertical='top'
              multiline={true}
              className={`mt-4 p-3 pr-12 text-xl bg-white border-2 border-white rounded-xl text-midnight-mosaic`}
              placeholder='Type your message here...'
              value={currentMessage}
              returnKeyLabel='send'
              onFocus={() => {
                setKeyboardAvoidingViewOffset(Platform.OS === 'ios' ? 0 : 50);
                setInputPressed(true);
                setMessageInputFocused(true);
              }}
              onBlur={() => {
                setKeyboardAvoidingViewOffset(0);
                setMessageInputFocused(false);
              }}
              style={{
                height: isMessageInputFocused ? 120 : 56,
              }}
              onChange={(e) => setCurrentMessage(e.nativeEvent.text)}
            />
            <Pressable
              className='absolute p-2 bottom-9 right-6 bg-jade rounded-xl'
              onPress={() => {
                handleSendChatMessage();
              }}
            >
              <Ionicons name='arrow-up-sharp' size={24} color='white' />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}

      <Modal
        backdropOpacity={0.4}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          margin: 0,
        }}
        className='relative rounded-t-lg'
        isVisible={isModalVisible}
      >
        <View className='absolute bottom-0 w-full rounded-t-lg'>
          <LinearGradient
            locations={[0.7, 1]}
            colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
            className='px-4 py-16 rounded-t-lg '
          >
            {userCtx.user.supports.filter((u) => u.id === targetUser.id)
              .length === 0 &&
              !isRequesting && (
                <Pressable
                  className='flex flex-row items-center p-2 mb-4 bg-white rounded-lg'
                  onPress={() => {
                    handleAddToSupport();
                  }}
                >
                  <View className='p-1 mr-4 rounded-md bg-jade'>
                    <Ionicons name='person-add-sharp' size={20} color='white' />
                  </View>
                  <Text className='text-lg font-semibold text-midnight-mosaic'>
                    Add to My Support
                  </Text>
                </Pressable>
              )}

            {targetUser && targetUser.listenerProfile && !isReviewed && (
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ListenerReview', {
                    userId: targetUser.id,
                  });
                }}
                className='flex flex-row items-center p-2 mb-4 bg-white rounded-lg'
              >
                <View className='p-1 mr-4 rounded-md bg-jade'>
                  <Ionicons name='star-outline' size={20} color='white' />
                </View>
                <Text className='text-lg font-semibold text-midnight-mosaic'>
                  Rate and Review
                </Text>
              </Pressable>
            )}

            {targetUser && targetUser.listenerProfile && (
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('ListenerProfile', {
                    listenerId: targetUser.id,
                  });
                }}
                className='flex flex-row items-center p-2 mb-4 bg-white rounded-lg'
              >
                <View className='p-1 mr-4 rounded-md bg-jade'>
                  <Ionicons name='star-outline' size={20} color='white' />
                </View>
                <Text className='text-lg font-semibold text-midnight-mosaic'>
                  Listener Profile
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                deleteChatHistory();
              }}
            >
              <View className='flex flex-row items-center p-2 mb-4 bg-white rounded-lg'>
                <View className='p-1 mr-4 rounded-md bg-cranberry'>
                  <Ionicons name='trash' size={20} color='white' />
                </View>
                <Text className='text-lg font-semibold text-cranberry'>
                  Delete This Conversation
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() =>
                isBlocked ? handleUnblock() : confirmBlockMember()
              }
              className='flex flex-row items-center p-2 mb-4 bg-white rounded-lg'
            >
              <View className='p-1 mr-4 rounded-md bg-cranberry'>
                <Ionicons
                  name='ios-remove-circle-outline'
                  size={20}
                  color='white'
                />
              </View>
              <Text className='text-lg font-semibold text-cranberry'>
                {isBlocked ? 'Unblock This Member' : 'Block This Member'}
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}
