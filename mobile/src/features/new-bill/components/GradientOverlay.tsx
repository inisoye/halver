import * as React from 'react';

import { Box, LinearGradient } from '@/components';
import { useIsDarkMode } from '@/utils';

export const GradientOverlay: React.FunctionComponent = React.memo(() => {
  const isDarkMode = useIsDarkMode();

  const gradientColors = isDarkMode
    ? ['rgba(0,0,0,0)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.5)', 'black']
    : [
        'rgba(255,255,255,0)',
        'rgba(255,255,255,0.2)',
        'rgba(255,255,255,0.5)',
        'white',
      ];

  return (
    <Box
      bottom={0}
      flex={1}
      left={0}
      pointerEvents="none"
      position="absolute"
      right={0}
      top={0}
    >
      <LinearGradient
        bottom={0}
        colors={gradientColors}
        flex={1}
        left={0}
        locations={[0.5, 0.7, 0.9, 1]}
        position="absolute"
        right={0}
        top={0}
      />
    </Box>
  );
});
