/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Topic } from "prisma-enum";
import { User } from "@prisma/client";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Groups: NavigatorScreenParams<GroupStackParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  NewUserConfigName: { email: string; password: string; signupType: string };
  ResetPasswordRequest: undefined;
  ResetPasswordConfirm: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  Notifications: undefined;
  CreateEmotion: { emotion: string };
  ListenerTrainingProgram: { type: "LISTENER" | "FACILITATOR" };
  GroupCategoryList: { category: string };
  GroupSearch: undefined;
  GroupDetail: { groupId: string };
  ChatConversation: { chatId: string };
  ListenerProfile: { listenerId: string };
  ListenerReview: {
    userId: string;
  };
};

export interface CreateGroupProps {
  title?: string;
  topic?: Topic;
  canvas?: number;
  facilitators?: string[];
  public?: boolean; // Public
  description?: string;
  guidelines?: string;
  invitations?: string[];
  meetingInfo?: string;
  meetingSchedule?: string;
  meetingLink?: string;
}

export interface EditGroupProps {
  id: string;
  title?: string;
  topic?: Topic;
  canvas?: number;
  facilitators?: string[];
  public?: boolean; // Public
  description?: string;
  guidelines?: string;
  invitations?: string[];
  meetingInfo?: string;
  meetingSchedule?: string;
  meetingLink?: string;
}

export type GroupStackParamList = {
  GroupsHome: undefined;
  CreateGroup: CreateGroupProps;
  GroupName: CreateGroupProps;
  GroupDescription: CreateGroupProps;
  GroupCategory: CreateGroupProps;
  GroupCanvas: CreateGroupProps;
  GroupFacilitators: CreateGroupProps;
  GroupVisibility: CreateGroupProps;
  GroupInvitation: CreateGroupProps;
  GroupGuidelines: CreateGroupProps;
  GroupCategoryList: { category: string };
  GroupSearch: undefined;
  GroupDetail: { groupId: string };
  FacilitatorTrainingProgram: { type: "LISTENER" | "FACILITATOR" };
  GroupFacilitatorEmailInvite: EditGroupProps;
  GroupMembersEmailInvite: EditGroupProps;
  ChatConversation: {
    chatId: string;
  };
};

export type ChatStackParamList = {
  ChatHome: undefined;
  ChatTopic: undefined;
  ChatLanguage: { language: string };
  ChatConversation: {
    chatId: string;
  };
  ListenerProfile: { listenerId: string };
  ListenerReview: {
    userId: string;
  };
};

export type UserStackParamList = {
  UserHome: { isShowModal: boolean };
  CreateEmotion: { emotion: string };
  Settings: undefined;
  Auth: undefined;
  NotificationSetting: undefined;
  PreferenceSetting: undefined;
  EditNickname: undefined;
  EditLanguage: undefined;
  EditAvatar: undefined;
  EditTopic: undefined;
  EditAbout: undefined;
  ListenerProfileSetting: undefined;
  BlockedMembersSetting: undefined;
  AccountSetting: undefined;
  Feedback: undefined;
  TermsAndPolicies: undefined;
  GroupDetail: { groupId: string };
  ChatConversation: { chatId: string };
  ListenerProfile: { listenerId: string };
  ListenerReview: {
    userId: string;
  };
  EditGroup: EditGroupProps;
  GroupName: EditGroupProps;
  GroupDescription: EditGroupProps;
  GroupCategory: EditGroupProps;
  GroupCanvas: EditGroupProps;
  GroupFacilitators: { groupId: string };
  GroupVisibility: EditGroupProps;
  GroupInvitation: EditGroupProps;
  GroupGuidelines: EditGroupProps;
  GroupMembers: EditGroupProps;
  SupportEmailInvite: undefined;
  TrainingProgram: { type: "LISTENER" | "FACILITATOR" };
  TrainingProgramVideo: { type: "LISTENER" | "FACILITATOR" };
  AddCoFacilitatorList: { groupId: string };
  AddMember: { groupId: string };
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, Screen>;
export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, Screen>;
export type GroupStackScreenProps<Screen extends keyof GroupStackParamList> =
  NativeStackScreenProps<GroupStackParamList, Screen>;
export type ChatStackScreenProps<Screen extends keyof ChatStackParamList> =
  NativeStackScreenProps<ChatStackParamList, Screen>;
export type UserStackScreenProps<Screen extends keyof UserStackParamList> =
  NativeStackScreenProps<UserStackParamList, Screen>;

export type RootTabParamList = {
  HomeTab: undefined;
  Groups: undefined;
  Chat: undefined;
  User: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export interface ChatConversationObject {
  from: string;
  content: string;
  isMe: boolean;
  likes: number;
  createdAt: string;
  id: string;
  avatar: string;
}
