import React from 'react';
import {Grid, Link, Typography} from '@material-ui/core';

import NewTeamForm from './NewTeamForm';

import {locale} from '../../../locale/en-us';

export const NewTeamContainer = (props) => {
  return (
    <Grid container direction="column">
      <Grid
        item
        className="
          e-bg
          e-bg-image--new-team
          u-height--full
          u-display--flex
          u-flex-direction--column
          u-justify-content--center
          u-align-items--center
        "
      >
        <Typography gutterBottom variant="h4">
          {locale.CreateYourTeamCallToAction}
        </Typography>
        <NewTeamForm teams={props.teams}/>
        <span className="u-position--absolute u-bottom--0">
          {locale.PhotoBy} <Link href="https://www.pexels.com/@fauxels" target="_blank" rel="noopener noreferrer">fauxels</Link>
       </span>
      </Grid>
    </Grid>
  );
};
