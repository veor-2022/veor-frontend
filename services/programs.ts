import { AxiosResponse } from 'axios';
import _a from './axios';

const createProgram = async ({
  userId,
  answers,
  type,
}: {
  userId: string;
  answers: string[];
  type: 'LISTENER' | 'FACILITATOR';
}): Promise<AxiosResponse> => {
  return _a.post(`/programs`, { userId, answers, type });
};

const getUserPrograms = async ({
  userId,
}: {
  userId: string;
}): Promise<AxiosResponse> => {
  return _a.get(`/programs/user/${userId}`);
};

export const ProgramService = {
  createProgram,
  getUserPrograms,
};
