import {UNIT_1, UNIT_2, UNIT_3, UNIT_4} from '../../../constants/StyleVariables';
import {Button, ClipboardIcon, Heading, IconButton, Link, Pane, Position, Text, TextInput, Tooltip} from 'evergreen-ui';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchTeam, useFetchTeamUsers, useInviteUserToTeam} from '../../../services/Teams.query';
import {Loading} from '../../../components/Loading';
import {TEAMS_NOT_FOUND} from '../../../constants/Routes';
import {useAppStore} from '../../../hooks/UseAppStore';
import {useState} from 'react';
import {Badge} from '../../../components/Badge';
import {MeCard} from './MeCard';
import {UserCard} from './UserCard';
import {Card} from '../../../components/card/Card';
import {BiSend} from 'react-icons/bi';
import {useTeamUsersSubscribeUnsubscribe, useUpdateTeamUserStatus} from './useTeam';

export const Team = () => {
  useTeamUsersSubscribeUnsubscribe();
  useUpdateTeamUserStatus();
  const params = useParams();
  const navigate = useNavigate();
  const {userInfo} = useAppStore();
  const [invitedUserEmail, setInvitedUserEmail] = useState('');

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
    isLoading: isLoadingInviteUser,
    mutateAsync: inviteUser
  } = useInviteUserToTeam({
    onSuccess: () => {
      setInvitedUserEmail('');
    }
  });

  const {
    data: teamUsers = []
  } = useFetchTeamUsers(params.id);

  const handleOnClickInviteUser = () => {
    inviteUser({teamId: params.id, email: invitedUserEmail, creatorId: userInfo.id});
  };

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
                  {teamUsers.length > 0 && teamUsers.filter(u => u.online).map(u => <UserCard user={u}/>)}
                </Pane>
              </Pane>
              <Pane marginBottom={UNIT_3}>
                <Heading size={100} paddingBottom={UNIT_2}>Offline</Heading>
                <Pane display="flex">
                  {teamUsers.filter(u => !u.online && u.userId).length > 0
                    ? teamUsers.filter(u => !u.online && u.userId).map(u => <UserCard user={u}/>)
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
            {isAdmin && (
              <Pane
                display="flex"
                flexDirection="column"
                marginLeft={UNIT_4}
                width="30%"
              >
                <Card marginBottom={UNIT_3} display="flex" flexDirection="column" position="relative">
                  <Loading overlay loading={isLoadingInviteUser}/>
                  <Heading size={100}>Invite</Heading>
                  <TextInput
                    marginTop={0}
                    paddingTop={0}
                    marginBottom={UNIT_2}
                    type="text"
                    placeholder="example@email.com"
                    value={invitedUserEmail}
                    onChange={(e) => setInvitedUserEmail(e.target.value)}
                  />
                  <Button
                    disabled={!Boolean(invitedUserEmail)}
                    appearance="primary"
                    display="flex"
                    alignSelf="flex-end"
                    onClick={handleOnClickInviteUser}
                  ><BiSend fontSize={UNIT_3} className="u-mr-1"/>Invite</Button>
                </Card>
                <Pane marginBottom={UNIT_3}>
                  <Heading size={100} paddingBottom={UNIT_2}>Invited</Heading>
                  <Pane display="flex" flexWrap="wrap">
                    {teamUsers.filter(({userId}) => !userId).length > 0
                      ? teamUsers.filter(({userId}) => !userId).map(u => <Badge key={u.id} marginRight={UNIT_1} marginBottom={UNIT_1}>{u.email}</Badge>)
                      : <Heading size={200}>There are no pending invitations</Heading>
                    }
                  </Pane>
                </Pane>
                <Pane marginBottom={UNIT_3}>
                  <Heading size={100} paddingBottom={UNIT_2}>Accepted</Heading>
                  <Pane display="flex" flexWrap="wrap">
                    {teamUsers.length > 0 && teamUsers.filter(({userId}) => userId).map(u => <Badge color="teal" marginRight={UNIT_1} marginBottom={UNIT_1}>{u.email}</Badge>)}
                  </Pane>
                </Pane>
              </Pane>
            )}
          </Pane>
        </Pane>
      )}
    </>
  );
};