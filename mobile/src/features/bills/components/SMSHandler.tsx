import * as SMS from 'expo-sms';
import * as React from 'react';

import { Box, Button, Text } from '@/components';
import { GoToArrow } from '@/icons';

import { BillCreationMMKVPayload } from '../types';

interface SMSHandlerProps {
  billName: string | undefined;
  unregisteredParticipants: BillCreationMMKVPayload['unregisteredParticipants'];
}

export const SMSHandler: React.FunctionComponent<SMSHandlerProps> = ({
  billName,
  unregisteredParticipants,
}) => {
  const [isSMSAvailable, setIsSMSAvailable] = React.useState(false);

  const handleComposeMessage = React.useCallback(async () => {
    const phoneNumbers =
      unregisteredParticipants?.map(participant => participant.phone ?? '') ??
      [];

    if (isSMSAvailable) {
      await SMS.sendSMSAsync(
        phoneNumbers,
        `Hi! I have just invited you to join a bill (${billName}) on Halver. Go to https://www.halverapp.com/ to join Halver and make your contribution. Make sure you use this phone number to register. Thanks!`,
      );
    }
  }, [isSMSAvailable, unregisteredParticipants, billName]);

  React.useEffect(() => {
    SMS.isAvailableAsync().then(setIsSMSAvailable);
  }, []);

  return (
    isSMSAvailable && (
      <Button
        backgroundColor="green11"
        flex={1}
        paddingLeft="4"
        paddingRight="4"
        onPress={handleComposeMessage}
      >
        <Box
          flexDirection="row"
          gap="4"
          justifyContent="space-between"
          width="100%"
        >
          <Text color="green2" fontFamily="Halver-Semibold">
            SMS
          </Text>

          <GoToArrow color="textInverse" />
        </Box>
      </Button>
    )
  );
};
