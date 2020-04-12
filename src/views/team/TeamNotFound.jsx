import './teamNotFound.css';

import React from 'react';
import {Grid, Typography, Link} from '@material-ui/core';

import {locale} from '../../locale/en-us';

export const TeamNotFound = () => {
  return (
    <Grid container direction="column">
      <Grid
        item
        className="
          e-team-not-found-bg
          u-height--full
          u-display--flex
          u-flex-direction--column
          u-justify-content--center
          u-align-items--center
        "
      >
        <Typography variant="h1">
          404
        </Typography>
        <Typography gutterBottom variant="h4">
          {locale.ErrorTeamNotFound}
        </Typography>
        <span className="u-position--absolute u-bottom--0">
          {locale.PhotoBy} <Link href="http://www.mcguiremade.com/" target="_blank" rel="noopener noreferrer">RyanMcGuire</Link>
        </span>
      </Grid>
    </Grid>
  );
};
