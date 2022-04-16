import {UNIT_2} from '../constants/StyleVariables';
import {Heading, Pane} from 'evergreen-ui';
import React from 'react';

export const NoRecords = ({arr}) => {
  if (!Array.isArray(arr)) {
    return null;
  }

  return (
    arr.length === 0 && <Pane gridColumn="span 6" textAlign="center" paddingTop={UNIT_2}><Heading size={200}>No records found</Heading></Pane>
  );
};