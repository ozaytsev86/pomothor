import {UNIT_1, UNIT_2, UNIT_3, UNIT_4} from '../../../constants/StyleVariables';
import {ClipboardIcon, Heading, IconButton, Link, Pane, Position, Text, Tooltip} from 'evergreen-ui';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchTeam, useFetchTeamUsers} from '../../../services/Teams.query';
import {Loading} from '../../../components/Loading';
import {TEAMS_NOT_ACCEPTED, TEAMS_NOT_FOUND, TEAMS_NOT_INVITED} from '../../../constants/Routes';
import {useAppStore} from '../../../hooks/UseAppStore';
import {MeCard} from './MeCard';
import {useTeamUsersSubscribeUnsubscribe, useUpdateTeamUserStatus} from './UseTeam';
import {TeamAdmin} from './TeamAdmin';
import {useAlertStore} from '../../../hooks/UseAlertStore';
import {UserCard} from './UserCard';

export const Team = () => {
  const {createSuccessAlert} = useAlertStore();
  useTeamUsersSubscribeUnsubscribe();
  useUpdateTeamUserStatus();
  const params = useParams();
  const navigate = useNavigate();
  const {userInfo} = useAppStore();

  const {
    isLoading: isLoadingTeam,
    data: team = {},
    error
  } = useFetchTeam(params.id);

  if (error) {
    navigate(TEAMS_NOT_FOUND);
  }

  const {
    data: teamUsers = {invitedUsers: [], acceptedUsers: []},
    isLoading: isLoadingTeamUsers
  } = useFetchTeamUsers(params.id);

  const isUserInvited = (userEmail) => teamUsers.invitedUsers.find(u => u.email === userEmail);
  const isUserAccepted = (userEmail) => teamUsers.acceptedUsers.find(u => u.email === userEmail);

  if (isLoadingTeam || isLoadingTeamUsers) {
    return <Loading loading/>;
  }

  if (team.isPrivate && !isUserInvited(userInfo.email) && !isUserAccepted(userInfo.email)) {
    navigate(TEAMS_NOT_INVITED);
  } else if (team.isPrivate && isUserInvited(userInfo.email) && !isUserAccepted(userInfo.email)) {
    navigate(TEAMS_NOT_ACCEPTED);
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    createSuccessAlert('Copied!');
  };

  const isAdmin = userInfo.id === team.creatorId;

  return (
    !isLoadingTeam && (
      <Pane padding={UNIT_4}>
        <Pane
          width="100%"
          textAlign="center"
          paddingBottom={UNIT_4}
        >
          <Heading size={900} textAlign="center">{team.name}</Heading>
          <Text paddingRight={UNIT_2}>Team link:</Text>
          <Link paddingRight={UNIT_2}>{window.location.href}</Link>
          <Tooltip content="Click to copy" position={Position.TOP}>
            <IconButton icon={ClipboardIcon} onClick={handleCopyToClipboard}/>
          </Tooltip>
        </Pane>
        <Pane display="flex">
          <Pane display="flex" flexDirection="column" flexGrow={1}>
            <MeCard/>
            <Pane marginBottom={UNIT_3}>
              <Heading size={100} paddingBottom={UNIT_2}>Online</Heading>
              <Pane display="flex">
                {teamUsers.acceptedUsers.filter(u => u.online).map(user => <UserCard key={user.email} {...user}/>)}
              </Pane>
            </Pane>
            <Pane marginBottom={UNIT_3}>
              <Heading size={100} paddingBottom={UNIT_2}>Offline</Heading>
              <Pane display="flex">
                {teamUsers.acceptedUsers.filter(u => !u.online).length > 0
                  ? teamUsers.acceptedUsers.filter(u => !u.online).map(user => <UserCard key={user.email} {...user}/>)
                  : (
                    <Pane display="flex" alignItems="center">
                      <Heading size={200}>Everybody is online!</Heading>
                      <Heading size={700} marginLeft={UNIT_1}>🎉</Heading>
                    </Pane>
                  )
                }
              </Pane>
            </Pane>
          </Pane>
          {isAdmin && <TeamAdmin teamUsers={teamUsers}/>}
        </Pane>
      </Pane>
    )
  );
};