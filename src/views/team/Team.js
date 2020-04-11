import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {withRouter} from 'react-router';
import Firebase from 'firebase';

import {addTeam, addTeamUser} from '../../services/team.service';
import {isValidTeamUrl} from '../teams/teams.helper';

import {LoadingCircularProgress} from '../../components/loadings/LoadingCircularProgress';
import {Pomodoros} from './Pomodoros';

const Team = (props) => {
  const {user} = props;
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    if (isValidTeamUrl(id)) {
      const currentTeamUrl = `/teams/${id}`;
      const teamsRef = Firebase.database().ref(currentTeamUrl);
      teamsRef.once('value', snapshot => {
        const currTeam = snapshot.val();

        if (!currTeam) {
          addTeam({user, id});
          addTeamUser({user, teamId: id})
        } else {
          if (currTeam.users.filter(userKey => userKey === user.uid).length === 0) {
            addTeamUser({user, teamId: id, users: currTeam.users});
          }
        }

        setCurrentTeam({id, ...currTeam});
        setIsLoading(false);
      });
    } else {
      //invalid team url
      props.history.push(`/teams/team-not-found`);
    }
  }, []);

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <Pomodoros user={user} team={currentTeam}/>
    </LoadingCircularProgress>
  );
};

export default withRouter(Team);
