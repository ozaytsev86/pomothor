import React from 'react';
import {CircularProgress} from '@material-ui/core';

export const LoadingCircularProgress = (props) => {
  return (
    props.isLoading
      ? props.full
        ? <div className="u-full-height--centered">
            <CircularProgress/>
          </div>
        : <CircularProgress/>
      : props.children
  );
};
