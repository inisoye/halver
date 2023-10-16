import * as React from 'react';

import { useUserDetails } from '@/features/account/api';
import { checkAnyUserDetailsHaveBeenAdded } from '@/features/account/utils';

import { Box } from './Box';
import { Text } from './Text';
import { TouchableOpacity } from './TouchableOpacity';

interface PaddedScreenHeaderProps {
  heading: string;
  subHeading: string;
  step?: string;
  isSkippable?: boolean;
  handleSkip?: () => void;
}

export const PaddedScreenHeader: React.FunctionComponent<
  PaddedScreenHeaderProps
> = ({ heading, subHeading, isSkippable = false, handleSkip, step }) => {
  const { data: userDetails } = useUserDetails();

  const isAnyDetailComplete = checkAnyUserDetailsHaveBeenAdded(userDetails);

  return (
    <Box gap="10" paddingBottom="2" paddingHorizontal="6" paddingTop="6">
      <Box flexDirection="row">
        {!!step &&
          !isAnyDetailComplete && ( // Hide if any data has been added already.
            <Text color="textLight" variant="sm">
              {step}
            </Text>
          )}

        {isSkippable && (
          <TouchableOpacity marginLeft="auto" onPress={handleSkip}>
            <Text color="textLight" textDecorationLine="underline" variant="sm">
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </Box>

      <Box gap="2">
        <Text fontFamily="Halver-Semibold" variant="2xl">
          {heading}
        </Text>

        <Text color="textLight" variant="sm">
          {subHeading}
        </Text>
      </Box>
    </Box>
  );
};
