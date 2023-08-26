import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import { Image, Pressable, ScrollView } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';
import { UserService } from '../../services/user';
import { UserStackScreenProps } from '../../types';
import UserContext from '../../components/User';
import UserAvatar from '../../components/UserAvatar';

export default function BlockedMembersSetting({
  navigation,
}: UserStackScreenProps<'BlockedMembersSetting'>) {
  const { user, setUser } = useContext(UserContext);

  const handleUnblock = async (id: string) => {
    const { data } = await UserService.editBlockedUser({
      userId: user.id,
      targetUser: id,
    });
    if (!data) {
      return;
    }
    const newBlockedUsers = user.blocked.filter(
      (blockedUser) => blockedUser.id !== id
    );
    setUser({ ...user, blocked: newBlockedUsers });
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='pt-0 px-5 h-full'
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {user.blocked.map((user, index) => (
          <GestureHandlerRootView
            className='my-4'
            style={{ backgroundColor: 'transparent' }}
            key={index}
          >
            <Swipeable
              friction={1}
              leftThreshold={30}
              renderRightActions={() => (
                <View
                  style={{ backgroundColor: 'transparent' }}
                  className='mx-2 mt-1'
                >
                  <Pressable
                    onPress={() => {
                      handleUnblock(user.id);
                    }}
                    className='w-18 h-12 bg-cranberry rounded-lg flex flex-row justify-center items-center'
                  >
                    <Text className='text-white font-semibold px-2'>
                      UNBLOCK
                    </Text>
                  </Pressable>
                </View>
              )}
            >
              <View className='flex flex-row rounded-lg items-center px-4 py-2'>
                <UserAvatar
                  size={20}
                  name={user.nickname || user.firstName}
                  url={user.profilePicture}
                />

                <Text className='text-lg ml-2 text-midnight-mosaic font-semibold'>
                  {user.nickname || user.firstName}
                </Text>
              </View>
            </Swipeable>
          </GestureHandlerRootView>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
