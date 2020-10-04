import React from 'react';
import {withRouter} from 'react-router';
import {Button, Grid, Link, Typography} from '@material-ui/core';

import {locale} from '../../locale/en-us';
import {routes} from '../../constants/routes';

const NoTeams = (props) => {
  return (
    <Grid container direction="column">
      <Grid
        item
        className="
          e-bg
          e-bg-image--no-teams
          u-height--full
          u-display--flex
          u-flex-direction--column
          u-justify-content--center
          u-align-items--center
        "
      >
        <Typography gutterBottom variant="h4">
          {locale.ThereAreNoTeamsCreatedYet}
        </Typography>
        <Button
          disableElevation
          variant="outlined"
          color="primary"
          onClick={() => props.history.push(routes.TeamsNew)}
        >
          {locale.CreateTeam}
        </Button>
        <span className="u-position--absolute u-bottom--0">
         {locale.PhotoBy} <Link href="https://www.pexels.com/@fauxels" target="_blank" rel="noopener noreferrer">fauxels</Link>
       </span>
      </Grid>
    </Grid>
  )
}

export default withRouter(NoTeams);
