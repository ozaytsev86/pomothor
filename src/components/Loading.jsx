import {Pane, Spinner} from 'evergreen-ui';
import React from 'react';
import {UNIT_3, UNIT_4} from '../constants/StyleVariables';

export const Loading = ({small, loading, overlay}) => {
  const size = small ? UNIT_3 : UNIT_4;

  return (
    loading ? (
        overlay
          ? (
            <Pane
              display="flex"
              alignSelf="center"
              justifyContent="center"
              height="100%"
              width="100%"
              flexGrow={1}
              backgroundColor="rgba(254, 254, 254, 0.9)"
              position="absolute"
              zIndex={2}
              top={0}
              borderRadius="inherit"
            >
              <Spinner
                display="flex"
                size={size}
                alignSelf="center"
              />
            </Pane>
          )
          : (
            <Pane
              display="flex"
              alignSelf="center"
              justifyContent="center"
              height="100%"
              width="100%"
              flexGrow={1}
              position="relative"
            >
              <Spinner
                position="absolute"
                marginX="auto"
                top="40%"
                left="45%"
              />
            </Pane>
          )
      )
      : null
  );
};