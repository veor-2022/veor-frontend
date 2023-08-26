import { AxiosResponse } from 'axios';
import { CreateGroupProps } from '../types';
import _a from './axios';

const createNewGroup = async ({
  groupData,
  creator,
}: {
  groupData: CreateGroupProps;
  creator: string;
}): Promise<AxiosResponse> => {
  return _a.post('/groups/', { ...groupData, creator });
};

const fetchGroupsByCategory = async ({
  category,
}: {
  category: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/category/${category.toUpperCase()}`);
};

const getGroupInfoById = async ({
  groupId,
}: {
  groupId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/${groupId}`);
};

const LeaveGroup = async ({
  groupId,
  userId,
  status,
}: {
  groupId: string;
  userId: string;
  status: string;
}): Promise<AxiosResponse> => {
  return _a.delete(`/groups/member/${groupId}`, {
    params: { user: userId, status },
  });
};

const requestToJoinGroup = async ({
  groupId,
  userId,
  status,
}: {
  groupId: string;
  userId: string;
  status: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/groups/member/${groupId}`, { userId, status });
};

const fetchGroupMessages = (groupId: string) => {
  return _a.get(`/groups/messages/${groupId}`);
};

const postNewGroupChatMessage = ({
  groupId,
  message,
  senderId,
}: {
  groupId: string;
  message: string;
  senderId: string;
}) => {
  return _a.post(`/groups/messages/${groupId}`, {
    content: message,
    sender: senderId,
  });
};

const unsentGroupMessage = ({
  groupId,
  messageId,
}: {
  groupId: string;
  messageId: string;
}) => {
  return _a.post(`/groups/messages/${groupId}/unsent`, {
    messageId,
  });
};

const editGroupInfo = async ({
  groupId,
  data,
}: {
  groupId: string;
  data: CreateGroupProps;
}): Promise<AxiosResponse> => {
  return _a.put(`/groups/${groupId}`, data);
};

const inviteMembersByEmail = async ({
  groupId,
  emails,
}: {
  groupId: string;
  emails: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/groups/invite/${groupId}/members/email`, { emails });
};

const inviteCoFacilitatorsByEmail = async ({
  groupId,
  emails,
}: {
  groupId: string;
  emails: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/groups/invite/${groupId}/cofacilitators/email`, { emails });
};

const searchGroups = async ({
  searchQuery,
}: {
  searchQuery: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/search`, { params: { searchQuery } });
};

const getGroupsByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/member/${userId}`);
};

const fetchPublicGroups = async (): Promise<AxiosResponse> => {
  return _a.get(`/groups/search/public`);
};

const removeMember = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.delete(`/groups/member/${groupId}`, { params: { user: userId } });
};

const likeGroupMessage = async ({
  groupId,
  messageId,
  userId,
}: {
  groupId: string;
  messageId: string;
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/groups/messages/${groupId}/like`, {
    messageId,
    userId,
  });
};

const revokeCoFacilitator = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/groups/revoke/CoFacilitator`, {
    groupId,
    userId,
  });
};

const fetchAddMemberList = async ({
  groupId,
  userId,
}: {
  groupId: string;
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/list/member/${groupId}/${userId}`);
};

const fetchAddCoFacilitatorList = async ({
  groupId,
}: {
  groupId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/groups/list/cofacilitator/${groupId}`);
};

const GroupService = {
  createNewGroup,
  fetchGroupsByCategory,
  getGroupInfoById,
  likeGroupMessage,
  requestToJoinGroup,
  fetchGroupMessages,
  postNewGroupChatMessage,
  editGroupInfo,
  LeaveGroup,
  inviteCoFacilitatorsByEmail,
  inviteMembersByEmail,
  searchGroups,
  unsentGroupMessage,
  fetchPublicGroups,
  removeMember,
  getGroupsByUser,
  revokeCoFacilitator,
  fetchAddMemberList,
  fetchAddCoFacilitatorList,
};

export default GroupService;
