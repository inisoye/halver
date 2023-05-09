import * as React from 'react';

export const useForceRerender = () => {
  const [_value, setValue] = React.useState(0);

  return () => setValue(value => value + 1);
};
