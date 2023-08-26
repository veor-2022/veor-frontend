import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../components/Button';
import React, { useEffect, useState, useContext } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { GroupStackScreenProps } from '../../types';
import GroupDetailAbout from './GroupDetailAbout';
import GroupDetailChat from './GroupDetailChat';
import GroupDetailChatSendBox from './GroupDetailChatSendBox';
import GroupDetailFacilitators from './GroupDetailFacilitators';
import GroupDetailGuidelines from './GroupDetailGuidelines';
import GroupService from '../../services/group';
import { Group, GroupEnrollment, User, Program } from '@prisma/client';
import { StackActions } from '@react-navigation/native';
import ChatStatusContext from '../../components/ChatStatus';
import Modal from 'react-native-modal';
import UserContext from '../../components/User';
import { UserService } from '../../services/user';
import { Ionicons } from '@expo/vector-icons';
import { canvasImages } from '../../constants/canvasImages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useIsFocused } from '@react-navigation/native';

export default function GroupSearch({
  navigation,
  route,
}: GroupStackScreenProps<'GroupDetail'>) {
  const groupId = route.params.groupId;
  const isFocused = useIsFocused();
  const { chatStatus, setHideBottomBar } = useContext(ChatStatusContext);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [tabBarSelect, setTabBarSelect] = useState(0);
  const [inGroupStatus, setInGroupStatus] = useState<
    'NONE' | 'REQUESTED' | 'MEMBER'
  >('NONE');
  const [groupInfo, setGroupInfo] = useState<
    Group & {
      members: (GroupEnrollment & { user: User & { programs: Program[] } })[];
    }
  >();
  useEffect(() => {
    const _status = chatStatus;
    const routes = navigation.getState()?.routes;
    const prevRoute = routes[routes.length - 2];
    if (prevRoute.name == 'CreateGroup') {
      navigation.setOptions({
        headerLeft: () => (
          <Pressable
            onPress={() => {
              navigation.dispatch(StackActions.pop(2));
            }}
          >
            <Ionicons name='close' size={24} color='black' />
          </Pressable>
        ),
      });
    }
    return () => {
      setHideBottomBar(false);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      setHideBottomBar(true);
    }
  }, [isFocused]);
  useEffect(() => {
    const getGroupInfo = async () => {
      const { data } = await GroupService.getGroupInfoById({ groupId });

      const isInGroup = !!data.members.find(
        (member: GroupEnrollment) => member.userId == user?.id
      );
      if (isInGroup) {
        setInGroupStatus('MEMBER');
      } else {
        const data = await UserService.fetchNotifications(user.id);
        if (!data.data.requestsSent) {
          setInGroupStatus('NONE');
        } else {
          if (
            data.data.requestsSent.find(
              (r: { relatedGroupId: string }) => r.relatedGroupId == groupId
            )
          ) {
            setInGroupStatus('REQUESTED');
          } else {
            setInGroupStatus('NONE');
          }
        }
      }
      setGroupInfo(data);
      setIsLoading(false);
    };
    getGroupInfo();
  }, []);

  const handleRequestToJoin = async () => {
    const { data } = await GroupService.requestToJoinGroup({
      groupId,
      userId: user?.id,
      status: 'USER',
    });
    if (data) {
      setInGroupStatus('REQUESTED');
    }
  };

  const tabBars = ['Description', 'Guidelines', 'Group Chat', 'Facilitators'];
  const [androidKeyboardOffset, setAndroidKeyboardOffset] = useState(0);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'position'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : androidKeyboardOffset}
      className='h-screen mb-0 pb-0'
    >
      <LinearGradient
        locations={[0.7, 1]}
        colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
        className='h-full'
      >
        {groupInfo && (
          <View className='w-full' style={{ backgroundColor: 'transparent' }}>
            <View style={{ backgroundColor: 'transparent' }}>
              <Image
                className={
                  'absolute top-0 w-full' +
                  (Platform.OS == 'ios' ? ' h-64' : ' h-48')
                }
                source={canvasImages[groupInfo?.canvas]}
                style={{ backgroundColor: 'transparent' }}
              />
              <View
                className={
                  'z-10 absolute top-0 w-full bg-light-gray opacity-90' +
                  (Platform.OS == 'ios' ? ' h-64' : ' h-48')
                }
              ></View>
            </View>

            <View
              className={
                'relative w-full px-4' +
                (Platform.OS == 'ios' ? ' top-28' : ' top-16')
              }
              style={{ backgroundColor: 'transparent' }}
            >
              <View
                className=' m-auto h-44 w-[95%]'
                style={{
                  backgroundColor: 'transparent',
                  shadowColor: '#5e5e5e',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  elevation: 6,
                  borderRadius: 20,
                }}
              >
                <Image
                  className='w-full h-full rounded-xl'
                  source={canvasImages[groupInfo?.canvas]}
                />
              </View>

              <View style={{ backgroundColor: 'transparent' }} className='mt-6'>
                <Text className='ml-2 text-3xl font-semibold text-midnight-mosaic'>
                  {groupInfo.title}
                </Text>
              </View>
              <View className='h-18' style={{ backgroundColor: 'transparent' }}>
                {inGroupStatus == 'MEMBER' ? (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    className='pb-4 mt-4 ml-2'
                  >
                    {tabBars.map((tab, index) => (
                      <Pressable
                        onPress={() => setTabBarSelect(index)}
                        key={index}
                        className={
                          index == tabBarSelect
                            ? 'bg-jade px-4 py-2 rounded-full mr-2'
                            : 'bg-white border border-neutral-grey px-4 py-2 rounded-full mr-2'
                        }
                      >
                        <Text
                          className={
                            index == tabBarSelect
                              ? 'text-white text-[14px] font-semibold'
                              : 'text-midnight-mosaic text-[14px] font-semibold'
                          }
                        >
                          {tab}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                ) : (
                  <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    className='pb-4 mt-4 ml-2'
                  >
                    {tabBars.map((tab, index) => (
                      <Pressable
                        disabled
                        key={index}
                        className={
                          index == 0
                            ? 'bg-jade px-4 py-2 rounded-full mr-2'
                            : 'bg-white border border-neutral-grey px-4 py-2 rounded-full mr-2 opacity-40'
                        }
                      >
                        <Text
                          className={
                            index == tabBarSelect
                              ? 'text-white text-lg font-semibold'
                              : 'text-midnight-mosaic text-lg font-semibold'
                          }
                        >
                          {tab}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>

              {tabBars[tabBarSelect] == 'Description' && (
                <GroupDetailAbout data={groupInfo} />
              )}
              {tabBars[tabBarSelect] == 'Guidelines' && (
                <GroupDetailGuidelines data={groupInfo} />
              )}
              {tabBars[tabBarSelect] == 'Group Chat' && (
                <GroupDetailChat data={groupInfo} />
              )}
              {tabBars[tabBarSelect] == 'Facilitators' && (
                <GroupDetailFacilitators
                  data={groupInfo}
                  navigation={navigation}
                />
              )}
            </View>
          </View>
        )}
        {groupInfo && inGroupStatus !== 'MEMBER' ? (
          <View className='absolute bottom-0 w-full px-6 py-8 '>
            <View className='mb-4 '>
              <Button
                disable={inGroupStatus == 'REQUESTED'}
                text={inGroupStatus == 'NONE' ? 'Join' : 'Request Sent'}
                backgroundColor='bg-jade'
                textColor='text-white'
                onPress={() => handleRequestToJoin()}
              />
            </View>
          </View>
        ) : null}
      </LinearGradient>
      <Modal
        coverScreen={false}
        hasBackdrop={false}
        style={{
          width: '100%',
          margin: 0,
          position: 'absolute',
          bottom: 0,
        }}
        deviceHeight={100}
        className='relative '
        isVisible={tabBars[tabBarSelect] == 'Group Chat'}
      >
        <GroupDetailChatSendBox
          setAndroidKeyboardOffset={setAndroidKeyboardOffset}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
}
