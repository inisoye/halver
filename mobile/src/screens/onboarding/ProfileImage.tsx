import type { AxiosError } from 'axios';
import * as FaceDetector from 'expo-face-detector';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  Button,
  FullScreenLoader,
  KeyboardStickyButton,
  PaddedScreenHeader,
  Screen,
  Text,
} from '@/components';
import { useUpdateProfileImage } from '@/features/account';
import { ProfileImage as ProfileImageIcon, UserFolder } from '@/icons';
import { showToast } from '@/lib/root-toast';
import { gapStyles } from '@/theme';
import {
  handleAxiosErrorAlertAndHaptics,
  handleGenericErrorAlertAndHaptics,
} from '@/utils';

const AnimatedImage = Animated.createAnimatedComponent(Image);

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

export const ProfileImage: React.FunctionComponent = () => {
  // const [imageUri, setImageUri] = React.useState<string>('');
  const [image, setImage] = React.useState<ImagePicker.ImagePickerAsset | undefined>(
    undefined,
  );
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

      <Screen isHeaderShown={false} hasNoIOSBottomInset>
        <PaddedScreenHeader
          heading="Please add a profile photo"
          subHeading="We want everyone to be easily recognizable on Halver. Please upload a photo with your face in it."
          hasExtraPadding
        />

        <View className="mt-10 flex-1 p-2 px-6 py-8 " style={gapStyles[28]}>
          {!!imageUri && (
            <AnimatedImage
              className="mx-auto h-40 w-40 rounded-full"
              entering={FadeInDown}
              source={{ uri: imageUri }}
            />
          )}

          {!imageUri && <ProfileImageIcon className="mx-auto" />}

          <Button
            className="mx-auto w-max"
            color="apricot"
            isTextContentOnly={false}
            size="sm"
            style={gapStyles[12]}
            onPress={pickImage}
          >
            <Text color="inverse" variant="sm" weight="bold">
              {!imageUri ? 'Select an ' : 'Change '}image
            </Text>
            <UserFolder />
          </Button>
        </View>

        <KeyboardStickyButton
          disabled={!imageUri}
          isTextContentOnly
          onPress={handleUpload}
        >
          {imageUri ? 'Continue' : 'No image selected'}
        </KeyboardStickyButton>
      </Screen>
    </>
  );
};
