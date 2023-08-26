import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable, Platform, StatusBar } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { View } from '../components/Themed';
import CustomTabBar from '../components/CustomTabBar';
import GroupsScreen from '../screens/GroupsScreen';
import ChatScreen from '../screens/ChatScreen';
import UserScreen from '../screens/UserScreen';
import {
  AuthStackParamList,
  AuthStackScreenProps,
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
  HomeStackParamList,
  HomeStackScreenProps,
  GroupStackParamList,
  ChatStackParamList,
  UserStackParamList,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';

//Auth Screen
import LandingScreen from '../screens/auth-flow/LandingScreen';
import LoginScreen from '../screens/auth-flow/LoginScreen';
import RegisterScreen from '../screens/auth-flow/RegisterScreen';
import NewUserConfigNameScreen from '../screens/auth-flow/NewUserConfigNameScreen';
import ResetPasswordConfirmScreen from '../screens/auth-flow/ResetPasswordConfirmScreen';
import ResetPasswordRequestScreen from '../screens/auth-flow/ResetPasswordRequestScreen';

//Home Screens
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ListenerTrainingProgram from '../screens/training-program';
import CreateEmotionScreen from '../screens/CreateEmotionScreen';

//Groups Screens
import GroupCategory from '../screens/GroupCategoryScreen';
import GroupSearch from '../screens/GroupSearchScreen';
import GroupDetail from '../screens/group-detail/GroupDetailScreen';

//Create Group Screens
import CreateGroupScreen from '../screens/create-group/CreateGroupScreen';
import GroupNameScreen from '../screens/create-group/GroupName';
import GroupDescription from '../screens/create-group/GroupDescription';
import GroupCategoryScreen from '../screens/create-group/GroupCategory';
import GroupCanvas from '../screens/create-group/GroupCanvas';
import GroupFacilitators from '../screens/create-group/GroupFacilitators';
import GroupVisibility from '../screens/create-group/GroupVisibility';
import GroupInvitation from '../screens/create-group/GroupInvitation';
import GroupGuidelines from '../screens/create-group/GroupGuidelines';

//Chat Screens
import ChatTopic from '../screens/create-chat-request/ChatTopic';
import ChatLanguage from '../screens/create-chat-request/ChatLanguage';
import ChatConversation from '../screens/ChatConversation';
import ListenerReview from '../screens/ListenerReview';
import ListenerProfile from '../screens/ListenerProfile';

//Setting Screens
import SettingsScreen from '../screens/SettingScreen';
import UserContext from '../components/User';
import NotificationSetting from '../screens/settings/NotificationSetting';
import PreferenceSetting from '../screens/settings/Preferences';
import EditNickname from '../screens/settings/EditNickname';
import EditAvatar from '../screens/settings/EditAvatar';
import EditLanguage from '../screens/settings/EditLanguage';
import ListenerProfileSetting from '../screens/settings/ListenerProfileSetting';
import EditAbout from '../screens/settings/EditAbout';
import EditTopic from '../screens/settings/EditTopic';
import BlockedMembersSetting from '../screens/settings/BlockedMembersSetting';
import AccountSetting from '../screens/settings/AccountSetting';
import Feedback from '../screens/settings/Feedback';
import TermsAndPolicies from '../screens/settings/TermsAndPolicies';
import TrainingProgram from '../screens/training-program';
import EditGroup from '../screens/edit-group/EditGroup';
import EditGroupName from '../screens/edit-group/GroupName';
import EditGroupDescription from '../screens/edit-group/GroupDescription';
import EditGroupCategory from '../screens/edit-group/GroupCategory';
import EditGroupCanvas from '../screens/edit-group/GroupCanvas';
import EditGroupFacilitators from '../screens/edit-group/GroupFacilitators';
import EditGroupVisibility from '../screens/edit-group/GroupVisibility';
import EditGroupInvitation from '../screens/edit-group/GroupInvitation';
import EditGroupGuidelines from '../screens/edit-group/GroupGuidelines';
import EditGroupMembers from '../screens/edit-group/GroupMembers';
import GroupFacilitatorEmailInvite from '../screens/group-detail/GroupFacilitatorEmailInviteScreen';
import SupportEmailInvite from '../screens/user-detail/SupportEmailInvite';
import GroupMembersEmailInvite from '../screens/group-detail/GroupMembersEmailInviteScreen';
import TrainingProgramVideoScreen from '../screens/TrainingProgramVideo';
import AddCoFacilitatorList from '../screens/edit-group/AddCoFacilitatorList';
import AddMember from '../screens/edit-group/AddMember';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { user } = React.useContext(UserContext);

  return (
    <Stack.Navigator initialRouteName={user.id ? 'Root' : 'Auth'}>
      <Stack.Screen
        name='Root'
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Auth'
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Home'
        component={HomeNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Groups'
        component={GroupNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='NotFound'
        component={NotFoundScreen}
        options={{ title: 'Oops!' }}
      />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name='Modal' component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName='Landing'>
      <AuthStack.Screen
        name='Landing'
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name='Login'
        component={LoginScreen}
        options={({ navigation }: AuthStackScreenProps<'Login'>) => ({
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#3D5467',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerLeft(props) {
            return (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back' size={30} color='#3D5467' />
              </Pressable>
            );
          },
        })}
      />
      <AuthStack.Screen
        name='Register'
        component={RegisterScreen}
        options={({ navigation }: AuthStackScreenProps<'Register'>) => ({
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#3D5467',
          headerLeft(props) {
            return (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back' size={30} color='#3D5467' />
              </Pressable>
            );
          },
        })}
      />
      <AuthStack.Screen
        name='NewUserConfigName'
        component={NewUserConfigNameScreen}
        options={({
          navigation,
        }: AuthStackScreenProps<'NewUserConfigName'>) => ({
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#3D5467',
          headerLeft(props) {
            return (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back' size={30} color='#3D5467' />
              </Pressable>
            );
          },
        })}
      />
      <AuthStack.Screen
        name='ResetPasswordRequest'
        component={ResetPasswordRequestScreen}
        options={({
          navigation,
        }: AuthStackScreenProps<'ResetPasswordRequest'>) => ({
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#3D5467',
          headerLeft(props) {
            return (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back' size={30} color='#3D5467' />
              </Pressable>
            );
          },
        })}
      />
      <AuthStack.Screen
        name='ResetPasswordConfirm'
        component={ResetPasswordConfirmScreen}
        options={({
          navigation,
        }: AuthStackScreenProps<'ResetPasswordConfirm'>) => ({
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerTitle: '',
          headerBackTitle: '',
          headerTintColor: '#3D5467',
          headerLeft(props) {
            return (
              <Pressable onPress={() => navigation.goBack()}>
                <Ionicons name='chevron-back' size={30} color='#3D5467' />
              </Pressable>
            );
          },
        })}
      />
    </AuthStack.Navigator>
  );
}

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeNavigator() {
  return (
    <HomeStack.Navigator initialRouteName='HomeScreen'>
      <HomeStack.Screen
        name='HomeScreen'
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name='Notifications'
        component={NotificationScreen}
        options={{
          headerShown: true,
          headerTitle: 'Notifications',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <HomeStack.Screen
        name='CreateEmotion'
        component={CreateEmotionScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,

          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <HomeStack.Screen
        name='ListenerTrainingProgram'
        component={ListenerTrainingProgram}
        options={{
          headerShown: true,
          headerTitle: 'Listener Training Program',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <HomeStack.Screen
        name='GroupCategoryList'
        component={GroupCategory}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.category,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('GroupSearch')}
              className='mb-2 absolute top-16 right-4 p-2'
            >
              <Ionicons name='search' size={24} color='#3D5467' />
            </Pressable>
          ),
        })}
      />
      <HomeStack.Screen
        name='GroupSearch'
        component={GroupSearch}
        options={{
          headerShown: true,
          headerTitle: 'Search for Groups',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <HomeStack.Screen
        name='GroupDetail'
        component={GroupDetail}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
            headerTransparent: true,
          };
        }}
      />
      <HomeStack.Screen
        name='ChatConversation'
        component={ChatConversation}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <HomeStack.Screen
        name='ListenerProfile'
        component={ListenerProfile}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Listener Profile',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <HomeStack.Screen
        name='ListenerReview'
        component={ListenerReview}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Rate and Review',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
    </HomeStack.Navigator>
  );
}

const GroupStack = createNativeStackNavigator<GroupStackParamList>();
function GroupNavigator() {
  return (
    <GroupStack.Navigator initialRouteName='GroupsHome'>
      <GroupStack.Screen
        name='GroupsHome'
        component={GroupsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'Support Groups',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 20,
          },
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerTintColor: '#3D5467',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('GroupSearch')}
              className='mb-2 absolute top-16 right-4 p-2'
            >
              <Ionicons name='search' size={24} color='#3D5467' />
            </Pressable>
          ),
        })}
      />
      <GroupStack.Screen
        name='CreateGroup'
        component={CreateGroupScreen}
        options={{
          headerShown: true,
          headerTitle: 'Create a Group',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupName'
        component={GroupNameScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupDescription'
        component={GroupDescription}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupCategory'
        component={GroupCategoryScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupCanvas'
        component={GroupCanvas}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupFacilitators'
        component={GroupFacilitators}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupVisibility'
        component={GroupVisibility}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupInvitation'
        component={GroupInvitation}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupGuidelines'
        component={GroupGuidelines}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupCategoryList'
        component={GroupCategory}
        options={({ navigation, route }) => ({
          headerShown: true,
          headerTitle: route.params.category,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('GroupSearch')}
              className='mb-2 absolute top-16 right-4 p-2'
            >
              <Ionicons name='search' size={24} color='#3D5467' />
            </Pressable>
          ),
        })}
      />
      <GroupStack.Screen
        name='GroupSearch'
        component={GroupSearch}
        options={{
          headerShown: true,
          headerTitle: 'Search for Groups',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupDetail'
        component={GroupDetail}
        options={({ navigation }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <GroupStack.Screen
        name='FacilitatorTrainingProgram'
        component={TrainingProgram}
        options={{
          headerShown: true,
          headerTitle: 'Facilitator Training Program',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupFacilitatorEmailInvite'
        component={GroupFacilitatorEmailInvite}
        options={{
          headerShown: true,
          headerTitle: 'Invite Co-Facilitators',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='GroupMembersEmailInvite'
        component={GroupMembersEmailInvite}
        options={{
          headerShown: true,
          headerTitle: 'Invite Members',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <GroupStack.Screen
        name='ChatConversation'
        component={ChatConversation}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
    </GroupStack.Navigator>
  );
}

const ChatStack = createNativeStackNavigator<ChatStackParamList>();
function ChatNavigator() {
  return (
    <ChatStack.Navigator initialRouteName='ChatHome'>
      <ChatStack.Screen
        name='ChatHome'
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen
        name='ChatTopic'
        component={ChatTopic}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <ChatStack.Screen
        name='ChatLanguage'
        component={ChatLanguage}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <ChatStack.Screen
        name='ChatConversation'
        component={ChatConversation}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <ChatStack.Screen
        name='ListenerProfile'
        component={ListenerProfile}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Listener Profile',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <ChatStack.Screen
        name='ListenerReview'
        component={ListenerReview}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Rate and Review',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
    </ChatStack.Navigator>
  );
}

const UserStack = createNativeStackNavigator<UserStackParamList>();
function UserNavigator() {
  return (
    <UserStack.Navigator initialRouteName='UserHome'>
      <UserStack.Screen
        name='UserHome'
        component={UserScreen}
        options={{ headerShown: false }}
      />
      <UserStack.Screen
        name='CreateEmotion'
        component={CreateEmotionScreen}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,

          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='SupportEmailInvite'
        component={SupportEmailInvite}
        options={{
          headerShown: true,
          headerTitle: 'Invite',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Settings',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='NotificationSetting'
        component={NotificationSetting}
        options={{
          headerShown: true,
          headerTitle: 'Notification',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='PreferenceSetting'
        component={PreferenceSetting}
        options={{
          headerShown: true,
          headerTitle: 'Preference',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='ListenerProfileSetting'
        component={ListenerProfileSetting}
        options={{
          headerShown: true,
          headerTitle: 'Listener Profile',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='EditNickname'
        component={EditNickname}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='EditLanguage'
        component={EditLanguage}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='EditAvatar'
        component={EditAvatar}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='EditTopic'
        component={EditTopic}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='EditAbout'
        component={EditAbout}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='BlockedMembersSetting'
        component={BlockedMembersSetting}
        options={{
          headerShown: true,
          headerTitle: 'Blocked Members',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='AccountSetting'
        component={AccountSetting}
        options={{
          headerShown: true,
          headerTitle: 'Account Settings',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='Feedback'
        component={Feedback}
        options={{
          headerShown: true,
          headerTitle: 'Feedback',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='TermsAndPolicies'
        component={TermsAndPolicies}
        options={{
          headerShown: true,
          headerTitle: 'Terms & Policies',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupDetail'
        component={GroupDetail}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <UserStack.Screen
        name='ChatConversation'
        component={ChatConversation}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <UserStack.Screen
        name='ListenerProfile'
        component={ListenerProfile}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Listener Profile',
            headerShadowVisible: false,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <UserStack.Screen
        name='ListenerReview'
        component={ListenerReview}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Rate and Review',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <UserStack.Screen
        name='EditGroup'
        component={EditGroup}
        options={({ navigation, route }) => {
          return {
            headerShown: true,
            headerTitle: 'Group Dashboard',
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: '#ecf2f6',
            },
            headerBackTitleVisible: false,
            headerTintColor: '#3D5467',
          };
        }}
      />
      <UserStack.Screen
        name='GroupName'
        component={EditGroupName}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupDescription'
        component={EditGroupDescription}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupCategory'
        component={EditGroupCategory}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupCanvas'
        component={EditGroupCanvas}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupFacilitators'
        component={EditGroupFacilitators}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupMembers'
        component={EditGroupMembers}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupVisibility'
        component={EditGroupVisibility}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupInvitation'
        component={EditGroupInvitation}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='GroupGuidelines'
        component={EditGroupGuidelines}
        options={{
          headerShown: true,
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
        }}
      />
      <UserStack.Screen
        name='TrainingProgram'
        component={TrainingProgram}
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerTitle:
            route.params.type === 'LISTENER'
              ? 'Listener Training Program'
              : 'Facilitator Training Program',
        })}
      />
      <UserStack.Screen
        name='TrainingProgramVideo'
        component={TrainingProgramVideoScreen}
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerTitle:
            route.params.type === 'LISTENER'
              ? 'Listener Training Program'
              : 'Facilitator Training Program',
        })}
      />
      <UserStack.Screen
        name='AddCoFacilitatorList'
        component={AddCoFacilitatorList}
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerTitle: '',
        })}
      />
      <UserStack.Screen
        name='AddMember'
        component={AddMember}
        options={({ route }) => ({
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: '#ecf2f6',
          },
          headerBackTitleVisible: false,
          headerTintColor: '#3D5467',
          headerTitle: '',
        })}
      />
    </UserStack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName='HomeTab'
      screenOptions={({ navigation }) => {
        return {
          tabBarHideOnKeyboard: true,
          headerStyle: {
            height: 0,
          },
          tabBarActiveTintColor: '#41B89C',
        };
      }}
    >
      <BottomTab.Screen
        name='HomeTab'
        component={HomeNavigator}
        options={({ navigation }) => {
          return {
            title: '',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name={
                  navigation.getState().index == 0
                    ? 'ios-home-sharp'
                    : 'ios-home-outline'
                }
                color={color}
              />
            ),
          };
        }}
      />
      <BottomTab.Screen
        name='Groups'
        component={GroupNavigator}
        options={({ navigation }: RootTabScreenProps<'Groups'>) => {
          return {
            title: '',

            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name={
                  navigation.getState().index == 1
                    ? 'people-sharp'
                    : 'people-outline'
                }
                color={color}
              />
            ),
          };
        }}
      />
      <BottomTab.Screen
        name='Chat'
        component={ChatNavigator}
        options={({ navigation }: RootTabScreenProps<'Chat'>) => {
          return {
            title: '',

            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name={
                  navigation.getState().index == 2
                    ? 'chatbubbles-sharp'
                    : 'chatbubbles-outline'
                }
                color={color}
              />
            ),
          };
        }}
      />
      <BottomTab.Screen
        name='User'
        component={UserNavigator}
        options={({ navigation }: RootTabScreenProps<'User'>) => {
          return {
            title: '',
            tabBarIcon: ({ color }) => (
              <TabBarIcon
                name={
                  navigation.getState().index == 3 ? 'person' : 'person-outline'
                }
                color={color}
              />
            ),
          };
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -20 }} {...props} />;
}
