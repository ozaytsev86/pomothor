import {UNIT_1, UNIT_2, UNIT_3, UNIT_4} from '../../../constants/StyleVariables';
import {ClipboardIcon, Heading, IconButton, Link, Pane, Position, Text, Tooltip} from 'evergreen-ui';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchTeam, useFetchTeamUsers} from '../../../services/Teams.query';
import {Loading} from '../../../components/Loading';
import {TEAMS_NOT_FOUND} from '../../../constants/Routes';
import {useAppStore} from '../../../hooks/UseAppStore';
import {MeCard} from './MeCard';
import {UserCard} from './UserCard';
import {useTeamUsersSubscribeUnsubscribe, useUpdateTeamUserStatus} from './useTeam';
import {TeamAdmin} from './TeamAdmin';

export const Team = () => {
  useTeamUsersSubscribeUnsubscribe();
  useUpdateTeamUserStatus();
  const params = useParams();
  const navigate = useNavigate();
  const {userInfo} = useAppStore();

  // TODO: check responsive
  // TODO: clean database and try all again

  const {
    isLoading: isLoadingTeam,
    data: team = {},
    error
  } = useFetchTeam(params.id);

  if (error) {
    navigate(TEAMS_NOT_FOUND);
  }

  const {
    data: teamUsers = {invitedUsers: [], acceptedUsers: []}
  } = useFetchTeamUsers(params.id);

  const isAdmin = userInfo.id === team.creatorId;

  return (
    <>
      <Loading loading={isLoadingTeam}/>
      {!isLoadingTeam && (
        <Pane padding={UNIT_4}>
          <Pane
            width="100%"
            textAlign="center"
            paddingBottom={UNIT_4}
          >
            <Heading size={900} textAlign="center">{team.name}</Heading>
            <Text paddingRight={UNIT_2}>Team link:</Text>
            <Link paddingRight={UNIT_2}>{window.location.href}</Link>
            <Tooltip content="Copy to clipboard" position={Position.TOP}>
              <IconButton icon={ClipboardIcon}/>
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
                    ? teamUsers.acceptedUsers.filter(u => !u.online).map(user => <UserCard key={user.email} active={false} {...user}/>)
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
      )}
    </>
  );
};