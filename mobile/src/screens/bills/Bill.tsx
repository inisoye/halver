import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { FadeInUp } from 'react-native-reanimated';

import {
  AfterInteractions,
  AnimatedBox,
  Box,
  Button,
  DynamicText,
  LogoLoader,
  Screen,
  ScrollView,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  BillParticipantsList,
  BillRecentContributionsList,
  statusColorIndex,
  useBill,
} from '@/features/bills';
import { BackWithBackground, Gear } from '@/icons';
import { AppRootStackParamList, BillsStackParamList } from '@/navigation';

type BillProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bill'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

export const Bill = ({ navigation, route }: BillProps) => {
  const { id, name } = route.params;

  const { data: bill, isLoading: isBillLoading } = useBill(id);
  const { status, actions, notes, creator, creditor, isDiscreet, isCreditor } =
    bill || {};

  const statusColor = React.useMemo(
    () => (status ? statusColorIndex[status?.short] : undefined),
    [status],
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <Screen
      backgroundColor="billScreenBackground"
      customScreenName={name}
      isHeaderShown={false}
      hasNoIOSBottomInset
    >
      <Box
        alignItems="center"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        paddingBottom="1"
        paddingHorizontal="6"
        paddingTop="5"
      >
        <TouchableOpacity
          hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
          onPress={handleGoBack}
        >
          <BackWithBackground />
        </TouchableOpacity>

        <Gear />
      </Box>

      <Box backgroundColor="transparent" height={16}>
        <AfterInteractions>{isBillLoading && <LogoLoader />}</AfterInteractions>
      </Box>

      <Box backgroundColor="background" flex={1}>
        <ScrollView>
          <Box
            backgroundColor="billScreenBackground"
            borderBottomEndRadius="2xl"
            borderBottomStartRadius="2xl"
            padding="6"
          >
            <Box
              flexDirection="row"
              gap="2"
              justifyContent="space-between"
              marginBottom="5"
            >
              <DynamicText
                fontFamily="Halver-Semibold"
                maxWidth="70%"
                numberOfLines={2}
                variant="4xl"
              >
                {name}
              </DynamicText>

              <DynamicText
                color={statusColor}
                fontFamily="Halver-Semibold"
                lineHeight={13.5}
                maxWidth="30%"
                textAlign="right"
                variant="xs"
              >
                {status?.long}
              </DynamicText>
            </Box>

            <Box>
              <Box
                flexDirection="row"
                gap="2"
                justifyContent="space-between"
                marginBottom="2"
              >
                <Text color="textLight" fontFamily="Halver-Semibold" variant="xs">
                  58% Contributed
                </Text>
                <Text fontFamily="Halver-Semibold" variant="xs">
                  ₦2,900 out of ₦5,000
                </Text>
              </Box>

              <Box backgroundColor="elementBackground" borderRadius="sm2" height={12}>
                <AnimatedBox
                  backgroundColor="billMeterBackground"
                  borderRadius="sm2"
                  height={12}
                  width="58%"
                />
              </Box>
            </Box>
          </Box>

          <Box
            columnGap="2"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="space-between"
            paddingHorizontal="6"
          >
            {!!creator && (
              <AnimatedBox
                borderBottomLeftRadius="xl"
                borderBottomRightRadius="xl"
                borderColor="gray7"
                borderTopWidth={0}
                borderWidth={1}
                entering={FadeInUp.springify()}
                maxWidth="48%"
                paddingHorizontal="4"
                paddingVertical="2"
              >
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Created by
                </Text>

                <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                  {creator?.fullName}
                </Text>
              </AnimatedBox>
            )}

            {!!creditor && (
              <AnimatedBox
                borderBottomLeftRadius="xl"
                borderBottomRightRadius="xl"
                borderColor="gray7"
                borderTopWidth={0}
                borderWidth={1}
                entering={FadeInUp.springify().delay(200)}
                maxWidth="48%"
                paddingHorizontal="4"
                paddingVertical="2"
              >
                <Text
                  color="textLight"
                  marginBottom="0.75"
                  numberOfLines={1}
                  variant="xs"
                >
                  Bill creditor
                </Text>

                <Text fontFamily="Halver-Semibold" numberOfLines={1} variant="sm">
                  {creditor?.fullName}
                </Text>
              </AnimatedBox>
            )}
          </Box>

          <Box gap="10" paddingBottom="2" paddingHorizontal="6" paddingTop="10">
            {!!notes && (
              <Box gap="3">
                <Text color="textLight" variant="sm">
                  {notes}
                </Text>

                <Text color="textLight" fontFamily="Halver-Semibold" variant="sm">
                  — {creator?.firstName} (bill creator)
                </Text>
              </Box>
            )}

            {!!actions && (
              <BillParticipantsList actions={actions} isDiscreet={isDiscreet} />
            )}

            <BillRecentContributionsList id={id} isDiscreet={isDiscreet} />
          </Box>
        </ScrollView>
      </Box>

      {!isBillLoading && !isCreditor && (
        <Box backgroundColor="background" paddingHorizontal="6" paddingVertical="3">
          <Button backgroundColor="buttonCasal" disabled={isBillLoading}>
            <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
              Make your contribution
            </Text>
          </Button>
        </Box>
      )}
    </Screen>
  );
};
