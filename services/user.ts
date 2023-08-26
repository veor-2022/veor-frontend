import { NotificationSettings } from '@prisma/client';
import { AxiosResponse } from 'axios';
import _a from './axios';

const updateUserPushToken = async (token: string): Promise<AxiosResponse> => {
  return _a.post(`/users/notification/token`, { token });
};

const fetchUserLatestChatRequest = async (): Promise<AxiosResponse> => {
  return _a.get(`/users/chat-request/latest`);
};

const fetchUserChatContactHistory = async (): Promise<AxiosResponse> => {
  return _a.get(`/users/chats`);
};

const fetchNotifications = async (userId: string): Promise<AxiosResponse> => {
  return _a.get(`/users/notification/${userId}`);
};

const fetchUserById = async (userId: string): Promise<AxiosResponse> => {
  return _a.get(`/users/${userId}`);
};

const updateUserInfo = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}): Promise<AxiosResponse> => {
  return _a.put(`/users/update/${userId}`, data);
};

const editBlockedUser = async ({
  userId,
  targetUser,
}: {
  userId: string;
  targetUser: string;
}): Promise<AxiosResponse> => {
  return _a.put(`/users/block/${userId}`, { targetUser });
};

const updatePassword = async ({
  userId,
  newPassword,
  oldPassword,
}: {
  userId: string;
  newPassword: string;
  oldPassword: string;
}): Promise<AxiosResponse> => {
  return _a.put(`/users/password/${userId}`, { newPassword, oldPassword });
};

const deleteUser = async (userId: string): Promise<AxiosResponse> => {
  return _a.delete(`/users`, { params: { id: userId } });
};

const cleanNotifications = async (userId: string): Promise<AxiosResponse> => {
  return _a.delete(`/users/notifications/clear/${userId}`);
};

const checkIfThirdParty = async (id: string): Promise<AxiosResponse> => {
  return _a.get(`/users/third-party/${id}`);
};

const updateListenerProfile = async ({
  userId,
  data,
}: {
  userId: string;
  data: any;
}): Promise<AxiosResponse> => {
  return _a.put(`/users/listener/${userId}`, data);
};

const fetchUserPublicInfo = async (userId: string): Promise<AxiosResponse> => {
  return _a.get(`/users/public/${userId}`);
};

const createReview = async ({
  userId,
  rating,
  content,
  targetListenerId,
}: {
  userId: string;
  rating: number;
  content: string;
  targetListenerId: string;
}) => {
  return _a.post(`/users/review/${userId}/${targetListenerId}`, {
    rating,
    content,
  });
};

const getReviewByUserIdAndListenerId = async ({
  userId,
  listenerId,
}: {
  userId: string;
  listenerId: string;
}) => {
  return _a.get(`/reviews/user/listener`, { params: { userId, listenerId } });
};

const removeSupporter = async ({
  userId,
  supporterId,
}: {
  userId: string;
  supporterId: string;
}) => {
  return _a.post(`/users/remove-support/${userId}`, { supporterId });
};

const getNotificationSettings = async () => {
  return _a.get(`/users/notification/settings`);
};

const updateNotificationSettings = async (data: NotificationSettings) => {
  return _a.put(`/users/notification/settings`, data);
};

const checkUserBadge = async (userId: string) => {
  return _a.get(`/users/badge/${userId}`);
};

const checkIfUserExist = async (email: string) => {
  return _a.post(`/auth/exist`, { email });
};

export const UserService = {
  updateUserPushToken,
  fetchUserLatestChatRequest,
  fetchUserChatContactHistory,
  fetchNotifications,
  fetchUserById,
  updateUserInfo,
  editBlockedUser,
  updatePassword,
  deleteUser,
  cleanNotifications,
  checkIfThirdParty,
  updateListenerProfile,
  fetchUserPublicInfo,
  createReview,
  getReviewByUserIdAndListenerId,
  removeSupporter,
  getNotificationSettings,
  updateNotificationSettings,
  checkUserBadge,
  checkIfUserExist,
};
