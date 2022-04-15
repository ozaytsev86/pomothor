import {Button, Heading, IconButton, Pane, Position, Tooltip} from 'evergreen-ui';
import {useFetchMyTeams, useLeaveTeam, useRemoveTeam} from '../../services/Teams.query';
import {useAppStore} from '../../hooks/UseAppStore';
import {BORDER_RADIUS_M, UNIT_2, UNIT_3, UNIT_4} from '../../constants/StyleVariables';
import React from 'react';
import {Loading} from '../../components/Loading';
import {BiLogOutCircle, BiPencil, BiTask, BiX} from 'react-icons/bi';
import {Badge} from '../../components/Badge';
import {Card} from '../../components/card/Card';
import {useAlertStore} from '../../hooks/UseAlertStore';

export const TeamsMy = () => {
  const {createSuccessAlert} = useAlertStore();
  const {userInfo} = useAppStore();
  const removedTeamIdRef = React.useRef(null);
  const leavedTeamIdRef = React.useRef(null);

  const {
    isLoading: isLoadingTeams,
    data: teams = null
  } = useFetchMyTeams({userId: userInfo.id, userEmail: userInfo.email});

  const {
    isLoading: isLoadingRemoveTeam,
    mutateAsync: removeTeam
  } = useRemoveTeam({
    onSuccess: () => {
      removedTeamIdRef.current = null;
    }
  });

  const {
    isLoading: isLoadingLeaveTeam,
    mutateAsync: leaveTeam
  } = useLeaveTeam({
    onSuccess: () => {
      leavedTeamIdRef.current = null;
    }
  });

  const handleCopyToClipboard = (teamId) => {
    navigator.clipboard.writeText(`${window.location.href}/${teamId}`);
    createSuccessAlert('Copied!');
  };

  const handleOnClickRemove = (teamId) => {
    removedTeamIdRef.current = teamId;
    removeTeam({teamId, creatorId: userInfo.id});
  };

  const handleOnClickLeave = (teamId) => {
    leavedTeamIdRef.current = teamId;
    leaveTeam({teamId, userEmail: userInfo.email});
  };

  if (isLoadingTeams) {
    return <Loading loading/>;
  }

  return (
    <Pane padding={UNIT_4}>
      <Heading size={100} paddingBottom={UNIT_2}>Created Teams</Heading>
      {teams.createdTeams.map(({id, name, isPrivate}) => (
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
              <Heading marginRight={UNIT_2}>{name}</Heading>
              <Tooltip content="Copy team link" position={Position.TOP}>
                <IconButton appearance="minimal" icon={BiTask} onClick={() => handleCopyToClipboard(id)}/>
              </Tooltip>
            </Pane>
            <Pane position="relative">
              <Loading
                overlay
                small
                loading={id === removedTeamIdRef.current && isLoadingRemoveTeam}
              />
              <Tooltip content="Edit" position={Position.TOP}>
                <IconButton
                  iconSize={UNIT_3}
                  appearance="minimal"
                  icon={BiPencil}
                />
              </Tooltip>
              <Tooltip content="Remove" position={Position.TOP}>
                <IconButton
                  iconSize={UNIT_3}
                  appearance="minimal"
                  intent="danger"
                  icon={BiX}
                  onClick={() => handleOnClickRemove(id)}
                />
              </Tooltip>
            </Pane>
          </Pane>
        </Card>
      ))}

      <Heading size={100} paddingTop={UNIT_4} paddingBottom={UNIT_2}>Assigned Teams</Heading>
      {teams.assignedTeams.map(({id, name, isPrivate}) => (
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
              <Heading marginRight={UNIT_2}>{name}</Heading>
              <Tooltip content="Copy team link" position={Position.TOP}>
                <IconButton appearance="minimal" icon={BiTask} onClick={() => handleCopyToClipboard(id)}/>
              </Tooltip>
            </Pane>
            <Pane position="relative">
              <Loading
                overlay
                small
                loading={id === leavedTeamIdRef.current && isLoadingLeaveTeam}
              />
              <Button appearance="primary" onClick={() => handleOnClickLeave(id)}>
                <BiLogOutCircle fontSize={UNIT_3} className="u-mr-1"/>
                Leave
              </Button>
            </Pane>
          </Pane>
        </Card>
      ))}
    </Pane>
  );
};