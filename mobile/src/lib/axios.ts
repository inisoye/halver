import axios, { AxiosInstance } from 'axios';

export const tokenlessApiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// API client will have token on app startup.
export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

export const setAxiosDefaultToken = (token: string, _apiClient: AxiosInstance) => {
  _apiClient.defaults.headers.common.Authorization = `Token ${token}`;
};

export const deleteAxiosDefaultToken = () => {
  delete axios.defaults.headers.common.Authorization;
};
