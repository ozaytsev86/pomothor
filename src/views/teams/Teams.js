import React, {useState, useEffect} from 'react';
import Firebase from 'firebase';

import {Grid, Typography} from '@material-ui/core';

import {LoadingCircularProgress} from '../../components/loadings/LoadingCircularProgress';
import NewTeamForm from './NewTeamForm';

export const Teams = () => {
  const [teamsList, setTeamsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const teamsRef = Firebase.database().ref('/teams');
    teamsRef.on('value', snapshot => {
      const teams = snapshot.val();

      setTeamsList(teams || {});
      setIsLoading(false);
    });
  }, []);

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Grid container direction="column">
        <Grid item className="u-full-height--centered e-teams-bg">
          <Typography variant="h3">
            Create your team and start be focused.
          </Typography>
          <NewTeamForm teamsList={teamsList}/>
        </Grid>
      </Grid>
    </LoadingCircularProgress>
  );
};
