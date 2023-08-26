import { GroupEnrollment, Notification, Request } from '@prisma/client';
import classNames from 'classnames';
import { LinearGradient } from 'expo-linear-gradient';
import React, { FC, useState, useContext, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Text, View } from '../components/Themed';
import UserContext from '../components/User';
import { unScreamingSnakeCase } from '../constants/helpers';
import { PublicUser } from '../constants/prismaTypes';
import { HomeStackScreenProps } from '../types';
import { UserService } from '../services/user';
import { RequestService } from '../services/request';
import dayjs from 'dayjs';
import { userInterfaceStyle } from '../app.config';
var relativeTime = require('dayjs/plugin/relativeTime');
import GroupService from '../services/group';
import { canvasImages } from '../constants/canvasImages';
import UserAvatar from '../components/UserAvatar';

export default function ({
  navigation,
}: HomeStackScreenProps<'Notifications'>) {
  dayjs.extend(relativeTime);
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState<
    (
      | (Notification & {
          userReferringTo: PublicUser;
          user: PublicUser;
        })
      | (Request & {
          from: PublicUser;
        })
      | (Request & {
          to: PublicUser;
        })
    )[]
  >([]);

  const cleanNotifications = async () => {
    await UserService.cleanNotifications(user.id);
  };
  const fetchNotifications = async () => {
    const { data } = await UserService.fetchNotifications(user.id);
    const n = [...data.notifications, ...data.requestsReceived].sort((a, b) => {
      const aTime = new Date(
        (a as Request).updatedAt || (a as Notification).createdAt
      ).getTime();
      const bTime = new Date(
        (b as Request).updatedAt || (b as Notification).createdAt
      ).getTime();
      return bTime - aTime;
    });
    const _n = n.filter((notification) => {
      if (
        (notification as Request).status &&
        (notification as Request).status === 'ACCEPTED'
      ) {
        return false;
      } else {
        return true;
      }
    });

    setNotifications(_n);
  };
  useEffect(() => {
    fetchNotifications();
    return () => {
      cleanNotifications();
    };
  }, []);

  const handleRequestToMeMessage = ({
    status,
    type,
    from,
    senderIsFacilitator,
  }: Request & {
    from: PublicUser;
    currentUser: string;
    senderIsFacilitator: boolean;
  }) => {
    const displayName = from.nickname || from.firstName;
    if (status === 'PENDING') {
      if (type === 'ADD_TO_SUPPORTS_REQUEST') {
        return 'has requested to add you to their support list.';
      } else if (type === 'FACILITATOR_INVITATION') {
        return `**${displayName}** has invited you to become a facilitator for the group.`;
      } else if (type === 'GROUP_INVITATION') {
        if (senderIsFacilitator) {
          return `**${displayName}** has invited you to join the group.`;
        } else {
          return `**${
            from.nickname || from.firstName
          }** has requested to join the group.`;
        }
      }
    } else if (status === 'ACCEPTED') {
      if (type === 'ADD_TO_SUPPORTS_REQUEST') {
        return `have been added to the support list of **${displayName}**.`;
      } else if (type === 'FACILITATOR_INVITATION') {
        return `**You** have accepted the invitation of **${displayName}** to become a facilitator for the group.`;
      } else if (type === 'GROUP_INVITATION') {
        return `**You** have joined the group.`;
      }
    }
  };

  const NotificationDisplay: FC<
    Notification & { userReferringTo: PublicUser; user: PublicUser }
  > = ({ icon, title, content, user }) => {
    let _icon: ImageSourcePropType =
      icon.length === 1 ? canvasImages[+icon] : { uri: icon };
    return (
      <View
        className='flex flex-row items-start pt-4'
        style={{ backgroundColor: 'transparent' }}
      >
        {icon === '' ? (
          <View className='mx-4'>
            <UserAvatar
              name={user.nickname || user.displayName}
              size={20}
              url={user.profilePicture}
            />
          </View>
        ) : (
          <Image source={_icon} className='h-[45px] w-[45px] mx-4 rounded-lg' />
        )}

        <View className='flex flex-col justify-between '>
          <Text className='font-bold text-midnight-mosaic text-[17px] '>
            {title || ''}
          </Text>
          <Text>
            <Markdown
              style={{
                body: {
                  color: '#686963',
                  maxWidth: Dimensions.get('window').width * 0.7,
                },
              }}
            >
              {content || ''}
            </Markdown>
          </Text>
        </View>
      </View>
    );
  };

  const RequestToMeDisplay: FC<
    Request & {
      from: PublicUser;
      currentUser: string;
    }
  > = (request) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [groupName, setGroupName] = useState<string>('');
    const [senderIsFacilitator, setSenderIsFacilitator] =
      useState<boolean>(false);
    const [groupAvatar, setGroupAvatar] = useState<ImageSourcePropType | null>(
      null
    );
    const { from, status, currentUser, relatedGroupId } = request;
    const handleAcceptRequest = async () => {
      const { data } = await RequestService.acceptRequest(request.id);
      if (data) {
        await fetchNotifications();
      } else {
        Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      }
    };
    const handleDeclineRequest = async () => {
      const { data } = await RequestService.declineRequest(request.id);
      if (data) {
        await fetchNotifications();
      } else {
        Alert.alert('Oops!', 'Something went wrong. Please try again later.');
      }
    };

    const getGroupInfo = async () => {
      if (relatedGroupId) {
        const { data } = await GroupService.getGroupInfoById({
          groupId: relatedGroupId,
        });
        if (data) {
          if (data.canvas !== null) {
            setGroupAvatar(canvasImages[data.canvas]);
          }
          if (data.title) {
            setGroupName(data.title);
          }
        }
        setSenderIsFacilitator(
          !!data.members.find(
            (u: GroupEnrollment) =>
              u.userId === from.id && u.status === 'FACILITATOR'
          )
        );
      }
      setLoading(false);
    };
    useEffect(() => {
      getGroupInfo();
    }, [notifications]);

    return loading ? (
      <View className='p-4' style={{ backgroundColor: 'transparent' }}>
        <ActivityIndicator color={'#41bb9c'} />
      </View>
    ) : currentUser !== from.id && request.status === 'PENDING' ? (
      <View
        className='flex flex-row items-start py-4'
        style={{ backgroundColor: 'transparent' }}
      >
        {request.type === 'ADD_TO_SUPPORTS_REQUEST' ? (
          <View className='mx-4'>
            <UserAvatar
              name={from.nickname || from.displayName || from.firstName || 'A'}
              size={20}
              url={from.profilePicture}
            />
          </View>
        ) : (
          <Image
            source={groupAvatar || canvasImages[0]}
            className={classNames('h-[45px] w-[45px] mx-4 rounded-lg')}
          />
        )}

        <View className='flex flex-col justify-between'>
          <Text className='font-bold text-midnight-mosaic text-[17px] '>
            {request.type === 'GROUP_INVITATION' ||
            request.type === 'FACILITATOR_INVITATION'
              ? groupName
              : from.nickname || from.firstName}
          </Text>
          <Text>
            <Markdown
              style={{
                body: { color: '#686963', maxWidth: 260 },
              }}
            >
              {handleRequestToMeMessage({ ...request, senderIsFacilitator })}
            </Markdown>
          </Text>
          {status === 'PENDING' && (
            <View className='flex flex-row'>
              <Pressable
                className='px-4 py-3 mr-2 rounded-full bg-jade'
                onPress={() => handleAcceptRequest()}
              >
                <Text className='font-bold text-white'>Accept</Text>
              </Pressable>
              <Pressable
                className='px-4 py-3 border rounded-full border-neutral-grey'
                onPress={() => handleDeclineRequest()}
              >
                <Text className='font-bold text-midnight-mosaic'>Decline</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    ) : null;
  };

  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full px-5 pt-0'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const time =
              (notification as Notification).createdAt ||
              (notification as Request).updatedAt;
            if (
              (notification as Request).fromId === user.id ||
              (notification as Notification).hide === true ||
              (notification as Request).hideTo === true
            ) {
              return null;
            }
            return (
              <View className='mb-4 rounded-lg' key={notification.id}>
                <View
                  className='flex flex-row items-center justify-between px-4 pt-4 '
                  style={{ backgroundColor: 'transparent' }}
                  key={notification.id}
                >
                  <Text className='text-storm'>
                    {notification.type === 'GROUP_INVITATION'
                      ? 'New Member'
                      : notification.type === 'ADD_TO_SUPPORTS_REQUEST'
                      ? 'Add To Support Request'
                      : unScreamingSnakeCase(notification.type)}
                  </Text>
                  <View className='flex flex-row items-center'>
                    <View className='w-2 h-2 mr-2 rounded-full bg-cranberry' />
                    <Text>{dayjs(time).fromNow()}</Text>
                  </View>
                </View>
                {'userId' in notification && (
                  <NotificationDisplay {...notification} />
                )}
                {'from' in notification && (
                  <RequestToMeDisplay currentUser={user.id} {...notification} />
                )}
              </View>
            );
          })
        ) : (
          <Text className='h-full text-lg text-center text-storm'>
            You're all up to date!
          </Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
