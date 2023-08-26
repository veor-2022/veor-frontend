import { createContext } from 'react';

export const initChatStatus: {
  status: 'NONE' | 'MATCHING' | 'MATCHED' | 'LISTENER' | 'REQUESTS';
} = { status: 'NONE' };

const ChatStatusContext = createContext({
  setChatStatus(v: {
    status: 'NONE' | 'MATCHING' | 'MATCHED' | 'LISTENER' | 'REQUESTS';
  }) {},
  chatStatus: initChatStatus,
  chatStatusId: '',
  setChatStatusId(v: string) {},
  hideChatStatus: false,
  setHideChatStatus(v: boolean) {},
  pendingChatCount: 0,
  setPendingChatCount(v: number) {},
  prevChatStatus: initChatStatus,
  setPrevChatStatus(v: {
    status: 'NONE' | 'MATCHING' | 'MATCHED' | 'LISTENER' | 'REQUESTS';
  }) {},
  hideBottomBar: false,
  setHideBottomBar(v: boolean) {},
  acceptChat: true,
  setAcceptChat(v: boolean) {},
  hideNavBar: false,
  setHideNavBar(v: boolean) {},
  isRequestsPanelOpen: false,
  setIsRequestsPanelOpen(v: boolean) {},
});

export default ChatStatusContext;
