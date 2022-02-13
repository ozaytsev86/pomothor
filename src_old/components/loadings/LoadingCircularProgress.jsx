import React from 'react';
import {CircularProgress} from '@material-ui/core';

export const LoadingCircularProgress = (props) => {
  return (
    props.isLoading
      ? props.full
        ? <div className="u-height--full u-display--flex u-justify-content--center u-align-items--center">
            <CircularProgress/>
          </div>
        : <CircularProgress/>
      : props.children
  );
};
