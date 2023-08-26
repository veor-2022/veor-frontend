import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

let token = '';

export const setToken = (t: string) => (token = t);

const a = axios.create({
  baseURL:
    Constants.manifest2?.extra?.expoClient?.extra?.apiURL ||
    Constants.manifest?.extra?.apiURL,
  timeout: 2 * 60 * 1000,
});

a.interceptors.request.use((config) => {
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

a.interceptors.response.use(
  (response) => response,
  (response) => {
    if (response.config.errorHandler) {
      response.config.errorHandler(response);
    } else if (
      response?.name !== 'AbortError' ||
      response?.name !== 'CanceledError' ||
      response?.name !== 'Timeout'
    ) {
      console.error(response.response.data);
    }
    return { ...response, error: response.response.data };
  }
);

export default a;
