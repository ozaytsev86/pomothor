import React from 'react';
import {Box, Typography} from '@material-ui/core';
import {CopyToClipboard} from '../../../components';

import {locale} from '../../../locale/EnUs';

export const NoTeams = () => {
  return (
    <Box py={4} px={2}>
      <div className="u-display--flex u-flex-direction--column u-justify-content--center u-align-items--center">
        <Typography gutterBottom variant="h4">
          {locale.JustStarted}
        </Typography>
        <Typography gutterBottom variant="h6">
          {locale.ShareTheLinkWithYourTeamAndStartPomothoring}
        </Typography>
        <Typography variant="body1">
          {window.location.href}
          <CopyToClipboard text={window.location.href}/>
        </Typography>
      </div>
    </Box>
  )
}