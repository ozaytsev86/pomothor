import {Heading, IconButton, Pane, Position, Tooltip} from 'evergreen-ui';
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

export const Teams = () => {
  const {userInfo} = useAppStore();
  const navigate = useNavigate();
  const joinedTeamIdRef = React.useRef(null);

  const {
    isLoading: isLoadingTeams,
    data: teams = []
  } = useFetchTeams();

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
    joinTeam({teamId, userId: userInfo.id, userEmail: userInfo.email});
  };

  return (
    <Pane
      padding={UNIT_4}
    >
      <Loading loading={isLoadingTeams}/>
      {teams.map(({name, id}) => (
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
            <Heading>{name}</Heading>
            <Pane position="relative">
              <Loading
                overlay
                small
                loading={id === joinedTeamIdRef.current && isLoadingJoinTeam}
              />
              <Tooltip content="Join" position={Position.LEFT}>
                <IconButton
                  icon={BiLogInCircle}
                  appearance="primary"
                  onClick={() => handleOnClickJoin(id)}
                />
              </Tooltip>
            </Pane>
          </Pane>
        </Card>
      ))}
    </Pane>
  );
};