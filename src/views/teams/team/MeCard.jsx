import {UNIT_2, UNIT_3, UNIT_4, UNIT_5} from '../../../constants/StyleVariables';
import {Avatar, Button, Heading, Pane, Text, TextInput} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';
import {useAppStore} from '../../../hooks/UseAppStore';
import {useState} from 'react';
import {BiTimer} from 'react-icons/bi';
import {useCreatePomodoro, useRemovePomodoro} from '../../../services/Pomodoro.query';
import {useParams} from 'react-router-dom';

const getTime = (minutes) => Date.now() + (Number(minutes) * 60000);

export const MeCard = () => {
  const {userInfo} = useAppStore();
  const params = useParams();
  const [time, setTime] = useState('');

  const {
    isLoading: isCreatingPomodoro,
    mutateAsync: createPomodoro
  } = useCreatePomodoro();

  const {
    isLoading: isRemovingPomodoro,
    mutateAsync: removePomodoro
  } = useRemovePomodoro();

  const handleOnClickStart = () => {
    createPomodoro({teamId: params.id, email: userInfo.email, time: getTime(time)});
    setTime('');
  };

  const handleOnClickRemove = () => {
    removePomodoro({teamId: params.id, email: userInfo.email});
  };

  return (
    <Card
      marginBottom={UNIT_4}
      padding={UNIT_2}
      display="flex"
      height="100%"
      alignItems="center"
    >
      <Avatar size={UNIT_5} marginLeft={UNIT_2} marginRight={UNIT_4} src={userInfo.user_metadata.avatar_url}/>
      <Pane flexGrow={1} justifyContent="space-between">
        <Heading size={100}>Name</Heading>
        <Text>{userInfo.user_metadata.name}</Text>
      </Pane>
      <Pane display="flex" flexDirection="column">
        <Heading size={100}>Focus Time</Heading>
        <TextInput
          textAlign="right"
          marginBottom={UNIT_2}
          value={time}
          maxLength="2"
          onChange={(e) => setTime(e.target.value)}
        />
        <Pane display="flex" justifyContent="flex-end">
          <Button
            intent="danger"
            marginRight={UNIT_2}
            onClick={handleOnClickRemove}
          >
            Stop
          </Button>
          <Button
            disabled={!Boolean(time)}
            appearance="primary"
            onClick={handleOnClickStart}
          >
            <BiTimer fontSize={UNIT_3} className="u-mr-1"/>Start
          </Button>
        </Pane>
      </Pane>
    </Card>
  );
};