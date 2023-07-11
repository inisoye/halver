import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

export const tokenlessApiClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
});

// API client will have token on app startup.
export const apiClient = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
});

export const setAxiosDefaultToken = (token: string, _apiClient: AxiosInstance) => {
  _apiClient.defaults.headers.common.Authorization = `Token ${token}`;
};

export const deleteAxiosDefaultToken = () => {
  delete axios.defaults.headers.common.Authorization;
};
