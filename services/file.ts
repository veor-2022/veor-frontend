import { AxiosResponse } from 'axios';
import _a from './axios';

const createAvatarLink = async (fileName: string): Promise<AxiosResponse> => {
  return _a.post('/files/avatar', null, {
    params: { filename: fileName },
  });
};

export const FileService = {
  createAvatarLink,
};
