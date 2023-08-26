import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import classNames from 'classnames';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import ChatStatusContext from '../components/ChatStatus';
import { Text, View } from '../components/Themed';
import { ChatService } from '../services/chat';
import { ChatStackScreenProps } from '../types';
import Button from '../components/Button';
import { Bar } from 'react-native-progress';
import Modal from 'react-native-modal';
import { topics } from '../constants/topics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingStatusContext from '../components/LoadingStatus';
export default function ChatScreen({
  navigation,
}: ChatStackScreenProps<'ChatHome'>) {
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [chatTopic, setChatTopic] = useState('');
  const [chatLanguage, setChatLanguage] = useState('');
  const [requestChatStatus, setRequestChatStatus] = useState('NONE');
  const { setLoadingStatus } = useContext(LoadingStatusContext);
  const {
    chatStatus,
    setChatStatus,
    chatStatusId,
    setChatStatusId,
    setHideChatStatus,
    setHideBottomBar,
    setHideNavBar,
  } = useContext(ChatStatusContext);

  DeviceEventEmitter.addListener('chat.request.lang', (eventData) =>
    setChatLanguage(eventData.lang)
  );

  DeviceEventEmitter.addListener('chat.request.topic', (eventData) =>
    setChatTopic(eventData.topic)
  );

  const handleSendChatRequest = async () => {
    setLoadingStatus({ isLoading: true });
    ChatService.requestOneOnOneChat({
      topic:
        chatTopic === 'Self-Relationship' ? 'Self_Relationship' : chatTopic,
      language: [chatLanguage === '中文' ? 'MANDARIN' : 'ENGLISH'],
    })
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setModalVisible(true);
        setRequestChatStatus('WAITING');
        setChatStatus({ status: 'MATCHING' });
        setChatStatusId(data.id);
        setHideBottomBar(false);
        setLoadingStatus({ isLoading: false });
      });
  };

  const handleCancelChatRequest = async () => {
    Alert.alert('Are you sure?', '', [
      {
        text: 'Change My Mind',
        style: 'cancel',
      },
      {
        text: 'Cancel Request',
        style: 'destructive',
        onPress: () => {
          ChatService.deleteOneOnOneChatRequest(chatStatusId)
            .then((res) => res.data)
            .then((data) => {
              if (!data) {
                return;
              }
              setChatStatus({ status: 'NONE' });
              setTimeout(() => {
                setRequestChatStatus('WAITING');
                setChatStatusId('');
                setHideChatStatus(false);
                setModalVisible(false);
                setHideNavBar(false);
                setHideBottomBar(false);
              }, 1000);
            });
          setHideChatStatus(false);
        },
      },
    ]);
  };

  useEffect(() => {
    if (chatStatus.status === 'MATCHED') {
      setModalVisible(false);
      return;
    }
    if (chatStatus.status === 'NONE') {
      setRequestChatStatus('WAITING');
      setModalVisible(false);
      return;
    }
  }, [chatStatus]);

  const handleJoinChatRequest = (id: string) => {
    setLoadingStatus({ isLoading: true });
    ChatService.getOneOnOneChatRequestDetail(id)
      .then((res) => res.data)
      .then((data) => {
        if (!data) {
          return;
        }
        setHideChatStatus(true);
        AsyncStorage.setItem('chatReqSession:' + id, 'true');
        setTimeout(() => {
          setHideBottomBar(true);
          setModalVisible(false);
          setChatStatus({ status: 'NONE' });
          navigation.getParent()?.navigate('ChatConversation', {
            chatId: data.chatId,
          });
          setLoadingStatus({ isLoading: false });
        }, 1000);
      });
  };

  return (
    <View>
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='h-full pt-20'
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          className='relative px-6 overflow-visible'
          style={{ backgroundColor: 'transparent' }}
        >
          <View
            style={{ backgroundColor: 'transparent' }}
            className='flex flex-row items-center justify-center mt-8'
          >
            <Image
              className=''
              source={require('../assets/images/chat_hero.png')}
            />
          </View>
          <Text className='mt-8 text-2xl font-semibold  text-midnight-mosaic'>
            Ready to Chat?
          </Text>
          <Text className='mt-1 text-sm  text-storm'>
            Connect with a trained Veor Listener to talk about anything on your
            mind.
          </Text>

          {/* topic */}
          <Pressable
            onPress={() => navigation.navigate('ChatTopic')}
            className='flex flex-row items-center justify-between w-full p-3 mt-8 bg-white rounded-lg'
            disabled={
              chatStatus.status === 'MATCHING' ||
              chatStatus.status === 'MATCHED'
            }
          >
            <View className='flex flex-row items-center justify-start '>
              {chatTopic ? (
                <Image
                  className='w-10 h-10'
                  source={topics.find((_) => _.name === chatTopic)?.image}
                />
              ) : (
                <View
                  className={classNames({
                    'p-2 rounded-xl': true,
                    'bg-neutral-grey': chatTopic === '',
                  })}
                >
                  <Ionicons
                    name='chatbox-ellipses-outline'
                    size={24}
                    color='white'
                  />
                </View>
              )}

              <Text className='ml-2 text-lg font-semibold  text-midnight-mosaic'>
                {chatTopic ? chatTopic : 'Select a Topic'}
              </Text>
            </View>
            <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
          </Pressable>

          {/* Language */}
          <Pressable
            onPress={() =>
              navigation.navigate('ChatLanguage', { language: chatLanguage })
            }
            className='flex flex-row items-center justify-between w-full p-3 mt-4 bg-white rounded-lg'
            disabled={
              chatStatus.status === 'MATCHING' ||
              chatStatus.status === 'MATCHED'
            }
          >
            <View className='flex flex-row items-center justify-start '>
              <View
                className={classNames({
                  'p-2 rounded-xl ': true,
                  'bg-neutral-grey': chatLanguage === '',
                  'bg-jade': chatLanguage,
                })}
              >
                <MaterialIcons name='language' size={24} color='white' />
              </View>
              <Text className='ml-2 text-lg font-semibold  text-midnight-mosaic'>
                {chatLanguage ? chatLanguage : 'Select a Language'}
              </Text>
            </View>
            <MaterialIcons name='arrow-forward-ios' size={24} color='#3D5467' />
          </Pressable>
          <View className='items-center justify-center h-12 mt-10 rounded-lg bg-jade'>
            {chatStatus.status === 'MATCHING' ? (
              <Button
                onPress={() => {
                  setHideChatStatus(true);
                  setModalVisible(true);
                }}
                text='VIEW CHAT REQUEST'
                backgroundColor='bg-jade'
                textColor='text-white'
              />
            ) : (
              <Button
                disable={chatTopic === '' || chatLanguage === ''}
                onPress={() => {
                  handleSendChatRequest();
                }}
                text='SEND CHAT REQUEST'
                backgroundColor='bg-jade'
                textColor='text-white'
              />
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      <Modal
        backdropOpacity={0.7}
        onBackdropPress={() => {
          if (requestChatStatus === 'Hide') {
            handleCancelChatRequest();
            return;
          } else {
            setModalVisible(false);
          }
        }}
        style={{
          margin: 0,
        }}
        className='relative flex justify-end rounded-t-lg'
        isVisible={isModalVisible}
        onModalHide={() => {
          setHideBottomBar(false);
        }}
        onModalShow={() => {
          setHideBottomBar(true);
        }}
      >
        <View className='rounded-t-lg '>
          <LinearGradient
            locations={[0.7, 1]}
            colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
            className='z-50 px-4 py-10 rounded-t-lg'
          >
            {requestChatStatus === 'WAITING' && (
              <View style={{ backgroundColor: 'transparent' }}>
                <Text className='mb-6 text-2xl font-semibold  text-midnight-mosaic'>
                  Connecting you with a trained Listener...
                </Text>
                <Bar
                  indeterminate
                  height={5}
                  color={'#41B89C'}
                  borderRadius={0}
                  unfilledColor={'#E6E6E6'}
                  width={null}
                  borderWidth={0}
                />
                <Text className='mt-6  text-storm'>
                  Here are some things you can try while waiting for your
                  perfect Listener:
                </Text>
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    navigation.getParent()?.navigate('User');
                  }}
                  className='flex flex-row items-center justify-between w-full p-3 mt-8 bg-white rounded-lg'
                >
                  <View className='flex flex-row items-center justify-start '>
                    <View className='p-2  bg-jade rounded-xl'>
                      <Feather name='calendar' size={24} color='white' />
                    </View>
                    <Text className='ml-3 text-lg font-semibold  text-midnight-mosaic'>
                      Check-Ins
                    </Text>
                  </View>
                  <MaterialIcons
                    name='arrow-forward-ios'
                    size={24}
                    color='#3D5467'
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setModalVisible(false);
                    navigation.getParent()?.navigate('Groups');
                  }}
                  className='flex flex-row items-center justify-between w-full p-3 mt-4 bg-white rounded-lg'
                >
                  <View className='flex flex-row items-center justify-start '>
                    <View className='p-2  bg-tiffany rounded-xl'>
                      <MaterialCommunityIcons
                        name='account-group-outline'
                        size={24}
                        color='white'
                      />
                    </View>
                    <Text className='ml-3 text-lg font-semibold  text-midnight-mosaic'>
                      Find a Support Group
                    </Text>
                  </View>
                  <MaterialIcons
                    name='arrow-forward-ios'
                    size={24}
                    color='#3D5467'
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleCancelChatRequest();
                  }}
                  className='flex flex-row justify-center mt-6'
                >
                  <Text className='text-lg font-semibold  text-cranberry'>
                    Cancel My Request
                  </Text>
                </Pressable>
              </View>
            )}
            {chatStatus.status === 'MATCHED' && (
              <View style={{ backgroundColor: 'transparent' }}>
                <Image
                  source={require('../assets/images/found_hero.png')}
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
                    not find the match helpful for any reason, you can always
                    send a new request and our system will match you with a
                    different Listener.
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
            )}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}
