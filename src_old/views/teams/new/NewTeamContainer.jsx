import React, {useEffect, useState} from 'react';
import Firebase from 'firebase';

import {Grid, Link, Typography} from '@material-ui/core';
import {LoadingCircularProgress} from '../../../components';
import NewTeamForm from './NewTeamForm';

import {locale} from '../../../locale/EnUs';

export const NewTeamContainer = (props) => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const teamsRef = Firebase.database().ref('/teams');
    teamsRef.on('value', snapshot => {
      const teams = snapshot.val();

      setTeams(teams);
      setIsLoading(false);
    });
  }, []);

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
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
          <NewTeamForm user={props.user} teams={teams}/>
          <span className="u-position--absolute u-bottom--0">
            {locale.PhotoBy} <Link href="https://www.pexels.com/@fauxels" target="_blank" rel="noopener noreferrer">fauxels</Link>
         </span>
        </Grid>
      </Grid>
    </LoadingCircularProgress>
  );
};
