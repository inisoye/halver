import type {
  CompositeNavigationProp,
  CompositeScreenProps,
} from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';

import {
  Box,
  FullWidthTextField,
  Image,
  LogoLoader,
  RectButton,
  Screen,
  Text,
  TouchableOpacity,
} from '@/components';
import {
  BillListItem,
  generateLongStatus,
  StatusInfo,
  useBills,
} from '@/features/bills';
import { useDebounce } from '@/hooks';
import { Plus, RightCaret, Search, ThreeUsersCluster } from '@/icons';
import type { AppRootStackParamList, BillsStackParamList } from '@/navigation';
import { useIsDarkModeSelected } from '@/utils';

/**
 * TODO
 * Add filter for search, integrate with React Query and debounce.
 * Add memo where possible. Considering moving stuff to separate files.
 */

interface BillParticipantAvatarProps {
  participant:
    | {
        fullName: string;
        profileImageUrl?: string | null | undefined;
        profileImageHash?: string | null | undefined;
      }
    | {
        name: string;
      };
}

export const BillParticipantAvatar: React.FunctionComponent<BillParticipantAvatarProps> =
  React.memo(({ participant }) => {
    if ('fullName' in participant) {
      return participant.profileImageUrl ? (
        <Image
          contentFit="contain"
          flexBasis="50%"
          height={20}
          placeholder={participant.profileImageHash || ''}
          source={participant.profileImageUrl}
          width={20}
        />
      ) : (
        <Box
          backgroundColor="elementBackground"
          flexBasis="50%"
          height={20}
          width={20}
        />
      );
    } else {
      return (
        <Box
          backgroundColor="elementBackground"
          flexBasis="50%"
          height={20}
          width={20}
        />
      );
    }
  });

interface BillListRenderItemProps {
  item: BillListItem | undefined;
  index: number;
  navigation: CompositeNavigationProp<
    NativeStackNavigationProp<BillsStackParamList, 'Bills', undefined>,
    NativeStackNavigationProp<AppRootStackParamList>
  >;
}

const BillListRenderItem: React.FunctionComponent<BillListRenderItemProps> = ({
  item,
  index,
  navigation,
}) => {
  const isDarkMode = useIsDarkModeSelected();

  const participantsAndUnregisteredParticipants = [
    ...(item?.participants || []),
    ...(item?.unregisteredParticipants || []),
  ];

  const firstFourParticipants = participantsAndUnregisteredParticipants.slice(0, 5);

  const hasNoRegisteredParticipantWithPhotos =
    !!item?.participants &&
    (item.participants.length < 1 ||
      item.participants.every(participant => !participant.profileImageUrl));

  const status = item?.statusInfo
    ? generateLongStatus(item?.statusInfo as StatusInfo)
    : { message: 'Unknown', color: undefined };

  const handleBillNavigation = () => {
    navigation.navigate('Bill', { id: item?.uuid || '', name: item?.name || '' });
  };

  return (
    <RectButton
      activeOpacity={0.05}
      marginTop={index === 0 ? '4' : undefined}
      underlayColor={isDarkMode ? 'white' : 'black'}
      onPress={handleBillNavigation}
    >
      <Box
        accessibilityRole="button"
        alignItems="center"
        flexDirection="row"
        gap="4"
        justifyContent="space-between"
        paddingHorizontal="6"
        paddingVertical="3.5"
      >
        <Box alignItems="center" flexDirection="row" gap="3">
          <Box
            alignItems="center"
            backgroundColor="elementBackground"
            borderRadius="lg"
            elevation={1}
            height={40}
            justifyContent="center"
            shadowColor="black"
            shadowOffset={{
              width: 0,
              height: 0.3,
            }}
            shadowOpacity={0.18}
            shadowRadius={0.2}
            width={40}
          >
            {hasNoRegisteredParticipantWithPhotos ? (
              <ThreeUsersCluster />
            ) : (
              <Box
                borderRadius="lg"
                flexDirection="row"
                flexWrap="wrap"
                height={40}
                overflow="hidden"
                width={40}
              >
                {firstFourParticipants.map((participant, participantIndex) => {
                  return (
                    <BillParticipantAvatar
                      key={participantIndex}
                      participant={participant}
                    />
                  );
                })}
              </Box>
            )}
          </Box>

          <Box width="74%">
            <Text fontFamily="Halver-Semibold" marginBottom="0.75" numberOfLines={1}>
              {item?.name}
            </Text>
            <Text
              color="textLight"
              fontFamily="Halver-Semibold"
              numberOfLines={1}
              variant="xs"
            >
              {item?.totalParticipants}
              {item?.totalParticipants === 1 ? ' person • ' : ' people • '}
              <Text color={status.color} fontFamily="Halver-Semibold" variant="xs">
                {status.message}
              </Text>
            </Text>
          </Box>
        </Box>

        <RightCaret />
      </Box>
    </RectButton>
  );
};

type BillsProps = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, 'Bills'>,
  NativeStackScreenProps<AppRootStackParamList>
>;

export const Bills: React.FunctionComponent<BillsProps> = ({ navigation }) => {
  const { control: controlForBillFilter } = useForm<{
    billFilter: string;
  }>({
    defaultValues: {
      billFilter: '',
    },
  });

  const billFilterValue = useWatch({
    control: controlForBillFilter,
    name: 'billFilter',
  });
  const debouncedFilterValue = useDebounce(billFilterValue, 500);

  const {
    data: billsResponse,
    isLoading: areBillsLoading,
    fetchNextPage,
    hasNextPage,
    isFetching: areBillsFetching,
  } = useBills(debouncedFilterValue);

  const bills = React.useMemo(
    () => billsResponse?.pages.flatMap(page => page.results),
    [billsResponse?.pages],
  );
  const loadMoreBills = () => hasNextPage && fetchNextPage();

  const noBillsFound = !areBillsLoading && (!bills || bills?.length < 1);

  const isFooterLoaderDisplayed = areBillsFetching && !areBillsLoading && !noBillsFound;

  const renderItem: ListRenderItem<BillListItem | undefined> = ({ item, index }) => {
    return <BillListRenderItem index={index} item={item} navigation={navigation} />;
  };

  return (
    <Screen
      headerProps={{ paddingBottom: '1' }}
      headerRightComponent={
        <TouchableOpacity
          hitSlop={{ top: 24, bottom: 24, left: 24, right: 24 }}
          onPress={() => {
            navigation.navigate('Bill Details');
          }}
        >
          <Plus />
        </TouchableOpacity>
      }
      hasNoIOSBottomInset
    >
      <Box backgroundColor="transparent" height={12}>
        {areBillsLoading && <LogoLoader />}
      </Box>

      <FullWidthTextField
        autoFocus={false}
        containerProps={{ marginTop: '0' }}
        control={controlForBillFilter}
        name="billFilter"
        paddingHorizontal="0"
        paddingRight="6"
        placeholder="Search by bill name"
        prefixComponent={<Search />}
      />

      {noBillsFound && (
        <Text color="textLight" padding="6">
          We found no bills
          {!!billFilterValue && ` matching "${billFilterValue}"`}
        </Text>
      )}

      <FlashList
        // eslint-disable-next-line react-native/no-inline-styles
        contentContainerStyle={{ paddingBottom: isFooterLoaderDisplayed ? 0 : 12 }}
        data={bills}
        estimatedItemSize={70}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={isFooterLoaderDisplayed ? <LogoLoader /> : undefined}
        renderItem={renderItem}
        onEndReached={loadMoreBills}
      />
    </Screen>
  );
};
