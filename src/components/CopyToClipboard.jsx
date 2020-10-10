import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {IconButton, Tooltip} from '@material-ui/core';
import {ContentCopy} from '@material-ui/icons';

import {locale} from '../locale/en-us';

const propTypes = {
  text: PropTypes.string.isRequired
}

export const CopyToClipboard = ({text}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleOnCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
  };

  return (
    <Tooltip title={isCopied ? locale.Copied : locale.ClickToCopy} placement="top">
      <IconButton
          color="secondary"
          onMouseEnter={() => setIsCopied(false)}
          onClick={handleOnCopy}
        >
          <ContentCopy />
      </IconButton>
    </Tooltip>
  )
};

CopyToClipboard.propTypes = propTypes;
