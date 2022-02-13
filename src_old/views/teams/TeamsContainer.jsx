import React, {useState, useEffect} from 'react';
import Firebase from 'firebase';

import {LoadingCircularProgress} from '../../components';
import {Teams} from './Teams';

export const TeamsContainer = () => {
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
      <Teams teams={teams}/>
    </LoadingCircularProgress>
  );
};
