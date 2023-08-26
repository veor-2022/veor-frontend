import { AxiosResponse } from 'axios';
import _a from './axios';

const postFeedback = async (payload: {
  content: string;
}): Promise<AxiosResponse> => {
  return _a.post(`/feedbacks`, payload);
};

export const FeedbackService = {
  postFeedback,
};
