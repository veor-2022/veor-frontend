import { Group, GroupEnrollment, Message, User } from '@prisma/client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Image,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import UserAvatar from '../../components/UserAvatar';
import { Text, View } from '../../components/Themed';
import UserContext from '../../components/User';
import LoadingStatusContext from '../../components/LoadingStatus';
import GroupService from '../../services/group';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { firebase } from '@react-native-firebase/auth';
import { AllZeroUUID } from '../../constants/helpers';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import { ChatService } from '../../services/chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import GroupDetailChatSendBox from './GroupDetailChatSendBox';

interface ConversationMessage {
  id: string | number;
  from: string;
  content: string;
  isMe: boolean;
  sentAt: Date;
  avatar: string | null;
  senderId: string;
  likes?: number;
}

interface FirebaseChatMsg {
  content: string;
  id: string;
  senderId: string;
  ts: Date;
  likes?: number;
}

interface props {
  data: Group & { members: (GroupEnrollment & { user: User })[] };
}

dayjs.extend(relativeTime);
export default function GroupDetailChat({ data }: props) {
  const user = useContext(UserContext);
  const { setLoadingStatus } = useContext(LoadingStatusContext);

  const delay = 500;

  const isFocused = useIsFocused();

  const [firstPress, setFirstPress] = useState(true);
  const [lastTime, setLastTime] = useState(new Date().getTime());
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const [conversation, setConversation] = React.useState<ConversationMessage[]>(
    []
  );

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
            // TODO: Add single tap logic here
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

  const onLikeMessage = async (item: ConversationMessage) => {
    setLoadingStatus({ isLoading: true });
    const isAlreadyLiked = await AsyncStorage.getItem(
      'liked:' + item.toString() + user.user.id
    );
    if (isAlreadyLiked === 'true') {
      ChatService.unlikeChatMessage({
        groupId: data.id,
        msgId: item.toString(),
      })
        .then((res) => res.data)
        .then((data) => {
          if (!data) {
            setTimeout(() => {
              setLoadingStatus({ isLoading: false });
            }, 500);
            return;
          }
        })
        .catch((err) => {
          setTimeout(() => {
            setLoadingStatus({ isLoading: false });
          }, 500);
        });
      AsyncStorage.removeItem('liked:' + item.toString() + user.user.id);
      setTimeout(() => {
        setLoadingStatus({ isLoading: false });
      }, 500);
      return;
    }
    ChatService.likeChatMessage({ groupId: data.id, msgId: item.toString() })
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          setTimeout(() => {
            setLoadingStatus({ isLoading: false });
            alert('Error liking message');
          }, 500);
          return;
        }
        AsyncStorage.setItem('liked:' + item.toString() + user.user.id, 'true');
      })
      .catch((err) => {
        setTimeout(() => {
          setLoadingStatus({ isLoading: false });
          alert('Error liking message');
        }, 500);
      });
    setTimeout(() => {
      setLoadingStatus({ isLoading: false });
    }, 500);
  };

  const fetchGroupChatMessages = async () => {
    const response = await GroupService.fetchGroupMessages(data.id).then(
      (res) => res.data
    );
    if (!response) {
      return;
    }
    const mappedData = response?.map(
      (
        msg: Message & {
          sender: User;
          group: Group;
        }
      ) => {
        const ret: ConversationMessage = {
          id: msg.id,
          content: msg.content,
          from: msg.sender.nickname || msg.sender.firstName,
          isMe: msg.userId === user.user.id,
          sentAt: msg.sentAt,
          avatar: msg.sender.profilePicture,
          senderId: msg.sender.id,
          likes: msg.likes,
        };
        return ret;
      }
    );
    const resolvedData = await Promise.all(mappedData);
    setConversation(resolvedData);
  };

  const handleSendMessage = (msg: string) => {
    setConversation((prev) => [
      ...prev,
      {
        id: -1,
        content: msg,
        from: user.user.nickname || user.user.firstName,
        isMe: true,
        sentAt: new Date(),
        avatar: user.user.profilePicture,
        senderId: user.user.id,
        likes: 0,
      },
    ]);
    GroupService.postNewGroupChatMessage({
      groupId: data.id,
      message: msg,
      senderId: user.user.id,
    })
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          Alert.alert('Oops!', 'Something went wrong. Please try again later.');
          return;
        }
      })
      .catch((err) => {
        console.error('err', err);
        Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      });
  };

  const handleUnsentMessage = (msgId: string) => {
    GroupService.unsentGroupMessage({
      groupId: data.id,
      messageId: msgId,
    });
  };

  const onUnsentMessage = (msgId: string) => {
    Alert.alert(
      'Unsent Message',
      'You want to unsent this message? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            handleUnsentMessage(msgId);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {},
      }
    );
  };

  useEffect(() => {
    fetchGroupChatMessages();
    DeviceEventEmitter.addListener('groupChat.sendMsg', (msg: string) => {
      handleSendMessage(msg);
    });
    const subscriber = firestore()
      .collection('groupMessages')
      .doc(data.id)
      .onSnapshot(async (documentSnapshot) => {
        if (!documentSnapshot.exists) {
          return;
        }
        const msgData = documentSnapshot.data();
        if (!msgData) return;
        const mappedData = msgData?.messages.map((msg: FirebaseChatMsg) => {
          const ret: ConversationMessage = {
            id: msg.id,
            content: msg.content,
            from:
              msgData.members[msg.senderId].nickname ||
              msgData.members[msg.senderId].firstName ||
              'A',
            isMe: msg.senderId === user.user.id,
            senderId: msg.senderId,
            // @ts-ignore
            sentAt: msg.ts.toDate(),
            avatar:
              data.members.find((member) => member.userId === msg.senderId)
                ?.user.profilePicture ||
              msgData.members[msg.senderId].profilePicture,
            likes: msg.likes,
          };
          return ret;
        });
        const resolvedData = await Promise.all(mappedData);
        setConversation(resolvedData);
      });
    return () => {
      DeviceEventEmitter.removeAllListeners('groupChat.sendMsg');
      subscriber;
    };
  }, [data.id]);
  const scrollViewRef = useRef<ScrollView>(null);
  return (
    <View style={{ backgroundColor: 'transparent' }} className='pb-0 mb-0'>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd();
        }}
        style={{
          backgroundColor: 'transparent',
          maxHeight:
            Dimensions.get('window').height *
            (Platform.OS === 'ios' ? 0.4 : 0.45),
        }}
        showsVerticalScrollIndicator={false}
        className='pb-0 mb-0'
      >
        <View style={{ backgroundColor: 'transparent' }} className='pb-6 mb-0'>
          {conversation.map((item, index) => {
            return (
              <View
                key={index}
                style={{ backgroundColor: 'transparent' }}
                className='h-auto mb-2'
              >
                {item.senderId !== AllZeroUUID ? (
                  <View style={{ backgroundColor: 'transparent' }} key={index}>
                    <View
                      style={{ backgroundColor: 'transparent' }}
                      className='flex flex-col items-center'
                    >
                      {conversation.length >= 1 && index > 1 ? (
                        dayjs(conversation[index - 1].sentAt).diff(
                          dayjs(item.sentAt),
                          'minute'
                        ) > 3 ? (
                          <Text className=' text-neutral-grey-300'>
                            {dayjs(new Date(item.sentAt)).fromNow()}
                          </Text>
                        ) : null
                      ) : (
                        <Text className=' text-neutral-grey-300'>
                          {dayjs(new Date(item.sentAt)).fromNow()}
                        </Text>
                      )}
                    </View>
                    <View
                      key={index}
                      className={
                        item.isMe
                          ? 'flex flex-row justify-end items-end mb-4 mr-2'
                          : 'flex flex-row justify-start items-end mb-4'
                      }
                      style={{ backgroundColor: 'transparent' }}
                    >
                      {!item.isMe && (
                        <UserAvatar
                          name={item.from}
                          size={20}
                          url={item.avatar}
                        />
                      )}
                      <Pressable
                        onPress={() => {
                          onTap(item.id);
                        }}
                        onLongPress={() => {
                          if (item.isMe) {
                            onUnsentMessage(item.id + '');
                          }
                        }}
                        className={
                          item.isMe
                            ? 'bg-jade rounded-xl p-3'
                            : 'bg-white rounded-xl p-3 ml-2'
                        }
                      >
                        <Text
                          className={
                            item.isMe ? 'text-white' : 'text-midnight-mosaic'
                          }
                        >
                          {item.content}
                        </Text>
                        {item.likes && item.likes > 0 ? (
                          <View
                            className={
                              item.isMe
                                ? 'absolute -bottom-3 left-0 bg-neutral-grey-100 border border-white rounded-full px-1 flex flex-row items-center'
                                : 'absolute -bottom-3 -right-2 bg-neutral-grey-100 border border-white rounded-full px-1 flex flex-row items-center'
                            }
                          >
                            <View
                              className='flex flex-row items-center justify-center w-3'
                              style={{ backgroundColor: 'transparent' }}
                            >
                              <Ionicons
                                name='heart'
                                size={12}
                                color='#F85D96'
                              />
                            </View>

                            {item.likes > 1 && (
                              <Text className='w-2 text-xs font-semibold text-midnight-mosaic'>
                                {item.likes}
                              </Text>
                            )}
                          </View>
                        ) : null}
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View style={{ backgroundColor: 'transparent' }} key={index}>
                    <View
                      style={{ backgroundColor: 'transparent' }}
                      className='flex flex-col items-center'
                    >
                      {JSON.parse(item.content).type === 'NEW_MEMBER' ? (
                        <Text className=' text-neutral-grey-300 mb-3'>
                          <Text className='font-bold text-neutral-grey-300'>
                            {JSON.parse(item.content).content}
                          </Text>{' '}
                          has joined the group.
                        </Text>
                      ) : (
                        <Text className=' text-neutral-grey-300'>
                          {JSON.parse(item.content).content}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
