import {
  Chat,
  CheckIn,
  Group,
  GroupEnrollment,
  ListenerProfile,
  Message,
  User,
  Notification,
  Request,
  Review,
  Program,
} from '@prisma/client';
import { createContext } from 'react';
import { PublicUser } from '../constants/prismaTypes';

export const initialUser: Omit<User, 'password'> & {
  chats: (Chat & {
    messages: Message[];
    listener: (ListenerProfile & PublicUser) | null;
    user: PublicUser;
  })[];
  groups: (GroupEnrollment & {
    group: Group & {
      members: { users: { profilePicture: string | null } }[];
      messages: Message[];
    };
  })[];
  checkIns: CheckIn[];
  supports: (PublicUser & { chats: Chat[] })[];
  blocked: {
    id: string;
    firstName: string;
    profilePicture: string;
    nickname: string;
  }[];
  listenerProfile:
    | (ListenerProfile & { reviews: (Review & { user: User })[] })
    | null;
  notifications: (Notification & { userReferringTo: PublicUser })[];
  requestsReceived: (Request & {
    from: PublicUser;
  })[];
  requestsSent: (Request & {
    to: PublicUser;
  })[];
  displayName: string;
  pushNotificationTokens: string;
  reviews: Review[];
  programs: Program[];
} = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  nickname: null,
  receiveNewsletter: false,
  emailVerified: false,
  emailVerificationToken: null,
  joinDate: new Date(),
  profilePicture: null,
  languages: [],
  notificationTypes: [],
  settingsFeedback: [],
  blocked: [],
  chats: [],
  checkIns: [],
  groups: [],
  listenerProfile: null,
  notifications: [],
  requestsReceived: [],
  requestsSent: [],
  supports: [],
  displayName: '',
  pushNotificationTokens: '',
  programs: [],
  reviews: [],
};

const UserContext = createContext({
  setUser(v: typeof initialUser) {},
  user: initialUser,
});

export default UserContext;
