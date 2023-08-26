import { AxiosResponse } from 'axios';
import _a from './axios';

const acceptRequest = async (requestId: string): Promise<AxiosResponse> => {
  return _a.post(`/requests/${requestId}`);
};
const declineRequest = async (requestId: string): Promise<AxiosResponse> => {
  return _a.delete(`/requests/${requestId}`);
};

const createSupportRequest = async (
  supportId: string
): Promise<AxiosResponse> => {
  return _a.post(`/requests/support`, { supportId });
};

const inviteSupportRequestEmail = async (
  email: string,
  userId: string
): Promise<AxiosResponse> => {
  return _a.post(`/requests/invite`, { email, userId });
};

const checkRequestStatus = async (payload: {
  type: string;
  fromId: string;
  toId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/requests/status`, { params: payload });
};

export const RequestService = {
  acceptRequest,
  declineRequest,
  createSupportRequest,
  inviteSupportRequestEmail,
  checkRequestStatus,
};
