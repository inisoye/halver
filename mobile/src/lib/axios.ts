import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

export const apiClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
});

export const setAxiosDefaultToken = (token: string, apiClient: AxiosInstance) => {
  apiClient.defaults.headers.common.Authorization = `Token ${token}`;
};

export const deleteAxiosDefaultToken = () => {
  delete axios.defaults.headers.common.Authorization;
};