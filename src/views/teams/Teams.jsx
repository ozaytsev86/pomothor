import './teams.css';

import React from 'react';
import {Grid, Typography} from '@material-ui/core';

import NewTeamForm from './NewTeamForm';

import {locale} from '../../locale/en-us';

export const Teams = (props) => {
  return (
    <Grid container direction="column">
      <Grid item className="u-full-height--centered e-teams-bg">
        <Typography gutterBottom variant="h3">
          {locale.CreateYourTeamCallToAction}
        </Typography>
        <NewTeamForm teams={props.teams}/>
      </Grid>
    </Grid>
  );
};
