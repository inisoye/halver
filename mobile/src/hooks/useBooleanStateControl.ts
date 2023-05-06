import * as React from 'react';

export const useBooleanStateControl = (initialState = false) => {
  const [state, setState] = React.useState(initialState);

  const setTrue = React.useCallback((): void => setState(true), []);
  const setFalse = React.useCallback((): void => setState(false), []);

  return {
    state,
    setTrue,
    setFalse,
  };
};
