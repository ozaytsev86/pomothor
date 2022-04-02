import {UNIT_2, UNIT_3, UNIT_5} from '../../../constants/StyleVariables';
import {Badge} from '../../../components/Badge';
import {Avatar, Heading, Pane} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';
import {Countdown} from '../../../components/countdown/Countdown';
import {useRemovePomodoro} from '../../../services/Pomodoro.query';
import {Loading} from '../../../components/Loading';

export const UserCard = ({online, avatarUrl, name, time, teamId, email}) => {
  const {
    isLoading: isRemovingPomodoro,
    mutateAsync: removePomodoro
  } = useRemovePomodoro();

  const handleRemovePomodoro = () => {
    removePomodoro({teamId, email});
  };

  return (
    <Card
      active={online}
      width="fit-content"
      position="relative"
      marginX={UNIT_2}
      padding={UNIT_3}
    >
      <Loading overlay loading={isRemovingPomodoro}/>
      {time && online && <Badge color="red" marginBottom={UNIT_3}>busy</Badge>}
      {!time && online && <Badge color="green" marginBottom={UNIT_3}>free</Badge>}
      <Pane textAlign="center">
        <Avatar
          size={UNIT_5}
          src={avatarUrl}
          className={!online ? 'u-filter-grayscale-1' : ''}
          marginBottom={UNIT_3}
        />
        <Heading size={500} textAlign="center" marginBottom={UNIT_2}>{name}</Heading>
        {online && <Countdown time={time} onComplete={handleRemovePomodoro}/>}
      </Pane>
    </Card>
  );
};