import {UNIT_2, UNIT_5} from '../../../constants/StyleVariables';
import {Badge} from '../../../components/Badge';
import {Avatar, Heading, Pane, Text} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';

export const UserCard = ({active = true, busy, avatarUrl}) => {
  return (
    <Card
      active={active}
      width="fit-content"
      marginX={UNIT_2}
    >
      {active && busy && <Badge color="red" marginBottom={UNIT_2}>busy</Badge>}
      {active && !busy && <Badge color="green" marginBottom={UNIT_2}>free</Badge>}
      <Pane textAlign="center">
        <Avatar
          size={UNIT_5}
          src={avatarUrl}
          className={!active ? 'u-filter-grayscale-1' : ''}
        />
      </Pane>
      <Heading size={100}>Name</Heading>
      <Text>Chuck Norris</Text>
      <Heading size={100} paddingTop={UNIT_2}>Time</Heading>
      <Text>00:29:12</Text>
    </Card>
  );
};