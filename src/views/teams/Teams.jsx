import {Button, Heading, IconButton, Pane, Position, Tooltip} from 'evergreen-ui';
import {useFetchTeams, useJoinTeam} from '../../services/Teams.query';
import {useAppStore} from '../../hooks/UseAppStore';
import {UNIT_2, UNIT_3, UNIT_4} from '../../constants/StyleVariables';
import {Card} from '../../components/card/Card';
import React, {useState} from 'react';
import {BiLogInCircle, BiTask} from 'react-icons/bi';
import {Loading} from '../../components/Loading';
import {useNavigate} from 'react-router-dom';
import {buildUrl} from '../../utils/Builders';
import {TEAMS_ID, TEAMS_NOT_FOUND} from '../../constants/Routes';
import {Badge} from '../../components/Badge';
import {useAlertStore} from '../../hooks/UseAlertStore';
import {NoRecords} from '../../components/NoRecords';

export const Teams = () => {
  const {createSuccessAlert} = useAlertStore();
  const {userInfo} = useAppStore();
  const [isVisibleCreateTeamModal, setIsVisibleCreateTeamModal] = useState(false);
  const navigate = useNavigate();
  const joinedTeamIdRef = React.useRef(null);

  const {
    isLoading: isLoadingTeams,
    data: teams = []
  } = useFetchTeams(userInfo.email);

  const {
    isLoading: isLoadingJoinTeam,
    mutateAsync: joinTeam,
    error: errorJoinTeam
  } = useJoinTeam({
    onSuccess: () => {
      navigate(buildUrl(TEAMS_ID, 'id', joinedTeamIdRef.current));
    }
  });

  const handleOnClickJoin = (teamId) => {
    joinedTeamIdRef.current = teamId;
    joinTeam({teamId, email: userInfo.email});
  };

  const handleCopyToClipboard = (teamId) => {
    navigator.clipboard.writeText(`${window.location.href}/${teamId}`);
    createSuccessAlert('Copied!');
  };

  if (errorJoinTeam) {
    navigate(TEAMS_NOT_FOUND);
  }

  if (isLoadingTeams) {
    return <Loading loading/>;
  }

  return (
    <Pane padding={UNIT_4}>
      {<NoRecords arr={teams}/>}
      {teams.map(({name, id, isPrivate}) => (
        <Card hoverable key={id}>
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
              <Heading marginRight={UNIT_2}>{name}</Heading>
              <Tooltip content="Copy team link" position={Position.TOP}>
                <IconButton appearance="minimal" icon={BiTask} onClick={() => handleCopyToClipboard(id)}/>
              </Tooltip>
            </Pane>
            <Pane position="relative">
              <Loading
                overlay
                small
                loading={id === joinedTeamIdRef.current && isLoadingJoinTeam}
              />
              <Button appearance="primary" onClick={() => handleOnClickJoin(id)}>
                <BiLogInCircle fontSize={UNIT_3} className="u-mr-1"/>
                Join
              </Button>
            </Pane>
          </Pane>
        </Card>
      ))}
    </Pane>
  );
};