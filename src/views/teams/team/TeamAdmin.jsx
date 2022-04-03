import {UNIT_1, UNIT_2, UNIT_3, UNIT_4} from '../../../constants/StyleVariables';
import {Card} from '../../../components/card/Card';
import {Loading} from '../../../components/Loading';
import {Button, Heading, Pane, TextInput} from 'evergreen-ui';
import {BiSend} from 'react-icons/bi';
import {Badge} from '../../../components/Badge';
import {useInviteUserToTeam} from '../../../services/Teams.query';
import {useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAppStore} from '../../../hooks/UseAppStore';

export const TeamAdmin = ({teamUsers}) => {
  const params = useParams();
  const {userInfo} = useAppStore();
  const [invitedUserEmail, setInvitedUserEmail] = useState('');

  const {
    isLoading: isLoadingInviteUser,
    mutateAsync: inviteUser
  } = useInviteUserToTeam({
    onSuccess: () => {
      setInvitedUserEmail('');
    }
  });

  const handleOnClickInviteUser = () => {
    inviteUser({teamId: params.id, email: invitedUserEmail, creatorId: userInfo.id});
  };

  return (
    <Pane
      display="flex"
      flexDirection="column"
      marginLeft={UNIT_4}
      width="30%"
    >
      <Card
        padding={UNIT_3}
        marginBottom={UNIT_3}
        display="flex"
        flexDirection="column"
        position="relative"
      >
        <Loading overlay loading={isLoadingInviteUser}/>
        <Heading size={100}>Invite</Heading>
        <TextInput
          marginTop={0}
          paddingTop={0}
          width="100%"
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
          {teamUsers.invitedUsers.length > 0
            ? teamUsers.invitedUsers.map(u => <Badge key={u.email} marginRight={UNIT_1} marginBottom={UNIT_1}>{u.email}</Badge>)
            : <Heading size={200}>There are no pending invitations</Heading>
          }
        </Pane>
      </Pane>
      <Pane marginBottom={UNIT_3}>
        <Heading size={100} paddingBottom={UNIT_2}>Accepted</Heading>
        <Pane display="flex" flexWrap="wrap">
          {teamUsers.acceptedUsers.map(u => <Badge key={u.email} color="teal" marginRight={UNIT_1} marginBottom={UNIT_1}>{u.email}</Badge>)}
        </Pane>
      </Pane>
    </Pane>
  );
};