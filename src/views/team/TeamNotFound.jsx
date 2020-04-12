import './teamNotFound.css';

import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import {locale} from '../../locale/en-us';

export const TeamNotFound = () => {
  return (
    <Grid container direction="column">
      <Grid item className="u-full-height--centered e-team-not-found-bg">
        <Typography variant="h1">
          404
        </Typography>
        <Typography gutterBottom variant="h4">
          {locale.ErrorTeamNotFound}
        </Typography>
        <Typography variant="caption">
          pic by: <a href="http://www.mcguiremade.com/" target="_blank">RyanMcGuire</a>
        </Typography>
      </Grid>
    </Grid>
  );
};
