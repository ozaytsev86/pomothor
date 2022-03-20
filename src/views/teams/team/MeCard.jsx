import {UNIT_2, UNIT_3, UNIT_4, UNIT_5} from '../../../constants/StyleVariables';
import {Avatar, Button, Heading, Pane, Text, TextInput} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';
import {useAppStore} from '../../../hooks/UseAppStore';
import {useState} from 'react';
import {BiTimer} from 'react-icons/bi';

export const MeCard = () => {
  const {userInfo} = useAppStore();
  const [focusTime, setFocusTime] = useState(null);

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
        <Heading size={100} paddingTop={UNIT_2}>Time</Heading>
        <Text>00:29:12</Text>
      </Pane>
      <Pane display="flex" flexDirection="column">
        <Heading size={100}>Focus Time</Heading>
        <TextInput
          marginBottom={UNIT_2}
          type="number"
          value={focusTime}
          onChange={(e) => setFocusTime(e.target.value)}
        />
        <Button
          disabled={!Boolean(focusTime)}
          display="flex"
          alignSelf="flex-end"
          appearance="primary"
        ><BiTimer fontSize={UNIT_3} className="u-mr-1"/>Start</Button>
      </Pane>
    </Card>
  );
};