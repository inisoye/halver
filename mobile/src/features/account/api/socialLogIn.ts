import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { tokenlessApiClient } from '@/lib/axios';
import {
  SocialLogin as SocialLoginSchema,
  Token as TokenSchema,
} from '@/lib/zod';

export type SocialLoginPayload = z.infer<typeof SocialLoginSchema>;
export type SocialLoginResponse = z.infer<typeof TokenSchema>;

export const postGoogleLogin = async (
  lotteryPaymentDto: SocialLoginPayload,
) => {
  const response = await tokenlessApiClient.post(
    '/dj-rest-auth/google/',
    lotteryPaymentDto,
  );
  return response.data as SocialLoginResponse;
};

export const usePostGoogleLogin = () => {
  return useMutation({
    mutationFn: postGoogleLogin,
  });
};

export const postAppleLogin = async (lotteryPaymentDto: SocialLoginPayload) => {
  const response = await tokenlessApiClient.post(
    '/dj-rest-auth/apple/',
    lotteryPaymentDto,
  );
  return response.data as SocialLoginResponse;
};

export const usePostAppleLogin = () => {
  return useMutation({
    mutationFn: postAppleLogin,
  });
};
