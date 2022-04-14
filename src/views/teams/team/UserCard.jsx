import {UNIT_2, UNIT_3, UNIT_5} from '../../../constants/StyleVariables';
import {Badge} from '../../../components/Badge';
import {Avatar, Heading, Pane, Pill, Position, Tooltip} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';
import {Countdown} from '../../../components/countdown/Countdown';
import {useFetchPomodoro} from '../../../services/Pomodoro.query';
import {Loading} from '../../../components/Loading';
import {useTeamUserPomodoroSubscribeUnsubscribe} from './UsePomodoro';
import {useEffect} from 'react';

export const UserCard = ({online, avatarUrl, name, userId}) => {
  useTeamUserPomodoroSubscribeUnsubscribe(userId);

  const {
    isLoading: isLoadingPomodoro,
    data: pomodoro = {},
    refetch
  } = useFetchPomodoro({userId, enabled: online});

  useEffect(() => {
    if (online) {
      refetch({userId, enabled: online});
    }
  }, [userId]);

  return (
    <Card
      active={online}
      width="fit-content"
      position="relative"
      marginX={UNIT_2}
      padding={UNIT_3}
    >
      <Loading overlay loading={isLoadingPomodoro}/>
      <Pane display="flex" justifyContent="space-between" alignItems="center">
        {pomodoro.isOnWork && online && <Badge color="red" marginBottom={UNIT_3} marginRight={UNIT_2}>working</Badge>}
        {!pomodoro.isOnWork && online && <Badge color="green" marginBottom={UNIT_3} marginRight={UNIT_2}>on break</Badge>}
        {online && pomodoro.pomodoros > 0
          ? (
            <Tooltip content={pomodoro.pomodoros === 1 ? 'Last pomodoro' : 'Pomodoros'} position={Position.TOP}>
              <Pill marginBottom={UNIT_3}>{pomodoro.pomodoros}</Pill>
            </Tooltip>
          )
          : null
        }
      </Pane>
      <Pane textAlign="center">
        <Avatar
          size={UNIT_5}
          src={avatarUrl}
          className={!online ? 'u-filter-grayscale-1' : ''}
          marginBottom={UNIT_3}
        />
        <Heading size={500} textAlign="center" marginBottom={UNIT_2}>{name}</Heading>
        <Heading size={100} textAlign="center" marginBottom={UNIT_2}>{pomodoro.status}</Heading>
        {online && <Countdown time={pomodoro.time} color={pomodoro.isOnWork ? 'red500' : 'green500'}/>}
      </Pane>
    </Card>
  );
};