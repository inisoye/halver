import { CompositeNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as React from 'react';

import { Box, Button, Modal, Text } from '@/components';
import type { BillTransaction } from '@/features/bills';
import { GoToArrow } from '@/icons';
import type { AppRootStackParamList, FinancialsStackParamList } from '@/navigation';
import { convertNumberToNaira } from '@/utils';

interface SelectedTransactionModalProps {
  closeModal: () => void;
  isModalOpen: boolean;
  selectedTransaction: BillTransaction | undefined;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<FinancialsStackParamList, 'Transactions'>,
    NativeStackNavigationProp<AppRootStackParamList>
  >;
}

export const SelectedTransactionModal: React.FunctionComponent<SelectedTransactionModalProps> =
  React.memo(({ closeModal, isModalOpen, selectedTransaction, navigation }) => {
    const {
      bill,
      created,
      contribution,
      totalPayment,
      payingUser,
      receivingUser,
      isCredit,
    } = selectedTransaction || {};
    const { name: billName, uuid: billId } = bill || {};

    const handleGoToBill = () => {
      closeModal();
      navigation.navigate('Home', {
        screen: 'BillsStackNavigator',
        params: {
          screen: 'Bill',
          initial: false,
          params: {
            id: billId || '',
            name: billName || '',
          },
        },
      });
    };

    return (
      <Modal
        closeModal={closeModal}
        headingText={`${isCredit ? 'Credit' : 'Debit'} transaction`}
        isLoaderOpen={false}
        isModalOpen={isModalOpen}
        hasLargeHeading
      >
        <Box
          backgroundColor="modalBackground"
          maxHeight="81%"
          paddingBottom="8"
          paddingTop="5"
        >
          <Box
            columnGap="6"
            flexDirection="row"
            flexWrap="wrap"
            marginBottom="3.5"
            paddingHorizontal="6"
          >
            <Box paddingVertical="2" width="46.3%">
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

            <Box paddingVertical="2" width="46.3%">
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

            <Box paddingVertical="2" width="46.3%">
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

            <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46.3%">
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

            <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46.3%">
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

            <Box opacity={'accountName' ? 1 : 0.5} paddingVertical="2" width="46.3%">
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
                <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
                  Go to bill
                </Text>

                <GoToArrow isLight />
              </Box>
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  });
