import {UNIT_1, UNIT_2, UNIT_3, UNIT_4} from '../../../constants/StyleVariables';
import {Button, ClipboardIcon, Heading, IconButton, Link, Pane, Position, Text, TextInputField, Tooltip} from 'evergreen-ui';
import {useNavigate, useParams} from 'react-router-dom';
import {useFetchTeam} from '../../../services/Teams.query';
import {Loading} from '../../../components/Loading';
import {TEAMS_NOT_FOUND} from '../../../constants/Routes';
import {useAppStore} from '../../../hooks/UseAppStore';
import {useState} from 'react';
import {Badge} from '../../../components/Badge';
import {MeCard} from './MeCard';
import {UserCard} from './UserCard';
import {Card} from '../../../components/card/Card';

export const Team = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {userInfo} = useAppStore();
  const [invitedUserEmail, setInvitedUserEmail] = useState('');

  const {
    isLoading,
    data: team = {},
    error
  } = useFetchTeam(params.id);

  if (error) {
    navigate(TEAMS_NOT_FOUND);
  }

  const isAdmin = userInfo.id === team.creatorId;

  return (
    <>
      <Loading loading={isLoading}/>
      {!isLoading && (
        <Pane
          padding={UNIT_4}
        >
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
                  <UserCard active busy/>
                  <UserCard/>
                </Pane>
              </Pane>
              <Pane marginBottom={UNIT_3}>
                <Heading size={100} paddingBottom={UNIT_2}>Offline</Heading>
                <Pane display="flex">
                  <UserCard active={false}/>
                  <UserCard active={false}/>
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
                <Card marginBottom={UNIT_3} display="flex" flexDirection="column">
                  <Heading size={100}>Invite</Heading>
                  <TextInputField
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
                  >Invite</Button>
                </Card>
                <Pane marginBottom={UNIT_3}>
                  <Heading size={100} paddingBottom={UNIT_2}>Invited</Heading>
                  <Badge onClickRemove={() => {}}>juan@email.com</Badge>
                </Pane>
                <Pane marginBottom={UNIT_3}>
                  <Heading size={100} paddingBottom={UNIT_2}>Accepted</Heading>
                  <Pane display="flex" flexWrap="wrap">
                    <Badge color="teal" marginRight={UNIT_1} marginBottom={UNIT_1} onClickRemove={() => {}}>olek@email.com</Badge>
                    <Badge color="teal" marginRight={UNIT_1} marginBottom={UNIT_1} onClickRemove={() => {}}>pepe@email.com</Badge>
                    <Badge color="teal" marginRight={UNIT_1} marginBottom={UNIT_1} onClickRemove={() => {}}>felipe@email.com</Badge>
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