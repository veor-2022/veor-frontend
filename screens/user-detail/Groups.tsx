import React, { useContext, useEffect } from 'react';
import { Image, Pressable, Alert, Dimensions } from 'react-native';
import { Text, View } from '../../components/Themed';
import { canvasImages } from '../../constants/canvasImages';
import UserContext from '../../components/User';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { UserStackParamList } from '../../types';
import a from '../../services/axios';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { EditGroupProps } from '../../types';
import GroupService from '../../services/group';
import dayjs from 'dayjs';
import { useIsFocused } from '@react-navigation/native';
import ChatStatusContext from '../../components/ChatStatus';
import LoadingStatusContext from '../../components/LoadingStatus';
interface Props {
  navigation: NativeStackNavigationProp<
    UserStackParamList,
    'UserHome',
    undefined
  >;
}

export default function UserDetailGroups({ navigation }: Props) {
  const userCtx = useContext(UserContext);
  const [groups, setGroups] = React.useState<any[]>([]);
  const chatStatusCtx = React.useContext(ChatStatusContext);
  const { setLoadingStatus } = React.useContext(LoadingStatusContext);
  const fetchUser = async () => {
    const { data: userData } = await a.get(`/users/${userCtx.user.id}`);
    if (!userData) return;
    userCtx.setUser(userData);
  };

  const fetchUserGroups = async () => {
    setLoadingStatus({ isLoading: true });
    const { data: userGroups } = await GroupService.getGroupsByUser({
      userId: userCtx.user.id,
    });
    setLoadingStatus({ isLoading: false });
    if (!userGroups) return;
    setGroups(userGroups);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fetchUserGroups();
    }
  }, [isFocused]);

  const handleLeaveGroup = async (groupId: string, index: number) => {
    Alert.alert(
      'Are you sure?',
      'Leaving the group may disconnect you from the rest of the group members.',
      [
        {
          text: 'Stay',
          onPress: () => {
            row[index - 1].close();
          },
          style: 'cancel',
        },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const data = await GroupService.LeaveGroup({
              groupId,
              status: 'USER',
              userId: userCtx.user.id,
            });
            if (data.error) {
              return Alert.alert(data.error);
            }
            fetchUser();
            fetchUserGroups();
            row[index].close();
          },
        },
      ]
    );
  };
  let row: Array<any> = [];
  return (
    <GestureHandlerRootView
      className='px-4 pb-20 mt-4'
      style={{ backgroundColor: 'transparent' }}
    >
      {groups.length ? (
        groups.map((_, index) => {
          const isFacilitator = _.members.find(
            (m: any) =>
              m.user?.id === userCtx.user.id &&
              (m.status === 'FACILITATOR' || m.status === 'CO_FACILITATOR')
          );
          return (
            <Swipeable
              ref={(ref) => (row[index] = ref)}
              key={'group' + index}
              friction={1}
              leftThreshold={30}
              renderRightActions={() => (
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='flex flex-row p-4 m-2 mr-0 gap-x-2'
                >
                  {isFacilitator ? (
                    <Pressable
                      onPress={() => {
                        row[index].close();
                        navigation.navigate('EditGroup', _ as EditGroupProps);
                      }}
                      className='flex flex-row items-center justify-center w-12 h-12 rounded-lg bg-jade'
                    >
                      <Feather name='edit' size={24} color='white' />
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={() => handleLeaveGroup(_.id, index)}
                    className='flex flex-row items-center justify-center w-12 h-12 rounded-lg bg-cranberry'
                  >
                    <MaterialIcons name='logout' size={24} color='white' />
                  </Pressable>
                </View>
              )}
            >
              <Pressable
                onPress={() => {
                  chatStatusCtx.setHideBottomBar(true);
                  setLoadingStatus({ isLoading: true });
                  //this is to prevent the page shows before the bottom bar is hidden, if there still have gap between chat input box and bottom, we have to show bottom bar in chat conversation page.
                  setTimeout(() => {
                    setLoadingStatus({ isLoading: false });
                    navigation.navigate('GroupDetail', { groupId: _.id });
                  }, 100);
                }}
                className='mb-4 bg-white rounded-lg'
                key={index}
              >
                <View
                  className='flex flex-row items-center'
                  style={{ backgroundColor: 'transparent' }}
                >
                  <Image
                    source={canvasImages[_.canvas] || canvasImages[0]}
                    className='h-[60px] w-[60px] m-4 rounded-lg'
                  />
                  <View className='flex flex-col'>
                    <Text
                      style={{ maxWidth: Dimensions.get('window').width * 0.6 }}
                      className='font-bold text-Midnight-Mosaic text-[15px] mb-1'
                    >
                      {_.title}
                    </Text>
                    <View className='flex flex-row items-center'>
                      <View
                        className={
                          'h-2 w-2 mr-2 rounded-full ' +
                          (_.messages.length === 0 ? 'bg-cranberry' : 'bg-jade')
                        }
                      ></View>
                      <Text className='text-storm'>
                        {_.messages.length === 0
                          ? 'No Activity'
                          : `Last activity ${dayjs(
                              _.messages[0].sentAt
                            ).fromNow()}`}
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Swipeable>
          );
        })
      ) : (
        <View
          className='flex flex-col items-center'
          style={{ backgroundColor: 'transparent' }}
        >
          <Text className='text-neutral-grey-300 text-[20px] font-bold'>
            No group yet
          </Text>
        </View>
      )}
    </GestureHandlerRootView>
  );
}
