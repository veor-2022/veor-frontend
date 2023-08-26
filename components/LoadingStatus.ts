import { createContext } from 'react';

export const initLoadingStatus: {
  isLoading: boolean;
} = { isLoading: false };

const LoadingStatusContext = createContext({
  setLoadingStatus(v: { isLoading: boolean }) {},
  loadingStatus: initLoadingStatus,
});

export default LoadingStatusContext;
