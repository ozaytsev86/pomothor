import {Button, Heading, Pane} from 'evergreen-ui';
import {useFetchTeams, useJoinTeam} from '../../services/Teams.query';
import {useAppStore} from '../../hooks/UseAppStore';
import {BORDER_RADIUS_M, UNIT_2, UNIT_4} from '../../constants/StyleVariables';
import {Card} from '../../components/card/Card';
import React from 'react';
import {BiLogInCircle} from 'react-icons/bi';
import {Loading} from '../../components/Loading';
import {useNavigate} from 'react-router-dom';
import {buildUrl} from '../../utils/Builders';
import {TEAMS_ID} from '../../constants/Routes';
import {Badge} from '../../components/Badge';

export const Teams = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  const joinedTeamIdRef = React.useRef(null);

  const {
    isLoading: isLoadingTeams,
    data: teams = []
  } = useFetchTeams(userInfo.email);

  const {
    isLoading: isLoadingJoinTeam,
    mutateAsync: joinTeam
  } = useJoinTeam({
    onSuccess: () => {
      navigate(buildUrl(TEAMS_ID, 'id', joinedTeamIdRef.current));
    }
  });

  const handleOnClickJoin = (teamId) => {
    joinedTeamIdRef.current = teamId;
    joinTeam({teamId, email: userInfo.email});
  };

  if (isLoadingTeams) {
    return <Loading loading/>;
  }

  return (
    <Pane padding={UNIT_4}>
      {teams.map(({name, id, isPrivate}) => (
        <Card
          key={id}
          hoverable
          borderRadius={BORDER_RADIUS_M}
          marginBottom={UNIT_2}
          padding={UNIT_2}
          className="u-box-shadow-1"
        >
          <Pane
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Pane
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {!isPrivate && <Badge color="green" marginRight={UNIT_2}>public</Badge>}
              {isPrivate && <Badge color="yellow" marginRight={UNIT_2}>private</Badge>}
              <Heading>{name}</Heading>
            </Pane>
            <Pane position="relative">
              <Loading
                overlay
                small
                loading={id === joinedTeamIdRef.current && isLoadingJoinTeam}
              />
              <Button appearance="primary" onClick={() => handleOnClickJoin(id)}>
                <BiLogInCircle className="u-mr-1"/>
                Join
              </Button>
            </Pane>
          </Pane>
        </Card>
      ))}
    </Pane>
  );
};