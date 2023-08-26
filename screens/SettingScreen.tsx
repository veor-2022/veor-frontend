import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useContext } from 'react';
import { Pressable, ScrollView, Switch } from 'react-native';
import { Text, View } from '../components/Themed';
import UserContext, { initialUser } from '../components/User';
import { setToken } from '../services/axios';
import { UserStackScreenProps } from '../types';
import auth from '@react-native-firebase/auth';
import ChatStatusContext from '../components/ChatStatus';
import { UserService } from '../services/user';
import * as Application from 'expo-application';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';

export default function SettingsScreen({
  navigation,
}: UserStackScreenProps<'Settings'>) {
  const version = `${Application.nativeApplicationVersion}(${Application.nativeBuildVersion})`;
  const { user, setUser } = useContext(UserContext);
  const { acceptChat, setAcceptChat } = useContext(ChatStatusContext);
  const fbAuth = auth();
  const settingArr = [
    {
      title: 'Preferences',
      icon: () => <Ionicons name='settings-outline' size={24} color='white' />,
      link: 'PreferenceSetting',
    },
    user.listenerProfile
      ? {
          title: 'Listener Profile',
          icon: () => <AntDesign name='idcard' size={24} color='white' />,
          link: 'ListenerProfileSetting',
        }
      : null,
    {
      title: 'Blocked Members',
      icon: () => <Entypo name='block' size={24} color='white' />,
      link: 'BlockedMembersSetting',
    },
    {
      title: 'Account Settings',
      icon: () => <FontAwesome5 name='user' size={24} color='white' />,
      link: 'AccountSetting',
    },
    {
      title: 'Feedback',
      icon: () => <Feather name='edit' size={24} color='white' />,
      link: 'Feedback',
    },
    {
      title: 'Terms & Policies',
      icon: () => (
        <Ionicons name='shield-checkmark-outline' size={24} color='white' />
      ),
      link: 'TermsAndPolicies',
    },
  ];

  const handleChangeAcceptChatStatus = async () => {
    if (acceptChat) {
      await AsyncStorage.setItem('acceptChatStatus', 'false');
      setAcceptChat(!acceptChat);
    } else {
      await AsyncStorage.setItem('acceptChatStatus', 'true');
      setAcceptChat(!acceptChat);
    }
  };

  const handleLogout = async () => {
    await UserService.updateUserPushToken('');
    await AsyncStorage.removeItem('token');
    setToken('');
    setUser(initialUser);
    navigation.navigate('Auth');
    // unhook any auth state change listener
    GoogleSignin.revokeAccess();
    fbAuth.signOut();
  };
  return (
    <LinearGradient
      locations={[0.7, 1]}
      colors={['rgba(227, 242, 253, 0.4)', 'rgba(229, 217, 242, 0.4)']}
      className='h-full flex flex-col justify-between'
    >
      <ScrollView showsVerticalScrollIndicator={false} className='px-5'>
        <View style={{ backgroundColor: 'transparent' }} className=''>
          {user.listenerProfile && (
            <View className='flex flex-row items-center justify-between p-3 mt-2 rounded-lg'>
              <Text className='text-lg text-midnight-mosaic'>
                Accepting Chat Requests
              </Text>
              <Switch
                trackColor={{ false: '#767577', true: '#41B89C' }}
                value={acceptChat}
                onValueChange={() => {
                  handleChangeAcceptChatStatus();
                }}
              />
            </View>
          )}

          {settingArr.map((item, index) => {
            if (item) {
              return (
                <Pressable
                  key={index}
                  onPress={() => navigation.navigate(item.link as any)}
                  className='flex flex-row items-center justify-between w-full p-3 mt-4 bg-white rounded-lg'
                >
                  <View className='flex flex-row items-center justify-start '>
                    <View className='p-2 bg-jade rounded-xl'>
                      {item.icon()}
                    </View>
                    <Text className='ml-2 text-lg font-semibold text-midnight-mosaic'>
                      {item.title}
                    </Text>
                  </View>
                  <MaterialIcons
                    name='arrow-forward-ios'
                    size={24}
                    color='#3D5467'
                  />
                </Pressable>
              );
            }
          })}
          <Pressable onPress={handleLogout}>
            <View
              style={{ backgroundColor: 'transparent' }}
              className='flex flex-row items-center justify-center pb-20 mt-8'
            >
              <Text className='text-xl font-semibold text-cranberry'>
                Log Out
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <Text className='text-center text-storm text-[11px] mb-4'>
        Version {version}
      </Text>
    </LinearGradient>
  );
}
