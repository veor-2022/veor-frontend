import { AxiosResponse } from 'axios';
import _a from './axios';

const getChatMsgById = async (id: string): Promise<AxiosResponse> => {
  return _a.get(`/chats/msg/${id}`);
};

const getChatroomMsgById = async (
  id: string,
  skip?: number,
  pageSize?: number
): Promise<AxiosResponse> => {
  return _a.get(`/chats/history/${id}`, {
    params: {
      skip,
      pageSize,
    },
  });
};

const requestOneOnOneChat = async (payload: {
  topic: string;
  language: string[];
}): Promise<AxiosResponse> => {
  return _a.post(`/chats/request`, payload);
};

const getOneOnOneChatRequest = async (
  topic?: string
): Promise<AxiosResponse> => {
  return _a.get(`/chats/requests`, {
    params: {
      topic,
    },
  });
};

const deleteOneOnOneChatRequest = async (
  id: string
): Promise<AxiosResponse> => {
  return _a.delete(`/chats/request/${id}`);
};

const acceptOneOnOneChatRequest = async (
  id: string
): Promise<AxiosResponse> => {
  return _a.post(`/chats/join`, { chatId: id });
};

const postChatMessage = async (
  chatId: string,
  content: string
): Promise<AxiosResponse> => {
  return _a.post(`/chats/msg`, { chatId, content });
};

const deleteChatHistory = async (chatId: string): Promise<AxiosResponse> => {
  return _a.post(`/chats/delete`, { chatId });
};

const cleanChatConversation = async (
  chatId: string
): Promise<AxiosResponse> => {
  return _a.post(`/chats/clean`, { chatId });
};

const markChatClosed = async (chatId: string): Promise<AxiosResponse> => {
  return _a.post(`/chats/close`, { chatId });
};

const fetchChatInfo = async (chatId: string): Promise<AxiosResponse> => {
  return _a.get(`/chats/info/${chatId}`);
};

const createDirectChat = async (listenerId: string): Promise<AxiosResponse> => {
  return _a.post(`/chats/direct`, { listenerId });
};

const addCurrentChatToSupport = async (
  supportId: string
): Promise<AxiosResponse> => {
  return _a.post(`/chats/add-support`, { supportId });
};

const likeChatMessage = async ({
  chatId,
  msgId,
  groupId,
}: {
  chatId?: string;
  msgId: string;
  groupId?: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/chats/like`, { chatId, msgId, groupId });
};

const unlikeChatMessage = async ({
  chatId,
  msgId,
  groupId,
}: {
  chatId?: string;
  msgId: string;
  groupId?: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/chats/unlike`, { chatId, msgId, groupId });
};

const unsentChatMessage = async (
  chatId: string,
  msgId: string
): Promise<AxiosResponse> => {
  return _a.post(`/chats/unsent`, { chatId, msgId });
};

const getOneOnOneChatRequestDetail = async (
  id: string
): Promise<AxiosResponse> => {
  return _a.get(`/chats/request/${id}`);
};

export const ChatService = {
  getChatMsgById,
  getChatroomMsgById,
  requestOneOnOneChat,
  getOneOnOneChatRequest,
  acceptOneOnOneChatRequest,
  postChatMessage,
  deleteChatHistory,
  deleteOneOnOneChatRequest,
  fetchChatInfo,
  createDirectChat,
  markChatClosed,
  addCurrentChatToSupport,
  likeChatMessage,
  unsentChatMessage,
  getOneOnOneChatRequestDetail,
  unlikeChatMessage,
  cleanChatConversation,
};
