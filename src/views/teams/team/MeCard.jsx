import {UNIT_1, UNIT_2, UNIT_3, UNIT_4, UNIT_5} from '../../../constants/StyleVariables';
import {Avatar, Button, Heading, Pane, Position, Text, TextInput, Tooltip} from 'evergreen-ui';
import {Card} from '../../../components/card/Card';
import {useAppStore} from '../../../hooks/UseAppStore';
import React, {useState} from 'react';
import {BiTimer} from 'react-icons/bi';
import {useCreatePomodoro, useFetchPomodoro, useRemovePomodoro, useUpdatePomodoro} from '../../../services/Pomodoro.query';
import {useFetchTimings} from '../../../services/Settings.query';
import {Countdown} from '../../../components/countdown/Countdown';
import {Badge} from '../../../components/Badge';

const initialForm = {
  workTime: '',
  breakTime: '',
  pomodoros: '',
  longBreakTime: '',
  status: '',
  startedAt: null
};

export const MeCard = () => {
  const {userInfo} = useAppStore();
  const [form, setForm] = useState(initialForm);

  const {
    isLoading: isLoadingTimings,
    data: timings = []
  } = useFetchTimings(userInfo.id);

  const {
    isLoading: isLoadingPomodoro,
    data: pomodoro = {}
  } = useFetchPomodoro({userId: userInfo.id, enabled: true});

  const {
    isLoading: isCreatingPomodoro,
    mutateAsync: createPomodoro
  } = useCreatePomodoro();

  const {
    isLoading: isUpdatingPomodoro,
    mutateAsync: updatePomodoro
  } = useUpdatePomodoro();

  const {
    isLoading: isRemovingPomodoro,
    mutateAsync: removePomodoro
  } = useRemovePomodoro();

  const isFormValid = () => {
    let isValid = true;

    if (!form.workTime) {
      isValid = false;
    } else if (!form.breakTime) {
      isValid = false;
    } else if (!form.pomodoros) {
      isValid = false;
    } else if (!form.longBreakTime) {
      isValid = false;
    }

    return isValid;
  };

  const handleOnClickStart = () => {
    createPomodoro({
      userId: userInfo.id,
      workTime: form.workTime,
      breakTime: form.breakTime,
      pomodoros: form.pomodoros,
      longBreakTime: form.longBreakTime,
      status: form.status,
      startedAt: new Date()
    });
    setForm(initialForm);
  };

  const handleOnClickRemove = () => {
    removePomodoro({userId: userInfo.id});
  };

  const handleRemovePomodoro = () => {
    if (pomodoro.isOnWork) {
      updatePomodoro({
        userId: userInfo.id,
        startedAt: new Date(),
        isOnWork: false
      });
    } else {
      if (pomodoro.pomodoros > 0) {
        updatePomodoro({
          userId: userInfo.id,
          pomodoros: pomodoro.pomodoros - 1,
          startedAt: new Date(),
          isOnWork: true
        });
      } else {
        removePomodoro({userId: userInfo.id});
      }
    }
  };

  return (
    <Card
      marginBottom={UNIT_4}
      padding={UNIT_3}
      display="flex"
      height="100%"
      justifyContent="space-between"
    >
      <Pane display="flex" flexDirection="column">
        <Avatar size={UNIT_5} marginLeft={UNIT_2} marginRight={UNIT_4} src={userInfo.user_metadata.avatar_url}/>
        <Heading size={100}>Name</Heading>
        <Text marginBottom={UNIT_3}>{userInfo.user_metadata.name}</Text>
        {pomodoro.isOnWork && <Badge color="red" marginBottom={UNIT_2}>working</Badge>}
        {!pomodoro.isOnWork && <Badge color="green" marginBottom={UNIT_2}>on break</Badge>}
        {pomodoro.time && (
          <Countdown
            time={pomodoro.time}
            color={pomodoro.isOnWork ? 'red500' : 'green500'}
            onComplete={handleRemovePomodoro}/>
        )}
      </Pane>
      <Pane display="grid">
        <Pane display="grid" gridTemplateColumns="1fr 1fr 1fr 1fr" gridGap={UNIT_2}>
          <Pane>
            <Heading size={100}>Work Time</Heading>
            <TextInput
              textAlign="right"
              marginBottom={UNIT_2}
              value={form.workTime}
              maxLength="2"
              width={100}
              onChange={(e) => setForm({...form, workTime: e.target.value})}
            />
          </Pane>
          <Pane>
            <Heading size={100}>Break Time</Heading>
            <TextInput
              textAlign="right"
              marginBottom={UNIT_2}
              value={form.breakTime}
              maxLength="2"
              width={100}
              onChange={(e) => setForm({...form, breakTime: e.target.value})}
            />
          </Pane>
          <Pane>
            <Heading size={100}>Pomodoros</Heading>
            <TextInput
              textAlign="right"
              marginBottom={UNIT_2}
              value={form.pomodoros}
              maxLength="1"
              width={100}
              onChange={(e) => setForm({...form, pomodoros: e.target.value})}
            />
          </Pane>
          <Pane>
            <Heading size={100}>Long Break Time</Heading>
            <TextInput
              textAlign="right"
              marginBottom={UNIT_2}
              value={form.longBreakTime}
              maxLength="2"
              width={100}
              onChange={(e) => setForm({...form, longBreakTime: e.target.value})}
            />
          </Pane>
        </Pane>
        <Pane display="flex" justifyContent="flex-end">
          {timings.map(({name, workTime, breakTime, pomodoros, longBreakTime}) => {
            return (
              <Tooltip
                position={Position.TOP}
                content={
                  <Pane display="flex" flexDirection="column">
                    <Heading size={100} color="white">Work Time: {workTime}</Heading>
                    <Heading size={100} color="white">Break Time: {breakTime}</Heading>
                    <Heading size={100} color="white">Pomodoros: {pomodoros}</Heading>
                    <Heading size={100} color="white">Long Break Time: {longBreakTime}</Heading>
                  </Pane>
                }
              >
                <span>
                  <Button
                    height={24}
                    paddingX={UNIT_2}
                    marginBottom={UNIT_2}
                    marginRight={UNIT_1}
                    onClick={() => setForm({workTime, breakTime, pomodoros, longBreakTime, status: form.status})}
                  >{name}</Button>
                </span>
              </Tooltip>
            );
          })}
        </Pane>
        <Pane>
          <Heading size={100}>Status</Heading>
          <TextInput
            placeholder="Let your teammates know what are you focused on"
            marginBottom={UNIT_2}
            width="100%"
            value={form.status}
            onChange={(e) => setForm({...form, status: e.target.value})}
          />
        </Pane>
        <Pane display="flex" justifyContent="flex-end">
          <Button
            intent="danger"
            marginRight={UNIT_2}
            onClick={handleOnClickRemove}
          >
            Stop
          </Button>
          <Button
            disabled={!isFormValid()}
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