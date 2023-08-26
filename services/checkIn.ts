import { AxiosResponse } from 'axios';
import _a from './axios';

const fetCheckInsByUser = async (userId: string): Promise<AxiosResponse> => {
  return _a.get(`/checkIns/user/${userId}`);
};

const deleteCheckIn = async (checkInId: string): Promise<AxiosResponse> => {
  return _a.delete(`/checkIns/${checkInId}`);
};

export const CheckInService = {
  fetCheckInsByUser,
  deleteCheckIn,
};
