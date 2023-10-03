import type { AxiosError } from 'axios';
import * as FaceDetector from 'expo-face-detector';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import { FadeInDown } from 'react-native-reanimated';

import {
  AnimatedImage,
  Box,
  Button,
  FullScreenLoader,
  KeyboardStickyButton,
  PaddedScreenHeader,
  Screen,
  Text,
} from '@/components';
import { ProfileImage as ProfileImageIcon, UserFolder } from '@/icons';
import { showToast } from '@/lib/root-toast';
import { marginAutoStyles } from '@/theme';
import {
  handleAxiosErrorAlertAndHaptics,
  handleGenericErrorAlertAndHaptics,
} from '@/utils';

import { useUpdateProfileImage } from '../api';

const createFormData = (
  formDataKey: string,
  photo: ImagePicker.ImagePickerAsset,
  otherValues = {},
) => {
  const data = new FormData();

  const localUri = photo.uri;
  const name = localUri.split('/').pop(); // Pick name from end of path

  const match = !!name && /\.(\w+)$/.exec(name);
  const type = match ? `image/${match[1]}` : `image`; // Infer the type of the image
  const uri = photo.uri;

  data.append(formDataKey, { uri, name, type } as unknown as Blob);

  Object.keys(otherValues).forEach(key => {
    data.append(key, otherValues[key]);
  });

  return data;
};

const detectAndReturnFaces = async (imageUri: string | undefined) => {
  if (!imageUri) {
    return;
  }

  const detectionResult = await FaceDetector.detectFacesAsync(imageUri);

  const facesDetected = detectionResult.faces;
  const isThereAFace = !!facesDetected && facesDetected.length > 0;
  const areThereMultipleFaces = facesDetected.length > 1;

  if (!isThereAFace) {
    handleGenericErrorAlertAndHaptics(
      'No faces detected',
      'Please select another photo where your face is in focus.',
    );
    return;
  }

  if (areThereMultipleFaces) {
    handleGenericErrorAlertAndHaptics(
      'Multiple people found',
      'Profile images should show only the owner of the profile.',
    );
    return;
  }

  return facesDetected;
};

interface EditProfileImageFormProps {
  isOnboarding?: boolean;
  onComplete?: () => void;
}

export const EditProfileImageForm: React.FunctionComponent<
  EditProfileImageFormProps
> = ({ isOnboarding, onComplete }) => {
  const [image, setImage] = React.useState<
    ImagePicker.ImagePickerAsset | undefined
  >(undefined);
  const { mutate: updateProfileImage, isLoading: isProfileImageUpdateLoading } =
    useUpdateProfileImage();

  const imageUri = image?.uri;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    const facesDetected = await detectAndReturnFaces(imageUri);

    if (facesDetected && !!image) {
      const formData = createFormData('profile_image', image);

      updateProfileImage(formData, {
        onSuccess: () => {
          showToast('Photo upload successful.');
          onComplete?.();
        },

        onError: error => {
          handleAxiosErrorAlertAndHaptics('Upload failed', error as AxiosError);
        },
      });
    }
  };

  return (
    <>
      <FullScreenLoader
        isVisible={isProfileImageUpdateLoading}
        message="Uploading your profile photo..."
      />

      <Screen isHeaderShown={!isOnboarding} hasNoIOSBottomInset>
        {isOnboarding && (
          <PaddedScreenHeader
            heading="Please add a profile photo"
            subHeading="We want everyone to be easily recognizable on Halver. Please upload a photo with your face in it."
            hasExtraPadding
          />
        )}

        {!isOnboarding && (
          <Text
            color="textLight"
            marginTop="1"
            paddingHorizontal="6"
            paddingVertical="2"
            variant="sm"
          >
            We want everyone to be easily recognizable on Halver. Please upload
            a photo with your face in it.
          </Text>
        )}

        <Box
          flex={1}
          gap="7"
          marginTop="5"
          paddingHorizontal="6"
          paddingVertical="8"
        >
          {!!imageUri && (
            <AnimatedImage
              borderRadius="2xl"
              entering={FadeInDown}
              height={160}
              marginLeft="auto"
              marginRight="auto"
              source={{ uri: imageUri }}
              width={160}
            />
          )}

          {!imageUri && (
            <ProfileImageIcon
              style={[marginAutoStyles['ml-auto'], marginAutoStyles['mr-auto']]}
            />
          )}

          <Button
            alignSelf="flex-start"
            backgroundColor="buttonApricot"
            gap="3"
            marginLeft="auto"
            marginRight="auto"
            variant="sm"
            onPress={pickImage}
          >
            <Text
              color="buttonTextApricot"
              fontFamily="Halver-Semibold"
              variant="sm"
            >
              {!imageUri ? 'Select an ' : 'Change '}image
            </Text>
            <UserFolder />
          </Button>
        </Box>

        <KeyboardStickyButton
          backgroundColor="buttonCasal"
          disabled={!imageUri}
          onPress={handleUpload}
        >
          <Text color="buttonTextCasal" fontFamily="Halver-Semibold">
            {imageUri ? 'Continue' : 'No image selected'}
          </Text>
        </KeyboardStickyButton>
      </Screen>
    </>
  );
};
