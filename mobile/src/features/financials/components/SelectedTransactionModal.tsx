import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, Image, Modal, Text } from '@/components';
import type { BillTransaction } from '@/features/bills';
import { GoBackArrow, GoToArrow } from '@/icons';
import type {
  AppRootStackParamList,
  FinancialsStackParamList,
  HomeStackParamList,
} from '@/navigation';
import {
  convertNumberToNaira,
  getDarkColorFromString,
  getInitials,
  getLightColorFromString,
  isAndroid,
  useIsDarkModeSelected,
} from '@/utils';

interface SelectedTransactionModalProps {
  isBack?: boolean;
  closeModal: () => void;
  isModalOpen: boolean;
  selectedTransaction: BillTransaction | undefined;
  navigation:
    | CompositeNavigationProp<
        NativeStackNavigationProp<AppRootStackParamList, 'Transactions', undefined>,
        CompositeNavigationProp<
          NativeStackNavigationProp<
            FinancialsStackParamList,
            'Transactions',
            undefined
          >,
          NativeStackNavigationProp<HomeStackParamList, 'Transactions', undefined>
        >
      >
    | CompositeNavigationProp<
        NativeStackNavigationProp<
          AppRootStackParamList,
          'Transactions in countribution round',
          undefined
        >,
        CompositeNavigationProp<
          NativeStackNavigationProp<
            FinancialsStackParamList,
            'Transactions in countribution round',
            undefined
          >,
          NativeStackNavigationProp<
            HomeStackParamList,
            'Transactions in countribution round',
            undefined
          >
        >
      >
    | CompositeNavigationProp<
        NativeStackNavigationProp<
          AppRootStackParamList,
          'Bill transactions',
          undefined
        >,
        CompositeNavigationProp<
          NativeStackNavigationProp<
            FinancialsStackParamList,
            'Bill transactions',
            undefined
          >,
          NativeStackNavigationProp<HomeStackParamList, 'Bill transactions', undefined>
        >
      >;
}

export const SelectedTransactionModal: React.FunctionComponent<SelectedTransactionModalProps> =
  React.memo(
    ({ closeModal, isModalOpen, selectedTransaction, navigation, isBack = false }) => {
      const isDarkMode = useIsDarkModeSelected();

      const { bill, created, contribution, totalPayment, payingUser, receivingUser } =
        selectedTransaction || {};
      const { name: billName, uuid: billId } = bill || {};

      const handleGoToBill = () => {
        closeModal();
        navigation.navigate('Bill', {
          id: billId || '',
          name: billName || '',
        });
      };

      const payingUserImage = React.useMemo(() => {
        const initials = getInitials(payingUser?.fullName);

        const avatarBackground = isDarkMode
          ? getLightColorFromString(payingUser?.fullName)
          : getDarkColorFromString(payingUser?.fullName);

        return payingUser?.profileImageUrl ? (
          <Image
            borderRadius="lg"
            contentFit="contain"
            height={36}
            placeholder={payingUser?.profileImageHash}
            source={payingUser?.profileImageUrl}
            width={36}
          />
        ) : (
          <Box
            alignItems="center"
            borderRadius="lg"
            height={36}
            justifyContent="center"
            style={{ backgroundColor: avatarBackground }}
            width={36}
          >
            <Text color="textInverse" fontFamily="Halver-Semibold" variant="sm">
              {initials}
            </Text>
          </Box>
        );
      }, [isDarkMode, payingUser]);

      const receivingUserImage = React.useMemo(() => {
        const initials = getInitials(receivingUser?.fullName);

        const avatarBackground = isDarkMode
          ? getLightColorFromString(receivingUser?.fullName)
          : getDarkColorFromString(receivingUser?.fullName);

        return receivingUser?.profileImageUrl ? (
          <Image
            borderRadius="lg"
            contentFit="contain"
            height={36}
            placeholder={receivingUser?.profileImageHash}
            source={receivingUser?.profileImageUrl}
            width={36}
          />
        ) : (
          <Box
            alignItems="center"
            borderRadius="lg"
            height={36}
            justifyContent="center"
            style={{ backgroundColor: avatarBackground }}
            width={36}
          >
            <Text color="textInverse" fontFamily="Halver-Semibold" variant="sm">
              {initials}
            </Text>
          </Box>
        );
      }, [isDarkMode, receivingUser]);

      const finalHeading = React.useMemo(
        () => (
          <Box alignItems="center" flexDirection="row" gap="3">
            {payingUserImage}
            <Text>to</Text>
            {receivingUserImage}
          </Box>
        ),
        [payingUserImage, receivingUserImage],
      );

      return (
        <Modal
          closeModal={closeModal}
          headingComponent={finalHeading}
          isLoaderOpen={false}
          isModalOpen={isModalOpen}
          hasLargeHeading
        >
          <Box
            backgroundColor="modalBackground"
            maxHeight="81%"
            paddingBottom={isAndroid() ? '2' : '6'}
            paddingTop="5"
          >
            <Box
              columnGap="6"
              flexDirection="row"
              flexWrap="wrap"
              marginBottom="3.5"
              paddingHorizontal="6"
            >
              <Box paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Bill name
                </Text>

                <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                  {billName}
                </Text>
              </Box>

              <Box paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Completed on
                </Text>

                <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                  {created ? new Date(created).toDateString() : 'Not recorded'}
                </Text>
              </Box>

              <Box paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Amount
                </Text>

                <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                  {!!contribution && convertNumberToNaira(Number(contribution))}
                </Text>
              </Box>

              <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Amount with fees
                </Text>

                <Text
                  color={'accountName' ? 'textDefault' : 'textLight'}
                  fontFamily="Halver-Semibold"
                  numberOfLines={1}
                  variant="sm"
                >
                  {!!totalPayment && convertNumberToNaira(Number(totalPayment))}
                </Text>
              </Box>

              <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Paying participant
                </Text>

                <Text
                  color={'accountName' ? 'textDefault' : 'textLight'}
                  fontFamily="Halver-Semibold"
                  numberOfLines={1}
                  variant="sm"
                >
                  {payingUser?.fullName}
                </Text>
              </Box>

              <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46%">
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Creditor
                </Text>

                <Text
                  color={'accountName' ? 'textDefault' : 'textLight'}
                  fontFamily="Halver-Semibold"
                  numberOfLines={1}
                  variant="sm"
                >
                  {receivingUser?.fullName}
                </Text>
              </Box>
            </Box>

            <Box flexDirection="row" gap="3" marginBottom="3" paddingHorizontal="6">
              <Button backgroundColor="buttonCasal" onPress={handleGoToBill}>
                <Box
                  flexDirection="row"
                  gap="4"
                  justifyContent="space-between"
                  width="100%"
                >
                  <Box alignItems="center" flexDirection="row" gap="4">
                    {isBack && <GoBackArrow isLight />}

                    <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                      {isBack ? 'Back to bill' : 'Go to bill'}
                    </Text>
                  </Box>

                  {!isBack && <GoToArrow isLight />}
                </Box>
              </Button>
            </Box>
          </Box>
        </Modal>
      );
    },
  );
