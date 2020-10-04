import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {withRouter} from 'react-router';
import Firebase from 'firebase';

import {addTeam, addTeamUser} from '../../../services/team.service';
import {isValidTeamUrl} from '../teams.helper';

import {LoadingCircularProgress} from '../../../components';
import {PomodorosContainer} from './PomodorosContainer';
import {routes} from '../../../constants/routes';

const TeamContainer = (props) => {
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
          // TODO: ask user to create a team instead of directly create it
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
      //when is invalid team url
      props.history.push(routes.TeamNotFound);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingCircularProgress full isLoading={isLoading}>
      <PomodorosContainer user={user} team={currentTeam}/>
    </LoadingCircularProgress>
  );
};

export default withRouter(TeamContainer);
