import React from 'react';
import {LinearProgress} from '@material-ui/core';

export const LoadingLinearProgress = (props) => {
  return props.isLoading
           ? <LinearProgress/>
           : props.children
};
